document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.querySelector("#sign-in-btn");
    const signUpBtn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    signUpBtn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
    });

    signInBtn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
    });
});


document.getElementById('btn-signIn').addEventListener('click', function () {
    console.log('clicked');
    window.location.href = 'dash_bord.html';
});
