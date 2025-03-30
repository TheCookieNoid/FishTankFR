from rest_framework import viewsets, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import UserProfile, Campaign, Investment
from .serializers import (
    UserProfileSerializer, CampaignSerializer, InvestmentSerializer,
    UserProfileRegistrationSerializer, UserProfileLoginSerializer, UserProfileUpdateSerializer
)
from .queries import *
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema, no_body
from drf_yasg import openapi

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoints for user profile management.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    def get_serializer_class(self):
        if self.action == 'create':
            return UserProfileRegistrationSerializer
        elif self.action in ['update', 'partial_update']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer

    @swagger_auto_schema(
        operation_description="Register a new user",
        manual_parameters=[
            openapi.Parameter(
                'username',
                openapi.IN_FORM,
                description="Username",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'email',
                openapi.IN_FORM,
                description="Email address",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'password',
                openapi.IN_FORM,
                description="Password",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'confirm_password',
                openapi.IN_FORM,
                description="Confirm password",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'profile_picture',
                openapi.IN_FORM,
                description="User's profile picture",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'location',
                openapi.IN_FORM,
                description="User's location",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'bio',
                openapi.IN_FORM,
                description="User's bio",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'upi',
                openapi.IN_FORM,
                description="User's UPI ID",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            201: UserProfileSerializer,
            400: "Bad Request"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update user profile",
        manual_parameters=[
            openapi.Parameter(
                'profile_picture',
                openapi.IN_FORM,
                description="User's profile picture",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'location',
                openapi.IN_FORM,
                description="User's location",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'bio',
                openapi.IN_FORM,
                description="User's bio",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'upi',
                openapi.IN_FORM,
                description="User's UPI ID",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'current_password',
                openapi.IN_FORM,
                description="Current password (required for password change)",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'new_password',
                openapi.IN_FORM,
                description="New password",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'confirm_password',
                openapi.IN_FORM,
                description="Confirm new password",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            200: UserProfileSerializer,
            400: "Bad Request"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Login with username and password",
        manual_parameters=[
            openapi.Parameter(
                'username',
                openapi.IN_FORM,
                description="Username",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'password',
                openapi.IN_FORM,
                description="Password",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: UserProfileSerializer,
            401: "Invalid credentials",
            404: "User not found"
        }
    )
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = UserProfileLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            try:
                user = UserProfile.objects.get(username=username)
                if user.check_password(password):
                    user.last_login_date = timezone.now()
                    user.save()
                    return Response(UserProfileSerializer(user).data)
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            except UserProfile.DoesNotExist:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Get user's campaigns",
        responses={200: CampaignSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def campaigns(self, request, pk=None):
        user_profile = self.get_object()
        campaigns = get_user_campaigns(user_profile.id)
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get user's statistics",
        responses={200: openapi.Response(
            description="User statistics",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'total_campaigns': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_investments': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_invested_amount': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'active_campaigns': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'completed_campaigns': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        )}
    )
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        user_profile = self.get_object()
        stats = get_user_statistics(user_profile.id)
        return Response(stats)

    @swagger_auto_schema(
        operation_description="Get user's investments",
        responses={200: InvestmentSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def investments(self, request, pk=None):
        user_profile = self.get_object()
        investments = get_user_investments(user_profile.id)
        serializer = InvestmentSerializer(investments, many=True)
        return Response(serializer.data)

class CampaignViewSet(viewsets.ModelViewSet):
    """
    API endpoints for campaign management.
    """
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    @swagger_auto_schema(
        operation_description="Create a new campaign",
        manual_parameters=[
            openapi.Parameter(
                'title',
                openapi.IN_FORM,
                description="Campaign title",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'user',
                openapi.IN_FORM,
                description="User ID",
                type=openapi.TYPE_INTEGER,
                required=True
            ),
            openapi.Parameter(
                'founder',
                openapi.IN_FORM,
                description="Founder name",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'description',
                openapi.IN_FORM,
                description="Campaign description",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'required_amount',
                openapi.IN_FORM,
                description="Required amount",
                type=openapi.TYPE_NUMBER,
                required=True
            ),
            openapi.Parameter(
                'category',
                openapi.IN_FORM,
                description="Campaign category",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'last_date',
                openapi.IN_FORM,
                description="Campaign end date",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'comment',
                openapi.IN_FORM,
                description="Additional comments",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'main_image',
                openapi.IN_FORM,
                description="Main campaign image",
                type=openapi.TYPE_FILE,
                required=True
            ),
            openapi.Parameter(
                'image_1',
                openapi.IN_FORM,
                description="Additional campaign image 1",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_2',
                openapi.IN_FORM,
                description="Additional campaign image 2",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_3',
                openapi.IN_FORM,
                description="Additional campaign image 3",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_4',
                openapi.IN_FORM,
                description="Additional campaign image 4",
                type=openapi.TYPE_FILE,
                required=False
            )
        ],
        responses={
            201: CampaignSerializer,
            400: "Bad Request"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update campaign",
        manual_parameters=[
            openapi.Parameter(
                'title',
                openapi.IN_FORM,
                description="Campaign title",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'founder',
                openapi.IN_FORM,
                description="Founder name",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'description',
                openapi.IN_FORM,
                description="Campaign description",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'required_amount',
                openapi.IN_FORM,
                description="Required amount",
                type=openapi.TYPE_NUMBER,
                required=False
            ),
            openapi.Parameter(
                'category',
                openapi.IN_FORM,
                description="Campaign category",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'last_date',
                openapi.IN_FORM,
                description="Campaign end date",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'comment',
                openapi.IN_FORM,
                description="Additional comments",
                type=openapi.TYPE_STRING,
                required=False
            ),
            openapi.Parameter(
                'main_image',
                openapi.IN_FORM,
                description="Main campaign image",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_1',
                openapi.IN_FORM,
                description="Additional campaign image 1",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_2',
                openapi.IN_FORM,
                description="Additional campaign image 2",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_3',
                openapi.IN_FORM,
                description="Additional campaign image 3",
                type=openapi.TYPE_FILE,
                required=False
            ),
            openapi.Parameter(
                'image_4',
                openapi.IN_FORM,
                description="Additional campaign image 4",
                type=openapi.TYPE_FILE,
                required=False
            )
        ],
        responses={
            200: CampaignSerializer,
            400: "Bad Request"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Campaign.objects.all()
        category = self.request.query_params.get('category', None)
        location = self.request.query_params.get('location', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if location:
            queryset = queryset.filter(user__location=location)
            
        return queryset

    @swagger_auto_schema(
        operation_description="Get campaign investments",
        responses={200: InvestmentSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def investments(self, request, pk=None):
        campaign = self.get_object()
        investments = get_campaign_investments(campaign.id)
        serializer = InvestmentSerializer(investments, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get campaign statistics",
        responses={200: openapi.Response(
            description="Campaign statistics",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'total_investors': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'total_invested_amount': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'remaining_amount': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'days_left': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        )}
    )
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        campaign = self.get_object()
        stats = get_campaign_statistics(campaign.id)
        return Response(stats)

    @swagger_auto_schema(
        operation_description="Get active campaigns",
        responses={200: CampaignSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def active(self, request):
        campaigns = get_active_campaigns()
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Get top campaigns by progress",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Number of campaigns to return",
                type=openapi.TYPE_INTEGER,
                default=5
            )
        ],
        responses={200: CampaignSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def top(self, request):
        limit = int(request.query_params.get('limit', 5))
        campaigns = get_top_campaigns(limit)
        serializer = self.get_serializer(campaigns, many=True)
        return Response(serializer.data)

class InvestmentViewSet(viewsets.ModelViewSet):
    """
    API endpoints for investment management.
    """
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (parsers.MultiPartParser, parsers.FormParser)

    @swagger_auto_schema(
        operation_description="Create a new investment",
        request_body=InvestmentSerializer,
        responses={
            201: InvestmentSerializer,
            400: "Bad Request"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Update campaign amount
        campaign = serializer.validated_data['campaign']
        amount = serializer.validated_data['invested_amount']
        campaign.amount_generated += amount
        campaign.save()
        
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 