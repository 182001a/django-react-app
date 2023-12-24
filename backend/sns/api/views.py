from rest_framework import viewsets, status, generics, response, permissions
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import action

from . import models, serializers


class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            username = models.CustomUser.objects.get(email=email).username
        except models.CustomUser.DoesNotExist:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            # トークンを取得または作成
            token, created = Token.objects.get_or_create(user=user)
            # トークンをレスポンスに含める
            return Response({'token': token.key, 'message': 'Logged in successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        logout(request)
        return response.Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class CurrentUserView(generics.ListAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 現在ログインしているユーザーのみを返す
        return models.CustomUser.objects.filter(id=self.request.user.id)


class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = models.Like.objects.all()
    serializer_class = serializers.LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 現在のユーザーがいいねした投稿のみを返す
        user = self.request.user
        return models.Like.objects.filter(user=user)


class FollowViewSet(viewsets.ModelViewSet):
    queryset = models.Follow.objects.all()
    serializer_class = serializers.FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

    @action(detail=True, methods=['get'])
    def list_followers(self, request, pk=None):
        user = self.get_object()
        followers = models.Follow.objects.filter(followed=user)
        serializer = self.get_serializer(followers, many=True)
        return Response(serializer.data)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()
    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.request.data.get('post')
        if post_id:
            post = models.Post.objects.get(pk=post_id)
            serializer.save(sender=self.request.user, recipient=post.author)
