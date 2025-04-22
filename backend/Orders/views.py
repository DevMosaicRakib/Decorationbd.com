from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order,OrderItem
from .serializer import OrderSerializer
from Cart.models import Cart
from Cart.serializer import CartSerializer
from customerSection.models import CustomerShippingAddress
from decimal import Decimal
from Coupon.models import Coupon
# from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
from .bkash_payment import BkashPaymentService
import json
from Cart.views import _cart_session_id
from Users.models import User
from django.conf import settings
from EmailTemplate.SendEmailAllTypesFuction import send_create_user_message_for_admin,send_welcome_email

class checkoutView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        if user:
            carts = Cart.objects.filter(user=user,is_checked = True)
        else:
            cus_device = request.headers.get('device')
            carts = Cart.objects.filter(device=cus_device,is_checked = True)    

        if not carts.exists():
            return Response({'error': 'No items selected for checkout'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def patch(self, request):
        try:
            user = request.user if request.user.is_authenticated else None
            cart_item_id = request.data.get('cartId')
            quantity = int(request.data.get('quantity'))
            if user:
                cart_item = Cart.objects.get(id=cart_item_id, user=user,is_checked = True)
            else:
                cus_device = request.headers.get('device')
                cart_item = Cart.objects.get(id=cart_item_id, device=cus_device,is_checked = True)    
            if quantity >= 1:
                cart_item.quantity = quantity
                cart_item.save()
                serializer = CartSerializer(cart_item)
                return Response({"data": serializer.data, "message": "Cart item updated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Sorry ! Cart item quantity cannot be zero.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    



class PlaceOrderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None

        # Retrieve or create cart items based on user or session
        if user:
            cart_items = Cart.objects.filter(user=user, is_checked=True)
        else:
            cus_device = request.headers.get('device')
            cart_items = Cart.objects.filter(device=cus_device, is_checked=True)

        if not cart_items.exists():
            return Response({'error': 'No items in cart'}, status=400)
        
        # Handle case for guest users
        if not user:
            shipping_address_data = request.data.get('shipping_address')
            if not shipping_address_data or 'email' not in shipping_address_data:
                return Response({'error': 'Email is required for guest users'}, status=400)

            email = shipping_address_data['email']
            
            # Check if a user already exists with the provided email
            user = User.objects.filter(email=email).first()
            
            # If no user exists, create a new one with a dummy password
            if not user:
                dummy_password = settings.SOCIAL_AUTH_PASSWORD
                user = User.objects.create_user( 
                    username=email.split('@')[0],
                    email=email, 
                    password=dummy_password,
                    password2=dummy_password
                )
                owner = User.objects.get(is_admin=True)
                ownername = owner.username
                username = user.username
                user_email = user.email
                user_data = {
                    'username':username
                }
                user_and_owner_data = {
                'username':username,
                'user_email':user_email,
                'ownername':ownername
                }
                # send_welcome_email(user_email,user_data)
                # send_create_user_message_for_admin(user_and_owner_data)
                



        # Handle shipping address
        shipping_address_id = request.data.get('shipping_address_id')
        if shipping_address_id:
            try:
                shipping_address = CustomerShippingAddress.objects.get(id=shipping_address_id, user=user)
                shipping_address_data = request.data.get('shipping_address', {})
                for attr, value in shipping_address_data.items():
                    setattr(shipping_address, attr, value)
                shipping_address.save()
            except CustomerShippingAddress.DoesNotExist:
                return Response({'error': 'Invalid shipping address'}, status=400)
        else:
            shipping_address_data = request.data.get('shipping_address')
            if shipping_address_data:
                shipping_address_data['user'] = user
                shipping_address = CustomerShippingAddress.objects.create(**shipping_address_data)
            else:
                return Response({'error': 'Shipping address is required'}, status=400)

        # Handle payment method
        payment_method = request.data.get('payment_method')
        if payment_method not in [pm[0] for pm in Order.PAYMENT_METHOD]:
            return Response({'error': 'Invalid payment method'}, status=400)

        total_price = request.data.get('totalPrice')
        partial_cod = request.data.get('pcod')
        for_order_confirmation = request.data.get('orderConfirmation')
        after_partial_cod_remain_total_price = request.data.get('afterRemainTotal')

        # Create a new order
        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            payment_method=payment_method,
            total_price=total_price,
            after_partial_cod_remain_total_price=after_partial_cod_remain_total_price,
            partial_cod=partial_cod,
            for_order_confirmation=for_order_confirmation,
        )

        # Create order items from cart items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                ordered_product_variant=cart_item.variant,
                quantity=cart_item.quantity
            )

        # Save the order to update the many-to-many relationship
        order.save()

        # Refresh from the database to get updated data
        order.refresh_from_db()

        # Now, delete the cart items after they are added to the order
        cart_items.delete()

        # Handle payment processing
        if payment_method == 'Full Payment':
            bkash_service = BkashPaymentService()
            payment_data = bkash_service.create_payment(total_price)

            if payment_data.get('paymentID') and payment_data.get('bkashURL'):
                order.payment_id = payment_data['paymentID']
                order.save()
                return JsonResponse(payment_data)

        elif payment_method == 'Cash on Delivery':
            bkash_service = BkashPaymentService()
            payment_data = bkash_service.create_payment(for_order_confirmation)

            if payment_data.get('paymentID') and payment_data.get('bkashURL'):
                order.payment_id = payment_data['paymentID']
                order.save()
                return JsonResponse(payment_data)

        # Serialize and return the order
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)







class AllOrdersView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        items = Order.objects.filter(user=user)
        serializer = OrderSerializer(items,many=True)
        return Response(serializer.data,status=200)   


class AddCouponToCheckout(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        if user:
            cart_items = Cart.objects.filter(user=user,is_checked = True)
        else:
            cus_device = request.headers.get('device')
            cart_items = Cart.objects.filter(device=cus_device,is_checked = True)
        # user = request.user
        # cart_items = Cart.objects.filter(user=user)

        if not cart_items.exists():
            return Response({'error': 'No items in cart'}, status=400)

        # Calculate the total price of items in the cart
        cart_serializer = CartSerializer(cart_items, many=True)
        total_price = Decimal(cart_serializer.data[0].get('total_price'))

        # Apply a new coupon
        coupon_code = request.data.get('coupon')
        if not coupon_code:
            return Response({'msg': 'Coupon code not provided'}, status=400)
        
        coupon = Coupon.objects.filter(code=coupon_code, active=True).first()
        if not coupon:
            return Response({'msg': 'Invalid or inactive coupon'}, status=400)
        
        # Check if a coupon is already applied to any cart item
        existing_coupon = next((item.coupon for item in cart_items if item.coupon), None)

        if existing_coupon:
            return Response({'msg': 'Coupon already used in cart'}, status=400)
        

        
        # cart_items = Cart.objects.filter(user=user, is_checked = True)
        # if not cart_items.exists():
            # return Response({'msg': 'No items in cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Apply coupon to each cart item
        for item in cart_items:
            item.coupon = coupon
            item.coupon_applied = True
            item.save()

        # Serialize the updated cart items
        cart_serializer = CartSerializer(cart_items, many=True)

        # Calculate total price before discount
        total_price = Decimal(cart_serializer.data[0]['total_price'])

        return Response({
            'total_price': total_price,
            'cart_items': cart_serializer.data
        }, status=status.HTTP_200_OK)

# For bkash payment...

# def bkash_payment_create(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             amount = data.get('amount')
            
#             if not amount:
#                 return JsonResponse({'error': 'Amount is required.'}, status=400)
            
#             bkash_service = BkashPaymentService()
#             payment_data = bkash_service.create_payment(amount)
#             return JsonResponse(payment_data)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        

def bkash_payment_callback(request):
    status = request.GET.get('status')
    payment_id = request.GET.get('paymentID')

    if not payment_id:
        return JsonResponse({"error": "Missing paymentID"}, status=400)

    bkash_service = BkashPaymentService()
    return bkash_service.call_back(status, payment_id)        
        








