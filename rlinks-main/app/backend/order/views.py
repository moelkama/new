from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from django.shortcuts import get_object_or_404
from restaurant.models import Restaurant, Partner
from django.contrib.auth import get_user_model
from restaurant.api.views import IsPartner

User = get_user_model()

class OrderListView(APIView):

    permission_classes = [IsPartner]

    def get(self, request):
        user = request.user

        partner = Partner.objects.filter(user=user).first()

        if partner:
            restaurants = Restaurant.objects.filter(partner=partner)
            orders = Order.objects.filter(restaurant__in=restaurants)
        else:
            orders = Order.objects.filter(user=user)

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OrderDetailView(APIView):

    permission_classes = [IsPartner]

    def get(self, request, order_id):
        user = request.user
        order = get_object_or_404(Order, id=order_id)

        partner = Partner.objects.filter(user=user).first()

        if partner:
            if not Restaurant.objects.filter(partner=partner, id=order.restaurant.id).exists():
                return Response({"detail": "You do not have permission to view this order."}, status=status.HTTP_403_FORBIDDEN)
        else:
            if order.user != user:
                return Response({"detail": "You do not have permission to view this order."}, status=status.HTTP_403_FORBIDDEN)

        # Prefetch related data to optimize the query
        order = Order.objects.prefetch_related(
            'orderitem_set__article',
            'orderitem_set__selected_addons'
        ).get(id=order_id)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OrderCreateView(APIView):
    permission_classes = [IsPartner]

    def post(self, request):
        user = request.user
        data = request.data.copy()

        # Check if the user is a partner
        partner = Partner.objects.filter(user=user).first()

        if "user_id" in data:
            try:
                customer = User.objects.get(id=data["user_id"])
            except User.DoesNotExist:
                return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
            if not partner:
                return Response(
                    {"detail": "You do not have permission to create an order for another user."},
                    status=status.HTTP_403_FORBIDDEN
                )

            restaurant = Restaurant.objects.filter(partner=partner).first()
            if not restaurant:
                return Response({"detail": "You do not have permission to create an order for your restaurant."}, status=status.HTTP_403_FORBIDDEN)

            if restaurant.partner != partner:
                return Response({"detail": "You can only create orders for your own restaurants."}, status=status.HTTP_403_FORBIDDEN)

            data["user"] = customer.id
            data["restaurant"] = restaurant.id
        else:
            data["user"] = user.id
            if "restaurant" not in data:
                return Response({"detail": "Restaurant ID is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                restaurant = Restaurant.objects.get(id=data["restaurant"])
            except Restaurant.DoesNotExist:
                return Response({"detail": "Restaurant not found."}, status=status.HTTP_404_NOT_FOUND)

        # Use serializer for validation and order creation
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemListView(APIView):
    permission_classes = [IsPartner]

    def get(self, request, order_id):
        user = request.user
        order = get_object_or_404(Order, id=order_id)

        partner = Partner.objects.filter(user=user).first()

        if partner:
            if not Restaurant.objects.filter(partner=partner, id=order.restaurant.id).exists():
                return Response({"detail": "You do not have permission to view this order's items."}, status=status.HTTP_403_FORBIDDEN)
        else:
            if order.user != user:
                return Response({"detail": "You do not have permission to view this order's items."}, status=status.HTTP_403_FORBIDDEN)

        order_items = OrderItem.objects.filter(order=order)
        serializer = OrderItemSerializer(order_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class OrderItemDetailView(APIView):

    permission_classes = [IsPartner]

    def get(self, request, order_item_id):
        user = request.user
        order_item = get_object_or_404(OrderItem, id=order_item_id)
        order = order_item.order

        partner = Partner.objects.filter(user=user).first()

        if partner:
            if not Restaurant.objects.filter(partner=partner, id=order.restaurant.id).exists():
                return Response({"detail": "You do not have permission to view this order item."}, status=status.HTTP_403_FORBIDDEN)
        else:
            if order.user != user:
                return Response({"detail": "You do not have permission to view this order item."}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderItemSerializer(order_item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderItemCreateView(APIView):
    permission_classes = [IsPartner]

    def post(self, request):
        user = request.user
        data = request.data.copy()

        order = get_object_or_404(Order, id=data.get("order"))

        # Check permissions (Partner or Order Owner)
        partner = Partner.objects.filter(user=user).first()

        if partner:
            if not Restaurant.objects.filter(partner=partner, id=order.restaurant.id).exists():
                return Response(
                    {"detail": "You do not have permission to add items to this order."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        elif order.user != user:
            return Response(
                {"detail": "You do not have permission to add items to this order."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Validate and save order item
        serializer = OrderItemSerializer(data=data)
        if serializer.is_valid():
            order_item = serializer.save(order=order)

            return Response(OrderItemSerializer(order_item).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderUpdateView(APIView):
    permission_classes = [IsPartner]

    def patch(self, request, order_id):
        user = request.user
        data = request.data

        order = get_object_or_404(Order, id=order_id)

        # Permission checks: Ensure the user (if a partner) belongs to the restaurant for the order
        partner = Partner.objects.filter(user=user).first()
        if partner:
            if not Restaurant.objects.filter(partner=partner, id=order.restaurant.id).exists():
                return Response(
                    {"detail": "You do not have permission to update this order."},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {"detail": "You do not have permission to update the order."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Business logic: Example for status updates when order is pending
        new_status = data.get("status")
        if new_status:
            # Define valid status transitions
            valid_transitions = {
                "pending": ["accepted", "decline"],
                "accepted": ["ready", "decline"],
                "ready": [],  # Final state
                "decline": []  # Final state
            }
            
            current_status = order.status
            if new_status not in valid_transitions.get(current_status, []):
                return Response(
                    {"detail": f"Invalid status transition from {current_status} to {new_status}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Use serializer to update the order (partial update allows sending only changed fields)
        serializer = OrderSerializer(order, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_order = serializer.save()

        return Response(
            {
                "detail": "Order updated successfully.",
                "order": OrderSerializer(updated_order).data
            },
            status=status.HTTP_200_OK
        )