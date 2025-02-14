from django.db import models
from django.core.validators import MinValueValidator, EmailValidator
from django.contrib.auth.hashers import make_password, check_password
from user_management.models.user_model import User


class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        help_text="Organization's primary email address"
    )
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    max_students = models.PositiveIntegerField(
        default=100,
        validators=[MinValueValidator(1)],
        help_text="Maximum number of students allowed"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    developer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="organizations", limit_choices_to={'is_developer': True}
    )

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        if not self.pk and self.password and not self.password.startswith('pbkdf2_sha256'):
            self.set_password(self.password)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name