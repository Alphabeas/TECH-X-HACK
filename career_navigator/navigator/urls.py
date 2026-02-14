from django.urls import path
from .views import analyze_profile, health_check

urlpatterns = [
    path('health/', health_check),
    path('analyze-profile/', analyze_profile),
]
