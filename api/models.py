from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError('Email required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        extra.setdefault('role', 'staff')
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    ROLES = [('student', 'Student'), ('staff', 'Staff')]
    email       = models.EmailField(unique=True)
    name        = models.CharField(max_length=100)
    role        = models.CharField(max_length=20, choices=ROLES, default='student')
    roll_number = models.CharField(max_length=20, blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['name']
    objects = UserManager()

    def __str__(self):
        return f'{self.name} ({self.role})'


class FoodCourt(models.Model):
    STATUSES = [('open', 'Open'), ('busy', 'Busy'), ('closed', 'Closed')]
    court_number     = models.IntegerField(unique=True)   # 3,6,7,8,12,14,15,25 or 0 for Kafeteria
    name             = models.CharField(max_length=100)   # "Food Court 3" or "KIIT Kafeteria"
    status           = models.CharField(max_length=20, choices=STATUSES, default='open')
    opening_time     = models.TimeField()
    closing_time     = models.TimeField()
    total_tables     = models.IntegerField(default=20)
    available_tables = models.IntegerField(default=20)
    is_active        = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['court_number']


class MenuItem(models.Model):
    CATS = [('Food', 'Food'), ('Snacks', 'Snacks'), ('Beverages', 'Beverages')]
    name         = models.CharField(max_length=100)
    category     = models.CharField(max_length=50, choices=CATS)
    price        = models.DecimalField(max_digits=8, decimal_places=2)
    quantity     = models.CharField(max_length=50, default='1 serving')
    description  = models.TextField(blank=True)
    prep_time    = models.IntegerField(default=5)
    is_veg       = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    image_url    = models.URLField(blank=True)

    def __str__(self):
        return f'{self.name} (₹{self.price})'

    class Meta:
        ordering = ['category', 'name']


class Order(models.Model):
    STATUSES = [('Placed', 'Placed'), ('Preparing', 'Preparing'), ('Ready', 'Ready'), ('Collected', 'Collected')]
    student      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    food_court   = models.ForeignKey(FoodCourt, on_delete=models.CASCADE, related_name='orders')
    status       = models.CharField(max_length=20, choices=STATUSES, default='Placed')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_prep_time = models.IntegerField(default=10)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Order #{self.id} by {self.student.name} — {self.status}'

    class Meta:
        ordering = ['-created_at']


class OrderItem(models.Model):
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item  = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity   = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f'{self.quantity}× {self.menu_item.name}'
