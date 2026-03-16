from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('studentlogin', views.studentlogin, name='studentlogin'),
    path('stafflogin', views.stafflogin, name='stafflogin'),
    path('logout', views.logout, name='logout'),
    path('student/<str:pk>', views.student, name='student'),
    path('staff/<str:pk>', views.staff, name='staff'),

]