from django.shortcuts import render, redirect
from django.contrib import messages

# Create your views here.
def cart(request, pk):
    return render(request, 'cart.html')

