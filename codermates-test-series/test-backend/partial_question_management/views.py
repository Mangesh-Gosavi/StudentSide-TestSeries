import random
from collections import defaultdict
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from question_management.models import Question
from .serializers import QuestionSerializer

class FilterQuestionsView(APIView):
    EXAM_DETAILS = {
        "JEE": {
            "percentage_breakdown": {"Mathematics": 33.33, "Physics": 33.33, "Chemistry": 33.33, "Biology": 0},
            "marking_scheme": {"correct": 4, "incorrect": -1, "unanswered": 0}
        },
        "NEET": {
            "percentage_breakdown": {"Physics": 27.78, "Chemistry": 27.78, "Biology": 55.56},
            "marking_scheme": {"correct": 4, "incorrect": -1, "unanswered": 0}
        },
        "MHT CET": {
            "percentage_breakdown": {"Mathematics": 33.33, "Physics": 33.33, "Chemistry": 33.33, "Biology": 0},
            "marking_scheme": {
                "Mathematics": {"correct": 2, "incorrect": 0, "unanswered": 0},
                "Physics": {"correct": 1, "incorrect": 0, "unanswered": 0},
                "Chemistry": {"correct": 1, "incorrect": 0, "unanswered": 0}
            }
        }
    }

    def post(self, request):
        try:
            org_id = request.data.get('org_id')
            exam_name = request.data.get('exam_name')
            exam_duration = request.data.get('exam_duration')
            filters = request.data.get('filters', {})
            number_of_questions = request.data.get('number_of_questions', 500)

            if not org_id or not exam_name or not exam_duration:
                return Response({"error": "org_id, exam_name, and exam_duration are required."}, status=status.HTTP_400_BAD_REQUEST)

            exam = filters.get("exam")
            if not exam or exam not in self.EXAM_DETAILS:
                return Response({"error": "Invalid or missing exam selection."}, status=status.HTTP_400_BAD_REQUEST)

            marking_scheme = self.EXAM_DETAILS[exam]["marking_scheme"]
            
            custom_easy = int(request.data.get('Low', 20))
            custom_medium = int(request.data.get('Medium', 60))
            custom_hard = int(request.data.get('High', 20))

            if custom_easy + custom_medium + custom_hard != 100:
                return Response({"error": "Difficulty percentages must add up to 100"}, status=400)

            subject_percentages = self.EXAM_DETAILS[exam]["percentage_breakdown"]
            selected_subjects = filters.get("subject", list(subject_percentages.keys()))
            total_percentage = sum(subject_percentages[subj] for subj in selected_subjects if subj in subject_percentages)

            subject_distribution = {subj: int((subject_percentages[subj] / total_percentage) * number_of_questions) for subj in selected_subjects}

            query = Q()
            for field in ["subject", "area", "chapter", "topic"]:
                if field in filters:
                    values = filters[field]
                    if isinstance(values, list) and values:
                        query &= Q(**{f"{field}__in": values})
                    elif isinstance(values, str):
                        query &= Q(**{field: values})

            final_questions = []
            subject_questions_count = {}
            total_marks = 0

            for subject, num_subject_questions in subject_distribution.items():
                if num_subject_questions > 0:
                    easy_questions = list(Question.objects.filter(query, subject=subject, difficulty="Low"))
                    medium_questions = list(Question.objects.filter(query, subject=subject, difficulty="Medium"))
                    hard_questions = list(Question.objects.filter(query, subject=subject, difficulty="High"))

                    num_easy = round((custom_easy / 100) * num_subject_questions)
                    num_medium = round((custom_medium / 100) * num_subject_questions)
                    num_hard = num_subject_questions - (num_easy + num_medium)

                    selected_easy = random.sample(easy_questions, min(len(easy_questions), num_easy)) if easy_questions else []
                    selected_medium = random.sample(medium_questions, min(len(medium_questions), num_medium)) if medium_questions else []
                    selected_hard = random.sample(hard_questions, min(len(hard_questions), num_hard)) if hard_questions else []

                    selected_questions = selected_easy + selected_medium + selected_hard
                    random.shuffle(selected_questions)

                    final_questions.extend(selected_questions)
                    subject_questions_count[subject] = len(selected_questions)

                    for question in selected_questions:
                        if isinstance(marking_scheme, dict) and subject in marking_scheme:
                            total_marks += marking_scheme[subject]["correct"]
                        else:
                            total_marks += marking_scheme["correct"]

            serialized_data = QuestionSerializer(final_questions, many=True).data

            return Response({
                "org_id": org_id,
                "exam_name": exam_name,
                "exam_duration": exam_duration,
                "subject_questions": subject_questions_count,
                "questions": serialized_data,
                "marking_scheme": marking_scheme,
                "total_marks": total_marks,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
