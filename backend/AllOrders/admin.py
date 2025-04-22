from django.contrib import admin
from django.utils.html import format_html
from datetime import datetime
from .models import OflineOrders  # Import your model
from django.utils import timezone

@admin.register(OflineOrders)
class OflineOrdersAdmin(admin.ModelAdmin):
    list_display = ('id','Name_Number','Address', 'Model', 'Total_price','adv_amount','due_amount','extra_cost','exact_total','customization','From_Order','status', 'formatted_created_date', 'print')
    list_filter = ('Date', 'From_Order','status')  # You can add any other filters you need
    search_fields = ('Name_Number', 'Model')  # Keep regular search fields
    date_hierarchy = 'Date'
    ordering = ('-Date',)

    def formatted_created_date(self, obj):
        return obj.Date.strftime('%d/%m/%y')  # Day/Month/Year in two digits
    formatted_created_date.admin_order_field = 'Date'  # Sort by actual 'created' field
    formatted_created_date.short_description = 'Date'  # This will show "Date" as the column header

    def print(self, obj):
        return format_html(
            '<button style="font-size:12px; background-color: #6c757d; color: white; border: none; padding: 5px 5px; margin-bottom: 5px;" '
            '>Print </button><br>'
            # '<button style="font-size:13px;background-color: #6c757d; color: white; border: none; padding: 5px 5px;" '
            # '>Print Inv</button>',           
        )

    # Automatically calculate due_amount and exact_total
    def save_model(self, request, obj, form, change):
        # Calculate due amount
        obj.due_amount = obj.Total_price - obj.adv_amount

        # Calculate exact total
        obj.exact_total = obj.Total_price - obj.extra_cost

        # Call the parent method to save the object
        super().save_model(request, obj, form, change)    

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        search_value = request.GET.get('q')

        if search_value:
            search_value = search_value.strip()

            try:
                if ' - ' in search_value:
                    # Split the date range
                    start_date_str, end_date_str = search_value.split(' - ')
                    start_date = timezone.datetime.strptime(start_date_str.strip(), '%d/%m/%Y')
                    end_date = timezone.datetime.strptime(end_date_str.strip(), '%d/%m/%Y')

                    # Make both dates timezone aware
                    start_date = timezone.make_aware(start_date)
                    end_date = timezone.make_aware(end_date)

                    # Print debugging info
                    print("Date Range:", start_date, end_date)

                    # Filter queryset by date range (inclusive)
                    return qs.filter(created__range=(start_date, end_date + timezone.timedelta(days=1)))

                # Handle single date search
                search_date = timezone.datetime.strptime(search_value, '%d/%m/%Y')
                search_date = timezone.make_aware(search_date)  # Make timezone aware

                # Print debugging info
                print("Single Date:", search_date)
                
                filtered_qs = qs.filter(created__date=search_date)
                print("Queryset Count:", filtered_qs.count())  # Debug print
                return filtered_qs

            except ValueError as e:
                print("ValueError:", e)  # Debug print
                return qs

        return qs

    class Media:
        css = {
            'all': ('custom_admin/admin.css',)
        }
        js = (
            'https://code.jquery.com/jquery-3.6.0.min.js',
            'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
            'custom_admin/admin.js',  # Append a version
        )

