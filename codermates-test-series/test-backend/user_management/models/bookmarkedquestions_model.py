from django.db import models

class BookmarkQuestion(models.Model):
    StudentId = models.CharField(max_length=255, null=True, blank=True)
    TestId = models.CharField(max_length=255)
    TestDateTime = models.DateTimeField(auto_now_add=True)
    BookmarkDateTime = models.DateTimeField(auto_now_add=True)
    Subject = models.CharField(max_length=255)
    Chapter = models.CharField(max_length=255)
    QuestionId = models.CharField(max_length=255, null=True, blank=True)
    Comments = models.CharField(max_length=255)


def __str__(self):
    return f"{self.StudentId} - {self.TestId} - {self.TestDateTime} - {self.BookmarkDateTime} - {self.Subject} -  {self.Chapter} - {self.QuestionId} - {self.Comments}"