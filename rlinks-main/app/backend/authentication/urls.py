from django.urls import path
from .views import SignUp, SignIn, SendResetPasswordLink, ResetPassword, AdminCreateUserView


urlpatterns = [
    path('sign-up/', SignUp.as_view(), name='sign-up'),
    path('sign-in/', SignIn.as_view(), name='sign-in'),
    path('send-reset-password-link/', SendResetPasswordLink.as_view(), name='send-reset-password-link'),
    path('reset-password/', ResetPassword.as_view(), name='reset-password'),
    path('partner-create-user/', AdminCreateUserView.as_view(), name='partner-create-user')
]