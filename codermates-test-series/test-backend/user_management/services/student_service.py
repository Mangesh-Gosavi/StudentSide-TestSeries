from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from ..models import Student, Organization, Batch

User = get_user_model()

class StudentService:
    @staticmethod
    @transaction.atomic
    def create_student(org_id, first_name, last_name, email, batch_id=None):
        """Create a student with associated user account."""
        try:
            organization = Organization.objects.get(id=org_id)

            # Check organization capacity
            if organization.students.count() >= organization.max_students:
                raise ValidationError("Organization has reached maximum student capacity")

            # Create user account first
            username = f"{first_name.lower()}.{last_name.lower()}"
            user = User.objects.create_user(
                email=email.lower(),
                username=username,
                password=User.objects.make_random_password()  # Generate random initial password
            )

            # Validate batch if provided
            batch = None
            if batch_id:
                batch = Batch.objects.get(id=batch_id, organization=organization)

            # Create student
            student = Student(
                user=user,
                organization=organization,
                batch=batch,
                first_name=first_name.strip(),
                last_name=last_name.strip()
            )
            student.full_clean()
            student.save()
            
            return student

        except (Organization.DoesNotExist, Batch.DoesNotExist):
            raise ValidationError("Organization or Batch not found")
        except Exception as e:
            raise ValidationError(f"Failed to create student: {str(e)}")

    @staticmethod
    @transaction.atomic
    def bulk_create_students(org_id, students_data, batch_id=None):
        """Bulk create students with user accounts."""
        try:
            organization = Organization.objects.get(id=org_id)
            
            # Validate organization capacity
            if organization.students.count() + len(students_data) > organization.max_students:
                raise ValidationError("Import would exceed organization capacity")

            # Validate batch if provided
            batch = None
            if batch_id:
                batch = Batch.objects.get(id=batch_id, organization=organization)

            created_students = []
            for student_data in students_data:
                # Create user account
                email = student_data['email'].lower()
                first_name = student_data['first_name'].strip()
                last_name = student_data['last_name'].strip()
                username = f"{first_name.lower()}.{last_name.lower()}"
                
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    password=User.objects.make_random_password()
                )

                # Create student
                student = Student(
                    user=user,
                    organization=organization,
                    batch=batch,
                    first_name=first_name,
                    last_name=last_name
                )
                student.full_clean()
                created_students.append(student)

            # Bulk create students
            Student.objects.bulk_create(created_students)
            return created_students

        except (Organization.DoesNotExist, Batch.DoesNotExist):
            raise ValidationError("Organization or Batch not found")
        except Exception as e:
            raise ValidationError(f"Failed to create students: {str(e)}")