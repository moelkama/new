from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager

class Role(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class User(AbstractBaseUser):

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=20, blank=False)
    last_name = models.CharField(max_length=20, blank=True, null=True)
    phone_number = models.CharField(max_length=20, unique=True) 
    preferred_language = models.CharField(max_length=50, blank=True, null=True, default="en")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    reset_email_uid = models.UUIDField(null=True, blank=True, default=None)
    reset_email_expiry = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    def __str__(self):
        return self.email   