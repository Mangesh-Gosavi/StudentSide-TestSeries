from django.shortcuts import render
from user_management.models.studymaterial_model import StudyMaterial
from user_management.serializers.studymaterial_serializer import StudyMaterialSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class StudyMaterialView(APIView):  
    def get(self, request):
        materials = StudyMaterial.objects.all()
        serializer = StudyMaterialSerializer(materials, many=True)
        return Response(serializer.data)  
