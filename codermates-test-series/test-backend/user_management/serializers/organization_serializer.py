from rest_framework import serializers
from django.contrib.auth import get_user_model
from user_management.models.organization_model import Organization

User = get_user_model()

class OrganizationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Organization
        fields = [
            "id", "name", "email", "username", "password",
            "max_students", "developer", "created_at", "updated_at"
        ]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data):
        password = validated_data.pop('password')
        organization = Organization(**validated_data)
        organization.set_password(password)
        organization.save()
        return organization

    def validate(self, data):
        if not data.get("developer"):
            raise serializers.ValidationError({"developer": "Developer field is required."})
        return data