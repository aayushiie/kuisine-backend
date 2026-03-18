from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as Base
from .models import User, FoodCourt, MenuItem, Order, OrderItem


@admin.register(User)
class UserAdmin(Base):
    list_display   = ['email', 'name', 'role', 'created_at']
    list_filter    = ['role']
    search_fields  = ['email', 'name']
    ordering       = ['-created_at']
    fieldsets      = (
        (None, {'fields': ('email', 'password')}),
        ('Info', {'fields': ('name', 'role', 'roll_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets  = ((None, {'classes': ('wide',), 'fields': ('email', 'name', 'password1', 'password2', 'role')}),)


@admin.register(FoodCourt)
class FoodCourtAdmin(admin.ModelAdmin):
    list_display  = ['name', 'court_number', 'status', 'available_tables', 'total_tables', 'opening_time', 'closing_time']
    list_editable = ['status', 'available_tables']


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display  = ['name', 'category', 'price', 'quantity', 'is_veg', 'is_available', 'prep_time']
    list_filter   = ['category', 'is_veg', 'is_available']
    list_editable = ['price', 'is_available']
    search_fields = ['name']


class OrderItemInline(admin.TabularInline):
    model           = OrderItem
    extra           = 0
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display    = ['id', 'student', 'food_court', 'status', 'total_amount', 'created_at']
    list_filter     = ['status', 'food_court']
    list_editable   = ['status']
    inlines         = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at']
