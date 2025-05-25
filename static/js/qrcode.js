document.addEventListener('DOMContentLoaded', function(){
    const contentInput = document.getElementById('content');
    const generateBtn = document.getElementById('generate-btn');
    const qrResult = document.getElementById('qr-result');
    const qrImage = document.getElementById('qr-image');
    const color1 = document.getElementById('fg-color');
    const color2 = document.getElementById('bg-color');
    const downloadBtn = document.getElementById('download-btn');


    const ErorrMessage = document.getElementById('errorMessage');
    ErorrMessage.style.display = 'none';

    function generateQR() {
        const content = contentInput.value.trim();
        const fgColor = color1.value;
        const bgColor = color2.value;

        if (!content) {
            ErorrMessage.textContent = 'Please enter a URL or text.';
            ErorrMessage.style.display = 'block';

            setTimeout(() => {
                ErorrMessage.style.display = 'none';
            }, 3000);
            return;
        }

    

        $.ajax({
            url: '/makeQR',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                content: content,
                fgColor: fgColor,
                bgColor: bgColor
                
            }),
            success: function(response) {
                if (response.success){
                    ErorrMessage.textContent = response.message;
                    ErorrMessage.style.color = "#2ecc71";
                    ErorrMessage.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
                    ErorrMessage.style.display = 'block';

                    qrImage.src = 'data:image/png;base64,' + response.img_str;
                    qrResult.style.display = 'block';
                
                    setTimeout(() => {
                        ErorrMessage.style.display = 'none';
                    }, 3000);
                }
                else {
                    ErorrMessage.textContent = response.message;
                    ErorrMessage.style.display = 'block';
                    
                }
            },
            error: function() {
                alert('Error generating QR code. Please try again.');
            }
        });
    }

    function downloadQR(){

        link = document.createElement('a');

        link.href = qrImage.src;

        link.download = 'qrcode.png';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);

    contentInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQR();
        }
    });
})