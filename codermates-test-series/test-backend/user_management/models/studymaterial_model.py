from django.db import models

class StudyMaterial(models.Model):
    Subject = models.CharField(max_length=100)
    Name = models.CharField(max_length=255)
    Url = models.CharField(max_length=255)

def __str__(self):
    return f"{self.Subject} - {self.Name}- {self.Url}"
