from django.db import models
from datetime import time
from django.utils import timezone


class FoodCourts(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    name = models.CharField(max_length=255)
    campus = models.CharField(max_length=255, null=True, blank=True)
    opening_time = models.TimeField(default=time(9, 0))
    closing_time = models.TimeField(default=time(21, 0))
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "food_courts"
        managed = False


class FoodItems(models.Model):
    id = models.AutoField(primary_key=True)

    food_court = models.ForeignKey(
        FoodCourts,
        db_column="foodcourt_id",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=250)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    prep_time_mins = models.IntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "food_items"
        managed = False
        unique_together = ("food_court", "name")