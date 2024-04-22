import graphene
from graphene_django import DjangoObjectType
from scheduling.models import Slot, Call
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q


class SlotType(DjangoObjectType):
    class Meta:
        model = Slot


class CallType(DjangoObjectType):
    class Meta:
        model = Call


class Query(graphene.ObjectType):
    slot = graphene.Field(SlotType, id=graphene.ID())
    slots = graphene.List(
        SlotType,
        start_time=graphene.String(required=False),
        end_time=graphene.String(required=False),
        coach_id=graphene.ID(required=False),
        student_id=graphene.ID(required=False),
        with_call=graphene.Boolean(required=False),
    )
    slot_counts = graphene.JSONString(
        year=graphene.Int(),
        month=graphene.Int(),
        coach_id=graphene.ID(),
        student_id=graphene.ID(),
    )
    call = graphene.Field(CallType, id=graphene.ID())
    calls = graphene.List(CallType)

    def resolve_slot(root, info, id):
        return Slot.objects.filter(id=id).first()

    def resolve_slots(
        root,
        info,
        start_time=None,
        end_time=None,
        coach_id=None,
        student_id=None,
        with_call=None,
    ):
        qs = Slot.objects.all()
        if coach_id:
            qs = qs.filter(coach_id=coach_id)
        if student_id:
            qs = qs.filter(Q(student_id=student_id) | Q(student_id__isnull=True))
        if start_time:
            start_time = datetime.fromisoformat(start_time)
            qs = qs.filter(start_time__gte=start_time)
        if end_time:
            end_time = datetime.fromisoformat(end_time)
            qs = qs.filter(end_time__lt=end_time)
        if with_call is not None:
            qs = qs.filter(call__isnull=bool(with_call))
        return qs.order_by("start_time")

    def resolve_slot_counts(root, info, year, month, coach_id=None, student_id=None):
        qs = Slot.objects.all()
        if coach_id:
            qs = qs.filter(coach_id=coach_id)
        if student_id:
            qs = qs.filter(Q(student_id=student_id) | Q(student_id__isnull=True))

        start_date = datetime(year, month, 1)
        end_date = start_date + relativedelta(months=1)
        qs = qs.filter(start_time__gte=start_date, start_time__lt=end_date)

        slot_counts = {}
        for slot in qs:
            day_of_month = slot.start_time.day
            if day_of_month not in slot_counts:
                slot_counts[day_of_month] = {"booked": 0, "available": 0}
            if slot.student_id:
                slot_counts[day_of_month]["booked"] += 1
            else:
                slot_counts[day_of_month]["available"] += 1

        return slot_counts

    def resolve_call(root, info, id):
        return Call.objects.filter(id=id).first()

    def resolve_calls(root, info):
        return Call.objects.all()


class CreateSlotMutation(graphene.Mutation):
    class Arguments:
        start_time = graphene.String()
        coach_id = graphene.ID()

    slot = graphene.Field(SlotType)

    @classmethod
    def mutate(cls, root, info, start_time, coach_id):

        slot = Slot.objects.create(
            start_time=datetime.fromisoformat(start_time), coach_id=coach_id
        )
        return CreateSlotMutation(slot=slot)


class BookSlotMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        student_id = graphene.ID()

    slot = graphene.Field(SlotType)

    @classmethod
    def mutate(cls, root, info, id, student_id):

        slot = Slot.objects.get(id=id)
        slot.student_id = student_id
        slot.save()
        return CreateSlotMutation(slot=slot)


class CreateCallMutation(graphene.Mutation):
    class Arguments:
        slot_id = graphene.ID()
        satisfaction_score = graphene.Int()
        notes = graphene.String()

    call = graphene.Field(CallType)

    @classmethod
    def mutate(cls, root, info, slot_id, satisfaction_score, notes=None):

        slot = Slot.objects.get(id=slot_id)
        call = Call.create_from_slot(
            slot, satisfaction_score=satisfaction_score, notes=notes
        )
        return CreateCallMutation(call=call)


class Mutation(graphene.ObjectType):
    create_slot = CreateSlotMutation.Field()
    book_slot = BookSlotMutation.Field()
    create_call = CreateCallMutation.Field()
