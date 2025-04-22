from rest_framework import serializers
from CategoryAndSubcategory.serializers import CategorySerializer,SubCategorySerializer
from .models import NewsPopUp, ProductSection, BannerSection, BannerImages, HomePage

class ProductSectionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True,read_only=True)
    sub_category = SubCategorySerializer(many=True,read_only=True)
    class Meta:
        model = ProductSection
        fields = ['id', 'title', 'category', 'sub_category','product_section_type','product_limitation','show_categorywise_product','show_subcategorywise_product']

class BannerImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannerImages
        fields = ['id', 'title', 'images']

class NewsPopUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsPopUp
        fields = ['id', 'active', 'popupSpeech']

class BannerSectionSerializer(serializers.ModelSerializer):
    banner_images = BannerImagesSerializer(many=True)

    class Meta:
        model = BannerSection
        fields = ['id', 'title', 'banner_images', 'banner_type']

class HomePageSerializer(serializers.ModelSerializer):
    product_section = ProductSectionSerializer(many=True, read_only=True)
    banner_section = BannerSectionSerializer(many=True, read_only=True)

    class Meta:
        model = HomePage
        fields = ['id', 'product_section', 'banner_section']

