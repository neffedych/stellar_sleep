from rest_framework import viewsets
from .models import Provider, Patient, Address, CustomField, PatientCustomField
from .serializers import (
    PatientSerializer,
    ProviderSerializer,
    AddressSerializer,
    CustomFieldSerializer,
    PatientCustomFieldSerializer
)

class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class CustomFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer

class PatientCustomFieldViewSet(viewsets.ModelViewSet):
    queryset = PatientCustomField.objects.all()
    serializer_class = PatientCustomFieldSerializer