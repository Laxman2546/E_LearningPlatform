let button = document.querySelector(".button");
const error = document.querySelector(".error");
const email = document.querySelector(".email");

let arr = [
  {
    email: "Please enter your Email id",
  },
];

var tl = gsap.timeline();

gsap.from(".forgot", {
  scale: 0.2,
  duration: 0.5,
  opacity: 0.5,
  delay: 0,
});
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
