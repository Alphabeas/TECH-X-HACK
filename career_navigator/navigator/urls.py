from django.urls import path
from .views import analyze_profile

urlpatterns = [
    path('analyze-profile/', analyze_profile),
]
