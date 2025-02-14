from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from user_management.models.batch_model import Batch
from user_management.serializers.batch_serializer import BatchSerializer
from user_management.services.batch_service import BatchService

class BatchViewSet(viewsets.ModelViewSet):
    permission_classes = []
    serializer_class = BatchSerializer
    
    def get_queryset(self):
        organization_pk = self.kwargs.get('organization_pk')
        if organization_pk:
            return Batch.objects.filter(organization_id=organization_pk)
        return Batch.objects.all()
    
    def create(self, request, *args, **kwargs):
        try:
            organization_pk = self.kwargs.get('organization_pk')
            if not organization_pk:
                organization_pk = request.data.get('organization')
                
            if not organization_pk:
                raise ValidationError("Organization ID is required")
                
            batch = BatchService.create_batch(
                org_id=organization_pk,
                name=request.data.get('name'),
                description=request.data.get('description'),
                is_active=request.data.get('is_active', True),
                start_date=request.data.get('start_date'),
                end_date=request.data.get('end_date'),
            )
            return Response(
                BatchSerializer(batch).data,
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            updated_batch = BatchService.edit_batch(
                batch_id=instance.id,
                batch_data=request.data
            )
            return Response(BatchSerializer(updated_batch).data)
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            BatchService.delete_batch(instance.id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )