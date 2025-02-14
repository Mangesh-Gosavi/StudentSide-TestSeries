from django.db import models

class StudentResult(models.Model):
    StudentId = models.CharField(max_length=255, null=True, blank=True)
    TestId = models.CharField(max_length=255, null=True, blank=True)
    Examname = models.CharField(max_length=255)
    Question = models.CharField(max_length=255)
    Answer = models.CharField(max_length=255)
    Marks = models.CharField(max_length=255, null=True, blank=True)
    ObtainedMarks = models.CharField(max_length=255, null=True, blank=True)
    TotalMarks = models.CharField(max_length=255, null=True, blank=True)
    Status = models.CharField(max_length=255)
    TestDuration = models.CharField(max_length=255, null=True, blank=True)
    DateTime = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    TimeTaken = models.CharField(max_length=255)


def __str__(self):
    return f"{self.StudentId} - {self.TestId} - {self.Examname} - {self.Question} - {self.Answer} - {self.ObtainedMarks} -  {self.TotalMarks} - {self.Marks} - {self.Status} - {self.TestDuration} - {self.DateTime} -  {self.TimeTaken}"







