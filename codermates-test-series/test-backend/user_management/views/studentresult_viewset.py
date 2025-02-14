from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from user_management.serializers.studentresult_serializer import StudentResultSerializer
from rest_framework import status
from user_management.models.studentresult_model import StudentResult

class StudentResultview(APIView):
    def get(self, request):
        questions = StudentResult.objects.all()
        serializer = StudentResultSerializer(questions, many=True)
        return Response(serializer.data, content_type="application/json")

    def post(self, request, *args, **kwargs):
        submission_data = request.data
        print("Submission Data:", submission_data)
        
        try:
            # Iterate over the responses and save them to the database
            for response in submission_data['responses']:
                print(f"Saving response for question: {response['Question']}")  # Log which question is being processed
                result = StudentResult.objects.create(
                    StudentId=submission_data['StudentId'],
                    TestId=submission_data['TestId'],
                    Examname=submission_data['Examname'],
                    Question=response['Question'],
                    Answer=response['Answer'],
                    Marks=response['Marks'],
                    Status=response['Status'],
                    ObtainedMarks=submission_data['ObtainedMarks'],
                    TotalMarks=submission_data['TotalMarks'],
                    TestDuration=submission_data['TestDuration'],
                    TimeTaken=response['TimeTaken'],
                )

            return Response({'message': 'Test result submitted successfully!'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error occurred while processing submission: {str(e)}")  # Log the error message
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


