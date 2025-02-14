from django.urls import path
from .views import FilterQuestionsView

urlpatterns = [
    path('filter-questions/', FilterQuestionsView.as_view(), name='filter_questions'),
]
