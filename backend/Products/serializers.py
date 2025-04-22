from rest_framework import serializers
from .models import Product, ProductImage,FeaturedProduct, ProductVariant, ProductVariantImage
from CategoryAndSubcategory.serializers import CategorySerializer, SubCategorySerializer


class ProductVariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariantImage
        fields = ('id', 'variant','images')


class ProductVariantSerializer(serializers.ModelSerializer):
    images = ProductVariantImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ('id', 'variant_type', 'value', 'price', 'discount_price','images')


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'images')

class ProductSerializer(serializers.ModelSerializer):
    description = serializers.ReadOnlyField()
    product_imgs = ProductImageSerializer(many=True)
    Category = CategorySerializer(read_only=True)
    Sub_category = SubCategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'Category', 'Sub_category', 'tags', 'stock','product_imgs','model_no', 'variants')

class FeaturedProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=True,read_only=True)
    
    class Meta:
        model = FeaturedProduct
        fields = ('id', 'title','product')