from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import FoodCourt, MenuItem, Order
import json


def get_foodcourts(request):
    courts = list(FoodCourt.objects.values())
    return JsonResponse(courts, safe=False)


def get_menu(request):
    menu = list(MenuItem.objects.values())
    return JsonResponse(menu, safe=False)


@csrf_exempt
def create_order(request):
    if request.method == "POST":
        data = json.loads(request.body)

        Order.objects.create(
            item_id=data["item_id"],
            quantity=data["quantity"]
        )

        return JsonResponse({"message": "Order placed"})

    return JsonResponse({"error": "POST request required"})


# HTML menu page
def menu_view(request):
    items = MenuItem.objects.all()
    return render(request, "menu.html", {"items": items})
