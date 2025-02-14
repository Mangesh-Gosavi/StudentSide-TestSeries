from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from user_management.models.user_model import User
from user_management.models.organization_model import Organization
from user_management.models.batch_model import Batch


class Student(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='students'
    )
    batch = models.ForeignKey(
        Batch,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='students'
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    student_id = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['first_name', 'last_name']
        indexes = [
            models.Index(fields=['first_name', 'last_name']),
            models.Index(fields=['student_id']),
            models.Index(fields=['is_active']),
            models.Index(fields=['organization']),
            models.Index(fields=['batch']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def clean(self):
        super().clean()
        if self.batch and self.batch.organization != self.organization:
            raise ValidationError("Student's batch must belong to the same organization")

        current_count = self.organization.students.count()
        if not self.pk and current_count >= self.organization.max_students:
            raise ValidationError(
                f"Organization has reached its maximum limit of {self.organization.max_students} students"
            )

    def save(self, *args, **kwargs):
        if not self.student_id:
            timestamp = timezone.now().strftime('%y%m%d%H%M')
            org_prefix = self.organization.name[:3].upper()
            self.student_id = f"{org_prefix}{timestamp}"
        super().save(*args, **kwargs)