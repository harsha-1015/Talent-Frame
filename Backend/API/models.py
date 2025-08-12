import uuid
from django.db import models
from django.utils import timezone

class User(models.Model):
    user_id = models.CharField(max_length=128, primary_key=True)  # Firebase UID
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    
    USER_TYPE_CHOICES = (
        ('actor', 'Actor'),
        ('filmmaker', 'Filmmaker'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_profile_complete = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f"{self.username} ({self.user_type})"
    
    
class FilmmakerProfile(models.Model):
    filmmaker_profile_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='filmmaker_profiles')
    information = models.TextField(blank=True, null=True, default="")  # Keep existing field
    location = models.CharField(max_length=255, blank=True, null=True, default="")
    profile_picture = models.TextField(blank=True, null=True, default="")  # Store Base64 encoded image
    movies_done = models.IntegerField(default=0)
    availability = models.CharField(max_length=100, blank=True, null=True, default="")
    created_at = models.DateTimeField(default=timezone.now)  # Use default instead of auto_now_add for existing rows
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Filmmaker Profile - {self.user.username}"
    
    
class ActorProfile(models.Model):
    actor_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='actor_profiles')
    bio = models.TextField(blank=True, null=True, default="")
    location = models.CharField(max_length=255, blank=True, null=True, default="")
    profile_picture = models.TextField(blank=True, null=True, default="")  # Store Base64 encoded image
    skills = models.TextField(blank=True, null=True, default="")
    availability = models.CharField(max_length=100, blank=True, null=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Actor Profile - {self.user.username}"