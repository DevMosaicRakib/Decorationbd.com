from django.shortcuts import render
from .models import HomePage, NewsPopUp
from .serializer import HomePageSerializer, NewsPopUpSerializer
from rest_framework.views import APIView 
from rest_framework.response import Response
# Create your views here.

class HomePageView(APIView):
    def get(self,request):
        homepagedata = HomePage.objects.all()
        serializer = HomePageSerializer(homepagedata,many=True)
        return Response(serializer.data)

class NewsPopUpView(APIView):
    def get(self,request):
        newsdata = NewsPopUp.objects.all()
        serializer = NewsPopUpSerializer(newsdata,many=True)
        return Response(serializer.data)