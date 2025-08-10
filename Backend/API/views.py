from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import logging
from .models import User, ActorProfile, FilmmakerProfile
from django.views.decorators.csrf import ensure_csrf_cookie

# Set up logging
logger = logging.getLogger(__name__)

# Create your views here.

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    try:
        logger.info("Register/Update User Endpoint Hit")
        logger.info(f"Request body: {request.body}")
        
        # Parse the request body
        try:
            data = json.loads(request.body)
            logger.info(f"Parsed JSON data: {data}")
        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error: {e}")
            return JsonResponse(
                {'error': 'Invalid JSON'}, 
                status=400
            )
        
        # Extract user data
        uid = data.get('uid')
        username = data.get('username')
        email = data.get('email')
        user_type = data.get('user_type')
        
        logger.info(f"Extracted data - UID: {uid}, Username: {username}, Email: {email}, Type: {user_type}")
        
        # Validate required fields
        if not all([uid, username, email, user_type]):
            logger.error("Missing required fields")
            return JsonResponse(
                {'error': 'Missing required fields (uid, username, email, user_type)'}, 
                status=400
            )
        
        try:
            # Check if user already exists
            user, created = User.objects.get_or_create(
                user_id=uid,
                defaults={
                    'username': username,
                    'email': email,
                    'user_type': user_type
                }
            )
            
            if not created:
                # Update existing user
                user.username = username
                user.email = email
                user.user_type = user_type
                user.save()
                logger.info(f"User updated successfully with ID: {user.user_id}")
            else:
                logger.info(f"User created successfully with ID: {user.user_id}")
            
            # Create the appropriate profile if it doesn't exist
            if user_type == 'actor' and not hasattr(user, 'actorprofile'):
                profile = ActorProfile.objects.create(user=user)
                logger.info(f"Actor profile created: {profile.id}")
            elif user_type == 'filmmaker' and not hasattr(user, 'filmmakerprofile'):
                profile = FilmmakerProfile.objects.create(user=user)
                logger.info(f"Filmmaker profile created: {profile.id}")
            
            return JsonResponse({
                'message': 'User processed successfully',
                'user': {
                    'id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type,
                    'is_new': created
                }
            }, status=201 if created else 200)
            
        except Exception as e:
            logger.error(f"Error processing user or profile: {str(e)}", exc_info=True)
            return JsonResponse(
                {'error': f'Error processing user: {str(e)}'}, 
                status=500
            )
            
    except Exception as e:
        logger.error(f"Unexpected error in register_user: {str(e)}", exc_info=True)
        return JsonResponse(
            {'error': 'An unexpected error occurred'}, 
            status=500
        )

@require_http_methods(["GET"])
def get_user_by_uid(request, uid):
    try:
        logger.info(f"Fetching user with UID: {uid}")
        user = get_object_or_404(User, user_id=uid)
        
        # Get the appropriate profile based on user type
        profile_data = {}
        if user.user_type == 'actor':
            profile = ActorProfile.objects.get(user=user)
            profile_data = {
                'skills': profile.skills,
                'availability': profile.availability,
                'headshots': profile.headshots.url if profile.headshots else None
            }
        elif user.user_type == 'filmmaker':
            profile = FilmmakerProfile.objects.get(user=user)
            profile_data = {
                'bio': profile.bio,
                'information': profile.information,
                'movies_done': profile.movies_done,
                'status': profile.status
            }
        
        # Build response data
        user_data = {
            'uid': user.user_id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type,
            'profile_photo': user.profile_photo.url if user.profile_photo else None,
            'profile': profile_data,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None
        }
        
        return JsonResponse(user_data)
        
    except Exception as e:
        logger.error(f"Error fetching user data: {str(e)}", exc_info=True)
        return JsonResponse(
            {'error': 'Error fetching user data'}, 
            status=500
        )
