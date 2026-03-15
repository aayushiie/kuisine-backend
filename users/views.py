from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User, Student, Staff


def index(request):
    return render(request, "index.html")


def register(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        role = request.POST.get("role")
        name = request.POST.get("name")
        roll = request.POST.get("roll")

        user = User.objects.create(
            email=email,
            password_hash=password,
            role=role
        )

        if role == "student":
            Student.objects.create(
                roll_number=roll,
                email=user,
                name=name
            )

        return redirect("studentlogin")

    return render(request, "register.html")


def studentlogin(request):

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user = User.objects.get(email=email)

            if user.password_hash == password:
                return redirect(f"/student/{email}")

        except User.DoesNotExist:
            pass

        return HttpResponse("Invalid login")

    return render(request, "studentlogin.html")


def stafflogin(request):
    return render(request, "stafflogin.html")


def student(request, pk):
    student = Student.objects.get(email=pk)
    return render(request, "student.html", {"student": student})


def staff(request, pk):
    staff = Staff.objects.get(email=pk)
    return render(request, "staff.html", {"staff": staff})


def logout(request):
    return redirect("/")