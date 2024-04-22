import graphene
from graphene_django import DjangoObjectType
from user.models import Coach, Student


class CoachType(DjangoObjectType):
    class Meta:
        model = Coach


class StudentType(DjangoObjectType):
    class Meta:
        model = Student


class Query(graphene.ObjectType):

    coach = graphene.Field(CoachType, id=graphene.ID())
    coaches = graphene.List(CoachType)
    student = graphene.Field(StudentType, id=graphene.ID())
    students = graphene.List(StudentType)

    def resolve_coach(root, info, id):
        return Coach.objects.filter(id=id).first()

    def resolve_coaches(root, info):
        return Coach.objects.all()

    def resolve_student(root, info, id):
        return Student.objects.filter(id=id).first()

    def resolve_students(root, info):
        return Student.objects.all()
