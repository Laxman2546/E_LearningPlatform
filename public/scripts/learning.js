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

let random = Math.floor(Math.random() * 10000);
console.log(random);
document.getElementById("review").innerHTML = random;
