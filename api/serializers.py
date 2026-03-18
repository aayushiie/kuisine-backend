from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import FoodCourt, MenuItem, Order, OrderItem, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'email', 'name', 'role', 'roll_number']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['email', 'name', 'password', 'role', 'roll_number']

    def create(self, validated_data):
        pw   = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(pw)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        data['user'] = user
        return data


class FoodCourtSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FoodCourt
        fields = ['id', 'court_number', 'name', 'status', 'opening_time',
                  'closing_time', 'total_tables', 'available_tables', 'is_active']


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MenuItem
        fields = ['id', 'name', 'category', 'price', 'quantity',
                  'description', 'prep_time', 'is_veg', 'is_available', 'image_url']


class OrderItemSerializer(serializers.ModelSerializer):
    name      = serializers.CharField(source='menu_item.name', read_only=True)
    image_url = serializers.CharField(source='menu_item.image_url', read_only=True)
    subtotal  = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = ['id', 'menu_item', 'name', 'image_url', 'quantity', 'unit_price', 'subtotal']


class OrderReadSerializer(serializers.ModelSerializer):
    items      = OrderItemSerializer(many=True, read_only=True)
    food_court = FoodCourtSerializer(read_only=True)
    student    = UserSerializer(read_only=True)

    class Meta:
        model  = Order
        fields = ['id', 'student', 'food_court', 'status', 'total_amount',
                  'estimated_prep_time', 'created_at', 'updated_at', 'items']


class OrderItemCreateSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity     = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    food_court_id = serializers.IntegerField()
    items         = OrderItemCreateSerializer(many=True)

    def validate_food_court_id(self, v):
        try:
            c = FoodCourt.objects.get(id=v)
            if c.status == 'closed':
                raise serializers.ValidationError('This food court is currently closed.')
        except FoodCourt.DoesNotExist:
            raise serializers.ValidationError('Food court not found.')
        return v

    def validate_items(self, v):
        if not v:
            raise serializers.ValidationError('At least one item required.')
        return v

    def create(self, validated_data):
        from django.db import transaction
        student       = self.context['request'].user
        items_data    = validated_data.pop('items')
        food_court_id = validated_data.pop('food_court_id')
        food_court    = FoodCourt.objects.get(id=food_court_id)
        total = 0; max_prep = 0; rows = []
        for d in items_data:
            mi = MenuItem.objects.get(id=d['menu_item_id'])
            if not mi.is_available:
                raise serializers.ValidationError(f'{mi.name} is unavailable.')
            total    += mi.price * d['quantity']
            max_prep  = max(max_prep, mi.prep_time)
            rows.append((mi, d['quantity'], mi.price))
        with transaction.atomic():
            order = Order.objects.create(
                student=student, food_court=food_court,
                total_amount=total, estimated_prep_time=max_prep + 2
            )
            for mi, qty, price in rows:
                OrderItem.objects.create(order=order, menu_item=mi, quantity=qty, unit_price=price)
        return order


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Order
        fields = ['status']
