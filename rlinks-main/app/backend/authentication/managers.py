from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def get_by_natural_key(self, email):
        return self.get(email=email)