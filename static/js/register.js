$(document).ready(function() {
    //ko pritisnes na tipko eneter se zmeraj submita obrazec 
    $("#registerForm").submit(function(event) {
        //prepreci defaultno obnašanje obrazca da se ne osveži stran ampak ajax prevzame nadzor
        event.preventDefault();
        register();
    });
});
function register(){

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
        url: "/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({

            username: username,
            password: password

        }),
        success: function(response){
            if (response.success) {

                errorMessage.textContent = "Account created successfully!";
                errorMessage.style.color = "#2ecc71";
                errorMessage.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
                errorMessage.style.display = 'block';

                //Redirecta v login po 1.5s
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
        

            } else {
                errorMessage.textContent = response.message;
                errorMessage.style.display = 'block';
            }
        },
        error: function(xhr, status, error) {
            console.error('Podrobnosti napake:', xhr.responseText);
            errorMessage.textContent = 'Prišlo je do napake. Poskusite znova.';
            errorMessage.style.display = 'block';
        }
    });
}