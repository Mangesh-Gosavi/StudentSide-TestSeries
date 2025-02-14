from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from user_management.serializers.studentreport_serializer import StudentReportSerializer
from rest_framework import status
from user_management.models.studentreport_model import StudentReport

class StudentReportview(APIView):
    def get(self, request):
        questions = StudentReport.objects.all()
        serializer = StudentReportSerializer(questions, many=True)
        return Response(serializer.data, content_type="application/json")

    def post(self, request):
        serializer = StudentReportSerializer(data=request.data)
        if serializer.is_valid():
            # Save the new report to the database
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # If the data is not valid, return error response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






