import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from order.routing import websocket_urlpatterns
from core.middleware import JWTAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Traditional HTTP
    "websocket": JWTAuthMiddleware(   # Custom JWT auth for WebSocket
            URLRouter(
                websocket_urlpatterns  # List of WebSocket URLs
            )
    ),
})
