from django.db import models
from django.contrib.auth import get_user_model
from menu.models import AddOn, Article

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('ready', 'Ready'),
        ('decline', 'Decline'),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    customer_address = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey('restaurant.Restaurant', on_delete=models.CASCADE)
    code = models.CharField(max_length=12, unique=True, blank=True)
    
    def update_total_price(self):
        self.total_price = sum(item.total_price for item in self.orderitem_set.all())
        self.save()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    selected_addons = models.ManyToManyField(AddOn, blank=True)

    @property
    def total_price(self):
        addon_total = sum(addon.price for addon in self.selected_addons.all())
        return (self.article.price + addon_total) * self.quantity