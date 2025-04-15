from django.urls import path, include
from django.urls import path, include
from .views import (
MenuViewSet, SectionViewSet, ArticleViewSet, AddOnViewSet, AddOnCollectionViewSet
)


from rest_framework.routers import SimpleRouter
router = SimpleRouter()
router.register(r'restaurants/(?P<restaurant_id>\d+)/menus', MenuViewSet, basename='restaurant-menus')
router.register(r'restaurants/(?P<restaurant_id>\d+)/addon-collections', AddOnCollectionViewSet, basename='addon-collections')


# print("\n=== ROUTER URLS ===")
# for url in router.urls:
#     print(f"{url.pattern} -> {url.callback}")

urlpatterns = [
#     path('restaurants/', RestaurantMenuListView.as_view(), name='restaurant-list'),
    
    path('restaurants/<int:restaurant_id>/menus/<int:menu_id>/sections/', 
         SectionViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='section-list'),
    path('restaurants/<int:restaurant_id>/menus/<int:menu_id>/sections/<int:pk>/', 
         SectionViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='section-detail'),
    
    path('restaurants/<int:restaurant_id>/menus/<int:menu_id>/sections/<int:section_id>/articles/', 
         ArticleViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='article-list'),
    path('restaurants/<int:restaurant_id>/menus/<int:menu_id>/sections/<int:section_id>/articles/<int:pk>/', 
         ArticleViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='article-detail'),
    
     path('restaurants/<int:restaurant_id>/addons/', AddOnViewSet.as_view({'get': 'list', 'post': 'create'}), name='addon-list'),
     path('restaurants/<int:restaurant_id>/addons/<int:pk>/', AddOnViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='addon-detail'),

    path('', include(router.urls)),
]



