let ham = document.querySelector(".ham");
let nav = document.querySelector(".nav-main");
let navitems = document.querySelector(".nav-items");
let program = document.querySelectorAll(".program");
let image = document.querySelectorAll(".pictures");
let courseAll = document.querySelector(".coursesAll");
const leftArrow = document.querySelector("#leftArrow");
const rightArrow = document.querySelector("#rightArrow");
const navLinks = document.querySelectorAll(".nav-main .nav-link");

function activateCoursesLink() {
  navLinks.forEach((link) => link.classList.remove("active"));
  document.getElementById("coursesLink").classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const currentURL = window.location.href;
  if (currentURL.includes("#courses")) {
    activateCoursesLink();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((link) => link.classList.remove("active"));
    link.classList.add("active");
  });
});

function intialize() {
  let FirstProgram = document.querySelector(".program");
  let FirstImage = document.querySelector(".pictures");
  FirstProgram.classList.add("active");
  FirstImage.style.display = "block";
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  if (window.innerWidth <= 900) return;
  var currentScrollPos = window.pageYOffset;
  var navBar = document.getElementsByClassName("nav")[0];
  if (navBar) {
    if (prevScrollpos > currentScrollPos) {
      navBar.style.top = "0";
    } else {
      navBar.style.top = "-500px";
    }
  }

  prevScrollpos = currentScrollPos;
};

window.onload = intialize();

function toggleMenu() {
  document.querySelector(".nav-main").classList.toggle("active");
  ham.classList.toggle("active");
}

function toggle(element, index, event) {
  if (event) event.preventDefault();

  document.querySelectorAll(".program").forEach((program) => {
    program.classList.remove("active");
  });
  element.classList.add("active");

  document.querySelectorAll(".pictures").forEach((img, idx) => {
    img.style.display = index === idx ? "block" : "none";
  });
}

// courses

var courses = [
  {
    title: "webdevelopment",
    description:
      "Master the fundamentals of HTML, CSS, and JavaScript to create your own websites from scratch",
    image: "./images/courses/webdev.jpg",
  },
  {
    title: "Data Science with Python",
    description:
      "Dive into data analysis with Python, exploring libraries like Pandas and NumPy for practical insights.",
    image: "./images/courses/pyds.jpg",
  },
  {
    title: "Graphic Design",
    description:
      "Learn the core principles of design and start creating stunning visuals with essential design tools",
    image: "./images/courses/Graphic.jpg",
  },
  {
    title: "Machine Learning ",
    description:
      "Explore the basics of machine learning, covering essential algorithms.",
    image: "./images/courses/machine.jpg",
  },
  {
    title: "Cloud Computing",
    description:
      "Learn the basics of cloud services and how they’re transforming businesses.",
    image: "./images/courses/cloud.jpeg",
  },
];

var coursedet = "";

courses.forEach(function (course) {
  coursedet += `<div class="courseDetails">
            <div class="courseImage">
              <img
                class="coursePic"
                src=${course.image}
                alt=""
              />
            </div>
            <div class="CourseTitle">
              <h4>${course.title}</h4>
              <p class="description">
               ${course.description}
              </p>
            </div>
            <a href="/register">
            <div class="courseBtn">
              <button type="button" class="Btn">Enroll Now</button>
            </div>
            </a>
          </div>`;
});

courseAll.innerHTML = coursedet;

function scrollCourses(direction) {
  const scrollDistance = courseAll.clientWidth / 0.5;
  let scrollAmount;

  if (direction === "right") {
    scrollAmount = scrollDistance;
    leftArrow.style.display = "flex";
  } else {
    scrollAmount = -scrollDistance;
  }

  courseAll.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });

  setTimeout(() => {
    if (courseAll.scrollLeft <= 0) {
      leftArrow.style.display = "none";
    } else {
      leftArrow.style.display = "flex";
    }

    if (courseAll.scrollLeft + courseAll.clientWidth >= courseAll.scrollWidth) {
      rightArrow.style.display = "none";
    } else {
      rightArrow.style.display = "flex";
    }
  }, 1000);
}

function updateArrowVisibility() {
  if (window.innerWidth <= 715) {
    rightArrow.style.display = "none";
    leftArrow.style.display = "none";
  } else {
    if (courseAll.scrollLeft > 0) {
      leftArrow.style.display = "flex";
    } else {
      leftArrow.style.display = "none";
    }
    if (courseAll.scrollLeft + courseAll.clientWidth < courseAll.scrollWidth) {
      rightArrow.style.display = "flex";
    } else {
      rightArrow.style.display = "none";
    }
  }
}

window.addEventListener("resize", updateArrowVisibility);
updateArrowVisibility();

rightArrow.addEventListener("click", () => scrollCourses("right"));
leftArrow.addEventListener("click", () => scrollCourses("left"));

document.addEventListener("DOMContentLoaded", () => {
  const currentURL = window.location.href;
  if (currentURL.includes("#courses")) {
    activateCoursesLink();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((link) => link.classList.remove("border"));
    link.classList.add("border");
  });
});

const autoscroll = () => {
  document.getElementById("coursePage").scrollIntoView(true);
};
const autoscroll2 = () => {
  document.getElementById("featuresPage").scrollIntoView(true);
};
const autoscroll3 = () => {
  document.getElementById("learnersPage").scrollIntoView(true);
};
const autoscroll4 = () => {
  document.getElementById("contactPage").scrollIntoView(true);
};
