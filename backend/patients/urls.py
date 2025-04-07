from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProviderViewSet,
    PatientViewSet,
    AddressViewSet,
    CustomFieldViewSet,
    PatientCustomFieldViewSet
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'providers', ProviderViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'custom-fields', CustomFieldViewSet)
router.register(r'patient-custom-fields', PatientCustomFieldViewSet)

urlpatterns = [
    path('', include(router.urls)),
]