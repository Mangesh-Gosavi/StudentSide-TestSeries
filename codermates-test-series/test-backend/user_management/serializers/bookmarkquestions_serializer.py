from rest_framework import serializers
from user_management.models.bookmarkedquestions_model import BookmarkQuestion

class BookmarkQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookmarkQuestion
        fields = '__all__'