from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user_management/', include('user_management.urls')),
    path('api/', include('question_management.urls')),
    path('auto-paper/', include('auto_paper.urls')),
    path('partial-question-management/', include('partial_question_management.urls')),
]