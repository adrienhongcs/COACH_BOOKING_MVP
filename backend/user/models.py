from django.db import models


class BaseUser(models.Model):
    phone_number = models.CharField(max_length=10)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    class Meta:
        abstract = True


class Coach(BaseUser):
    pass


class Student(BaseUser):
    pass
