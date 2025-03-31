from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
import uuid
import os
import time

def get_profile_picture_path(instance, filename):
    if not filename:
        return None
    # Get the file extension
    ext = filename.split('.')[-1]
    # Create filename using timestamp for new instances
    timestamp = int(time.time() * 1000)  # millisecond timestamp
    filename = f"temp_{timestamp}.{ext}"
    return os.path.join('profile_pictures', filename)

def get_campaign_image_path(instance, filename):
    if not filename:
        return None
    # Get the file extension
    ext = filename.split('.')[-1]
    # Create filename using timestamp for new instances
    timestamp = int(time.time() * 1000)  # millisecond timestamp
    
    # Determine the image suffix based on the field name
    field_name = instance._meta.get_field('main_image').name if instance._meta.get_field('main_image').name == 'main_image' else instance._meta.get_field('image_1').name
    if field_name == 'main_image':
        image_suffix = 'main'
    else:
        try:
            # Extract the number from field name (e.g., 'image_1' -> '1')
            image_suffix = field_name.split('_')[1]
        except IndexError:
            image_suffix = '1'  # Default fallback
    
    filename = f"temp_{timestamp}-{image_suffix}.{ext}"
    return os.path.join('campaign_images', filename)

class UserProfile(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    profile_picture = models.ImageField(upload_to=get_profile_picture_path, null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    upi = models.CharField(max_length=50, blank=True)
    last_login_date = models.DateTimeField(default=timezone.now)
    last_updated_date = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        # Store the profile picture if it exists
        profile_picture = self.profile_picture
        
        # If this is an existing instance
        if self.id:
            try:
                # Get the old instance
                old_instance = UserProfile.objects.get(id=self.id)
                # If there's an old profile picture and it's different from the new one
                if old_instance.profile_picture and (not profile_picture or old_instance.profile_picture != profile_picture):
                    try:
                        # Close the file handle
                        old_instance.profile_picture.close()
                        # Delete the old file
                        if os.path.isfile(old_instance.profile_picture.path):
                            os.remove(old_instance.profile_picture.path)
                    except (OSError, ValueError, Exception) as e:
                        # Log the error but continue
                        print(f"Error deleting old profile picture: {e}")
            except UserProfile.DoesNotExist:
                pass

        # Save the instance first
        super().save(*args, **kwargs)
        
        # If there's a new profile picture, rename it
        if profile_picture and hasattr(profile_picture, 'file'):
            try:
                # Get the current file path
                current_path = profile_picture.path
                
                # Generate the new filename with the actual ID
                ext = os.path.splitext(current_path)[1]
                new_filename = f"{self.id}{ext}"
                new_path = os.path.join(os.path.dirname(current_path), new_filename)
                
                # Rename the file if it's different
                if current_path != new_path:
                    os.rename(current_path, new_path)
                    self.profile_picture.name = os.path.join('profile_pictures', new_filename)
                    # Update only the profile_picture field
                    super().save(update_fields=['profile_picture'])
            except Exception as e:
                # If file operations fail, continue without the profile picture
                print(f"Error handling profile picture: {e}")
                self.profile_picture = None
                super().save(update_fields=['profile_picture'])

    def delete(self, *args, **kwargs):
        try:
            if self.profile_picture:
                # Close the file handle before attempting to delete
                self.profile_picture.close()
                if os.path.isfile(self.profile_picture.path):
                    os.remove(self.profile_picture.path)
        except (OSError, ValueError, Exception) as e:
            # Log the error but continue
            print(f"Error deleting profile picture: {e}")
        super().delete(*args, **kwargs)

    class Meta:
        ordering = ['-last_updated_date']

class Campaign(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='campaigns')
    title = models.CharField(max_length=200)
    description = models.TextField()
    founder = models.CharField(max_length=200)
    required_amount = models.DecimalField(max_digits=12, decimal_places=2)
    amount_generated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    category = models.CharField(max_length=100)
    last_date = models.DateTimeField()
    comment = models.TextField(blank=True)
    main_image = models.ImageField(upload_to=get_campaign_image_path)
    image_1 = models.ImageField(upload_to=get_campaign_image_path, null=True, blank=True)
    image_2 = models.ImageField(upload_to=get_campaign_image_path, null=True, blank=True)
    image_3 = models.ImageField(upload_to=get_campaign_image_path, null=True, blank=True)
    image_4 = models.ImageField(upload_to=get_campaign_image_path, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._current_image_field = None

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.id:
            try:
                old_instance = Campaign.objects.get(id=self.id)
                # Handle optional images
                for field_name in ['image_1', 'image_2', 'image_3', 'image_4']:
                    new_value = getattr(self, field_name)
                    old_value = getattr(old_instance, field_name)
                    
                    if old_value and (not new_value or old_value != new_value):
                        try:
                            # Close the file handle
                            if hasattr(old_value, 'file'):
                                old_value.file.close()
                            # Delete the old file
                            if hasattr(old_value, 'path') and os.path.isfile(old_value.path):
                                os.remove(old_value.path)
                        except Exception as e:
                            print(f"Error removing old image {field_name}: {e}")
                        
                        if not new_value:
                            setattr(self, field_name, None)
            except Campaign.DoesNotExist:
                pass

        # Perform the save
        super().save(*args, **kwargs)

        # Handle new image renaming
        for field_name in ['main_image', 'image_1', 'image_2', 'image_3', 'image_4']:
            field_value = getattr(self, field_name)
            if field_value and hasattr(field_value, 'file'):
                try:
                    # Close any existing file handles
                    field_value.file.close()
                    
                    current_path = field_value.path
                    ext = os.path.splitext(current_path)[1]
                    new_filename = f"{self.id}-{field_name}{ext}"
                    new_path = os.path.join(os.path.dirname(current_path), new_filename)
                    
                    # Wait for a short time to ensure file handles are released
                    time.sleep(0.1)
                    
                    if current_path != new_path:
                        if os.path.exists(new_path):
                            os.remove(new_path)
                        os.rename(current_path, new_path)
                        setattr(self, field_name, f"campaign_images/{new_filename}")
                        super().save(update_fields=[field_name])
                except Exception as e:
                    print(f"Error handling {field_name}: {e}")
                finally:
                    # Ensure file handles are closed
                    if hasattr(field_value, 'file'):
                        field_value.file.close()

    def delete(self, *args, **kwargs):
        # Close and delete all associated image files
        for field_name in ['main_image', 'image_1', 'image_2', 'image_3', 'image_4']:
            field_value = getattr(self, field_name)
            if field_value:
                try:
                    if hasattr(field_value, 'file'):
                        field_value.file.close()
                    if hasattr(field_value, 'path') and os.path.isfile(field_value.path):
                        os.remove(field_value.path)
                except Exception as e:
                    print(f"Error deleting {field_name}: {e}")
        super().delete(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class Investment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='investments')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='investments')
    investment_date = models.DateTimeField(auto_now_add=True)
    invested_amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.user.username}'s investment in {self.campaign.title}"

    class Meta:
        ordering = ['-investment_date']
