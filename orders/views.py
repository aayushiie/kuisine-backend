from django.shortcuts import redirect, render
from django.db import transaction
from django.db.models import Sum, F
from users.models import Student
from foodcourts.models import FoodItems
from .models import Orders, OrderItems


def add_to_cart(request, pk):

    if request.method == "POST":
        student = Student.objects.get(pk=pk)
        selected_items = request.POST.getlist("items")
        if not selected_items:
            return redirect("student", pk=pk)

        items_data = []
        total = 0
        foodcourt = None

        for item_id in selected_items:
            item = FoodItems.objects.get(id=item_id)

            quantity = int(request.POST.get(f"quantity_{item_id}", 1))

            total += item.price * quantity
            foodcourt = item.food_court 

            items_data.append({
                "item": item,
                "quantity": quantity
            })

        # Atomic transaction
        with transaction.atomic():

            order = Orders.objects.create(
                student=student,
                foodcourt=foodcourt,
                total_amt=total
            )

            for data in items_data:
                OrderItems.objects.create(
                    order=order,
                    food_item=data["item"],
                    quantity=data["quantity"]
                )

        return redirect("cart", pk=pk)


def cart(request, pk):
    student = Student.objects.get(pk=pk)

    orders = Orders.objects.filter(student=student)\
        .prefetch_related("orderitems_set__food_item")\
        .order_by("-created_at")

    return render(request, "cart.html", {
        "orders": orders,
        "pk": pk
    })