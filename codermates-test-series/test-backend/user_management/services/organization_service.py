from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from ..models import Organization

User = get_user_model()

class OrganizationService:
    @staticmethod
    @transaction.atomic
    def create_organization(name, email, password, max_students=100):
        """Create a new organization with associated developer user."""
        try:
            # Validate email uniqueness
            if Organization.objects.filter(email=email).exists():
                raise ValidationError("An organization with this email already exists.")
            
            # Generate username and validate uniqueness
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while Organization.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Create the developer user
            developer = User.objects.create_user(
                email=email.lower(),
                username=username,
                password=password,
                is_developer=True
            )
            
            # Create organization instance
            organization = Organization(
                name=name,
                email=email.lower(),
                username=username,
                max_students=max_students,
                developer=developer
            )
            organization.save()
            
            return organization
            
        except Exception as e:
            raise ValidationError(f"Failed to create organization: {str(e)}")