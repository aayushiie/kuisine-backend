from django.urls import path
from . import views

urlpatterns = [

    path("foodcourts/", views.get_foodcourts),

    path("menu/", views.get_menu),

    path("create/", views.create_order),

]