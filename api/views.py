from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from .models import FoodCourt, MenuItem, Order
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    FoodCourtSerializer, MenuItemSerializer,
    OrderReadSerializer, OrderCreateSerializer, OrderStatusSerializer,
)


# ── AUTH ──────────────────────────────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid():
            user  = s.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=201)
        return Response(s.errors, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = LoginSerializer(data=request.data)
        if s.is_valid():
            user  = s.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response(s.errors, status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully.'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ── FOOD COURTS ───────────────────────────────────────────────────────────────
class FoodCourtListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courts = FoodCourt.objects.filter(is_active=True)
        return Response(FoodCourtSerializer(courts, many=True).data)


class FoodCourtDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        court = get_object_or_404(FoodCourt, pk=pk, is_active=True)
        return Response(FoodCourtSerializer(court).data)

    def patch(self, request, pk):
        # Staff only
        if request.user.role != 'staff':
            return Response({'error': 'Staff only.'}, status=403)
        court   = get_object_or_404(FoodCourt, pk=pk)
        allowed = {k: v for k, v in request.data.items() if k in ['status', 'available_tables']}
        s = FoodCourtSerializer(court, data=allowed, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=400)


# ── MENU ──────────────────────────────────────────────────────────────────────
class MenuListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = MenuItem.objects.all()
        if c := request.query_params.get('category'):
            qs = qs.filter(category=c)
        if request.query_params.get('veg') == 'true':
            qs = qs.filter(is_veg=True)
        return Response(MenuItemSerializer(qs, many=True).data)


# ── ORDERS ────────────────────────────────────────────────────────────────────
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'staff':
            # Staff see all orders, optionally filtered
            qs = Order.objects.select_related('food_court', 'student').prefetch_related('items__menu_item')
            if c := request.query_params.get('food_court'):
                qs = qs.filter(food_court_id=c)
            if s := request.query_params.get('status'):
                qs = qs.filter(status=s)
        else:
            # Students see only their own orders
            qs = Order.objects.filter(student=request.user).select_related('food_court').prefetch_related('items__menu_item')
        return Response(OrderReadSerializer(qs, many=True).data)

    def post(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can place orders.'}, status=403)
        s = OrderCreateSerializer(data=request.data, context={'request': request})
        if s.is_valid():
            order = s.save()
            return Response(OrderReadSerializer(order).data, status=201)
        return Response(s.errors, status=400)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if request.user.role == 'staff':
            order = get_object_or_404(Order, pk=pk)
        else:
            order = get_object_or_404(Order, pk=pk, student=request.user)
        return Response(OrderReadSerializer(
            Order.objects.select_related('food_court', 'student').prefetch_related('items__menu_item').get(pk=pk)
        ).data)


class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'staff':
            return Response({'error': 'Staff only.'}, status=403)
        order = get_object_or_404(Order, pk=pk)
        s = OrderStatusSerializer(order, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(OrderReadSerializer(
                Order.objects.select_related('food_court', 'student').prefetch_related('items__menu_item').get(pk=pk)
            ).data)
        return Response(s.errors, status=400)


# ── STATS (staff) ──────────────────────────────────────────────────────────────
class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'staff':
            return Response({'error': 'Staff only.'}, status=403)
        from django.db.models import Count, Sum
        return Response({
            'total_orders':  Order.objects.count(),
            'active_orders': Order.objects.filter(status__in=['Placed', 'Preparing']).count(),
            'ready_orders':  Order.objects.filter(status='Ready').count(),
            'revenue':       Order.objects.filter(status__in=['Ready', 'Collected']).aggregate(t=Sum('total_amount'))['t'] or 0,
            'by_status':     list(Order.objects.values('status').annotate(count=Count('id'))),
        })
