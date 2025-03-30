from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Campaign, Investment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'email', 'profile_picture', 'bio', 'location', 'upi', 'last_login_date', 'last_updated_date')
        read_only_fields = ('last_login_date', 'last_updated_date')

class UserProfileRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'password', 'confirm_password', 'profile_picture', 'location', 'bio', 'upi')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = UserProfile.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            location=validated_data.get('location', ''),
            bio=validated_data.get('bio', ''),
            upi=validated_data.get('upi', ''),
            profile_picture=validated_data.get('profile_picture')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'profile_picture', 'bio', 'location', 'upi', 
                 'current_password', 'new_password', 'confirm_password')
        read_only_fields = ('username', 'email')

    def validate(self, attrs):
        if 'new_password' in attrs:
            if 'current_password' not in attrs:
                raise serializers.ValidationError({"current_password": "Current password is required to set new password."})
            if attrs['new_password'] != attrs.get('confirm_password'):
                raise serializers.ValidationError({"new_password": "Password fields didn't match."})
            if not self.instance.check_password(attrs['current_password']):
                raise serializers.ValidationError({"current_password": "Current password is incorrect."})
        return attrs

    def update(self, instance, validated_data):
        if 'new_password' in validated_data:
            instance.set_password(validated_data.pop('new_password'))
        validated_data.pop('current_password', None)
        validated_data.pop('confirm_password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CampaignSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    main_image = serializers.ImageField(required=True)
    image_1 = serializers.ImageField(required=False, allow_null=True)
    image_2 = serializers.ImageField(required=False, allow_null=True)
    image_3 = serializers.ImageField(required=False, allow_null=True)
    image_4 = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Campaign
        fields = ('id', 'user', 'title', 'description', 'founder', 'required_amount', 
                 'amount_generated', 'category', 'last_date', 'comment', 'main_image',
                 'image_1', 'image_2', 'image_3', 'image_4', 'created_at', 'updated_at')
        read_only_fields = ('amount_generated', 'created_at', 'updated_at')

class InvestmentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    campaign = serializers.PrimaryKeyRelatedField(queryset=Campaign.objects.all())
    
    class Meta:
        model = Investment
        fields = ('id', 'user', 'campaign', 'investment_date', 'invested_amount')
        read_only_fields = ('investment_date',) 