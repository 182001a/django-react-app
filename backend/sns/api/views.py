from rest_framework import viewsets, status, generics, response, permissions
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from django.contrib.auth.models import User

from . import models, serializers


class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            username = User.objects.get(email=email).username
        except User.DoesNotExist:
            return response.Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return response.Response({'message': 'Logged in successfully'}, status=status.HTTP_200_OK)
        else:
            return response.Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        logout(request)
        return response.Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class CurrentUserView(generics.ListAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # 現在ログインしているユーザーのみを返す
        return User.objects.filter(id=self.request.user.id)


class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = models.Like.objects.all()
    serializer_class = serializers.LikeSerializer
    permission_classes = [permissions.AllowAny]


class FollowViewSet(viewsets.ModelViewSet):
    queryset = models.Follow.objects.all()
    serializer_class = serializers.FollowSerializer
    permission_classes = [permissions.AllowAny]


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        if post_id:
            post = models.Post.objects.get(pk=post_id)
            serializer.save(sender=self.request.user, recipient=post.author)
