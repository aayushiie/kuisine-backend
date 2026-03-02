from django.shortcuts import render, redirect
from .models import User, Student, Staff
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.
def index(request):
    return render(request, 'index.html')

def register(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']
        role = request.POST['role']

        if password == password2:

            if User.objects.filter(email=email).exists():
                messages.info(request, 'Email already used. Please login')
                return redirect('register')
            
            elif email.lower().endswith('@kiit.ac.in'):
                user = User.objects.create(email=email, password_hash=make_password(password), role=role)
                id = email.split('@')[0]

                if role == 'Student':
                    Student.objects.create(roll_number=id, email=user, name=name)
                    return redirect('studentlogin')

                elif role == 'Staff':
                    Staff.objects.create(staff_id=id, email=user, name=name)
                    return redirect('stafflogin')
                
                return redirect('index')
            
            else:
                messages.info(request, 'Invalid email.')
                return redirect('register')
        else:
            messages.info(request, 'Password does not match')
            return redirect('register')
    else:
        return render(request, 'register.html')


def studentlogin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        user = User.objects.get(email=email)

        if check_password(password, user.password_hash):
            request.session['user_email'] = user.email
            student = Student.objects.get(email=user)
            return redirect('student', pk=student.roll_number)
                
        else:
            messages.info(request, 'Invalid credentials')
            return redirect('studentlogin')
    
    else:
        return render(request, 'studentlogin.html')
    
def stafflogin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        user = User.objects.get(email=email)

        if check_password(password, user.password_hash):
            request.session['user_email'] = user.email
            staff = Staff.objects.get(email=user)
            return redirect('staff', pk=staff.staff_id)        
        
        else:
            messages.info(request, 'Invalid credentials')
            return redirect('stafflogin')
    
    else:
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