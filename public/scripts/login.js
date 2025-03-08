var password = document.querySelector(".password");
let button = document.querySelector(".button");
const error = document.querySelector(".error");
const email = document.querySelector(".email");
let arr = [
  {
    email: "Please enter your Email id",
  },
  { password: "Please enter your Password " },
];
button.addEventListener("click", function () {
  if (email.value === "") {
    error.style.display = "block";
    error.innerHTML = `  <p style="color: white">${arr[0].email}</p>`;
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
  } else if (password.value === "") {
    error.style.display = "block";
    error.innerHTML = `  <p style="color: white">${arr[1].password}</p>`;
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
  } else {
    error.style.display = "none";
  }
});

var tl = gsap.timeline();

gsap.from(".Login", {
  scale: 0.2,
  duration: 0.5,
  opacity: 0.5,
  delay: 0,
});
const messages = [];
if (messages.length > 0) {
  event.preventDefault();
  error.style.display = "block";
  error.innerHTML = `<p style="color: white">${messages.join("<br>")}</p>`;
}
// Password visibility toggle
const icon = document.querySelector(".fa-eye-slash");
icon.addEventListener("click", () => {
  const passAttri = password.getAttribute("type");
  if (passAttri === "password") {
    password.setAttribute("type", "text");
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    password.setAttribute("type", "password");
    icon.classList.add("fa-eye-slash");
    icon.classList.remove("fa-eye");
  }
});
const notification = document.querySelector(".notification");

const t5 = gsap.timeline();
t5.from(".notification", {
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

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var authResponse = googleUser.getAuthResponse();
  $("#name").text(profile.getname());
  $("#email").text(profile.getEmail());
  $("#image").attr("src", profile.getImageUrl());
  $(".data").css("display", "block");
  $(".g-signin2").css("display", "none");
  console.log("Profile Picture URL: " + authResponse.profileObj.imageUrl);
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    alert("Signing out.....");
    $(".g-signin2").css("display", "block");
    $(".data").css("display", "none");
  });
}
