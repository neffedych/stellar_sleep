from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Provider, Patient, Address, CustomField, PatientCustomField
from .serializers import PatientSerializer, ProviderSerializer, AddressSerializer, CustomFieldSerializer, PatientCustomField

# Create your views here.
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'provider_id']
    search_fields = ['first_name', 'last_name', 'middle_name']
    ordering_fields = ['date_of_birth', 'created_at']


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    
class CustomFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer

class PatientCustomFieldViewSet(viewsets.ModelViewSet):
    queryset = PatientCustomField.objects.all()
    serializer_class = PatientCustomField
