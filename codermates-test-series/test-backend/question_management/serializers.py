# Serializers.py
from rest_framework import serializers
from .models import Question
from question_management.models import Exam, ExamQuestion

class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('question_text', 'correct_answer', 'options', 'question_type', 'difficulty')


class ExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestion
        fields = ['que_id', 'subject', 'area', 'chapter', 
            'topic', 'difficulty', 'question_text', 'options', 
            'correct_answer', 'question_type', 'is_used', 
            'explain', 'marks', 'prev_year', 'created_at'
            ]
        read_only_fields = ['created_at']


class ExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(many=True)
    
    class Meta:
        model = Exam
        fields = [
            'test_id', 'org_id', 'exam_name', 'exam_duration', 
            'total_marks', 'subject_questions', 'marking_scheme', 
            'created_at', 'questions'
        ]

