from django.urls import path
from .views import UserDetailView, UserUpdateView, UserDeleteView


urlpatterns = [
    path('', UserDetailView.as_view(), name='user-detail'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    path('delete/', UserDeleteView.as_view(), name='user-delete'), 
]