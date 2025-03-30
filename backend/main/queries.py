from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from .models import UserProfile, Campaign, Investment

def get_user_profile(user_id):
    """Get user profile by user ID"""
    return UserProfile.objects.get(user_id=user_id)

def get_user_campaigns(user_id):
    """Get all campaigns created by a user"""
    return Campaign.objects.filter(user_id=user_id)

def get_active_campaigns():
    """Get all active campaigns (not expired)"""
    return Campaign.objects.filter(last_date__gt=timezone.now())

def get_campaign_details(campaign_id):
    """Get campaign details with total investments"""
    return Campaign.objects.annotate(
        total_investments=Count('investments'),
        total_amount=Sum('investments__invested_amount')
    ).get(id=campaign_id)

def get_user_investments(user_id):
    """Get all investments made by a user"""
    return Investment.objects.filter(user_id=user_id)

def get_campaign_investments(campaign_id):
    """Get all investments for a specific campaign"""
    return Investment.objects.filter(campaign_id=campaign_id)

def get_top_campaigns(limit=5):
    """Get top campaigns by amount generated"""
    return Campaign.objects.annotate(
        total_investments=Count('investments'),
        total_amount=Sum('investments__invested_amount')
    ).order_by('-total_amount')[:limit]

def get_campaigns_by_category(category):
    """Get all campaigns in a specific category"""
    return Campaign.objects.filter(category=category)

def get_campaigns_by_location(location):
    """Get all campaigns from users in a specific location"""
    return Campaign.objects.filter(user__profile__location=location)

def get_campaign_statistics(campaign_id):
    """Get detailed statistics for a campaign"""
    campaign = Campaign.objects.get(id=campaign_id)
    investments = get_campaign_investments(campaign_id)
    
    return {
        'total_investors': investments.values('user').distinct().count(),
        'total_invested_amount': investments.aggregate(total=Sum('invested_amount'))['total'] or 0,
        'remaining_amount': campaign.required_amount - (investments.aggregate(total=Sum('invested_amount'))['total'] or 0),
        'days_left': max(0, (campaign.last_date - timezone.now()).days)
    }

def get_user_statistics(user_id):
    """Get statistics for a user's campaigns and investments"""
    user = UserProfile.objects.get(id=user_id)
    campaigns = get_user_campaigns(user_id)
    investments = Investment.objects.filter(user_id=user_id)
    
    return {
        'total_campaigns': campaigns.count(),
        'total_investments': investments.count(),
        'total_invested_amount': investments.aggregate(total=Sum('invested_amount'))['total'] or 0,
        'active_campaigns': campaigns.filter(last_date__gt=timezone.now()).count(),
        'completed_campaigns': campaigns.filter(last_date__lte=timezone.now()).count()
    }

# New queries based on mock data structure
def get_user_with_campaigns(username):
    """Get user profile with all their campaigns"""
    user_profile = UserProfile.objects.select_related('user').get(user__username=username)
    campaigns = get_user_campaigns(user_profile.user.id)
    
    return {
        'username': user_profile.user.username,
        'email': user_profile.user.email,
        'profilePicture': user_profile.profile_picture.url if user_profile.profile_picture else None,
        'bio': user_profile.bio,
        'location': user_profile.location,
        'campaigns': [{
            'id': campaign.id,
            'title': campaign.title,
            'description': campaign.description,
            'requiredAmount': str(campaign.required_amount),
            'amountGenerated': str(campaign.amount_generated),
            'category': campaign.category,
            'daysLeft': (campaign.last_date - timezone.now()).days,
            'mainImage': campaign.main_image.url if campaign.main_image else None,
            'image-1': campaign.image_1.url if campaign.image_1 else None,
            'image-2': campaign.image_2.url if campaign.image_2 else None,
            'image-3': campaign.image_3.url if campaign.image_3 else None,
            'image-4': campaign.image_4.url if campaign.image_4 else None
        } for campaign in campaigns]
    }

def get_campaigns_by_days_left(days):
    """Get campaigns with specific days remaining"""
    target_date = timezone.now() + timezone.timedelta(days=days)
    return Campaign.objects.filter(
        last_date__lte=target_date,
        last_date__gt=timezone.now()
    )

def get_campaigns_by_amount_range(min_amount, max_amount):
    """Get campaigns within a specific amount range"""
    return Campaign.objects.filter(
        required_amount__gte=min_amount,
        required_amount__lte=max_amount
    )

def get_campaigns_by_progress(progress_percentage):
    """Get campaigns that have reached a specific funding progress"""
    return Campaign.objects.annotate(
        progress=F('amount_generated') / F('required_amount') * 100
    ).filter(progress__gte=progress_percentage)

def get_user_campaigns_by_category(user_id, category):
    """Get user's campaigns in a specific category"""
    return Campaign.objects.filter(
        user_id=user_id,
        category=category
    )

def get_campaigns_by_multiple_categories(categories):
    """Get campaigns from multiple categories"""
    return Campaign.objects.filter(category__in=categories)

def get_campaigns_by_date_range(start_date, end_date):
    """Get campaigns created within a date range"""
    return Campaign.objects.filter(
        created_at__gte=start_date,
        created_at__lte=end_date
    ) 