from django.urls import path
from .views import (
    RestaurantListView, 
    RestaurantDetail, 
    OperationContactView, 
    HolidayView, 
    ProblemReportView,
    PartnerCreateView,
    CreateRestaurantView,
    RestaurantScheduleView,
    HolidayDeleteView,
    BusinessContactAPIView
)

urlpatterns = [
    path('restaurants/', RestaurantListView.as_view(), name='restaurant-list'),

    path('restaurants/<int:restaurant_id>/schedule/', RestaurantScheduleView.as_view(), name='restaurant-schedule'),
    
    path('restaurants/<int:restaurant_id>/', RestaurantDetail.as_view(), name='restaurant-detail'),
    
    path('restaurants/<int:restaurant_id>/operation-contact/', OperationContactView.as_view(), name='operation-contact-detail'),

    path('restaurants/<int:restaurant_id>/business-contact/', BusinessContactAPIView.as_view(), name='business-contact'),
    
    path('restaurants/<int:restaurant_id>/holidays/', HolidayView.as_view(), name='holiday-list-create'),

    path('restaurants/<int:restaurant_id>/holidays/<int:pk>/', HolidayDeleteView.as_view(), name='holiday-delete'),
    
    path('restaurants/reports/', ProblemReportView.as_view(), name='problem-report-create'),

    path('create-partner/', PartnerCreateView.as_view(), name='create_partner'),

    path('create-restaurant/', CreateRestaurantView.as_view(), name='create_restaurant'),
]
