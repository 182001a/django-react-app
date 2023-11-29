from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('post', views.PostViewSet)
router.register('like', views.LikeViewSet)
router.register('follow', views.FollowViewSet)
router.register('message', views.MessageViewSet)

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]
