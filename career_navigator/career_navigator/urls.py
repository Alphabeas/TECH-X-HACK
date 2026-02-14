from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include


def empty_favicon(_request):
    return HttpResponse(status=204)

urlpatterns = [
    path('favicon.ico', empty_favicon),
    path('admin/', admin.site.urls),
    path('api/', include('navigator.urls')),
]
