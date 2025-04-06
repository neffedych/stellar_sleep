from django.db import models
import uuid

# Create your models here.
class Provider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = 'providers'

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.TextField()
    middle_name = models.TextField(null=True, blank=True)
    last_name = models.TextField()
    date_of_birth = models.DateField()
    status = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    provider_id = models.UUIDField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = 'patients'



class Address(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    first_address = models.TextField()
    second_address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_address}, {self.second_address}"

    class Meta:
        db_table = 'addresses'

class CustomField(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    field_name = models.TextField()
    field_type = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.field_name

    class Meta:
        db_table = 'custom_fields'


class PatientCustomField(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.UUIDField()
    custom_field_id = models.UUIDField()
    field_value = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Custom Field for Patient {self.patient_id}"

    class Meta:
        db_table = 'patient_custom_fields'
