const initialData = {};

function toggleMenu() {
  const ham = document.querySelector(".ham");
  const nav = document.querySelector(".nav-main");

  if (nav) {
    nav.classList.toggle("active");
  }
  if (ham) {
    ham.classList.toggle("active");
  }
}
