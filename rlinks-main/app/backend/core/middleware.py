from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()

@database_sync_to_async
def get_user(validated_token):
    try:
        user = User.objects.get(id=validated_token['user_id'])
        return user
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Parse the query string (e.g., ws://.../?token=YOUR_TOKEN)
        query_string = scope["query_string"].decode()
        query_params = parse_qs(query_string)

        token = query_params.get('token')
        if token:
            jwt_token = token[0]
            try:
                validated_token = JWTAuthentication().get_validated_token(jwt_token)
                scope['user'] = await get_user(validated_token)
            except (InvalidToken, TokenError) as e:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
