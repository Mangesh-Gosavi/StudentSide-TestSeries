import csv
import io
import logging
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Question
from .serializers import CSVUploadSerializer
from django.db.models import Q
from .serializers import QuestionSerializer
from .models import Exam, ExamQuestion
from .serializers import ExamSerializer
from rest_framework import generics
import random
import uuid
from datetime import datetime


logger = logging.getLogger(__name__)
BATCH_SIZE = 5000  
ERROR_LIMIT = 50  


class CSVUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = CSVUploadSerializer(data=request.data)

        if serializer.is_valid():
            file = request.FILES.get('file')
            if not file:
                return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

            if not file.name.endswith('.csv'):
                return Response({"error": "Only CSV files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                csv_file = io.TextIOWrapper(file.file, encoding='utf-8')
                reader = csv.reader(csv_file)
                headers = next(reader, None)

                if not headers:
                    return Response({"error": "Empty CSV file."}, status=status.HTTP_400_BAD_REQUEST)

                logger.info(f"CSV Columns: {headers}")

                expected_columns = [
                    "Que_ID", "Exam", "Subject", "Area", "Chapter", "Topic", "Difficulty",
                    "Question", "Correct Answer", "Option A", "Option B", "Option C", "Option D",
                    "Question Paper Type", "Explain", "Marks", "prev_year",
                ]

                headers_normalized = [col.strip().lower() for col in headers]
                expected_columns_normalized = [col.strip().lower() for col in expected_columns]

                if not all(col in headers_normalized for col in expected_columns_normalized):
                    missing_cols = [col for col in expected_columns if col.strip().lower() not in headers_normalized]
                    return Response({"error": f"Missing columns: {missing_cols}"}, status=status.HTTP_400_BAD_REQUEST)

                column_index_map = {col: headers_normalized.index(col.lower()) for col in expected_columns}

                questions_to_create = []
                error_count = 0
                success_count = 0
                errors = []
                existing_que_ids = set()  # To track unique Que_IDs

                for row in reader:
                    try:
                        if len(row) < len(headers):
                            raise ValueError("Row has missing values.")

                        row_data = {key: row[column_index_map[key]].strip() for key in expected_columns}

                        missing_fields = [key for key in expected_columns if not row_data[key]]
                        if missing_fields:
                            raise ValueError(f"Missing fields: {missing_fields}")

                        options = {
                            "A": row_data['Option A'],
                            "B": row_data['Option B'],
                            "C": row_data['Option C'],
                            "D": row_data['Option D']
                        }

                        correct_answer = row_data['Correct Answer']
                        if correct_answer not in options:
                            raise ValueError("Correct Answer must be one of: A, B, C, or D.")

                        is_used = row_data.get('is_used', '').strip().lower() in ('true', '1', 'yes')
                        marks = float(row_data.get('Marks', 0))
                        prev_year = row_data.get('prev_year', '').strip().lower() in ('true', '1', 'yes')
                        explain = row_data.get('Explain', '')
                        que_id = row_data['Que_ID']

                        if que_id in existing_que_ids:
                            raise ValueError(f"Duplicate Que_ID found: {que_id}")
                        existing_que_ids.add(que_id)

                        questions_to_create.append(Question(
                            que_id=que_id,
                            exam=row_data['Exam'],
                            subject=row_data['Subject'],
                            area=row_data['Area'],
                            chapter=row_data['Chapter'],
                            topic=row_data['Topic'],
                            difficulty=row_data['Difficulty'],
                            question_text=row_data['Question'],
                            options=options,
                            correct_answer=correct_answer,
                            question_type=row_data['Question Paper Type'],
                            is_used=is_used,
                            marks=marks,
                            prev_year=prev_year,
                            explain=explain,
                        ))

                        if len(questions_to_create) >= BATCH_SIZE:
                            with transaction.atomic():
                                Question.objects.bulk_create(questions_to_create)
                            success_count += len(questions_to_create)
                            questions_to_create = []

                    except Exception as e:
                        error_count += 1
                        if len(errors) < ERROR_LIMIT:
                            errors.append({"row": row, "error": str(e)})
                        logger.error(f"Error processing row {row}: {str(e)}")

                if questions_to_create:
                    with transaction.atomic():
                        Question.objects.bulk_create(questions_to_create)
                    success_count += len(questions_to_create)

                response_status = status.HTTP_200_OK if error_count == 0 else status.HTTP_400_BAD_REQUEST
                return Response({
                    "message": "CSV processing completed.",
                    "success_count": success_count,
                    "error_count": error_count,
                    "errors": errors if errors else None
                }, status=response_status)

            except Exception as e:
                logger.error(f"CSV Processing Failed: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FilterQuestionsView(APIView):
    def post(self, request):
        try:
            filters = request.data.get('filters', {})
            number_of_questions = request.data.get('number_of_questions', 500) 

            print("Received Filters:", filters)
            print("Requested Number of Questions:", number_of_questions)

            if not isinstance(filters, dict):
                return Response({"error": "Filters must be a JSON object."}, status=status.HTTP_400_BAD_REQUEST)

            if not isinstance(number_of_questions, int) or number_of_questions <= 0:
                return Response({"error": "Number of questions must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST)

            query = Q()
            for field in ['exam', 'subject', 'area', 'chapter', 'topic', 'difficulty']:
                if field in filters:
                    query &= Q(**{field: filters[field]})

            questions = Question.objects.filter(query)

            total_questions = questions.count()
            print("Total Questions Found:", total_questions)

            if total_questions == 0:
                return Response({"error": "No questions found matching the filters."}, status=status.HTTP_404_NOT_FOUND)

            # number_of_questions = min(number_of_questions, total_questions)

            # random_questions = random.sample(list(questions), number_of_questions)

            # Use order_by('?') to fetch random questions directly from the database
            number_of_questions = min(number_of_questions, total_questions)
            
            random_questions = questions.order_by('?')[:number_of_questions]

            serialized_data = QuestionSerializer(random_questions, many=True).data

            return Response({"questions": serialized_data}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error:", str(e)) 
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExamListView(generics.ListAPIView):
    serializer_class = ExamSerializer

    def get_queryset(self):
        org_id = self.kwargs['org_id']
        return Exam.objects.filter(org_id=org_id)

class DynamicDropdownView(APIView):
    def get(self, request):
        exam = request.query_params.get('exam', None)
        subject = request.query_params.get('subject', None)
        area = request.query_params.get('area', None)
        chapter = request.query_params.get('chapter', None)
        
        response_data = {}

        if exam:
            subjects = Question.objects.filter(exam=exam).values_list('subject', flat=True).distinct()
            response_data['subjects'] = subjects

        if subject:
            areas = Question.objects.filter(exam=exam, subject=subject).values_list('area', flat=True).distinct()
            response_data['areas'] = areas

        if area:
            chapters = Question.objects.filter(exam=exam, subject=subject, area=area).values_list('chapter', flat=True).distinct()
            response_data['chapters'] = chapters

        if chapter:
            topics = Question.objects.filter(exam=exam, subject=subject, area=area, chapter=chapter).values_list('topic', flat=True).distinct()
            response_data['topics'] = topics

        return Response(response_data, status=status.HTTP_200_OK)

class ExamFetchView(APIView):
    def get(self, request, test_id):
        try:
            # Retrieve the exam with the provided test_id
            exam = Exam.objects.get(test_id=test_id)

            # Serialize the exam data
            serializer = ExamSerializer(exam)

            # Return the serialized data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exam.DoesNotExist:
            # If the exam with the given test_id is not found
            return Response({"error": "Exam not found."}, status=status.HTTP_404_NOT_FOUND)

class ExamCreateView(APIView):
    def post(self, request):
        # Validate the input data using the serializer
        serializer = ExamSerializer(data=request.data)


        if serializer.is_valid():
            try:
                with transaction.atomic():
                    exam_data = serializer.validated_data
                    exam = Exam.objects.create(
                        test_id=uuid.uuid4(),
                        org_id=exam_data['org_id'], 
                        exam_name=exam_data['exam_name'],
                        exam_duration=exam_data['exam_duration'],
                        total_marks=exam_data['total_marks'],
                        subject_questions=exam_data['subject_questions'],
                        marking_scheme=exam_data['marking_scheme'],
                        created_at=datetime.now()
                    )

                    questions_data = exam_data['questions']
                    for question in questions_data:
                        ExamQuestion.objects.create(
                            exam=exam,
                            que_id=uuid.uuid4(),  # Generate unique question ID
                            subject=question['subject'],
                            area=question['area'],  # Ensure area is provided by the user
                            chapter=question['chapter'],  # Ensure chapter is provided
                            topic=question['topic'], 
                            question_text=question['question_text'],
                            options=question['options'],
                            correct_answer=question['correct_answer'],
                            question_type=question['question_type'],
                            difficulty=question['difficulty'],
                            is_used=question['is_used'],  # Ensure is_used is provided
                            explain=question['explain'],  # Ensure explain is provided
                            marks=question['marks'],  # Ensure marks is provided
                            prev_year=question['prev_year'],  # Ensure prev_year is provided
                            created_at=datetime.now()
                        )
                    
                # Return a success response if everything went well
                return Response({"message": "Exam and questions created successfully."}, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                # In case of any error, return a failure response
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # If the data from the serializer is invalid, return the validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MultiSelectDynamicDropdownView(APIView):
    def get(self, request):
        exams = request.query_params.getlist('exam', [])  
        subjects = request.query_params.getlist('subject', [])  
        areas = request.query_params.getlist('area', [])  
        chapters = request.query_params.getlist('chapter', [])  

        response_data = {}

        # Get subjects based on multiple exams
        if exams:
            response_data['subjects'] = Question.objects.filter(exam__in=exams).values_list('subject', flat=True).distinct()

        # Get areas based on multiple subjects
        if subjects:
            response_data['areas'] = Question.objects.filter(subject__in=subjects).values_list('area', flat=True).distinct()

        # Get chapters based on multiple areas
        if areas:
            response_data['chapters'] = Question.objects.filter(area__in=areas).values_list('chapter', flat=True).distinct()

        # Get topics based on multiple chapters
        if chapters:
            response_data['topics'] = Question.objects.filter(chapter__in=chapters).values_list('topic', flat=True).distinct()

        return Response(response_data, status=status.HTTP_200_OK)