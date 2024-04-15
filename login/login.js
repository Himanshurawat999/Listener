let login = document.getElementById("linksLogin");
let signup = document.getElementById("linksSignup");
let contentLogin = document.getElementById("contentLogin");
let contentSignUp = document.getElementById("contentSignUp");
let submitLogin = document.getElementById("submitLogin");
let submitSignup = document.getElementById("submitSignup");
let email = document.getElementById("mail");
let password = document.getElementById("password");
let name = document.getElementById("name");

const cleanValue = function () {
  email.value = "";
  password.value = "";
  name.value = "";
};

login.addEventListener("click", function (e) {
  e.preventDefault();
  login.classList.add("hide");
  signup.classList.remove("hide");
  contentSignUp.classList.add("hide");
  contentLogin.classList.remove("hide");
  submitSignup.classList.add("hide");
  submitLogin.classList.remove("hide");

  cleanValue();
});

signup.addEventListener("click", function (e) {
  e.preventDefault();
  login.classList.remove("hide");
  signup.classList.add("hide");
  contentSignUp.classList.remove("hide");
  contentLogin.classList.add("hide");
  submitSignup.classList.remove("hide");
  submitLogin.classList.add("hide");

  cleanValue();
});
