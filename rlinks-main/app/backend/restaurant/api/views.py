from rest_framework import generics, exceptions, status, permissions
from restaurant.models import OperationContact, Holiday, Partner, ProblemReport
from restaurant.models import Restaurant as RestaurantModel
from .serializers import RestaurantSerializer, OperationContactSerializer, HolidaySerializer, ProblemReportSerializer, PartnerSerializer, BusinessContactSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import exceptions
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from django.conf import settings
from smtplib import SMTPException

User = get_user_model()


class IsPartner(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) and request.user.role.id == 2


class CreateRestaurantView(generics.CreateAPIView):
    queryset = RestaurantModel.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated, IsPartner]

    def perform_create(self, serializer):
        user = self.request.user

        partner = Partner.objects.get(user=user)

        serializer.save(partner=partner)

class RestaurantScheduleView(generics.RetrieveUpdateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]

    def get_object(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        user = self.request.user
        restaurant = RestaurantModel.objects.filter(id=restaurant_id, partner__user=user).first()

        if not restaurant:
            raise exceptions.NotFound("Restaurant not found or you do not have permission to access it.")
        return restaurant

    def get(self, request, *args, **kwargs):
        restaurant = self.get_object()
        return Response({"opening_hours": restaurant.opening_hours}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        restaurant = self.get_object()
        schedule_data = request.data.get("opening_hours")

        if not schedule_data:
            return Response({"detail": "Missing 'opening_hours' in request body."}, status=status.HTTP_400_BAD_REQUEST)

        restaurant.opening_hours = schedule_data

        if hasattr(restaurant, "validate_schedule_format"):
            is_valid, message = restaurant.validate_schedule_format()
            if not is_valid:
                return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        restaurant.save()
        return Response({"opening_hours": restaurant.opening_hours}, status=status.HTTP_200_OK)


class PartnerCreateView(generics.CreateAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        user = self.request.user
        owner_id = user.id
        partner_role_id = user.role.id
        
        serializer.save(user=user, owner_id=owner_id, partner_role_id=partner_role_id)


class RestaurantListView(generics.ListAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated, IsPartner]

    def get_queryset(self):
        user = self.request.user
        
        try:
            partner = Partner.objects.get(user=user)
        except Partner.DoesNotExist:
            return RestaurantModel.objects.none()
        
        return RestaurantModel.objects.filter(partner=partner)


class RestaurantDetail(generics.RetrieveUpdateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]
    # authentication_classes = [BaseJSONWebTokenAuthentication]

    def get_object(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        restaurant_name = self.request.query_params.get('name')
        
        user = self.request.user

        if restaurant_id:
            restaurant = RestaurantModel.objects.filter(id=restaurant_id, partner__user=user).first()
        elif restaurant_name:
            restaurant = RestaurantModel.objects.filter(name__iexact=restaurant_name, partner__user=user).first()
        else:
            raise exceptions.NotFound("Restaurant not found.")
        
        if not restaurant:
            raise exceptions.NotFound("Restaurant not found or you do not have permission to view it.")
        
        return restaurant

    def get(self, request, *args, **kwargs):
        restaurant = self.get_object()
        serializer = self.get_serializer(restaurant)
        return Response(serializer.data)

class OperationContactView(generics.RetrieveUpdateAPIView):
    serializer_class = OperationContactSerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]
    # authentication_classes = [BaseJSONWebTokenAuthentication]
    def get_object(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        user = self.request.user

        restaurant = RestaurantModel.objects.filter(id=restaurant_id, partner__user=user).first()
        
        if not restaurant:
            raise exceptions.NotFound("Restaurant not found or you do not have permission to access it.")
        
        return restaurant


class BusinessContactAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = BusinessContactSerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]

    def get_object(self):
        restaurant_id = self.kwargs.get("restaurant_id")
        return get_object_or_404(RestaurantModel, id=restaurant_id, partner__user=self.request.user)




class HolidayView(generics.ListCreateAPIView):
    serializer_class = HolidaySerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]

    def get_queryset(self):
        restaurant_id = self.kwargs.get("restaurant_id")
        restaurant = get_object_or_404(RestaurantModel, id=restaurant_id, partner__user=self.request.user)
        return Holiday.objects.filter(restaurant=restaurant)

    # Important Check for overlapping holidays after asking the frontend about it
    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get("restaurant_id")
        restaurant = get_object_or_404(RestaurantModel, id=restaurant_id, partner__user=self.request.user)
        serializer.save(restaurant=restaurant)

class HolidayDeleteView(generics.RetrieveDestroyAPIView):
    serializer_class = HolidaySerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]

    def get_queryset(self):
        restaurant_id = self.kwargs.get("restaurant_id")
        restaurant = get_object_or_404(RestaurantModel, id=restaurant_id, partner__user=self.request.user)
        return Holiday.objects.filter(restaurant=restaurant)



class ProblemReportView(generics.ListCreateAPIView):
    serializer_class = ProblemReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsPartner]

    def get_queryset(self):
        user = self.request.user
        try:
            partner = Partner.objects.get(user=user)
        except Partner.DoesNotExist:
            raise exceptions.NotFound("Partner account not found.")

        return ProblemReport.objects.filter(partner=partner)

    def perform_create(self, serializer):
        user = self.request.user
        try:
            partner = Partner.objects.get(user=user)
        except Partner.DoesNotExist:
            raise exceptions.NotFound("Partner account not found.")

        report = serializer.save(partner=partner)

        print(f"sender's mail is {partner.user.email} and receiver is {settings.DEFAULT_FROM_EMAIL}")
        try:
            send_mail(
                'Problem Report Received',
                (
                    f"Hello {report.full_name},\n\n"
                    f"We have received your problem report for the partner \"{partner.name}\".\n\n"
                    f"Your message:\n{report.message}\n\n"
                    "Thank you for reaching out."
                ),
                settings.DEFAULT_FROM_EMAIL,
                [partner.user.email],
            )
        except SMTPException:
            raise exceptions.APIException("Failed to send notification email. Please try again later.")
        except Exception:
            raise exceptions.APIException("An unexpected error occurred while sending the notification email.")
