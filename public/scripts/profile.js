const wrapper = document.querySelector(".wrapper");
const userNames = document.querySelector(".userNames");
const personalDetails = document.querySelector(".personalDetails");
const enrolledCourses = document.querySelector(".enrolledCourses");
const enrolledCourses1 = document.querySelector(".enrolledCourses1");
const save = document.querySelector(".save");
const usernames = document.querySelector(".userNames");
const notification = document.querySelector(".notification");
const pencil = document.querySelector("#pencil");
const popup = document.querySelector(".popup");
const cancel = document.querySelector("#cancel");
const overlay = document.querySelector(".overlay");
const upload = document.querySelector(".upload");
const accountData = document.querySelector(".accountData");

const profile = document.querySelector(".profileaddress");
const profilePic = document.querySelector(".profilepicLoader");
pencil.classList.remove("display");

document.addEventListener("DOMContentLoaded", () => {
  profile.style.display = "block";
  profilePic.style.display = "block";
  setTimeout(() => {
    profile.style.display = "none";
    profilePic.style.display = "none";
  }, 1000);
});

personalDetails.addEventListener("click", () => {
  userNames.style.display = "block";
  enrolledCourses1.style.display = "none";
  pencil.classList.remove("display");
});
enrolledCourses.addEventListener("click", () => {
  userNames.style.display = "none";
  pencil.classList.add("display");
  enrolledCourses1.style.display = "grid";
});

// Initialize initial data
Array.from(usernames.querySelectorAll("input, select")).forEach((input) => {
  initialData[input.name || input.id] = input.value.trim();
});

// Event listener for input changes
usernames.addEventListener("input", () => {
  const isModified = Array.from(
    usernames.querySelectorAll("input, select")
  ).some((input) => {
    const currentValue = input.value.trim();
    const originalValue = initialData[input.name || input.id];
    return currentValue !== originalValue;
  });

  save.style.display = isModified ? "block" : "none";
});

const tl = gsap.timeline();
tl.from(".notification", {
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
const t2 = gsap.timeline();
t2.from(".upload", {
  opacity: 0,
  duration: 1,
})
  .to(".upload", {
    opacity: 1,
    delay: 0,
    duration: 1,
  })
  .to(".upload", {
    opacity: 0,
    duration: 1,
    delay: 1,
    display: "none",
  });
save.addEventListener("click", () => {
  notification.style.display = "flex";
  save.style.display = "none";
  tl.restart();
});

pencil.addEventListener("click", () => {
  popupOpen();
});

function popupOpen() {
  overlay.style.display = "flex";
  popup.style.display = "flex";
  upload.style.display = "none";
}
function popupClose() {
  popup.style.display = "none";
  overlay.style.display = "none";
  upload.style.display = "flex";
}

cancel.addEventListener("click", () => {
  popupClose();
  const t2 = gsap.timeline();
  t2.from(".upload", {
    opacity: 0,
    duration: 1,
  })
    .to(".upload", {
      opacity: 1,
      delay: 0,
      duration: 1,
    })
    .to(".upload", {
      opacity: 0,
      duration: 1,
      delay: 1,
      display: "none",
    });
});
const fileInput = document.getElementById("fileInput");

const preview = document.getElementById("imagePreview");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});
