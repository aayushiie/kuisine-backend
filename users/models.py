from django.db import models
from datetime import datetime
# Create your models here.

class User(models.Model):
    email = models.EmailField(primary_key=True, max_length=255)
    password_hash = models.TextField()
    role = models.CharField(max_length=20)
    created_at = models.DateTimeField(default=datetime.now, null=True, blank=True)

    class Meta:
        db_table = "users"   
        managed = False    


class Student(models.Model):
    roll_number = models.CharField(primary_key=True, max_length=20)
    email = models.OneToOneField(
        "User",                     
        db_column="email",          
        on_delete=models.CASCADE,
        unique=True,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "student"
        managed = False

class Staff(models.Model):
    staff_id = models.CharField(primary_key=True, max_length=20)
    email = models.OneToOneField(
        "User",
        db_column='email',
        on_delete=models.CASCADE,
        unique=True,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "staff"
        managed = False