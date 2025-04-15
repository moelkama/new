from django.core.management.base import BaseCommand
from authentication.models import User, Role

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        role, created = Role.objects.get_or_create(name="Admin")  

        User.objects.create(
            email="admin@example.com",
            first_name="John",  # Ensure max 20 chars
            last_name="Doe",  # Ensure max 20 chars
            phone_number="1234567890",  # Ensure max 20 chars
            preferred_language="English",
            role=role
        )
