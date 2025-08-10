import uuid
from django.db import models

class User(models.Model):
    user_id = models.CharField(max_length=128, primary_key=True)  # Firebase UID
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    
    USER_TYPE_CHOICES = (
        ('actor', 'Actor'),
        ('filmmaker', 'Filmmaker'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.user_type})"
    
    
    
class FilmmakerProfile(models.Model):
    filmmaker_profile_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='filmmaker_profiles')
    bio = models.TextField(blank=True)
    information = models.TextField(blank=True)
    movies_done = models.IntegerField(default=0)
    status = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Filmmaker Profile - {self.user.username}"
    
    
    
    
class ActorProfile(models.Model):
    actor_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, to_field='user_id', on_delete=models.CASCADE, related_name='actor_profiles')
    skills = models.TextField(blank=True)
    headshots = models.ImageField(upload_to='headshots/', blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Actor Profile - {self.user.username}" 
    