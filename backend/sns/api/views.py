from rest_framework import viewsets, status, generics
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User

from . import models, serializers


class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    # 認証やアクセス制限を解除
    authentication_classes = []
    permission_classes = []


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return Response({'message': 'Login Success !!'}, status=status.HTTP_200_OK)

        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # 認証やアクセス制限を解除
    authentication_classes = []
    permission_classes = []


class LogoutView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)


class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = models.Like.objects.all()
    serializer_class = serializers.LikeSerializer


class FollowViewSet(viewsets.ModelViewSet):
    queryset = models.Follow.objects.all()
    serializer_class = serializers.FollowSerializer


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer

    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        if post_id:
            post = models.Post.objects.get(pk=post_id)
            serializer.save(sender=self.request.user, recipient=post.author)
