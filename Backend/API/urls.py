from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),  # This will be /api/register/
    path('user/<str:uid>/', views.get_user_by_uid, name='get_user_by_uid'),  # This will be /api/user/<uid>/
    path('users/profile/<str:uid>/', views.handle_profile, name='handle_profile'),  # This will be /api/users/profile/<uid>/
    path('avatar/store/', views.store_avatar, name='store_avatar'),  # This will be /api/avatar/store/
    path('avatar/get/<str:uid>/', views.get_avatar_by_uid, name='get_avatar_by_uid'),  # This will be /api/avatar/get/<uid>/
    path('avatar/match/', views.match_avatar_to_actors, name='match_avatar_to_actors'), # This will be /api/avatar/match/
]