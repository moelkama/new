from django.urls import path, include
from .views import OrderListView, OrderDetailView, OrderCreateView, OrderItemListView, OrderItemDetailView, OrderItemCreateView, OrderUpdateView
urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('<int:order_id>/items/', OrderItemListView.as_view(), name='order-item-list'),
    path('<int:order_id>/items/<int:item_id>/', OrderItemDetailView.as_view(), name='order-item-detail'),
    path('<int:order_id>/items/create/', OrderItemCreateView.as_view(), name='order-item-create'),
    path('<int:order_id>/update/', OrderUpdateView.as_view(), name='order-update'),
] 