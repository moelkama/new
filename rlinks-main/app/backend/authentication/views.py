from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.utils.timezone import now, timedelta
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiTypes, OpenApiResponse, OpenApiExample
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from smtplib import SMTPException
from .serializers import UserSerializer, SignInSerializer, SignupSerializer, ResetPasswordSerializer, AdminCreateUserSerializer
from restaurant.api.views import IsPartner
import uuid

User = get_user_model()

def get_unauthorized_error_example():
    serializer = UserSerializer(data={})
    serializer.is_valid()
    return serializer.errors

class SignUp(APIView):

    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            200: OpenApiResponse(
                description="Access token successfully returned, refresh token set in cookies.",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Success Example",
                        value={'success': 'Authentication successful', "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJleHBpcmVkX3N0YWdlX2xvZ2luIjoiY29tcGxldGVfY3JldGF0aW9uIiwiZXhwIjoxNjEyMzQ1NzYwfQ.PtGn80sb8ygd4nt7Z0q8q6sTx9umgEtA4REAPtu_s3A"},
                        response_only=True,
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Unauthorized: Invalid credentials.",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Seralizer Error Example",
                        value=get_unauthorized_error_example(),
                        response_only=True,
                    ),
                    OpenApiExample(
                        name="Failed to save user data",
                        value={'error': 'Failed to save user data'},
                        response_only=True,
                    )
                ]
            )
        }
    )
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                user.last_login = now()
                user.save()
                refresh = RefreshToken.for_user(user)

                jwt_tokens = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

                response = Response({
                    'success': 'Authentication successful',
                    'access': jwt_tokens['access']
                }, status=status.HTTP_201_CREATED)

                response.set_cookie(
                    key='refresh',
                    value=jwt_tokens['refresh'],
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                    path='/token/refresh/',
                    max_age=7 * 24 * 60 * 60,
                )

                return response
            else:
                return Response({'error': 'Failed to save user data'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignIn(APIView):

    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            200: OpenApiResponse(
                description="Access token successfully returned, refresh token set in cookies.",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Success Example",
                        value={'success': 'Authentication successful', "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJleHBpcmVkX3N0YWdlX2xvZ2luIjoiY29tcGxldGVfY3JldGF0aW9uIiwiZXhwIjoxNjEyMzQ1NzYwfQ.PtGn80sb8ygd4nt7Z0q8q6sTx9umgEtA4REAPtu_s3A"},
                        response_only=True,
                    )
                ]
            ),
            401: OpenApiResponse(
                description="Unauthorized: Invalid credentials.",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Error Example",
                        value={'error': 'Invalid credentials'},
                        response_only=True,
                    )
                ]
            )
        }
    )
    def post(self, request):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            print(email, password)
            user = authenticate(email=email, password=password)
            print(user)
            if user:
                user.last_login = now()
                user.save()
                refresh = RefreshToken.for_user(user)

                jwt_tokens = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                
                response = Response({
                    'success': 'Authentication successful',
                    'access': jwt_tokens['access']
                }, status=status.HTTP_200_OK)

                response.set_cookie(
                    key='refresh',
                    value=jwt_tokens['refresh'],
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                    path='/token/refresh/',
                    max_age=7 * 24 * 60 * 60,
                )
                return response
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):

    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            200: OpenApiResponse(
                description="Access token successfully refreshed.",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Success Example",
                        value={"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJleHBpcmVkX3N0YWdlX2xvZ2luIjoiY29tcGxldGVfY3JldGF0aW9uIiwiZXhwIjoxNjEyMzQ1NzYwfQ.PtGn80sb8ygd4nt7Z0q8q6sTx9umgEtA4REAPtu_s3A"},
                        response_only=True,
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Bad Request: Invalid or missing refresh token.",
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Missing Refresh Token Example",
                        value={"detail": "Refresh token missing."},
                        response_only=True,
                    ),
                    OpenApiExample(
                        name="Invalid Token Example",
                        value={"detail": "Invalid token."},
                        response_only=True,
                    ),
                    OpenApiExample(
                        name="User Does Not Exist Example",
                        value={"detail": "Invalid token: User does not exist."},
                        response_only=True,
                    ),
                    OpenApiExample(
                        name="Validation Error Example",
                        value={"detail": "Token is invalid or expired."},
                        response_only=True,
                    )
                ]
            )
        }
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token missing.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = RefreshToken(refresh_token).payload
        except Exception as e:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = payload.get('user_id')
        if not user_id or not User.objects.filter(id=user_id).exists():
            return Response({'error': 'Invalid token: User does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    

class SendResetPasswordLink(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            reset_email_uid = uuid.uuid4()
            reset_email_expiry = now() + timedelta(minutes=10)
            user.reset_email_uid = reset_email_uid
            user.reset_email_expiry = reset_email_expiry
            user.save()

            send_mail(
                'Password Reset request',
                f'You have requested to reset your password. Please click the link below to proceed:\n'
                f'{settings.FRONTEND_URL}/reset_password/?code={reset_email_uid}\n'
                f'If you did not request this, please ignore this email.\n'
                f'This link will expire in 10 minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email]
            )
            return Response({'success': 'Check your email.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'success': 'Check your email.'}, status=status.HTTP_200_OK)
        except SMTPException as e:
            return Response(
                {"detail": "Failed to send verification email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"detail": "An unexpected error occurred deal with it."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResetPassword(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        try:
            user = User.objects.get(
                reset_email_uid=code, reset_email_expiry__gt=now()
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid or expired reset token."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.reset_email_uid = None
            user.reset_email_expiry = None
            user.save()
            return Response({"success": "Your password has been reset successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminCreateUserView(APIView):
    permission_classes = [IsPartner]

    def post(self, request):
        serializer = AdminCreateUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            if hasattr(serializer, 'existing_user'):
                return Response({
                    "message": "User already exists.",
                    "user_id": user.id
                }, status=status.HTTP_200_OK)

            return Response({
                "message": "User created successfully.",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)