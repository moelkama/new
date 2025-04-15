from django.db import models
from restaurant.models import Restaurant




class Menu(models.Model):
    name = models.CharField(max_length=200)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menus')
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    # A menu doesn't need a price - it contains sections which contain articles with prices
    is_available = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']

class Section(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='section_images/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='sections')
    start_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"{self.menu.name} - {self.name}"
    
    class Meta:
        ordering = ['order']


class AddOn(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_mandatory = models.BooleanField(default=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='addons')
    enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
    

class AddOnCollection(models.Model):
    name = models.CharField(max_length=255)
    addons = models.ManyToManyField(AddOn)
    description = models.TextField(blank=True, null=True)

    min_select = models.PositiveIntegerField(default=0, help_text="Minimum number of addons user must choose")
    max_select = models.PositiveIntegerField(default=1, help_text="Maximum number of addons user can choose")

    allow_multiple_same_addon = models.BooleanField(default=False, help_text="Can the same addon be selected more than once?")

    def __str__(self):
        return self.name

class Article(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='article_images/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='articles')
    is_available = models.BooleanField(default=True)
    available_addons = models.ManyToManyField(AddOnCollection, blank=True)
    order = models.PositiveIntegerField(default=0)
    option_groups = models.ManyToManyField(AddOnCollection, related_name="articles", blank=True)
    # option_groups = models.ManyToManyField(
    #     'AddOnCollection',
    #     related_name='articles',
    #     blank=True
    # )
    
    def __str__(self):
        return f"{self.section.name} - {self.name}"
    
    class Meta:
        ordering = ['order']

