from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from user_management.serializers.bookmarkquestions_serializer import BookmarkQuestionSerializer
from rest_framework import status
from user_management.models.bookmarkedquestions_model import BookmarkQuestion

class BookmarkQuestionview(APIView):
    def get(self, request):
        questions = BookmarkQuestion.objects.all()
        serializer = BookmarkQuestionSerializer(questions, many=True)
        return Response(serializer.data, content_type="application/json")

    def post(self, request):
        print("Request Data:", request.data)  # Add logging to see the incoming data
        serializer = BookmarkQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Question bookmarked successfully!"}, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)  # Print out serializer validation errors
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


