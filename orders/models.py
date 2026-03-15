from django.db import models

class FoodCourt(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)


class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    foodcourt = models.ForeignKey(FoodCourt, on_delete=models.CASCADE)


class Order(models.Model):
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    status = models.CharField(max_length=20, default="Pending")

class Menu(models.Model):
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=50)
    available = models.BooleanField(default=True)

    class Meta:
        db_table = "menu"

    def __str__(self):
        return self.name