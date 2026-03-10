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