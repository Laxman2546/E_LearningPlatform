const passwords = document.querySelectorAll(".password, .Confirmpassword");
const cnfPassword = document.querySelector(".Confirmpassword");
const password = document.querySelector(".password");
const icons = document.querySelectorAll(".fa-eye-slash");
const button = document.querySelector(".button");
const Email = document.querySelector(".email");
const error = document.querySelector(".error");
const notification = document.querySelector(".notification");


let errors = [
  { email: "please enter your email" },
  {
    password: "please enter your password",
  },
  {
    cnfPassword: "please enter the confirm Password",
  },
  {
    notMatch: "passwords were not match",
  },
];

icons.forEach((icon, index) => {
  icon.addEventListener("click", () => {
    let passwordField = passwords[index];
    let passAttri = passwordField.getAttribute("type");

    if (passAttri === "password") {
      passwordField.setAttribute("type", "text");
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    } else {
      passwordField.setAttribute("type", "password");
      icon.classList.add("fa-eye-slash");
      icon.classList.remove("fa-eye");
    }
  });
});
var tl = gsap.timeline();
button.addEventListener("click", () => {
  if (Email.value.trim() === "") {
    error.style.display = "flex";
    error.innerHTML = `  <p style="color: white">${errors[0].email}</p>`;
    tl.restart();
    tl.from(".error", {
      y: 15,
      opacity: 0,
      duration: 1,
    });
    tl.to(".error", {
      y: 0,
      opacity: 0,
      delay: 3,
      duration: 1,
    });
  } else if (password.value.trim() === "") {
    error.style.display = "block";
    error.innerHTML = ` <p style="color: white">${errors[1].password}</p>`;
    tl.restart();
    tl.from(".error", {
      y: 15,
      opacity: 0,
      duration: 1,
    });
    tl.to(".error", {
      y: 0,
      opacity: 0,
      delay: 3,
      duration: 1,
    });
  } else if (cnfPassword.value.trim() === "") {
    error.style.display = "flex";
    error.innerHTML = ` <p style="color: white">${errors[2].cnfPassword}</p>`;
    tl.restart();
    tl.from(".error", {
      y: 15,
      opacity: 0,
      duration: 1,
    });
    tl.to(".error", {
      y: 0,
      opacity: 0,
      delay: 3,
      duration: 1,
    });
  } else if (password.value != cnfPassword.value) {
    error.style.display = "block";
    error.innerHTML = ` <p style="color: white">${errors[3].notMatch}</p>`;
    tl.restart();
    tl.from(".error", {
      y: 15,
      opacity: 0,
      duration: 1,
    });
    tl.to(".error", {
      y: 0,
      opacity: 0,
      delay: 3,
      duration: 1,
    });
    event.preventDefault();
  } else {
    error.style.display = "none";
  }
});

gsap.from(".register", {
  scale: 0.2,
  duration: 0.5,
  opacity: 0.5,
  delay: 0,
});
const t2 = gsap.timeline();
t2.from(".notification", {
  opacity: 0,
  duration: 1,
})
  .to(".notification", {
    opacity: 1,
    delay: 0,
    duration: 1,
  })
  .to(".notification", {
    opacity: 0,
    duration: 1,
    delay: 1,
    display: "none",
  });