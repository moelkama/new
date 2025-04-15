from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import OrderSerializer

@receiver(post_save, sender=Order)
def send_order_status_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()

    if instance.user:  # Only send if the order has a user
        async_to_sync(channel_layer.group_send)(
            f"user_{instance.user.id}",  # Group name: user ID
            {
                "type": "order_status_update",  # Matches a method in the Consumer
                "content": {
                    "order": OrderSerializer(instance).data  # Send serialized Order
                }
            }
        )
