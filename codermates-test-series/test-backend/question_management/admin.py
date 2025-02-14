from django.contrib import admin
from .models import Question
from .models import Exam, ExamQuestion  


class QuestionAdmin(admin.ModelAdmin):
    list_display = [
        'que_id', 'exam', 'subject', 'area', 'chapter', 'topic',
        'difficulty', 'question_text', 'correct_answer',
        'options', 'question_type', 'is_used', 'explain', 'marks', 'prev_year'
    ]
    search_fields = ['exam', 'subject', 'area', 'chapter', 'topic']

admin.site.register(Question, QuestionAdmin)


class ExamAdmin(admin.ModelAdmin):
    list_display = ('test_id','org_id', 'exam_name', 'exam_duration', 'total_marks', 'subject_questions', 'marking_scheme','created_at')
    search_fields = ("exam_name", "org_id")
    list_filter = ("created_at",)
    ordering = ("-created_at",)

admin.site.register(Exam, ExamAdmin)


class ExamQuestionAdmin(admin.ModelAdmin):
    list_display = ('exam','que_id','subject','area','chapter','topic','question_text', 'question_type', 'difficulty', 'correct_answer', 'options', 'is_used','explain','marks','prev_year','created_at')

    list_filter = ('exam',)

admin.site.register(ExamQuestion, ExamQuestionAdmin)



