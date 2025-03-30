from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import UserProfileViewSet, CampaignViewSet, InvestmentViewSet

schema_view = get_schema_view(
    openapi.Info(
        title="FishTank API",
        default_version='v1',
        description="API for FishTank crowdfunding platform",
        terms_of_service="https://www.fishtank.com/terms/",
        contact=openapi.Contact(email="contact@fishtank.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet, basename='user-profile')
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'investments', InvestmentViewSet, basename='investment')

urlpatterns = [
    path('', include(router.urls)),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] 