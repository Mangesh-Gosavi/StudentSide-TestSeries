from django.db import models

class ExamPaper(models.Model):
    EXAM_CHOICES = [
        ('JEE', 'JEE Mains'),
        ('NEET', 'NEET'),
        ('MHT-CET', 'MHT-CET'),
    ]

    exam_type = models.CharField(max_length=10, choices=EXAM_CHOICES)
    num_questions = models.IntegerField()
    exam_duration = models.IntegerField(help_text="Duration in minutes")
    total_marks = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exam_type} - {self.num_questions} Questions"


