document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".input");
  const closeBtn = document.querySelector("#closeBtn");

  // Initialize carousels for each category
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
  // Delay to ensure scrolling completes
  setTimeout(() => {
    // Check if mobile view
    if (window.innerWidth <= 715) {
      leftArrow.style.display = "none";
      rightArrow.style.display = "none";
      return;
    }

    // Left arrow visibility
    leftArrow.style.display = courseContainer.scrollLeft > 0 ? "flex" : "none";

    // Right arrow visibility
    const isAtEnd =
      courseContainer.scrollLeft + courseContainer.clientWidth >=
      courseContainer.scrollWidth;
    rightArrow.style.display = isAtEnd ? "none" : "flex";
  }, 300);
}
function initNotificationAnimation() {
  const notification = document.querySelector(".notification");

  if (notification) {
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
        onComplete: () => {
          notification.style.display = "none";
        },
      });
  }
}

document.addEventListener("DOMContentLoaded", initNotificationAnimation);

const deleteCourse = document.querySelector(".delete");
const background = document.querySelector(".background");
const popup = document.querySelector(".popup");
const close = document.querySelectorAll(".close");
const removeCourse = document.querySelector(".removeCourse");
deleteCourse.addEventListener("click", () => {
  background.classList.remove("back");
  popup.classList.remove("popDisplay");
});
close.forEach((close) => {
  close.addEventListener("click", () => {
    background.classList.add("back");
    popup.classList.add("popDisplay");
  });
});
removeCourse.addEventListener("click", () => {
  background.classList.add("back");
  popup.classList.add("popDisplay");
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete");
  const popup = document.getElementById("popup");
  const background = document.querySelector(".background");
  const courseTitleInput = document.getElementById("courseTitle");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const courseDetails = e.target.closest(".courseDetails");
      const courseTitle = courseDetails.querySelector(
        "input[name='title']"
      ).value;

      // Update popup data dynamically
      courseTitleInput.value = courseTitle; // Set course title in hidden input
      popup.querySelector(
        "h1"
      ).textContent = `Do you want to delete "${courseTitle}"?`;

      // Show popup
      background.classList.remove("back");
      popup.classList.remove("popDisplay");
    });
  });

  // Handle close popup
  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach((close) => {
    close.addEventListener("click", () => {
      background.classList.add("back");
      popup.classList.add("popDisplay");
    });
  });
});
