from rest_framework import serializers
from user_management.models.studymaterial_model import StudyMaterial

class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = '__all__'
