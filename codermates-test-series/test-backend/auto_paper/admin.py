from django.contrib import admin
from .models import ExamPaper

class ExamPaperAdmin(admin.ModelAdmin):
    list_display = ('exam_type', 'num_questions', 'exam_duration', 'total_marks', 'created_at')
    search_fields = ('exam_type',)
    list_filter = ('exam_type',)
    ordering = ('-created_at',)
    list_per_page = 10

admin.site.register(ExamPaper, ExamPaperAdmin)
