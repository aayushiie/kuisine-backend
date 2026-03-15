from django.shortcuts import render, redirect
from .models import User, Student, Staff
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password


def index(request):
    return render(request, 'index.html')


def register(request):

    if request.method == 'POST':

        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        role = request.POST.get('role')

        # Check password match
        if password != password2:
            messages.info(request, 'Passwords do not match')
            return redirect('register')

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.info(request, 'Email already used. Please login')
            return redirect('register')

        # Allow only KIIT email
        if not email.lower().endswith('@kiit.ac.in'):
            messages.info(request, 'Invalid email. Use KIIT email')
            return redirect('register')

        # Create user
        user = User.objects.create(
            email=email,
            password_hash=make_password(password),
            role=role
        )

        user_id = email.split('@')[0]

        if role == 'Student':
            Student.objects.create(
                roll_number=user_id,
                email=user,
                name=name
            )
            messages.success(request, 'Registration successful. Please login.')
            return redirect('studentlogin')

        elif role == 'Staff':
            Staff.objects.create(
                staff_id=user_id,
                email=user,
                name=name
            )
            messages.success(request, 'Registration successful. Please login.')
            return redirect('stafflogin')

        return redirect('index')

    return render(request, 'register.html')


def studentlogin(request):

    if request.method == 'POST':

        email = request.POST.get('email')
        password = request.POST.get('password')

        if not User.objects.filter(email=email).exists():
            messages.info(request, 'User not registered')
            return redirect('studentlogin')

        user = User.objects.get(email=email)

        if check_password(password, user.password_hash):

            request.session['user_email'] = user.email

            student = Student.objects.get(email=user)

            return redirect('student', pk=student.roll_number)

        else:
            messages.info(request, 'Invalid credentials')
            return redirect('studentlogin')

    return render(request, 'studentlogin.html')


def stafflogin(request):

    if request.method == 'POST':

        email = request.POST.get('email')
        password = request.POST.get('password')

        if not User.objects.filter(email=email).exists():
            messages.info(request, 'User not registered')
            return redirect('stafflogin')

        user = User.objects.get(email=email)

        if check_password(password, user.password_hash):

            request.session['user_email'] = user.email

            staff = Staff.objects.get(email=user)

            return redirect('staff', pk=staff.staff_id)

        else:
            messages.info(request, 'Invalid credentials')
            return redirect('stafflogin')

    return render(request, 'stafflogin.html')


def logout(request):
    request.session.flush()
    return redirect('index')


def student(request, pk):

    student = Student.objects.get(pk=pk)

    return render(request, 'student.html', {'name': student.name})


def staff(request, pk):

    staff = Staff.objects.get(pk=pk)

    return render(request, 'staff.html', {'name': staff.name})