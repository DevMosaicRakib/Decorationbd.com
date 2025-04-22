from django.db import models

# Create your models here.

class OflineOrders(models.Model):
    ORDER_CREATE_PLATFORM = (
        ('My Fb Page','My Fb Page'),
        ('My WA','My WA'),
        ('My Others','My Others'),
        ('Rakib','Rakib'),
        ('Rupu','Rupu'),
    )
    ORDER_STATUS = (
        ('Delivered','Delivered'),
        ('Returned','Returned'),
        ('Cancelled','Cancelled'),
    )
    Date = models.DateTimeField(auto_now_add=True)
    # customer_name = models.CharField(max_length=250)
    # phone_number=models.CharField(max_length=100)
    Name_Number = models.TextField(max_length=250,null=True)
    Address = models.CharField(max_length=250)
    Model = models.CharField(max_length=100)
    Total_price = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    adv_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False,null=True)  # Non-editable
    extra_cost = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    exact_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False,null=True) # Non-editable
    customization = models.CharField(max_length=250,null=True,blank=True)
    From_Order = models.CharField(max_length=250, choices=ORDER_CREATE_PLATFORM, null=True)
    status = models.CharField(max_length=250, choices=ORDER_STATUS, null=True)

    def __str__(self):
        return f"Offline Order - {self.Name_Number} ({self.From_Order})"

    @property
    def formatted_created_date(self):
        return format(self.created, 'j F, Y, g:i A') 


