$(document).ready(function() {
    $('.download-btn').on('click', function() {
        const content = $(this).data('content');
        
        $.ajax({
            url: '/download_qr',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                content: content
            }),
            success: function(response) {
                if (response.success) {
                
                    const link = document.createElement('a');

                    link.href = 'data:image/png;base64,' + response.img_data;

                    link.download = 'qrcode.png';
                
                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);
                    
                } else {
                    alert('Error downloading QR code: ' + response.message);
                }
            },
            error: function() {
                alert('Error downloading QR code. Please try again.');
            }
        });
    });
});