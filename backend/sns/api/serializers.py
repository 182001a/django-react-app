from rest_framework import serializers
from .models import Post, Like, Follow, Message
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    # created_at = serializers.DateTimeField(format='%Y/%m/%d, %H:%M:%S')

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'file', 'created_at']


class LikeSerializer(serializers.ModelSerializer):
    post_detail = PostSerializer(source='post', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'post_detail']

    def create(self, validated_data):
        user = self.context['request'].user
        like = Like.objects.create(user=user, **validated_data)
        return like

    def update(self, instance, validated_data):
        instance.post = validated_data.get('post', instance.post)
        instance.save()
        return instance


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient',
                  'post', 'content', 'file', 'created_at']
