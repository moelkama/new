from rest_framework import serializers
from ..models import Partner, Restaurant, Holiday, ProblemReport

from authentication.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'



class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['name', 'logo_url', 'description', 'is_active']

    def create(self, validated_data):
        return Partner.objects.create(**validated_data)



class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'address',
            'city',
            'postal_code',
            'latitude',
            'longitude',
            'phone_number',
            'primary_email',
            'secondary_email',
            'whatsapp_number',
            'opening_hours',
            'is_active',
            'store_status',
            'image_url'
        ]
        
    def validate_opening_hours(self, value):
        days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        
        if not all(day in value for day in days):
            missing_days = [day for day in days if day not in value]
            raise serializers.ValidationError(f"Missing days in schedule: {', '.join(missing_days)}")
        
        for day, shifts in value.items():
            if not isinstance(shifts, list):
                raise serializers.ValidationError(f"Shifts for {day} must be a list")
                
            if len(shifts) > 2:
                raise serializers.ValidationError(f"{day} cannot have more than 2 shifts")
                
            for shift in shifts:
                if not isinstance(shift, dict) or 'start' not in shift or 'end' not in shift:
                    raise serializers.ValidationError(f"Each shift must be an object with 'start' and 'end' keys")
                    
        
        return value



class BusinessContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'name', 'full_name', 'surname',
            'primary_email', 'secondary_email',
            'phone_number', 'whatsapp_number',
            'address', 'city', 'postal_code',
            'is_active', 'store_status'
        ]


class OperationContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'full_name', 'surname',
            'primary_email', 'secondary_email',
            'phone_number', 'whatsapp_number',
            'opening_hours', 'is_active'
        ]



class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ["id", "start_date", "end_date"]

    def validate(self, data):
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError({"end_date": "End date must be after start date."})
        return data





class ProblemReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemReport
        fields = ['id', 'restaurant', 'full_name', 'primary_email', 'mobile_phone', 'message', 'created_at']
        extra_kwargs = {
            'full_name': {'required': True},
            'primary_email': {'required': True},
            'mobile_phone': {'required': True},
            'message': {'required': True},
        }
