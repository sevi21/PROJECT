$(document).ready(function() {
    //ko pritisnes na tipko eneter se zmeraj submita obrazec 
    $("#loginForm").submit(function(event) {
        //prepreci defaultno obnašanje obrazca da se ne osveži stran ampak ajax prevzame nadzor
        event.preventDefault();
        login();
    });
});

function login() {

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    const username = $("#name").val();
    const password = $("#password").val();

    if (username === "" || password === "") {
        errorMessage.textContent = 'Username and password are required!';
        errorMessage.style.display = 'block';
        return;
    }

    $.ajax({
        url: "/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({

            username: username,
            password: password

        }),
        success: function(response) {
            if (response.success) {
                errorMessage.textContent = "Login successfully!";
                errorMessage.style.color = "#2ecc71";
                errorMessage.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
                errorMessage.style.display = 'block';

                //pocaka 1.5 sekunde in preusmeri na qrcode
                setTimeout(function() {
                    window.location.href = "/qrcode";
                }, 1500)

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
}