from rest_framework import serializers
from user_management.models.scheduledpaper_model import ScheduledPaper

class ScheduledPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledPaper
        fields = '__all__'