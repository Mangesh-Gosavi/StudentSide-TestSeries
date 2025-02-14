from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from user_management.serializers.scheduledpaper_serializer import ScheduledPaperSerializer
from rest_framework import status
from user_management.models.scheduledpaper_model import ScheduledPaper

class ScheduledPaperview(APIView):
    def get(self, request):
        questions = ScheduledPaper.objects.all()
        serializer = ScheduledPaperSerializer(questions, many=True)
        return Response(serializer.data, content_type="application/json")

    # def post(self, request):
    #     organization = "IItians"
    #     data = request.data
    #     total_marks = data.get('marks', 0)  
    #     print(data)

    #     # Loop through each question using the keys (index)
    #     for index in data:
    #         if index != 'marks' and index != 'organization':  
    #             question = data[index]
    #             print("question", question)

    #             exam_name = question.get('ExamName')
    #             paper_pattern = question.get('Paperpattern')
    #             question_id = question.get('id')

    #             # Create the paper entry with the question details
    #             paper_data = Papers.objects.create(
    #                 Organization=organization,
    #                 ExamName=exam_name,
    #                 Paperpattern=paper_pattern,
    #                 TotalMarks=total_marks,
    #                 Questionid=question_id,
    #             )

    #     return Response({"message": "Papers created successfully"}, status=status.HTTP_201_CREATED)






