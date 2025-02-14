# urls.py
from django.urls import path
from question_management.views import CSVUploadView
from question_management.views import FilterQuestionsView
from question_management.views import ExamCreateView
from question_management.views import ExamListView
from question_management.views import DynamicDropdownView
from question_management.views import MultiSelectDynamicDropdownView
from question_management.views import ExamFetchView

urlpatterns = [
    path('upload-csv/', CSVUploadView.as_view(), name='upload-csv'),
    path('filter-questions/', FilterQuestionsView.as_view(), name='filter-questions'),
    path('create-exam/', ExamCreateView.as_view(), name='create-exam'),
    path('exams/<str:org_id>', ExamListView.as_view(), name='exam-list'),
    path('dynamic-dropdown/', DynamicDropdownView.as_view(), name='dynamic-dropdown'),
    path('multi-select-dropdown/', MultiSelectDynamicDropdownView.as_view(), name='multi-select-dropdown'),
    path('exams/<uuid:test_id>/', ExamFetchView.as_view(), name='exam-fetch'),
]

