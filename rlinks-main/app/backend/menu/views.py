from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Restaurant, Menu, Section, Article, AddOn, AddOnCollection
from .serializers import MenuSerializer, AddOnSerializer
from django.shortcuts import get_object_or_404
from restaurant.models import Restaurant
from restaurant.api.views import IsPartner

from django.db.models import Q

from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from .serializers import (
    MenuSerializer, SectionSerializer, ArticleSerializer, AddOnSerializer,
    MenuCreateUpdateSerializer, SectionCreateUpdateSerializer, ArticleCreateUpdateSerializer,
    RestaurantMenuSerializer, StandardResultsSetPagination, AddOnCollectionSerializer
)

class BasePartnerView:
    permission_classes = [permissions.IsAuthenticated, IsPartner]
    
    def get_partner_restaurants(self):
        return Restaurant.objects.filter(partner__user=self.request.user)

class RestaurantMenuListView(BasePartnerView, generics.ListAPIView):
    serializer_class = RestaurantMenuSerializer
    
    def get_queryset(self):
        return self.get_partner_restaurants()


class MenuViewSet(BasePartnerView, viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MenuCreateUpdateSerializer
        return MenuSerializer

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        return Menu.objects.filter(
            restaurant__id=restaurant_id,
            restaurant__partner__user=self.request.user
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not queryset.exists():
            return Response(
                {"detail": "No menu found. You can POST to create one."},
                status=status.HTTP_404_NOT_FOUND
            )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({'results': serializer.data})
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
    
        menu_data = MenuSerializer(instance, context={'request': request}).data

        sections = instance.sections.all().order_by('order', 'id')
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(sections, request)

        serializer = SectionSerializer(page, many=True)
        paginated_response = paginator.get_paginated_response(serializer.data)

        response_data = menu_data.copy()
        response_data['sections'] = paginated_response.data['results']
        response_data['count'] = paginated_response.data['count']
        response_data['next'] = paginated_response.data['next']
        response_data['previous'] = paginated_response.data['previous']
        response_data['current_page'] = paginated_response.data['current_page']
        response_data['total_pages'] = paginated_response.data['total_pages']
        response_data['page_size'] = paginated_response.data['page_size']

        return Response(response_data)

    def perform_create(self, serializer):
        restaurant = get_object_or_404(
            Restaurant,
            id=self.kwargs.get('restaurant_id'),
            partner__user=self.request.user
        )
        menu, created = Menu.objects.get_or_create(restaurant=restaurant)
        serializer.instance = menu

    def perform_destroy(self, instance):
        instance.delete()


    @action(detail=True, methods=['get'])
    def articles(self, request, restaurant_id=None, pk=None):

        menu = self.get_object()
        search_query = request.query_params.get('search', '')

        articles_qs = Article.objects.filter(section__menu=menu)

        if search_query:
            articles_qs = articles_qs.filter(
                Q(name__icontains=search_query)
            )

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(articles_qs, request)

        serializer = ArticleSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)



class SectionViewSet(BasePartnerView, viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SectionCreateUpdateSerializer
        return SectionSerializer
    
    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        menu_id = self.kwargs.get('menu_id')
        queryset = Section.objects.filter(
            menu__id=menu_id,
            menu__restaurant__id=restaurant_id,
            menu__restaurant__partner__user=self.request.user
        )

        if not queryset.exists():
            raise NotFound("No section found. You can POST to create one.")

        return queryset
    
    def perform_create(self, serializer):
        menu = get_object_or_404(
            Menu,
            id=self.kwargs.get('menu_id'),
            restaurant__id=self.kwargs.get('restaurant_id'),
            restaurant__partner__user=self.request.user
        )
        serializer.save(menu=menu)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        sections_qs = [instance]

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(sections_qs, request)

        serializer = SectionSerializer(page, many=True, context={'request': request})
        paginated_response = paginator.get_paginated_response(serializer.data)

        return Response({
            'sections': paginated_response.data['results'],
            'count': paginated_response.data['count'],
            'next': paginated_response.data['next'],
            'previous': paginated_response.data['previous'],
            'current_page': paginated_response.data['current_page'],
            'total_pages': paginated_response.data['total_pages'],
            'page_size': paginated_response.data['page_size'],
        })


class ArticleViewSet(BasePartnerView, viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ArticleCreateUpdateSerializer
        return ArticleSerializer
    
    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        menu_id = self.kwargs.get('menu_id')
        section_id = self.kwargs.get('section_id')
        queryset = Article.objects.filter(
            section__id=section_id,
            section__menu__id=menu_id,
            section__menu__restaurant__id=restaurant_id,
            section__menu__restaurant__partner__user=self.request.user
        )

        if not queryset.exists():
            raise NotFound("No article found. You can POST to create one.")
        return queryset
    
    def perform_create(self, serializer):
        section = get_object_or_404(
            Section,
            id=self.kwargs.get('section_id'),
            menu__id=self.kwargs.get('menu_id'),
            menu__restaurant__id=self.kwargs.get('restaurant_id'),
            menu__restaurant__partner__user=self.request.user
        )
        serializer.save(section=section)
    
    def perform_destroy(self, instance):
        instance.delete()

class AddOnViewSet(BasePartnerView, viewsets.ModelViewSet):
    queryset = AddOn.objects.all()
    serializer_class = AddOnSerializer

    def perform_create(self, serializer):
        restaurant_id = self.kwargs['restaurant_id']
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        serializer.save(restaurant=restaurant)

    def get_queryset(self):
        restaurant_id = self.kwargs['restaurant_id']
        return AddOn.objects.filter(restaurant_id=restaurant_id)
    

class AddOnCollectionViewSet(BasePartnerView, viewsets.ModelViewSet):
    queryset = AddOnCollection.objects.all()
    serializer_class = AddOnCollectionSerializer
