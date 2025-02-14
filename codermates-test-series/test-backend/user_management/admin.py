from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Organization, Batch, Student, User

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'is_staff', 'is_developer', 'date_joined')
    list_filter = ('is_staff', 'is_developer', 'date_joined')
    search_fields = ('email', 'username')
    readonly_fields = ('date_joined',)

admin.site.register(User, UserAdmin)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'max_students', 'student_count', 'batch_count', 'created_at', 'username')
    list_filter = ('created_at',)
    search_fields = ('name', 'username')
    readonly_fields = ('created_at',)

    def student_count(self, obj):
        count = obj.students.count()
        url = reverse('admin:user_management_student_changelist') + f'?organization__id={obj.id}'
        return format_html('<a href="{}">{} students</a>', url, count)
    student_count.short_description = 'Students'

    def batch_count(self, obj):
        count = obj.batches.count()
        url = reverse('admin:user_management_batch_changelist') + f'?organization__id={obj.id}'
        return format_html('<a href="{}">{} batches</a>', url, count)
    batch_count.short_description = 'Batches'

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('students', 'batches')

@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization_link', 'student_count', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at', 'organization')
    search_fields = ('name', 'organization__name')
    readonly_fields = ('created_at',)
    raw_id_fields = ('organization',)

    def student_count(self, obj):
        count = obj.students.count()
        url = reverse('admin:user_management_student_changelist') + f'?batch__id={obj.id}'
        return format_html('<a href="{}">{} students</a>', url, count)
    student_count.short_description = 'Students'

    def organization_link(self, obj):
        url = reverse('admin:user_management_organization_change', args=[obj.organization.id])
        return format_html('<a href="{}">{}</a>', url, obj.organization.name)
    organization_link.short_description = 'Organization'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('organization').prefetch_related('students')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'get_email', 'organization_link', 'batch_link', 'is_active', 'created_at', 'username')
    list_filter = ('is_active', 'created_at', 'organization', 'batch')
    search_fields = ('first_name', 'last_name', 'email', 'organization__name', 'batch__name', 'user__username')
    readonly_fields = ('created_at',)
    raw_id_fields = ('organization', 'batch')
    actions = ['activate_students', 'deactivate_students', 'remove_from_batch']

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Name'

    def organization_link(self, obj):
        url = reverse('admin:user_management_organization_change', args=[obj.organization.id])
        return format_html('<a href="{}">{}</a>', url, obj.organization.name)
    organization_link.short_description = 'Organization'

    def batch_link(self, obj):
        if obj.batch:
            url = reverse('admin:user_management_batch_change', args=[obj.batch.id])
            return format_html('<a href="{}">{}</a>', url, obj.batch.name)
        return '-'
    batch_link.short_description = 'Batch'

    def username(self, obj):
        return obj.user.username
    username.short_description = 'Username'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

    def activate_students(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} students have been activated.')
    activate_students.short_description = 'Activate selected students'

    def deactivate_students(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} students have been deactivated.')
    deactivate_students.short_description = 'Deactivate selected students'

    def remove_from_batch(self, request, queryset):
        updated = queryset.update(batch=None)
        self.message_user(request, f'{updated} students have been removed from their batches.')
    remove_from_batch.short_description = 'Remove selected students from their batches'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('organization', 'batch').prefetch_related('user')

    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'username')
        }),
        ('Organization Details', {
            'fields': ('organization', 'batch')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at')
        }),
    )

from user_management.models.bookmarkedquestions_model import BookmarkQuestion
from user_management.models.studentreport_model import StudentReport
from user_management.models.scheduledpaper_model import ScheduledPaper
from user_management.models.studentresult_model import StudentResult
from user_management.models.studymaterial_model import StudyMaterial


@admin.register(BookmarkQuestion)
class BookmarkQuestionAdmin(admin.ModelAdmin):
    list_display = ('StudentId', 'TestId', 'Subject', 'TestDateTime', 'BookmarkDateTime', 'Subject', 'Chapter', 'QuestionId' ,'Comments') 

@admin.register(StudentReport)
class StudentReportAdmin(admin.ModelAdmin):
    list_display = ('StudentId', 'ScheduledBy', 'TestStartTime', 'TestDuration', 'PaperDescription','QuestionId', 'Report') 

@admin.register(ScheduledPaper)
class ScheduledPaperAdmin(admin.ModelAdmin):
    list_display = ('StudentId', 'TestId', 'ScheduledBy', 'TestStartTime', 'TestEndTime', 'TestDuration', 'PaperDescription', 'Status', 'Comments') 

@admin.register(StudentResult)
class StudentResultAdmin(admin.ModelAdmin):
    list_display = ('StudentId', 'TestId', 'Examname', 'Question', 'Answer', 'Marks', 'ObtainedMarks', 'TotalMarks' , 'Status', 'TestDuration', 'DateTime','TimeTaken') 

@admin.register(StudyMaterial) 
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ('Subject', 'Name', 'Url')