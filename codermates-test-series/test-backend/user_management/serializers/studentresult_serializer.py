from rest_framework import serializers
from user_management.models.studentresult_model import StudentResult

class StudentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentResult
        fields = '__all__'