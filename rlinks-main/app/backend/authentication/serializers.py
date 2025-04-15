from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError  
import re 
from .utils import generate_unique_email

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = '__all__'

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    def validate_phone_number(self, value):
        if not re.match(r'^\+212\d{9}$', value):  
            raise serializers.ValidationError("Invalid phone number format.")

        if get_user_model().objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("This phone number is already in use.")
        
        return value

    class Meta:
        model = get_user_model()
        fields = ['email', 'phone_number', 'password', 'first_name', 'last_name', 'preferred_language', 'role']

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])  
        user.save()
        return user

class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        return value.lower()

class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    retyped_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        retyped_password = attrs.get('retyped_password')
        temp_token = attrs.get('temp_token')

        try:
            user = User.objects.get(email=temp_token)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'email': 'User with this email does not exist.'})

        if new_password != retyped_password:
            raise serializers.ValidationError(
                {'mismatch': 'new password does not match the retyped password.'})
        try:
            validate_password(new_password, user=user)
        except ValidationError as e:
            raise serializers.ValidationError(
                {'new_password': list(e.messages)})

        try:
            validate_password(retyped_password, user=user)
        except ValidationError as e:
            raise serializers.ValidationError(
                {'retyped_password': list(e.messages)})

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user

class AdminCreateUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'phone_number'] 

    def validate_phone_number(self, value):
        if not re.match(r'^\+212\d{9}$', value):  
            raise serializers.ValidationError("Invalid phone number format.")
        
        return value

    def create(self, validated_data):
        phone_number = validated_data['phone_number']
        first_name = validated_data['first_name']

        user, created = User.objects.get_or_create(
            phone_number=phone_number,
            defaults={
                'first_name': first_name,
                'email': generate_unique_email(first_name),
                'last_name': "",
                'role_id': 1,
                'is_active': False
            }
        )

        if not created:
            self.existing_user = True 
        else:
            user.set_unusable_password()
            user.save()

        return user