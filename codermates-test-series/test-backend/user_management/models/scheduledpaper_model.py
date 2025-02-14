from django.db import models

class ScheduledPaper(models.Model):
    StudentId = models.CharField(max_length=255, null=True, blank=True)
    TestId = models.CharField(max_length=255)
    ScheduledBy = models.CharField(max_length=255)
    TestStartTime = models.CharField(max_length=255)
    TestEndTime	= models.CharField(max_length=255)
    TestDuration = models.CharField(max_length=255)
    PaperDescription = models.CharField(max_length=255)
    Status = models.CharField(max_length=255)
    Comments = models.CharField(max_length=255)


def __str__(self):
    return f"{self.StudentId} - {self.TestId} - {self.ScheduledBy} - {self.TestStartTime} -  {self.TestEndTime} - {self.TestDuration} - {self.PaperDescription} - {self.Status} - {self.Comments}"