from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from user_management.models.student_model import Student
from user_management.serializers.student_serializer import StudentSerializer, BulkStudentSerializer
from user_management.services.student_service import StudentService
from django.core.exceptions import ValidationError
from rest_framework import viewsets

class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  # No authentication required
    serializer_class = StudentSerializer

    def get_queryset(self):
        return Student.objects.all()  # Open access to all students

    def create(self, request):
        try:
            # Ensure student is created under the correct organization and batch
            student = StudentService.create_student(
                org_id=request.data.get('organization'),  # Ensure organization is passed in data
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                email=request.data.get('email'),
                batch_id=request.data.get('batch')  # Ensure batch is passed in data
            )
            return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], permission_classes=[AllowAny])
    def bulk_create(self, request):
        try:
            # Validate and create students in bulk
            serializer = BulkStudentSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            students = StudentService.bulk_create_students(
                org_id=request.data.get('organization'),  # Ensure organization is passed in data
                students_data=serializer.validated_data['students'],
                batch_id=serializer.validated_data.get('batch_id')  # Ensure batch is passed if available
            )

            return Response({
                "message": f"{len(students)} students created successfully",
                "students": StudentSerializer(students, many=True).data
            })
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)