from rest_framework import serializers
from .models import Provider, Patient, Address, CustomField, PatientCustomField

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at']

class PatientSerializer(serializers.ModelSerializer):
    provider_id = serializers.PrimaryKeyRelatedField(queryset=Provider.objects.all(), source='provider')
    class Meta:
        model = Patient
        fields = ['id', 'first_name', 'middle_name', 'last_name', 'date_of_birth', 'status', 'created_at', 'updated_at', 'provider_id']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'user_id', 'first_address', 'second_address', 'created_at', 'updated_at']

class CustomFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomField
        fields = ['id', 'field_name', 'field_type', 'created_at', 'updated_at']

class PatientCustomFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientCustomField
        fields = ['id', 'patient_id', 'custom_field_id', 'field_value', 'created_at', 'updated_at']
