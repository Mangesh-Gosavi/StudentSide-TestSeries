from rest_framework import serializers
from user_management.models.student_model import Student
from user_management.models.batch_model import Batch

class StudentSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    batch_name = serializers.CharField(source='batch.name', read_only=True)
    full_name = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'student_id', 'organization', 'organization_name',
            'batch', 'batch_name', 'username', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'student_id', 'created_at', 'updated_at',
            'organization_name', 'batch_name', 'username'
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def validate(self, data):
        if 'batch' in data and data['batch']:
            if data['batch'].organization != data.get('organization', self.instance.organization if self.instance else None):
                raise serializers.ValidationError({
                    'batch': "Batch must belong to the same organization as the student"
                })
        return data

class BulkStudentSerializer(serializers.Serializer):
    students = serializers.ListField(
        child=serializers.DictField(),
        min_length=1,
        max_length=1000
    )
    batch_id = serializers.IntegerField(required=False, allow_null=True)

    def validate_students(self, value):
        if not value:
            raise serializers.ValidationError("At least one student is required")

        emails = set()
        validated_students = []

        for student in value:
            required_fields = {'first_name', 'last_name', 'email'}
            missing_fields = required_fields - set(student.keys())

            if missing_fields:
                raise serializers.ValidationError(
                    f"Missing required fields: {', '.join(missing_fields)}"
                )

            email = student['email'].lower().strip()
            if email in emails:
                raise serializers.ValidationError(
                    f"Duplicate email in batch: {email}"
                )
            emails.add(email)

            if Student.objects.filter(user__email=email).exists():
                raise serializers.ValidationError(
                    f"Student with email {email} already exists"
                )

            validated_students.append({
                'first_name': student['first_name'].strip(),
                'last_name': student['last_name'].strip(),
                'email': email
            })

        return validated_students

    def validate(self, data):
        organization = self.context.get('organization')
        if not organization:
            raise serializers.ValidationError("Organization context is required")

        if data.get('batch_id'):
            try:
                batch = Batch.objects.get(id=data['batch_id'], organization=organization)
                data['batch'] = batch
            except Batch.DoesNotExist:
                raise serializers.ValidationError({
                    'batch_id': "Invalid batch ID or batch does not belong to this organization"
                })

        current_count = organization.students.count()
        new_count = len(data['students'])
        if current_count + new_count > organization.max_students:
            raise serializers.ValidationError(
                f"Adding {new_count} students would exceed the organization's "
                f"limit of {organization.max_students} students. "
                f"Current count: {current_count}"
            )

        return data
