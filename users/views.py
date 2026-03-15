from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.hashers import check_password, make_password
from .models import User, Student, Staff


# Home page
def index(request):
    return render(request, "index.html")


# Register user
def register(request):

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")
        role = request.POST.get("role")
        name = request.POST.get("name")
        roll = request.POST.get("roll")

        user = User.objects.create(
            email=email,
            password_hash=make_password(password),
            role=role
        )

        if role == "student":
            Student.objects.create(
                email=user,
                name=name,
                roll_number=roll
            )

        return redirect("studentlogin")

    return render(request, "register.html")


# Student login
def studentlogin(request):

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email)

            if check_password(password, user.password_hash):
                return redirect(f"/student/{email}")
            else:
                return HttpResponse("Invalid login")

        except User.DoesNotExist:
            return HttpResponse("User not found")

    return render(request, "studentlogin.html")


# Staff login
def stafflogin(request):
    return render(request, "stafflogin.html")


# Student dashboard
def student(request, pk):
    try:
        student = Student.objects.get(email=pk)
        return render(request, "student.html", {"student": student})
    except Student.DoesNotExist:
        return HttpResponse("Student not found")


# Staff dashboard
def staff(request, pk):
    try:
        staff = Staff.objects.get(email=pk)
        return render(request, "staff.html", {"staff": staff})
    except Staff.DoesNotExist:
        return HttpResponse("Staff not found")


# Logout
def logout(request):
    return