from django.urls import path
from .views import generate_exam_paper, get_all_papers

urlpatterns = [
    path('generate-paper/', generate_exam_paper, name='generate_exam_paper'),
    path('exam-papers/', get_all_papers, name='get_all_papers'),
]
