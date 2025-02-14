from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from user_management.views.organization_viewset import OrganizationViewSet
from user_management.views.batch_viewset import BatchViewSet
from user_management.views.student_viewset import StudentViewSet
from user_management.views.bookmarkquestion_viewset import BookmarkQuestionview
from user_management.views.studentreport_viewset import StudentReportview
from user_management.views.scheduledpaper_viewset import ScheduledPaperview
from user_management.views.studentresult_viewset import StudentResultview
from user_management.views.studymaterial_viewset import StudyMaterialView

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'batches', BatchViewSet, basename='batch')
router.register(r'students', StudentViewSet, basename='student')

# Create nested router for organization-batches
organization_router = NestedDefaultRouter(
    router,
    r'organizations',
    lookup='organization'
)
organization_router.register(
    r'batches',
    BatchViewSet,
    basename='organization-batches'
)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(organization_router.urls)),
    path('bookmarkquestion/', BookmarkQuestionview.as_view(), name='bookmark_question'),
    path('studentreports/', StudentReportview.as_view(), name='student_report'),
    path('scheduledpaper/', ScheduledPaperview.as_view(), name='scheduled_paper'),
    path('results/', StudentResultview.as_view(), name='results'),
    path('studymaterial/', StudyMaterialView.as_view(), name='study-material-list'),
]