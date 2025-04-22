from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from CategoryAndSubcategory.models import *
# Create your models here.

STOCK_STATUS = (
    ("In Stock","In Stock"),
    ("On Sale", "On Sale"),
)

class Product(models.Model):
    name = models.CharField(max_length=100)
    # price = models.DecimalField(decimal_places=2, max_digits=10)
    # discount_price = models.DecimalField(decimal_places=2, max_digits=10)
    description = RichTextUploadingField()
    Category = models.ForeignKey(Category, on_delete=models.CASCADE)
    Sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    tags = models.CharField(max_length=100)
    stock = models.CharField(choices=STOCK_STATUS,max_length=100)
    model_no = models.CharField(max_length=250,null=True,blank=True)
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name='product_imgs')    
    images = models.ImageField(upload_to='products/')
    def __str__(self):
        return self.product.name
    

Product_VariantType = (
    ("Size","Size"),
    ("Color","Color"),
    ("Others","Others"),
    ("Stand Mount System","Stand Mount System"),
)


class ProductVariant(models.Model):
    """Represents the actual variant of a product, e.g., Red, Large"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants',null=True,blank=True)
    variant_type = models.CharField(choices=Product_VariantType,max_length=100,null=True,blank=True)
    value = models.CharField(max_length=100,default='standard')  # e.g., Red, Large
    price = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)
    discount_price = models.DecimalField(decimal_places=2, max_digits=10, default=0.00)

    def __str__(self):
        return self.value

class ProductVariantImage(models.Model):
    """Represents the images for a specific product variant"""
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images')
    images = models.ImageField(upload_to='variant_images/')

    def __str__(self):
        return f"{self.variant.value}"








class FeaturedProduct(models.Model):
    title = models.CharField(max_length=250,null=True,blank=True)
    product = models.ManyToManyField(Product,related_name='featured_product')        