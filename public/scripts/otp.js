const button = document.querySelector(".button");
const error = document.querySelector(".error");
const otpInputs = document.querySelectorAll(".otp");

// Error Message Object (Optional for Dynamic Error Management)
let messages = {
  otp: "Please enter all OTP digits.",
};

// Add event listener to each OTP input
otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value;

    // Allow only single digit
    if (value.length > 1) {
      e.target.value = value[0];
    }

    if (value !== "" && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }

    if (value === "" && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});

// Add animation using GSAP
gsap.from(".forgot", {
  scale: 0.2,
  duration: 0.5,
  opacity: 0.5,
  delay: 0,
});
function combineOTP(event) {
  event.preventDefault(); // Prevent default form submission
  const otpInputs = document.querySelectorAll(".otp");
  let finalOtp = "";

  otpInputs.forEach((input) => {
    finalOtp += input.value.trim();
  });

  document.getElementById("finalOtp").value = finalOtp;

  // Proceed to submit the form
  event.target.submit();
}
