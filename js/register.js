let formRegister = document.querySelector(".container-login");
let user = document.querySelector("#user");
let password = document.querySelector("#password");
let confirmPassword = document.querySelector("#confirm");
let btnRegister = document.querySelector(".btn-login");
let users = JSON.parse(localStorage.getItem("users")) || [];
const vietnameseRegex = /[À-Ỵà-ỹĂăÂâĐđÊêÔôƠơƯư]/;

let errorMessage = document.querySelector(".errorMessage");
let btnCloseError = document.querySelector(".btnCloseError");
let textBodyError = document.querySelector(".textBodyError");

let successSignIn = document.querySelector(".successSignIn");

errorMessage.style.display = "none";
successSignIn.style.display = "none";


btnRegister.addEventListener("click", function(event){
    textBodyError.innerHTML=``;
    event.preventDefault();
    let valueUser = user.value;
    if(valueUser === ""){
        errorMessage.style.display = "block";
        let span = document.createElement("span");
        span.className="textDetailed";
        span.textContent="Tên đăng ký không được để trống";
        textBodyError.appendChild(span);
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }
    else if(valueUser.includes(" ")){
        errorMessage.style.display = "block";
        let span = document.createElement("span");
        span.className="textDetailed";
        span.textContent="Tên đăng ký không được chứa khoảng trắng";
        textBodyError.appendChild(span);
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }
    else if(vietnameseRegex.test(valueUser)){
        errorMessage.style.display = "block";
        let span = document.createElement("span");
        span.className="textDetailed";
        span.textContent="Tên đăng ký không được chứa dấu tiếng Việt";
        textBodyError.appendChild(span);
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }
    let valuePassword = password.value;
    if(valuePassword === ""){
        errorMessage.style.display = "block";

        let span = document.createElement("span");
        span.className="textDetailed";
        span.textContent="Mật khẩu không được để trống";
        textBodyError.appendChild(span);
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }
    else if(valuePassword.length < 6){
        errorMessage.style.display = "block";
        let span = document.createElement("span");
        span.className="textDetailed";
        span.textContent="Mật khẩu tối thiểu phải từ 6 ký tự trở lên";
        textBodyError.appendChild(span);
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }
    let valueConfirm = confirmPassword.value;
    if(valueConfirm === ""){
        errorMessage.style.display = "block";
        let span = document.createElement("span");
        span.className="textDetailed";
        span.textContent="Bạn cần phải ký mật khẩu xác nhận";
        textBodyError.appendChild(span);
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 2000);
        return;
    }
    if(valueConfirm === valuePassword){
        for(let i = 0; i < users.length; i++){
            if(valueUser === users[i].username){
                errorMessage.style.display = "block";
                let span = document.createElement("span");
                span.className="textDetailed";
                span.textContent="Tài khoản đã tồn tại";
                textBodyError.appendChild(span);
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 2000);
                return;
            }
        }

        errorMessage.style.display = "none";
        successSignIn.style.display = "block";
        const acc = {
            id: users.length + 1,
            username : valueUser,
            password : valuePassword
        }
        users.push(acc);
        localStorage.setItem("users", JSON.stringify(users));
        setTimeout(() => {
            window.location.href = "../pages/login.html";
        }, 1000);

        user.value = "";
        password.value = "";
        confirmPassword.value = "";
    }
    else{
        alert("Mật khẩu xác nhận không đúng");
        return;
    }
});

btnCloseError.addEventListener("click", function () {
    errorMessage.style.display = "none";
});

