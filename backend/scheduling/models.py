from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user.models import Coach, Student
from datetime import datetime, timedelta
from django.db.models import Q
from django.core.exceptions import ValidationError


class Slot(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name="slots")
    student = models.ForeignKey(
        Student, on_delete=models.SET_NULL, related_name="slots", null=True
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            self.end_time = self.start_time + timedelta(hours=2)
        overlapping_slots = Slot.objects.exclude(pk=self.pk).filter(
            Q(start_time__range=(self.start_time, self.end_time))
            | Q(end_time__range=(self.start_time, self.end_time))
        )
        if overlapping_slots.filter(coach_id=self.coach_id).exists():
            raise ValidationError(
                f"An overlapping slot exists for coach {self.coach.first_name} {self.coach.last_name}"
            )
        if (
            self.student_id
            and overlapping_slots.filter(student_id=self.student_id).exists()
        ):
            raise ValidationError(
                f"An overlapping slot exists for student {self.student.first_name} {self.student.last_name}"
            )
        super().save(*args, **kwargs)

    @classmethod
    def apply_filters(
        cls,
        start_time=None,
        end_time=None,
        coach_id=None,
        student_id=None,
        with_call=None,
    ):
        qs = cls.objects.all()
        if coach_id:
            qs = qs.filter(coach_id=coach_id)
        if student_id:
            qs = qs.filter(Q(student_id=student_id) | Q(student_id__isnull=True))
        if start_time:
            if isinstance(start_time, str):
                start_time = datetime.fromisoformat(start_time)
            qs = qs.filter(start_time__gte=start_time)
        if end_time:
            if isinstance(end_time, str): 
                end_time = datetime.fromisoformat(end_time)
            qs = qs.filter(end_time__lt=end_time)
        if with_call is not None:
            qs = qs.filter(call__isnull=bool(with_call))
        return qs


class Call(models.Model):
    slot = models.OneToOneField(Slot, on_delete=models.CASCADE, related_name="call")
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name="calls")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="calls")
    satisfaction_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    notes = models.TextField(max_length=500, null=True)

    @classmethod
    def create_from_slot(cls, slot, satisfaction_score, notes):
        return cls.objects.create(
            slot_id=slot.id,
            coach_id=slot.coach_id,
            student_id=slot.student_id,
            satisfaction_score=satisfaction_score,
            notes=notes,
        )
