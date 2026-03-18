from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/',          views.RegisterView.as_view()),
    path('auth/login/',             views.LoginView.as_view()),
    path('auth/logout/',            views.LogoutView.as_view()),
    path('auth/me/',                views.MeView.as_view()),

    # Food Courts
    path('food-courts/',            views.FoodCourtListView.as_view()),
    path('food-courts/<int:pk>/',   views.FoodCourtDetailView.as_view()),

    # Menu
    path('menu/',                   views.MenuListView.as_view()),

    # Orders
    path('orders/',                 views.OrderListView.as_view()),
    path('orders/<int:pk>/',        views.OrderDetailView.as_view()),
    path('orders/<int:pk>/status/', views.OrderStatusUpdateView.as_view()),

    # Stats
    path('stats/',                  views.StatsView.as_view()),
]
