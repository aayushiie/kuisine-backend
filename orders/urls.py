from django.urls import path
from . import views

urlpatterns = [
    path('student/<str:pk>/cart', views.cart, name='cart'),
    path("student/<str:pk>/add-to-cart/", views.add_to_cart, name="add_to_cart"),


]