// const progressBar = document.querySelector('[role="progressbar"]');

// // Initialize progress bar to 0% at load
// let progressPercentage = 0;
// progressBar.setAttribute("aria-valuenow", progressPercentage); // Set initial accessibility value
// progressBar.style.setProperty("--value", progressPercentage); // Set initial CSS custom property
// progressBar.setAttribute("aria-label", `${progressPercentage}%`); // Set visible percentage

// // Function to update the progress bar
// function updateProgressBar() {
//   const duration = player.duration(); // Get total duration of the video
//   const currentTime = player.currentTime(); // Get current playback time

//   // Calculate the progress percentage
//   let progressPercentage = (currentTime / duration) * 100;

//   // Round up the value to the nearest integer
//   progressPercentage = Math.ceil(progressPercentage);

//   // Ensure the value is not NaN or infinity before updating
//   if (!isNaN(progressPercentage) && isFinite(progressPercentage)) {
//     // Update the progress bar's aria-valuenow (for accessibility)
//     progressBar.setAttribute("aria-valuenow", progressPercentage);
//     progressBar.style.setProperty("--value", progressPercentage);
//     progressBar.setAttribute("aria-label", `${progressPercentage}%`);
//   }
// }

// // Update the progress bar as the video plays
// player.on("timeupdate", updateProgressBar);

// // Ensure progress is displayed correctly on initial load
// player.ready(function () {
//   const duration = player.duration();

//   // Handle cases where the duration is available immediately
//   if (duration > 0) {
//     updateProgressBar();
//   }
// });
