$(document).ready(function() {
    $('#update-password-btn').on('click', updateProfile);
});

function updateProfile() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
        
    
        const currentPassword = $('#current-password').val();
        const newPassword = $('#new-password').val();
        
        
        if (!currentPassword || !newPassword) {
            errorMessage.textContent = 'Current password and new password are required!';
            errorMessage.style.display = 'block';
            return;
        }
        

        $.ajax({
            url: '/update_password',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword
            }),
            success: function(response) {
                if (response.success) {
                    errorMessage.textContent = response.message;
                    errorMessage.style.color = '#2ecc71';
                    errorMessage.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
                    errorMessage.style.display = 'block';
                    
                    $('#current-password').val('');
                    $('#new-password').val('');
                } else {
                    errorMessage.textContent = response.message;
                    errorMessage.style.display = 'block';
                }
            },
            error: function(xhr, status, error) {
                console.error('Error details:', xhr.responseText);
                alert('An error occurred. Please try again.');
            }
        });
    };
    
    