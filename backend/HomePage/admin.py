from django.contrib import admin
from .models import ProductSection,BannerSection,HomePage,BannerImages,NewsPopUp
# Register your models here.
admin.site.register(ProductSection)
admin.site.register(NewsPopUp)
admin.site.register(BannerSection)
admin.site.register(BannerImages)
admin.site.register(HomePage)