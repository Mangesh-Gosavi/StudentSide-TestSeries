from rest_framework import serializers
from user_management.models.batch_model import Batch

class BatchSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(
        source='organization.name',
        read_only=True
    )
    student_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Batch
        fields = [
            'id', 'name', 'description', 'organization',
            'organization_name', 'is_active', 'start_date',
            'end_date', 'student_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_is_active(self, value):
        if isinstance(value, str):
            value = value.lower() == 'true'
        return value
    
    def get_student_count(self, obj):
        return obj.students.count()
    
    def validate(self, data):
        if 'start_date' in data and 'end_date' in data:
            if data['start_date'] and data['end_date']:
                if data['start_date'] > data['end_date']:
                    raise serializers.ValidationError(
                        "End date must be after start date."
                    )
        
        for field in ['start_date', 'end_date']:
            if field in data and not data[field]:
                raise serializers.ValidationError(
                    f"{field.replace('_', ' ').title()} cannot be null."
                )
        
        return data