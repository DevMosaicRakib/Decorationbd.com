from django.db import models
from Users.models import User
from Products.models import Product, ProductVariant
from Coupon.models import Coupon
# Create your models here.

class DeliverCharge(models.Model):
    delivery_charge = models.CharField(max_length=50)

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="carts", null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True, related_name="cart_variants")
    device = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    coupon = models.ForeignKey(Coupon, null=True, blank=True, on_delete=models.SET_NULL)
    coupon_applied = models.BooleanField(default=False)
    is_checked = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} - {self.variant.value if self.variant else 'No Variant'}"

    @property
    def sub_total(self):
        # Calculate using the variant's discount price
        price = self.variant.discount_price if self.variant and self.variant.discount_price else 0
        return self.quantity * price

