import random
import string
from django.contrib.auth import get_user_model

User = get_user_model()

def generate_unique_email(first_name):
        first_name_part = first_name.replace(' ', '').lower()
        random_part = ''.join(random.choices(string.digits, k=4))
        base_email = f"{first_name_part}{random_part}@temp_mail.com"

        while User.objects.filter(email=base_email).exists():
            random_part = ''.join(random.choices(string.digits, k=4))
            base_email = f"{first_name_part}{random_part}@temp_mail.com"

        return base_email