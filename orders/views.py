from django.http import JsonResponse
from .models import FoodCourt, MenuItem, Order
from django.views.decorators.csrf import csrf_exempt
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