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
    # userフィールドは引き続き読み取り専用です。
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    # postフィールドをPrimaryKeyRelatedFieldとして定義し、書き込みを許可します。
    post = serializers.PrimaryKeyRelatedField(
        queryset=models.Post.objects.all()
    )

    class Meta:
        model = models.Like
        fields = ['id', 'user', 'post', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        like, created = models.Like.objects.get_or_create(
            user=user, **validated_data)
        return like


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['id', 'username']


class FollowSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()

    class Meta:
        model = models.Follow
        fields = ['followed', 'followers']

    def get_followers(self, obj):
        # obj は Follow モデルのインスタンス
        followers = models.Follow.objects.filter(followed=obj.followed)
        return [SimpleUserSerializer(follower.follower).data for follower in followers]

    def validate(self, data):
        follower = self.context['request'].user
        followed = data.get('followed')

        if follower == followed:
            raise serializers.ValidationError("Cannot follow yourself.")

        if models.Follow.objects.filter(follower=follower, followed=followed).exists():
            raise serializers.ValidationError(
                "You are already following this user.")

        return data

# class FollowSerializer(serializers.ModelSerializer):
#     follower = UserSerializer(read_only=True)
#     followed = serializers.PrimaryKeyRelatedField(
#         queryset=models.CustomUser.objects.all()
#     )

#     class Meta:
#         model = models.Follow
#         fields = ['id', 'follower', 'followed', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = models.Message
        fields = ['id', 'sender', 'recipient',
                  'post', 'content', 'file', 'created_at']
