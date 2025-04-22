from django.urls import path
from .views import HomePageView, NewsPopUpView
urlpatterns = [
    path('home/', HomePageView.as_view()),
    path('newspopup/', NewsPopUpView.as_view()),
]