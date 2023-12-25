from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


def upload_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['files', filename + str(".") + str(ext)])


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    file = models.FileField(upload_to=upload_path, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content

    def save(self, *args, **kwargs):
        if self.file:  # ファイルフィールドが存在する場合のみチェック
            # 同じファイル名のレコードが存在するかチェック
            if Post.objects.filter(file=self.file.name).exclude(id=self.id).exists():
                raise ValidationError(
                    "A file with the same name already exists.")

        super().save(*args, **kwargs)


class Like(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')


class Follow(models.Model):
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='following')
    followed = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')

    def clean(self):
        if self.follower == self.followed:
            raise ValidationError("Cannot follow yourself.")

    def save(self, *args, **kwargs):
        self.clean()
        super(Follow, self).save(*args, **kwargs)


class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    file = models.FileField(upload_to=upload_path, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
