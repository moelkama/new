from django.db import models
from authentication.models import User

class Partner(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="partner")
    name = models.CharField(max_length=255)
    logo_url = models.URLField(blank=True, null=True)
    description = models.TextField()
    owner_id = models.IntegerField()
    partner_role_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name



class Restaurant(models.Model):
    id = models.AutoField(primary_key=True)
    partner = models.ForeignKey('Partner', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255, help_text="Full name of the restaurant owner or contact person")
    surname = models.CharField(max_length=255, help_text="Surname of the restaurant owner or contact person")
    primary_email = models.EmailField(unique=True, help_text="Primary contact email address")
    secondary_email = models.EmailField(null=True, blank=True, help_text="Secondary contact email address (optional)")
    phone_number = models.CharField(max_length=20, help_text="Primary phone number")
    whatsapp_number = models.CharField(max_length=20, null=True, blank=True, help_text="WhatsApp number (optional)")
    
    address = models.TextField()
    city = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    opening_hours = models.JSONField(
        default=dict,
        help_text="Store schedule (e.g., daily opening hours)"
    )
    image_url = models.URLField(max_length=500, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    store_status = models.CharField(
        max_length=20,
        choices=[('open', 'Open'), ('closed', 'Closed')],
        default='open',
        help_text="Current operational status of the store"
    )

    def __str__(self):
        return self.name


    def initialize_empty_schedule(self):
        self.opening_hours = {
            "mon": [],
            "tue": [],
            "wed": [],
            "thu": [],
            "fri": [],
            "sat": [],
            "sun": []
        }
        self.save()
    
    def is_open_now(self):
        from datetime import datetime
        
        if not self.is_active or self.store_status == 'closed':
            return False
            
        now = datetime.now()
        day = now.strftime("%a").lower()
        current_time = now.strftime("%H:%M")
        
        for shift in self.opening_hours.get(day, []):
            if shift["start"] <= shift["end"]:
                if shift["start"] <= current_time <= shift["end"]:
                    return True
            else:
                if shift["start"] <= current_time or current_time <= shift["end"]:
                    return True
                    
        return False
    
    def get_current_status(self):
        if not self.is_active:
            return "inactive"
        
        if self.store_status == 'closed':
            return "temporarily_closed"
            
        return "open" if self.is_open_now() else "closed"


class OperationContact(models.Model):
    restaurant = models.OneToOneField(Restaurant, on_delete=models.CASCADE, related_name='contact')

    def __str__(self):
        return f"{self.restaurant.name}"




class Holiday(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='holidays')
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"Holiday from {self.start_date} to {self.end_date}"



class ProblemReport(models.Model):
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='reports')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    full_name = models.CharField(max_length=255)
    primary_email = models.EmailField()
    mobile_phone = models.CharField(max_length=20)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.full_name} on {self.created_at}"
