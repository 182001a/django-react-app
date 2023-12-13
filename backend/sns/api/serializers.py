from rest_framework import serializers
from django.contrib.auth.models import User

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = models.CustomUser.objects.create_user(**validated_data)  # ここも変更
        return user


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    # created_at = serializers.DateTimeField(format='%Y/%m/%d, %H:%M:%S')

    class Meta:
        model = models.Post
        fields = ['id', 'author', 'content', 'file', 'created_at']


class LikeSerializer(serializers.ModelSerializer):
    post_detail = PostSerializer(source='post', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Like
        fields = ['id', 'user', 'post', 'post_detail']

    def create(self, validated_data):
        user = self.context['request'].user
        like = models.Like.objects.create(user=user, **validated_data)
        return like

    def update(self, instance, validated_data):
        instance.post = validated_data.get('post', instance.post)
        instance.save()
        return instance


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Follow
        fields = ['id', 'follower', 'followed']
        read_only_fields = ('follower',)


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = models.Message
        fields = ['id', 'sender', 'recipient',
                  'post', 'content', 'file', 'created_at']
