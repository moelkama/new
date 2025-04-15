from rest_framework import serializers
from .models import Restaurant, Menu, Section, Article, AddOn, AddOnCollection

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import math

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.page.paginator.per_page)

        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current_page': self.page.number,
            'total_pages': total_pages,
            'page_size': self.page.paginator.per_page,
            'results': data,
            'is_paginated': True,
            'has_next': self.page.has_next(),
            'has_previous': self.page.has_previous(),
            'start_index': self.page.start_index(),
            'end_index': self.page.end_index(),
        })

        

class AddOnSerializerArticle(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'price', 'is_mandatory', 'enabled', 'restaurant']




class SectionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Section
        fields = [
            'id', 'name', 'image', 'description', 
            'menu', 'start_price'
        ]

class MenuSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = [
            'id', 'name', 'image', 'description', 
            'is_available', 'order', 'sections', 'restaurant'
        ]
        read_only_fields = ['restaurant']
    
    def get_sections(self, obj):
        request = self.context.get('request')
        sections_qs = obj.sections.all()
        
        paginator = StandardResultsSetPagination()
        paginated_sections = paginator.paginate_queryset(sections_qs, request)
        
        serializer = SectionSerializer(paginated_sections, many=True)
        
        return {
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'current_page': paginator.page.number,
            'total_pages': math.ceil(paginator.page.paginator.count / paginator.page_size),
            'page_size': paginator.page_size,
            'results': serializer.data
        }



class RestaurantMenuSerializer(serializers.ModelSerializer):
    menus = MenuSerializer(many=True, read_only=True)
    
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'menus']

class MenuCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = [
            'id', 'name', 'image', 'description', 
            'is_available', 'restaurant'
        ]
        read_only_fields = ['restaurant']

class SectionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = [
            'id', 'name', 'image', 'description'
            , 'start_price'
        ]


class ArticleCreateUpdateSerializer(serializers.ModelSerializer):
    option_group_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=AddOnCollection.objects.all(),
        source='option_groups',
        required=False
    )

    class Meta:
        model = Article
        fields = [
            'id', 'name', 'image', 'description', 'price',
            'section', 'is_available',
            'option_group_ids'
        ]


class AddOnSerializer(serializers.ModelSerializer):
    restaurant = serializers.PrimaryKeyRelatedField(
        queryset=Restaurant.objects.all(),
        required=False,
        read_only=False
    )

    class Meta:
        model = AddOn
        fields = ['id', 'name', 'price', 'is_mandatory', 'enabled', 'restaurant']



class AddOnCollectionSerializer(serializers.ModelSerializer):
    addon_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AddOn.objects.all(), write_only=True, source='addons'
    )
    addons = AddOnSerializer(many=True, read_only=True)


    class Meta:
        model = AddOnCollection
        fields = [
            'id', 'name', 'description',
            'min_select', 'max_select',
            'allow_multiple_same_addon',
            'addons',
            'addon_ids'

        ]


class ArticleSerializer(serializers.ModelSerializer):
    option_groups = AddOnCollectionSerializer(many=True, read_only=True)
    option_group_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=AddOnCollection.objects.all(),
        source='option_groups',
        write_only=True
    )

    class Meta:
        model = Article
        fields = [
            'id', 'name', 'image', 'description', 'price',
            'section', 'is_available',
            'option_groups',
            'option_group_ids'
        ]

