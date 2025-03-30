from django.contrib import admin
from .models import UserProfile, Campaign, Investment

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'location', 'upi', 'last_login_date', 'last_updated_date')
    list_display_links = ('id', 'username', 'email')
    search_fields = ('username', 'email', 'location', 'bio', 'upi')
    list_filter = ('location', 'last_login_date')
    readonly_fields = ('last_login_date', 'last_updated_date')
    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'email', 'password', 'location', 'upi')
        }),
        ('Profile Details', {
            'fields': ('profile_picture', 'bio')
        }),
        ('Timestamps', {
            'fields': ('last_login_date', 'last_updated_date'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'founder', 'required_amount', 'amount_generated', 
                   'category', 'last_date', 'created_at')
    list_display_links = ('id', 'title', 'user')
    search_fields = ('title', 'description', 'founder', 'user__username', 'category')
    list_filter = ('category', 'last_date', 'created_at')
    readonly_fields = ('amount_generated', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'user', 'founder', 'description', 'category', 'last_date')
        }),
        ('Financial Details', {
            'fields': ('required_amount', 'amount_generated')
        }),
        ('Images', {
            'fields': ('main_image', 'image_1', 'image_2', 'image_3', 'image_4')
        }),
        ('Additional Information', {
            'fields': ('comment',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'campaign', 'invested_amount', 'investment_date')
    list_display_links = ('id', 'user', 'campaign')
    search_fields = ('user__username', 'campaign__title')
    list_filter = ('investment_date',)
    readonly_fields = ('investment_date',)
    fieldsets = (
        ('Investment Details', {
            'fields': ('user', 'campaign', 'invested_amount')
        }),
        ('Timestamps', {
            'fields': ('investment_date',),
            'classes': ('collapse',)
        }),
    )
