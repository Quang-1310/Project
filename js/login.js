let userNameInput = document.querySelector("#user");
let password = document.querySelector("#password");
let btnLogin = document.querySelector(".btn-login");
let account = JSON.parse(localStorage.getItem("acount")) || [];

let errorMessage = document.querySelector(".errorMessage");
let btnCloseError = document.querySelector(".btnCloseError");
let textBodyError = document.querySelector(".textBodyError");

let successSignIn = document.querySelector(".successSignIn");

errorMessage.style.display = "none";
successSignIn.style.display = "none";

if(Array.isArray(account) && account.length > 0){
    window.location.href = "../pages/finance.html";
}
else{
    btnLogin.addEventListener("click",function(event){
        event.preventDefault();
        textBodyError.innerHTML= '';
        let valueUser = userNameInput.value.trim();
        if(valueUser === ""){
            errorMessage.style.display = "block";
            let span = document.createElement("span");
            span.className="textDetailed";
            span.textContent="user không được để trống";
            textBodyError.appendChild(span);
            return;
        }
        let valuePassword = password.value.trim();
        if(valuePassword === ""){
            errorMessage.style.display = "block";
            let span = document.createElement("span");
            span.className="textDetailed";
            span.textContent="Mật khẩu không được để trống";
            textBodyError.appendChild(span);
            return;
        }
        
        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.length === 0) {
            errorMessage.style.display = "block";
            let span = document.createElement("span");
            span.className = "textDetailed";
            span.textContent = "Chưa có tài khoản nào, vui lòng đăng ký";
            textBodyError.appendChild(span);
            return;
        }

        let user = users.find((acc) => acc.username === valueUser && acc.password === valuePassword);
        if(user){
            successSignIn.style.display = "block";
            localStorage.setItem("acount", JSON.stringify(user));
            setTimeout(() => {
                window.location.href = "../pages/finance.html";
            }, 1000);
        }
        else{
            textBodyError.innerHTML = '';
            errorMessage.style.display = "block";
            let span = document.createElement("span");
            span.className="textDetailed";
            span.textContent="Tài khoản hoặc mật khẩu không đúng";
            textBodyError.appendChild(span);
            return;
        }
    
        userNameInput.value = "";
        password.value = "";
    
    });
}

btnCloseError.addEventListener("click", function () {
    errorMessage.style.display = "none";
});

