from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from user_management.models.organization_model import Organization
from rest_framework import viewsets
from user_management.serializers.organization_serializer import OrganizationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        return []

    @action(detail=False, methods=['post'])
    def register(self, request):
        print("Register endpoint hit with data:", request.data)  # Debug log
        if not request.data.get("developer"):
            return Response(
                {"error": "Developer is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            organization = serializer.save()
            return Response(
                {
                    "message": "Organization registered successfully",
                    "organization": {
                        "id": organization.id,
                        "name": organization.name
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            print("Login attempt with data:", request.data)
            
            identifier = request.data.get('email')
            password = request.data.get('password')

            if not identifier or not password:
                return Response(
                    {'error': 'Both email/username and password are required.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the identifier is email or username
            organization = Organization.objects.filter(
                Q(email=identifier) | Q(username=identifier)
            ).first()

            if not organization:
                return Response(
                    {'error': 'Organization not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            # Validate password
            if organization.check_password(password):
                return Response({
                    'message': 'Login successful',
                    'organization': {
                        'id': organization.id,
                        'name': organization.name,
                        'email': organization.email,
                        'username': organization.username
                    }
                }, status=status.HTTP_200_OK)
            
            return Response(
                {'error': 'Invalid password'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        except Exception as e:
            print(f"Login error: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return Response(
                {'error': 'Login failed. Please try again.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )