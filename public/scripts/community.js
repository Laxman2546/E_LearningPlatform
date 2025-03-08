document.addEventListener("DOMContentLoaded", () => {
  const askBtns = document.querySelectorAll(".click");
  const background = document.querySelector(".background");
  const wrapper = document.querySelector(".wrapper");
  const closeds = document.querySelectorAll(".closed");
  const notification = document.querySelector(".notification");
  const communityLoader = document.querySelector(".communityQuestion");
  const communityProfile = document.querySelector(".communityprofilepic");
  const communityAsk = document.querySelector(".communityAsk");

  [
    communityLoader,
    communityProfile,
    communityAsk,
  ].forEach((el) => {
    el.style.display = "block";
  });

  setTimeout(() => {
    [
      communityLoader,
      communityProfile,
      communityAsk,
    ].forEach((el) => {
      el.style.display = "none";
    });
  }, 1000);

  if (wrapper) wrapper.classList.remove("overflow");

  function animateQuestions(isOpening) {
    const tl = gsap.timeline();
    tl.to(".userQuestions", {
      y: isOpening ? 0 : 200,
      opacity: isOpening ? 1 : 0,
      scale: isOpening ? 1 : 0.8,
      duration: 1,
      ease: isOpening ? "elastic.out(1, 0.5)" : "power4.in",
    });
  }

  gsap
    .timeline()
    .fromTo(".notification", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 })
    .to(".notification", { autoAlpha: 0, delay: 1 });

  askBtns.forEach((button) => {
    button.addEventListener("click", () => {
      background?.classList.remove("display");
      wrapper?.classList.add("overflow");
      animateQuestions(true);
    });
  });

  closeds.forEach((button) => {
    button.addEventListener("click", () => {
      animateQuestions(false);
      setTimeout(() => {
        background?.classList.add("display");
        wrapper?.classList.remove("overflow");
      }, 1000);
    });
  });

  function toggleText(button) {
    const parent = button.closest(".randomQuestions");
    const moreText = parent.querySelector(".more-text");
    const seeMoreBtn = parent.querySelector(".see-more-btn");
    const seeLessBtn = parent.querySelector(".see-less-btn");

    const isHidden =
      moreText.style.display === "none" || moreText.style.display === "";
    moreText.style.display = isHidden ? "inline" : "none";
    seeMoreBtn.style.display = isHidden ? "none" : "inline";
    seeLessBtn.style.display = isHidden ? "inline" : "none";
  }

  document
    .querySelectorAll(".see-more-btn, .see-less-btn")
    .forEach((button) => {
      button.addEventListener("click", () => toggleText(button));
    });

document.querySelectorAll(".comment-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const commentsDiv = button
      .closest(".randomQuestions")
      ?.querySelector(".commentsDiv");

    if (!commentsDiv) return; // Prevent errors if .commentsDiv is not found

    // Toggle display property correctly
    commentsDiv.style.display =
      commentsDiv.style.display === "block" ? "none" : "block";
  });
});

});
