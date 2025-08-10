from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),  # This will be /api/register/
    path('user/<str:uid>/', views.get_user_by_uid, name='get_user_by_uid'),  # This will be /api/user/<uid>/
    path('profile/<str:uid>/', views.update_profile, name='update_profile'),  # This will be /api/profile/<uid>/
]