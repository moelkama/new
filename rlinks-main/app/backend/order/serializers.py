from rest_framework import serializers
from .models import Order, OrderItem
from menu.models import Article, AddOn
from .utils import two_letter_code, get_neighborhood_from_coords, next_sequence

# from menu.serializers import ArticleSerializer, AddOnSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    article_name = serializers.CharField(source='article.name', read_only=True)
    article_price = serializers.DecimalField(source='article.price', max_digits=10, decimal_places=2, read_only=True)
    article_image = serializers.ImageField(source='article.image', read_only=True)
    article_description = serializers.CharField(source='article.description', read_only=True)
    selected_addons_details = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'article', 'article_name', 'article_price', 'article_image', 
                 'article_description', 'quantity', 'selected_addons', 'selected_addons_details', 'total_price']

    def get_selected_addons_details(self, obj):
        return [{
            'id': addon.id,
            'name': addon.name,
            'price': addon.price
        } for addon in obj.selected_addons.all()]

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'status', 'total_price', 'customer_address', 
                 'order_items', 'user', 'user_email', 'restaurant', 'restaurant_name', 'code']
        read_only_fields = ['id', 'created_at', 'total_price', 'code']

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        
        # Generate the order code before creating the order
        restaurant = validated_data['restaurant']
        city_code  = two_letter_code(restaurant.city)
        brand_code = two_letter_code(restaurant.name)
        neighborhood = get_neighborhood_from_coords(
            restaurant.latitude, restaurant.longitude
        ) or ""
        neigh_code = two_letter_code(neighborhood)

        prefix = f"{city_code}{brand_code}{neigh_code}"
        seq    = next_sequence(prefix)
        validated_data['code'] = prefix + seq

        # Create the order with the generated code
        order = Order.objects.create(**validated_data)

        for item_data in order_items_data:
            selected_addons = item_data.pop('selected_addons', [])
            order_item = OrderItem.objects.create(order=order, **item_data)
            order_item.selected_addons.set(selected_addons)
            order_item.save()

        order.update_total_price()  # To calculate the total after adding items
        return order

    def update(self, instance, validated_data):
        # Pull out the new items list (or empty list if not provided)
        new_items_data = validated_data.pop('order_items', [])

        # Update simple fields (status, address, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # --- REPLACE ALL ITEMS ---
        # 1) delete everything currently on the order
        instance.orderitem_set.all().delete()

        # 2) recreate items from scratch
        for item_data in new_items_data:
            selected_addons = item_data.pop('selected_addons', [])
            order_item = OrderItem.objects.create(order=instance, **item_data)
            order_item.selected_addons.set(selected_addons)
            order_item.save()

        # Recalculate total price now that items changed
        instance.update_total_price()
        return instance
# class OrderSerializer(serializers.ModelSerializer):
#     items = OrderItemSerializer(many=True, read_only=True, source="orderitem_set")  # Fetch related items

#     class Meta:
#         model = Order
#         fields = ['id', 'user', 'restaurant', 'created_at', 'total_price', 'items']
#         read_only_fields = ['id', 'created_at', 'total_price']

#     def create(self, validated_data):
#         """
#         Override create method to ensure the total_price is calculated automatically.
#         """
#         order = Order.objects.create(**validated_data)
#         order.total_price = sum(item.price * item.quantity for item in order.orderitem_set.all())
#         order.save()
#         return order