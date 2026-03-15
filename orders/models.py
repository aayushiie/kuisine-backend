ffrom django.db import models


class FoodCourt(models.Model):
    court_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)

    class Meta:
        db_table = "foodcourt"

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    price = models.FloatField()
    available = models.BooleanField(default=True)

    court = models.ForeignKey(
        FoodCourt,
        on_delete=models.CASCADE,
        db_column="court_id"
    )

    class Meta:
        db_table = "menuitem"

    def __str__(self):
        return self.name


class Order(models.Model):
    order_id = models.AutoField(primary_key=True)

    item = models.ForeignKey(
        MenuItem,
        on_delete=models.CASCADE,
        db_column="item_id"
    )

    quantity = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"

    def __str__(self):
        return str(self.order_id)