from django.contrib import admin
from .models import FoodCourt, MenuItem, Order

admin.site.register(FoodCourt)
admin.site.register(MenuItem)
admin.site.register(Order)
