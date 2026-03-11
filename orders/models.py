from django.db import models
from django.utils import timezone
from users.models import Student
from foodcourts.models import FoodCourts, FoodItems

class Orders(models.Model):

    STATUS_CHOICES = [
        ("Placed", "Placed"),
        ("Accepted", "Accepted"),
        ("Preparing", "Preparing"),
        ("Ready", "Ready"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    id = models.AutoField(primary_key=True)

    student = models.ForeignKey(
        Student,
        db_column="student_id",
        to_field="roll_number",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True
    )

    foodcourt = models.ForeignKey(
        FoodCourts,
        db_column="foodcourt_id",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Placed"
    )

    total_amt = models.DecimalField(max_digits=10, decimal_places=2)

    estimated_prep_time = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now, null=True, blank=True)

    class Meta:
        db_table = "orders"
        managed = False


class OrderItems(models.Model):

    id = models.AutoField(primary_key=True)

    order = models.ForeignKey(
        Orders,
        db_column="order_id",
        on_delete=models.CASCADE
    )

    food_item = models.ForeignKey(
        FoodItems,
        db_column="food_item_id",
        on_delete=models.DO_NOTHING
    )

    quantity = models.IntegerField()

    class Meta:
        db_table = "order_items"
        managed = False
        unique_together = ("order", "food_item")