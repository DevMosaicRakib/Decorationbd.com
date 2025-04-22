
// Add jQuery and jQuery UI dynamically
// var head = document.getElementsByTagName('head')[0];

// // Load jQuery
// var jq = document.createElement('script');
// jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
// head.appendChild(jq);

// Load jQuery UI
// var jqui = document.createElement('script');
// jqui.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
// head.appendChild(jqui);

// // Load jQuery UI CSS
// var css = document.createElement('link');
// css.href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
// css.rel = "stylesheet";
// head.appendChild(css);


// Ensure all DOM elements are fully loaded
// $(document).ready(function() {
//     // Toggle the visibility of the details section when clicking the button
//     $('.toggle-details').on('click', function() {
//         var detailsDiv = $('#details-' + $(this).data('id'));
//         detailsDiv.toggle();
//     });

//     // Initialize the date picker if the input exists
//     const dateInput = $('#datepicker');
//     if (dateInput.length) {
//         dateInput.datepicker({
//             dateFormat: 'yy-mm-dd',  // Format Django expects for the date filter
//             onSelect: function(dateText) {
//                 const form = dateInput.closest('form');
//                 form.submit();  // Automatically submit the form when a date is selected
//             }
//         });
//     }
// });


// $(document).ready(function() {
//     const dateInput = $('#datepicker');
//     if (dateInput.length) {
//         dateInput.datepicker({
//             dateFormat: 'yy-mm-dd',  // Ensure this format matches what your backend expects
//             onSelect: function(dateText) {
//                 // Auto-submit the form when a date is selected
//                 const form = dateInput.closest('form');
//                 form.submit();
//             }
//         });
//     }
// });

// $(document).ready(function() {
//     // Optional: Initialize the date picker
//     $('#your-datepicker-input').datepicker({
//         dateFormat: 'yy-mm-dd',  // Adjust the date format as needed
//     });
// });



// Add jQuery UI dynamically (without jQuery)
var head = document.getElementsByTagName('head')[0];

// Load jQuery UI CSS
var css = document.createElement('link');
css.href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
css.rel = "stylesheet";
head.appendChild(css);

// Load jQuery UI JS
var jqui = document.createElement('script');
jqui.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
jqui.onload = function() {
    // Initialize toggle and date picker functionality after jQuery UI is loaded
    document.addEventListener('DOMContentLoaded', function() {
        
        // Toggle the visibility of the details section when clicking the button
        document.querySelectorAll('.toggle-details').forEach(function(button) {
            button.addEventListener('click', function() {
                var id = button.getAttribute('data-id');
                var detailsDiv = document.getElementById('details-' + id);
                
                // Toggle visibility using a simple toggle and slide effect (CSS)
                if (detailsDiv.style.display === 'none' || detailsDiv.style.display === '') {
                    detailsDiv.style.display = 'block';
                    button.textContent = 'Hide Details';
                } else {
                    detailsDiv.style.display = 'none';
                    button.textContent = 'View Details';
                }
            });
        });
        
        // Initialize the date picker if the input exists (using jQuery UI)
        var dateInput = document.getElementById('your-datepicker-input'); // Change to your input ID
        if (dateInput) {
            $(dateInput).datepicker({
                dateFormat: 'yy-mm-dd',  // Format Django expects for the date filter
                onSelect: function(dateText) {
                    dateInput.closest('form').submit();  // Automatically submit the form when a date is selected
                }
            });
        }
    });
};
head.appendChild(jqui);



