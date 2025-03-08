document.addEventListener("DOMContentLoaded", () => {
  const arrow = document.querySelector(".arrow");
  const input = document.querySelector(".inputField");

  arrow.classList.add("hidden-arrow");

  input.addEventListener("keyup", () => {
    if (input.value.trim() === "") {
      arrow.classList.add("hidden-arrow");
    } else {
      arrow.classList.remove("hidden-arrow");
    }
  });
  input.addEventListener("click", () => {
    input.value === "";
  });
});
const notification = document.querySelector(".notification");

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
