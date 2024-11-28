const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");


sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});


const btn_signin = document.querySelector("#btn-signin");
const btn_signup = document.querySelector("#btn-signup");

btn_signin.addEventListener("click", () => {
    let email = document.getElementById("signin-email").value;
    let password = document.getElementById("signin-password").value;

    if (email === "" || password === "") {
        alert("Please fill in all required fields.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/auth/signin",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function (data) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);
            alert("Sign in successful!");
            window.location.href = "dash_bord.html";
        },
        error: function (xhr, status, error) {
            alert("Error signing in: " + error);
        }

    });
});

btn_signup.addEventListener("click", () => {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    let rePassword = document.getElementById("signup-re-password").value;
    let role = document.getElementById("signup-role").value;

    if (email === "" || password === "" || rePassword === "" || role === "") {
        alert("Please fill in all required fields.");
        return;
    }

    if (password !== rePassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/auth/signup",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password,
            role: role
        }),
        success: function (data) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);
            alert("Sign up successful!");
            window.location.href = "dash_bord.html";
        },
        error: function (xhr, status, error) {
            alert("Error signing up: " + error);
        }

    });
})