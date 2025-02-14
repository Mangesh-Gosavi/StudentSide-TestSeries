from django.db import models

class StudentReport(models.Model):
    StudentId = models.CharField(max_length=255, null=True, blank=True)
    ScheduledBy = models.CharField(max_length=255, null=True, blank=True)
    TestStartTime = models.DateTimeField(auto_now_add=True)
    TestDuration = models.CharField(max_length=255)
    PaperDescription = models.CharField(max_length=255)
    QuestionId = models.CharField(max_length=255, null=True, blank=True)
    Report = models.CharField(max_length=255, null=True, blank=True)


def __str__(self):
    return f"{self.ScheduledBy} - {self.ScheduledBy} - {self.TestStartTime} - {self.TestDuration} - {self.PaperDescription} - {self.QuestionId} -  - {self.Report}"