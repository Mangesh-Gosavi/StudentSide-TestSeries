from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from random import sample
from question_management.models import Question
import random

from django.db.models import Q

EXAM_PATTERNS = {
    "JEE": {
        "default_questions": 75,
        "default_duration": 180,
        "duration_per_question": 2.4,
        "total_marks": 300,
        "percentage_breakdown": {
            "Mathematics": 33.33,
            "Physics": 33.33,
            "Chemistry": 33.33,
            "Biology": 0
        },
        "marking_scheme": {
            "correct": 4,
            "incorrect": -1,
            "unanswered": 0,
        },
        "sections": [
            {"subject": "Mathematics", "MCQs": 20, "Numerical": 5, "Total": 25},
            {"subject": "Physics", "MCQs": 20, "Numerical": 5, "Total": 25},
            {"subject": "Chemistry", "MCQs": 20, "Numerical": 5, "Total": 25},
        ],
    },
    "NEET": {
        "default_questions": 180,
        "default_duration": 200,
        "duration_per_question": 1.1,
        "total_marks": 720,
        "percentage_breakdown": {
            "Physics": 27.78,
            "Chemistry": 27.78,
            "Biology": 55.56
        },
        "marking_scheme": {
            "correct": 4,
            "incorrect": -1,
            "unanswered": 0,
        },
        "sections": [
            {"subject": "Physics", "A": 35, "B": 5, "Total": 50, "Marks": 180},
            {"subject": "Chemistry", "A": 35, "B": 5, "Total": 50, "Marks": 180},
            {"subject": "Biology", "A": 70, "B": 20, "Total": 100, "Marks": 360},
        ],
    },
    "MHT-CET": {
        "default_questions": 150,
        "default_duration": 180,
        "duration_per_question": 1.2,
        "total_marks": 200,
        "percentage_breakdown": {
            "Mathematics": 33.33,
            "Physics": 33.33,
            "Chemistry": 33.33,
            "Biology": 0
        },
        "marking_scheme": {
            "Mathematics": {
                "correct": 2,
                "incorrect": 0,
                "unanswered": 0,
            },
            "Physics": {
                "correct": 1,
                "incorrect": 0,
                "unanswered": 0,
            },
            "Chemistry": {
                "correct": 1,
                "incorrect": 0,
                "unanswered": 0,
            },
        },
        "sections": [
            {"subject": "Mathematics", "Questions": 50, "Marks Per Question": 2, "Total Marks": 100},
            {"subject": "Physics", "Questions": 50, "Marks Per Question": 1, "Total Marks": 50},
            {"subject": "Chemistry", "Questions": 50, "Marks Per Question": 1, "Total Marks": 50},
        ],
    },
}


@api_view(['GET'])
def generate_exam_paper(request):
    exam_name = request.GET.get('exam_name', '').upper()
    num_questions = int(request.GET.get('num_questions', 0))
    
    # Fetch custom difficulty percentages (if provided)
    custom_easy = request.GET.get('Low', 20)  # Default: 20%
    custom_medium = request.GET.get('Medium', 60)  # Default: 60%
    custom_hard = request.GET.get('High', 20)  # Default: 20%

    custom_easy = int(custom_easy)
    custom_medium = int(custom_medium)
    custom_hard = int(custom_hard)

    if custom_easy + custom_medium + custom_hard != 100:
        return Response({"error": "Difficulty percentages must add up to 100"}, status=400)

    if exam_name not in EXAM_PATTERNS:
        return Response({"error": "Invalid exam type. Choose from JEE, NEET, MHT-CET"}, status=400)

    exam_data = EXAM_PATTERNS[exam_name]

    # Use default if num_questions is 0
    if num_questions == 0:
        num_questions = exam_data["default_questions"]

    # Calculate duration and total marks dynamically
    exam_duration = round(num_questions * exam_data["duration_per_question"])
    # total_marks = round((num_questions / exam_data["default_questions"]) * exam_data["total_marks"])


    # Calculate subject-wise question distribution
    subject_questions = {}
    for section in exam_data["sections"]:
        subject = section["subject"]
        percentage = exam_data["percentage_breakdown"].get(subject, 0)
        subject_questions[subject] = round((num_questions * percentage) / 100)

    # Marking Scheme
    marking_scheme = exam_data.get("marking_scheme", {})

    # Fetch questions from the database based on the calculated distribution
    questions = []
    for subject, num_subject_questions in subject_questions.items():
        if num_subject_questions > 0:
            easy_questions = list(Question.objects.filter(exam=exam_name, subject=subject, difficulty="Low"))
            medium_questions = list(Question.objects.filter(exam=exam_name, subject=subject, difficulty="Medium"))
            hard_questions = list(Question.objects.filter(exam=exam_name, subject=subject, difficulty="High"))

            # Calculate the count based on the percentage split
            num_easy = round((custom_easy / 100) * num_subject_questions)
            num_medium = round((custom_medium / 100) * num_subject_questions)
            num_hard = num_subject_questions - (num_easy + num_medium)  # Ensure total questions match

            # Sample questions while ensuring enough are available
            selected_easy = random.sample(easy_questions, min(len(easy_questions), num_easy)) if len(easy_questions) > 0 else []
            selected_medium = random.sample(medium_questions, min(len(medium_questions), num_medium)) if len(medium_questions) > 0 else []
            selected_hard = random.sample(hard_questions, min(len(hard_questions), num_hard)) if len(hard_questions) > 0 else []

            # If there are not enough questions in one category, distribute the remaining questions across other categories
            remaining_questions = num_subject_questions - len(selected_easy) - len(selected_medium) - len(selected_hard)
            if remaining_questions > 0:
                # Try to distribute remaining questions into each category if needed
                if remaining_questions > 0:
                    selected_easy += random.sample(easy_questions, min(len(easy_questions), remaining_questions))
                    remaining_questions -= len(selected_easy)
                if remaining_questions > 0:
                    selected_medium += random.sample(medium_questions, min(len(medium_questions), remaining_questions))
                    remaining_questions -= len(selected_medium)
                if remaining_questions > 0:
                    selected_hard += random.sample(hard_questions, min(len(hard_questions), remaining_questions))

            # Combine selected questions
            selected_questions = selected_easy + selected_medium + selected_hard
            random.shuffle(selected_questions)  # Shuffle for randomness

            # Add selected questions to exam paper
            for q in selected_questions:
                questions.append({
                    'que_id': q.que_id,
                    'subject':q.subject,
                    'area': q.area,
                    'chapter': q.chapter,
                    'topic': q.topic,
                    'difficulty': q.difficulty,
                    'question_text': q.question_text,
                    'options': q.options,
                    'correct_answer': q.correct_answer,
                    'question_type': q.question_type,
                    'is_used' : q.is_used,
                    'explain': q.explain,
                    'marks': q.marks,
                    'prev_year': q.prev_year,
                })

    # Store the number of questions retrieved
    num_questions_retrieved = len(questions)

    # Calculate total marks using the number of questions retrieved
    total_marks = round((num_questions_retrieved / exam_data["default_questions"]) * exam_data["total_marks"])

    # Return response with number of questions retrieved
    return Response({
        "exam_name": exam_name,
        "exam_duration": f"{exam_duration} minutes",
        "subject_questions": subject_questions,
        "questions": questions,
        "marking_scheme": marking_scheme,
        "total_marks": total_marks,
    })



@api_view(['GET'])
def get_all_papers(request):
    papers = ExamPaper.objects.all().values('id', 'exam_name', 'num_questions', 'exam_duration', 'total_marks', 'created_at')
    return Response(list(papers))
