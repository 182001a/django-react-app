from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
]

urlpatterns += static(settings.FILE_URL, document_root=settings.FILE_ROOT)
