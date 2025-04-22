from rest_framework import serializers
from .models import Order,OrderItem
from Cart.serializer import CartSerializer
from Products.serializers import ProductSerializer
from customerSection.serializers import CustomerShippingAddressSerializer
from Coupon.serializer import CouponSerializer
# class OrderSerializer(serializers.ModelSerializer):
#     order_items = CartSerializer(many=True, read_only=True)
#     shipping_address = CustomerShippingAddressSerializer()
#     created = serializers.DateTimeField(read_only=True)
#     delivery_date = serializers.DateTimeField(read_only=True)
#     coupon = CouponSerializer(read_only=True)

#     class Meta:
#         model = Order
#         fields = ['id', 'user', 'order_items', 'created', 'shipping_address', 'payment_method', 'status',
#                    'total_price','after_partial_cod_remain_total_price','partial_cod','for_order_confirmation', 'coupon', 'coupon_applied', 
#                    'payment_status','paid_amount','delivery_date']
#         read_only_fields = ['id', 'created', 'delivery_date']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'ordered_product_variant']

class OrderSerializer(serializers.ModelSerializer):
    formatted_created_date = serializers.CharField(read_only=True)
    order_items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = CustomerShippingAddressSerializer()
    delivery_date = serializers.DateTimeField(read_only=True)
    coupon = CouponSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_items', 'formatted_created_date', 'shipping_address', 
                  'payment_method', 'status', 'total_price', 
                  'after_partial_cod_remain_total_price', 'partial_cod', 
                  'for_order_confirmation','coupon', 'coupon_applied', 
                  'payment_status', 'paid_amount', 'delivery_date']
        read_only_fields = ['id', 'formatted_created_date', 'delivery_date']

