from django.db import models
import uuid

class Question(models.Model):
    EXAM_CHOICES = [
        ('JEE', 'JEE'),
        ('NEET', 'NEET'),
        ('MHT CET', 'MHT CET'),
    ]
    
    SUBJECT_CHOICES = [
        ('Mathematics', 'Mathematics'),
        ('Chemistry', 'Chemistry'),
        ('Physics', 'Physics'),
        ('Biology','Biology')
    ]
    
    DIFFICULTY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    
    QUESTION_TYPE_CHOICES = [
        ('MCQ', 'MCQ'),
        ('Descriptive', 'Descriptive'),
        ('Numericals', 'Numericals'),
    ]

    que_id = models.CharField(max_length=36, primary_key=True, editable=False)
    exam = models.CharField(max_length=50, choices=EXAM_CHOICES)
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
    area = models.CharField(max_length=100)
    chapter = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    question_text = models.TextField()
    options = models.JSONField()  
    correct_answer = models.CharField(max_length=1) 
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)
    is_used = models.BooleanField(default=False)
    explain = models.TextField(blank=True, null=True)
    marks = models.FloatField()
    prev_year = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Question {self.que_id} - {self.question_text}"


from django.db import models
import uuid

class Exam(models.Model):
    test_id = models.UUIDField(default=uuid.uuid4, editable=False)  
    org_id = models.CharField(max_length=255)  
    exam_name = models.CharField(max_length=255)
    exam_duration = models.CharField(max_length=50) 
    total_marks = models.IntegerField()
    subject_questions = models.JSONField()
    marking_scheme = models.JSONField() 
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.exam_name


class ExamQuestion(models.Model):
    exam = models.ForeignKey(Exam, related_name="questions", on_delete=models.CASCADE)
    que_id = models.CharField(max_length=255, default=uuid.uuid4, editable=False)
    subject = models.CharField(max_length=255) 
    area = models.CharField(max_length=255) 
    chapter = models.CharField(max_length=255) 
    topic = models.CharField(max_length=255) 
    question_text = models.TextField()
    options = models.JSONField() 
    correct_answer = models.CharField(max_length=1)
    question_type = models.CharField(max_length=20)
    difficulty = models.CharField(max_length=10)
    is_used = models.BooleanField() 
    explain = models.TextField() 
    marks = models.FloatField() 
    prev_year = models.BooleanField() 
    created_at = models.DateTimeField()  

    def __str__(self):
        return f"Question {self.id} for {self.exam.exam_name}"







