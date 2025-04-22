
// // Add jQuery UI
// var head = document.getElementsByTagName('head')[0];
// var jq = document.createElement('script');
// jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
// head.appendChild(jq);

// var jqui = document.createElement('script');
// jqui.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
// head.appendChild(jqui);

// var css = document.createElement('link');
// css.href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
// css.rel = "stylesheet";
// head.appendChild(css);




// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelectorAll('.toggle-details').forEach(function(button) {
//         button.addEventListener('click', function() {
//             const id = this.getAttribute('data-id');
//             const detailsDiv = document.getElementById('details-' + id);
            
//             if (detailsDiv.style.display === 'none' || detailsDiv.style.display === '') {
//                 detailsDiv.style.display = 'block';
//             } else {
//                 detailsDiv.style.display = 'none';
//             }
//         });
//     });
// });


// document.addEventListener('DOMContentLoaded', function() {
//     const dateInput = document.getElementById('datepicker');
//     if (dateInput) {
//         $(dateInput).datepicker({
//             dateFormat: 'yy-mm-dd',  // Format Django expects for the date filter
//             onSelect: function(dateText) {
//                 // Automatically submit the form when a date is selected
//                 const form = dateInput.closest('form');
//                 form.submit();
//             }
//         });
//     }
// });

// // Include jQuery and jQuery UI
// $(document).ready(function() {
//     // Toggle the visibility of the details section when clicking the button
//     $('.toggle-details').on('click', function() {
//         var detailsDiv = $('#details-' + $(this).data('id'));
//         detailsDiv.toggle();
//     });

//     // Optional: Initialize the date picker
//     $('#your-datepicker-input').datepicker({
//         dateFormat: 'yy-mm-dd',  // Adjust the date format as needed
//     });
// });



// Add jQuery and jQuery UI dynamically
var head = document.getElementsByTagName('head')[0];

// Load jQuery
var jq = document.createElement('script');
jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
head.appendChild(jq);

// Load jQuery UI
var jqui = document.createElement('script');
jqui.src = "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js";
head.appendChild(jqui);

// Load jQuery UI CSS
var css = document.createElement('link');
css.href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
css.rel = "stylesheet";
head.appendChild(css);


// Ensure all DOM elements are fully loaded
$(document).ready(function() {
    // Toggle the visibility of the details section when clicking the button
    $('.toggle-details').on('click', function() {
        var detailsDiv = $('#details-' + $(this).data('id'));
        detailsDiv.toggle();
    });

    // Initialize the date picker if the input exists
    const dateInput = $('#datepicker');
    if (dateInput.length) {
        dateInput.datepicker({
            dateFormat: 'yy-mm-dd',  // Format Django expects for the date filter
            onSelect: function(dateText) {
                const form = dateInput.closest('form');
                form.submit();  // Automatically submit the form when a date is selected
            }
        });
    }
});


$(document).ready(function() {
    const dateInput = $('#datepicker');
    if (dateInput.length) {
        dateInput.datepicker({
            dateFormat: 'yy-mm-dd',  // Ensure this format matches what your backend expects
            onSelect: function(dateText) {
                // Auto-submit the form when a date is selected
                const form = dateInput.closest('form');
                form.submit();
            }
        });
    }
});

