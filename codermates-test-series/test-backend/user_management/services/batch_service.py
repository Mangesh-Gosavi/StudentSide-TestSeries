from django.db import transaction
from django.core.exceptions import ValidationError
from ..models import Organization, Batch

class BatchService:
    @staticmethod
    @transaction.atomic
    def create_batch(org_id, name, description=None, is_active=True, start_date=None, end_date=None):
        """Create a new batch for an organization."""
        try:
            organization = Organization.objects.get(id=org_id)

            if Batch.objects.filter(organization=organization, name__iexact=name).exists():
                raise ValidationError("A batch with this name already exists")

            batch = Batch(
                organization=organization,
                name=name,
                description=description,
                is_active=is_active,
                start_date=start_date,
                end_date=end_date,
            )
            batch.full_clean()
            batch.save()
            return batch

        except Organization.DoesNotExist:
            raise ValidationError("Organization not found")
        except Exception as e:
            raise ValidationError(f"Failed to create batch: {str(e)}")

    @staticmethod
    @transaction.atomic
    def edit_batch(batch_id, batch_data):
        """Update a batch's information."""
        try:
            batch = Batch.objects.get(id=batch_id)
            if 'name' in batch_data:
                batch.name = batch_data['name']
            if 'description' in batch_data:
                batch.description = batch_data.get('description', batch.description)
            if 'is_active' in batch_data:
                batch.is_active = batch_data['is_active']
            if 'start_date' in batch_data:
                batch.start_date = batch_data['start_date']
            if 'end_date' in batch_data:
                batch.end_date = batch_data['end_date']

            batch.full_clean()
            batch.save()

            return batch
        except Batch.DoesNotExist:
            raise ValidationError("Batch not found")
        except Exception as e:
            raise ValidationError(f"Failed to update batch: {str(e)}")

    @staticmethod
    @transaction.atomic
    def delete_batch(batch_id):
        """Delete a batch by ID."""
        try:
            batch = Batch.objects.get(id=batch_id)
            batch.delete()
        except Batch.DoesNotExist:
            raise ValidationError("Batch not found")
