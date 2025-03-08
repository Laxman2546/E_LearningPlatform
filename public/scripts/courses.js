document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".box");
  const leftArrow = document.querySelector("#leftArrow");
  const rightArrow = document.querySelector("#rightArrow");

  // Hide arrows initially
  if (leftArrow) leftArrow.style.display = "none";
  if (rightArrow) rightArrow.style.display = "none";

  setTimeout(() => {
    boxes.forEach((box) => {
      box.style.display = "none";
    });

    // Check if courses exist before making arrows visible
    const courseContainer = document.querySelector(".coursesAll");
    if (courseContainer && courseContainer.children.length > 0) {
      updateArrowVisibility(courseContainer, leftArrow, rightArrow);
    }
  }, 2000);
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".input");
  const closeBtn = document.querySelector("#closeBtn");
  const courseSections = document.querySelectorAll(".courses");
  courseSections.forEach((section) => {
    const courseContainer = section.querySelector(".coursesAll");
    const leftArrow = section.querySelector("#leftArrow");
    const rightArrow = section.querySelector("#rightArrow");

    if (leftArrow && rightArrow) {
      initializeCarousel(courseContainer, leftArrow, rightArrow);
    }
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("keyup", handleSearch);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", resetSearch);
  }
});

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const courseSections = document.querySelectorAll(".courses");

  let totalVisibleCourses = 0;

  courseSections.forEach((section) => {
    const courseContainer = section.querySelector(".coursesAll");
    const courses = courseContainer.querySelectorAll(".courseDetails");
    const categoryHeading = section.querySelector(".coursesHeading");
    const leftArrow = section.querySelector("#leftArrow");
    const rightArrow = section.querySelector("#rightArrow");

    let visibleCourses = 0;

    // Filter courses in this category
    courses.forEach((course) => {
      const title = course
        .querySelector(".CourseTitle h4")
        .textContent.toLowerCase();
      const isVisible = title.includes(searchTerm);

      course.style.display = isVisible ? "block" : "none";
      if (isVisible) visibleCourses++;
    });

    totalVisibleCourses += visibleCourses; // Add to total count

    // Handle visibility of category heading and arrows
    if (visibleCourses > 0) {
      categoryHeading.style.display = "block";
      courseContainer.querySelector(".nodata")?.remove();
      updateArrowVisibility(courseContainer, leftArrow, rightArrow);
    } else {
      categoryHeading.style.display = searchTerm ? "none" : "block";
      updateArrowVisibility(courseContainer, leftArrow, rightArrow);

      // Remove "No Data" if it exists for this category
      courseContainer.querySelector(".nodata")?.remove();
    }
  });

  // Show "No Data" only once if no courses are found across all categories
  const wrapper = document.querySelector(".wrapper");
  const existingNoData = document.querySelector(".nodata-global");

  if (totalVisibleCourses === 0 && searchTerm) {
    if (!existingNoData) {
      const noDataDiv = document.createElement("div");
      noDataDiv.classList.add("nodata-global");
      noDataDiv.innerHTML = `
        <div class="nodata">
          <img class="dataimage" src="../images/nodata/nodata.svg" alt="No Data" />
          <p>No courses found matching your search</p>
        </div>
      `;
      wrapper.appendChild(noDataDiv);
    }
  } else {
    existingNoData?.remove(); // Remove the global "No Data" message if courses are visible
  }

  const closeBtn = document.querySelector("#closeBtn");
  closeBtn.classList.toggle("active", searchTerm.length > 0);
}

function resetSearch() {
  const searchInput = document.querySelector(".input");
  const courseSections = document.querySelectorAll(".courses");

  searchInput.value = "";

  courseSections.forEach((section) => {
    const courseContainer = section.querySelector(".coursesAll");
    const courses = courseContainer.querySelectorAll(".courseDetails");
    const categoryHeading = section.querySelector(".coursesHeading");
    const leftArrow = section.querySelector("#leftArrow");
    const rightArrow = section.querySelector("#rightArrow");

    // Reset courses visibility
    courses.forEach((course) => {
      course.style.display = "block";
    });

    categoryHeading.style.display = "block";
    updateArrowVisibility(courseContainer, leftArrow, rightArrow);
    courseContainer.querySelector(".nodata")?.remove();
  });

  document.querySelector(".nodata-global")?.remove();
  const closeBtn = document.querySelector("#closeBtn");
  closeBtn.classList.remove("active");
}

// Carousel functionality
function initializeCarousel(courseContainer, leftArrow, rightArrow) {
  leftArrow.onclick = () =>
    scrollCoursesHandler(courseContainer, leftArrow, rightArrow, "left");
  rightArrow.onclick = () =>
    scrollCoursesHandler(courseContainer, leftArrow, rightArrow, "right");

  window.addEventListener("resize", () =>
    updateArrowVisibility(courseContainer, leftArrow, rightArrow)
  );

  updateArrowVisibility(courseContainer, leftArrow, rightArrow);
}

function scrollCoursesHandler(
  courseContainer,
  leftArrow,
  rightArrow,
  direction
) {
  const courseCard = courseContainer.querySelector(".courseDetails");
  if (!courseCard) return;

  const cardWidth = courseCard.offsetWidth;
  const gap = parseInt(window.getComputedStyle(courseContainer).gap) || 0;
  const scrollDistance = cardWidth + gap;
  const scrollAmount = direction === "right" ? scrollDistance : -scrollDistance;

  courseContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });

  updateArrowVisibility(courseContainer, leftArrow, rightArrow);
}

function updateArrowVisibility(courseContainer, leftArrow, rightArrow) {
  setTimeout(() => {
    // Ensure arrows are hidden when no content exists or during loading
    if (!courseContainer || courseContainer.children.length === 0) {
      leftArrow.style.display = "none";
      rightArrow.style.display = "none";
      return;
    }

    if (window.innerWidth <= 715) {
      leftArrow.style.display = "none";
      rightArrow.style.display = "none";
      return;
    }

    leftArrow.style.display = courseContainer.scrollLeft > 0 ? "flex" : "none";
    const isAtEnd =
      courseContainer.scrollLeft + courseContainer.clientWidth >=
      courseContainer.scrollWidth;
    rightArrow.style.display = isAtEnd ? "none" : "flex";
  }, 300);
}

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

// Fetch data from the backend API
// fetch("http://localhost:3000/courses") // Replace with your API endpoint
//   .then((response) => response.json())
//   .then((courses) => {
//     console.log("Courses Data:", courses); // Log the data to the console
//   })
//   .catch((error) => {
//     console.error("Error fetching courses:", error); // Log errors, if any
//   });
