from django.http import JsonResponse
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

        item_id = data.get("item_id")
        quantity = data.get("quantity")

        try:
            item = MenuItem.objects.get(item_id=item_id)

            Order.objects.create(
                item=item,
                quantity=quantity
            )

            return JsonResponse({"message": "Order placed successfully"})

        except MenuItem.DoesNotExist:
            return JsonResponse({"error": "Item not found"})

    return JsonResponse({"error": "POST request required"})