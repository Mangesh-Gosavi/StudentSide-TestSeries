from rest_framework import serializers
from user_management.models.studentreport_model import StudentReport

class StudentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentReport
        fields = '__all__'