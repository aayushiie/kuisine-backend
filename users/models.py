from django.db import models
from datetime import datetime


class User(models.Model):
    email = models.EmailField(primary_key=True, max_length=255)
    password_hash = models.TextField()
    role = models.CharField(max_length=20)
    created_at = models.DateTimeField(default=datetime.now)

    class Meta:
        db_table = "users"


class Student(models.Model):
    roll_number = models.CharField(primary_key=True, max_length=20)

    email = models.OneToOneField(
        User,
        db_column="email",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    class Meta:
        db_table = "student"


class Staff(models.Model):
    staff_id = models.CharField(primary_key=True, max_length=20)

    email = models.OneToOneField(
        User,
        db_column="email",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    class Meta:
        db_table = "staff"