from django.db import models
from CategoryAndSubcategory.models import Category,SubCategory
# Create your models here.


BANNER_SECTION_TYPE = [
    ('normal','normal'),
    ('logo','logo'),
    ('service','service'),
    ('offer','offer')
]

PROUCT_SECTION_TYPE = [
    ('normal','normal'),
    ('multiple','multiple'),
    ('other','other'),
]
PRODUCT_LIMITATION = [(str(i), str(i)) for i in range(1, 31)]


class NewsPopUp(models.Model):
    active = models.BooleanField(default=True)
    popupSpeech = models.TextField(max_length=300)

class ProductSection(models.Model):
    title = models.CharField(max_length=250)
    category = models.ManyToManyField(Category, related_name='categories', blank=True)
    sub_category = models.ManyToManyField(SubCategory, related_name='subcategories', blank=True)
    product_section_type = models.CharField(max_length=250,choices=PROUCT_SECTION_TYPE, null = True, blank = True)
    product_limitation = models.CharField(max_length=2,choices=PRODUCT_LIMITATION,null=True,blank=True)
    show_categorywise_product = models.BooleanField(default=False)
    show_subcategorywise_product = models.BooleanField(default=False)
    def __str__(self):
        return self.title

class BannerImages(models.Model):
    title = models.CharField(max_length=250)
    images = models.ImageField(upload_to='homebanner/')

    def __str__(self):
        return self.title

class BannerSection(models.Model):
    title = models.CharField(max_length=250)
    banner_images = models.ManyToManyField(BannerImages,related_name='banner_images')
    banner_type = models.CharField(max_length=250,choices=BANNER_SECTION_TYPE, null = True, blank = True)

    def __str__(self):
        return self.title

class HomePage(models.Model):
    product_section = models.ManyToManyField(ProductSection, related_name='home_product_sections', blank=True)
    banner_section = models.ManyToManyField(BannerSection, related_name='home_banner_sections', blank=True)