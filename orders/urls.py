from django.urls import path
from . import views

urlpatterns = [
    path('student/<str:pk>/cart/', views.cart, name='cart'),

]