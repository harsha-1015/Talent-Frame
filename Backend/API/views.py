from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import logging
import base64
import uuid
from .models import User, ActorProfile, FilmmakerProfile
from django.db import transaction
from django.utils import timezone

# Set up logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    try:
        logger.info("Register/Update User Endpoint Hit")
        
        # Parse the request body
        try:
            data = json.loads(request.body)
            logger.info(f"Parsed JSON data: {data}")
        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error: {e}")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        # Extract user data
        uid = data.get('uid')
        username = data.get('username')
        email = data.get('email')
        user_type = data.get('user_type')
        is_profile_complete = data.get('is_profile_complete', False)
        
        logger.info(f"Extracted data - UID: {uid}, Username: {username}, Email: {email}, Type: {user_type}")
        
        # Validate required fields
        if not all([uid, username, email, user_type]):
            logger.error("Missing required fields")
            return JsonResponse(
                {'error': 'Missing required fields (uid, username, email, user_type)'}, 
                status=400
            )
        
        try:
            # Check if user already exists using uid to prevent duplication
            user, created = User.objects.get_or_create(
                user_id=uid,  # Use uid as unique identifier
                defaults={
                    'username': username,
                    'email': email,
                    'user_type': user_type,
                    'is_profile_complete': is_profile_complete
                }
            )
            
            if not created:
                # Update existing user
                user.username = username
                user.email = email
                user.user_type = user_type
                
                # Only update is_profile_complete if it's being set to True
                if is_profile_complete and not user.is_profile_complete:
                    user.is_profile_complete = True
                    
                user.save()
                logger.info(f"User updated successfully with ID: {user.user_id}")
            else:
                logger.info(f"User created successfully with ID: {user.user_id}")
            
            # Create the appropriate profile if it doesn't exist
            if user_type == 'actor':
                if not ActorProfile.objects.filter(user=user).exists():
                    profile = ActorProfile.objects.create(user=user)
                    logger.info(f"Actor profile created with ID: {profile.actor_id}")
            elif user_type == 'filmmaker':
                if not FilmmakerProfile.objects.filter(user=user).exists():
                    profile = FilmmakerProfile.objects.create(user=user)
                    logger.info(f"Filmmaker profile created with ID: {profile.filmmaker_profile_id}")
            
            # Refresh user data from database
            user.refresh_from_db()
            
            return JsonResponse({
                'message': 'User processed successfully',
                'user': {
                    'id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type,
                    'is_profile_complete': user.is_profile_complete,
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
            try:
                profile = ActorProfile.objects.get(user=user)
                profile_picture_data = None
                
                # Handle profile picture
                if profile.profile_picture:
                    if hasattr(profile.profile_picture, 'path') and hasattr(profile.profile_picture, 'url'):
                        # It's a file field - read and encode to base64
                        try:
                            with open(profile.profile_picture.path, 'rb') as img_file:
                                profile_picture_data = base64.b64encode(img_file.read()).decode('utf-8')
                                # Add data URL prefix if not present
                                if not profile_picture_data.startswith('data:image'):
                                    profile_picture_data = f"data:image/jpeg;base64,{profile_picture_data}"
                        except (FileNotFoundError, IOError) as e:
                            logger.error(f"Error reading actor profile picture file: {e}")
                            profile_picture_data = None
                    else:
                        # It's already a string (base64 data URL)
                        profile_picture_data = str(profile.profile_picture)
                
                profile_data = {
                    'skills': profile.skills or '',
                    'availability': profile.availability or 'no',
                    'profile_picture': profile_picture_data,
                    'bio': profile.bio or '',
                    'location': profile.location or '',
                }
                
            except ActorProfile.DoesNotExist:
                logger.warning(f"No actor profile found for user: {uid}")
                profile_data = {
                    'skills': '',
                    'availability': 'no',
                    'profile_picture': None,
                    'bio': '',
                    'location': '',
                }
                
        elif user.user_type == 'filmmaker':
            try:
                profile = FilmmakerProfile.objects.get(user=user)
                profile_picture_data = None
                
                # Handle profile picture
                if profile.profile_picture:
                    if hasattr(profile.profile_picture, 'path') and hasattr(profile.profile_picture, 'url'):
                        # It's a file field - read and encode to base64
                        try:
                            with open(profile.profile_picture.path, 'rb') as img_file:
                                profile_picture_data = base64.b64encode(img_file.read()).decode('utf-8')
                                # Add data URL prefix if not present
                                if not profile_picture_data.startswith('data:image'):
                                    profile_picture_data = f"data:image/jpeg;base64,{profile_picture_data}"
                        except (FileNotFoundError, IOError) as e:
                            logger.error(f"Error reading filmmaker profile picture file: {e}")
                            profile_picture_data = None
                    else:
                        # It's already a string (base64 data URL)
                        profile_picture_data = str(profile.profile_picture)
                
                profile_data = {
                    'information': profile.information or '',  # Use information instead of bio
                    'location': profile.location or '',
                    'profile_picture': profile_picture_data,
                    'movies_done': profile.movies_done or 0,
                    'availability': profile.availability or 'no',
                }
                
            except FilmmakerProfile.DoesNotExist:
                logger.warning(f"No filmmaker profile found for user: {uid}")
                profile_data = {
                    'information': '',
                    'location': '',
                    'profile_picture': None,
                    'movies_done': 0,
                    'availability': 'no',
                }
        
        else:
            logger.error(f"Invalid user type: {user.user_type}")
            return JsonResponse({'error': 'Invalid user type'}, status=400)
            
        # Return the user data with profile information
        user_data = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type,
            'is_profile_complete': user.is_profile_complete,
            'profile': profile_data
        }
        
        return JsonResponse(user_data)
        
    except Exception as e:
        logger.error(f"Error in get_user_by_uid: {str(e)}", exc_info=True)
        return JsonResponse(
            {'error': 'An error occurred while fetching user data'}, 
            status=500
        )


@csrf_exempt
@require_http_methods(["GET", "PUT"])
@transaction.atomic
def handle_profile(request, uid):
    if request.method == 'GET':
        try:
            logger.info(f"Fetching profile for user: {uid}")
            
            # Try to get the user using the user_id
            try:
                user = User.objects.get(user_id=uid)
                logger.info(f"Found user with user_id: {uid}")
            except User.DoesNotExist:
                logger.error(f"User with user_id {uid} not found")
                return JsonResponse({'error': 'User not found'}, status=404)
                
            # Get the appropriate profile based on user type
            if user.user_type == 'actor':
                profile = ActorProfile.objects.filter(user=user).order_by('-created_at').first()
            elif user.user_type == 'filmmaker':
                profile = FilmmakerProfile.objects.filter(user=user).order_by('-created_at').first()
            else:
                return JsonResponse({'error': 'Invalid user type'}, status=400)
                
            if not profile:
                logger.error(f"No profile found for user: {uid}")
                return JsonResponse({'error': 'Profile not found'}, status=404)
                
            # Prepare the response data
            response_data = {
                'name': user.username,
                'email': user.email,
                'location': profile.location or '',
                'availability': 'yes' if profile.availability == 'yes' else 'no',
                'profile_picture': profile.profile_picture or '',
                'user_type': user.user_type
            }
            
            # Add bio for actors, information for filmmakers
            if user.user_type == 'actor':
                response_data['bio'] = getattr(profile, 'bio', '') or ''
            elif user.user_type == 'filmmaker':
                response_data['information'] = getattr(profile, 'information', '') or ''
            
            # Add actor-specific fields
            if user.user_type == 'actor' and isinstance(profile, ActorProfile):
                response_data['skills'] = profile.skills or ''
            
            # Add filmmaker-specific fields
            if user.user_type == 'filmmaker' and isinstance(profile, FilmmakerProfile):
                response_data['movies_done'] = profile.movies_done or 0
                response_data['information'] = profile.information or ''  # Include information field
            
            logger.info(f"Successfully fetched profile for user: {uid}")
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Error fetching profile: {str(e)}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
    
    elif request.method == 'PUT':
        try:
            logger.info(f"Update Profile Endpoint Hit for UID: {uid}")
            
            # Handle multipart form data (for file uploads)
            if hasattr(request, 'content_type') and request.content_type and request.content_type.startswith('multipart/form-data'):
                data = request.POST.dict()
                files = request.FILES
            else:
                # Handle JSON data
                try:
                    data = json.loads(request.body)
                    files = {}
                except json.JSONDecodeError as e:
                    logger.error(f"JSON Decode Error: {e}")
                    return JsonResponse({'error': 'Invalid JSON'}, status=400)
            
            logger.info(f"Request data keys: {list(data.keys())}")
            
            # Get the user using the user_id
            try:
                user = User.objects.get(user_id=uid)
                user_type = user.user_type
                logger.info(f"User type from database: {user_type}")
            except User.DoesNotExist:
                logger.error(f"User with user_id {uid} does not exist")
                return JsonResponse({'error': 'User not found'}, status=404)
            
            # Update user fields if provided
            user_updated = False
            
            if 'username' in data and data['username']:
                user.username = data['username']
                user_updated = True
                logger.info(f"Updated username to: {data['username']}")
                
            if 'email' in data and data['email']:
                user.email = data['email']
                user_updated = True
                logger.info(f"Updated email to: {data['email']}")
            
            # Save user if updated
            if user_updated:
                user.save()
                
            # Handle profile based on user type - saves to correct model
            if user_type == 'actor':
                logger.info("Processing actor profile - saving to ActorProfile model")
                
                # Get or create actor profile - prevents duplicates by using user as unique key
                profile, created = ActorProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'bio': '',
                        'location': '',
                        'skills': '',
                        'availability': 'no',
                        'profile_picture': '',
                    }
                )
                
                # Update profile fields
                profile_updated = False
                
                if 'bio' in data:
                    profile.bio = data['bio'] or ''
                    profile_updated = True
                    
                if 'location' in data:
                    profile.location = data['location'] or ''
                    profile_updated = True
                    
                if 'skills' in data:
                    profile.skills = data['skills'] or ''
                    profile_updated = True
                    
                if 'availability' in data:
                    availability = data['availability']
                    if availability in ['yes', 'no']:
                        profile.availability = availability
                        profile_updated = True
                    else:
                        logger.warning(f"Invalid availability value: {availability}")
                
                # Handle profile picture
                if 'profile_picture' in data and data['profile_picture']:
                    if data['profile_picture'].startswith('data:image'):
                        profile.profile_picture = data['profile_picture']
                        profile_updated = True
                    else:
                        logger.warning("Invalid profile picture format. Expected base64 data URL")
                
                # Save profile if updated
                if profile_updated:
                    profile.updated_at = timezone.now()
                    profile.save()
                    logger.info("Updated actor profile successfully")
                else:
                    logger.info("No changes to actor profile")
                
            elif user_type == 'filmmaker':
                logger.info("Processing filmmaker profile - saving to FilmmakerProfile model")
                
                # Get or create filmmaker profile - prevents duplicates by using user as unique key
                profile, created = FilmmakerProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'bio': '',
                        'information': '',
                        'location': '',
                        'movies_done': 0,
                        'availability': 'no',
                        'profile_picture': '',
                    }
                )
                
                # Update profile fields
                profile_updated = False
                
                if 'bio' in data:
                    profile.bio = data['bio'] or ''
                    profile_updated = True
                    
                if 'information' in data:
                    profile.information = data['information'] or ''
                    profile_updated = True
                    
                if 'location' in data:
                    profile.location = data['location'] or ''
                    profile_updated = True
                    
                if 'movies_done' in data:
                    try:
                        movies_done = int(data['movies_done']) if data['movies_done'] else 0
                        profile.movies_done = movies_done
                        profile_updated = True
                    except (ValueError, TypeError):
                        logger.warning(f"Invalid movies_done value: {data['movies_done']}")
                        
                if 'availability' in data:
                    availability = data['availability']
                    if availability in ['yes', 'no']:
                        profile.availability = availability
                        profile_updated = True
                    else:
                        logger.warning(f"Invalid availability value: {availability}")
                
                # Handle profile picture
                if 'profile_picture' in data and data['profile_picture']:
                    if data['profile_picture'].startswith('data:image'):
                        profile.profile_picture = data['profile_picture']
                        profile_updated = True
                    else:
                        logger.warning("Invalid profile picture format. Expected base64 data URL")
                
                # Save profile if updated
                if profile_updated:
                    profile.updated_at = timezone.now()
                    profile.save()
                    logger.info("Updated filmmaker profile successfully")
                else:
                    logger.info("No changes to filmmaker profile")
            
            else:
                return JsonResponse({'error': 'Invalid user type'}, status=400)
            
            # Check if profile is complete and update user
            required_fields_filled = bool(
                data.get('bio') and 
                data.get('location') and
                user.username and 
                user.email
            )
            
            if user.is_profile_complete != required_fields_filled:
                user.is_profile_complete = required_fields_filled
                user.save()
            
            # Refresh user data
            user.refresh_from_db()
            
            return JsonResponse({
                'message': 'Profile updated successfully',
                'user': {
                    'id': user.user_id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type,
                    'is_profile_complete': user.is_profile_complete
                }
            })
            
        except Exception as e:
            logger.error(f"Error updating profile: {str(e)}", exc_info=True)
            return JsonResponse({'error': f'Error updating profile: {str(e)}'}, status=500)