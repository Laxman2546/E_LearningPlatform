document.addEventListener("DOMContentLoaded", () => {
  const arrow = document.querySelector(".arrow");
  const inputField = document.querySelector(".inputField");
  const chatBox = document.getElementById("chat-box");

  // Hide the arrow initially
  arrow.classList.add("hidden-arrow");

  // Show/Hide arrow based on user input
  inputField.addEventListener("keyup", () => {
    arrow.classList.toggle("hidden-arrow", inputField.value.trim() === "");
  });

  // Handle Send button click
  arrow.addEventListener("click", async (event) => {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    // Append user's message
    appendMessage("User", userMessage);

    // Clear the input field immediately
    inputField.value = "";
    arrow.classList.add("hidden-arrow");

    // Show "loading" message while waiting for AI response
    const loadingMessage = appendMessage("AI", "Loading...");

    try {
      // Send message to backend
      const response = await fetch("/generative/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat: userMessage }),
      });

      // Check for successful response
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      // Log the entire response for debugging
      console.log("Received data:", data);

      // Check if the AI reply exists
      if (data && data.aiReply) {
        // Replace "loading" with AI's response
        replaceLoadingWithAIResponse(loadingMessage, data.aiReply);
      } else {
        console.error("No aiReply found in response.");
        replaceLoadingWithAIResponse(
          loadingMessage,
          "Sorry, I couldn't understand that. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      replaceLoadingWithAIResponse(
        loadingMessage,
        "Sorry, something went wrong. Please try again later."
      );
    }
  });

  // Function to append messages dynamically
  function appendMessage(sender, message) {
    const messageContainer = document.createElement("div");
    messageContainer.className = sender === "User" ? "user" : "aiDetails";

    if (sender === "AI") {
      const profilePic = document.createElement("div");
      profilePic.className = "profilepic";
      profilePic.innerHTML = `<img src="../images/adobe.png" alt="AI profile pic" />`;
      messageContainer.appendChild(profilePic);
    }

    const messageText = document.createElement("div");
    messageText.className = sender === "User" ? "userDet" : "aitext";
    messageText.innerHTML = `<p>${message}</p>`;
    messageContainer.appendChild(messageText);

    chatBox.appendChild(messageContainer);

    // Scroll to bottom of chat
    setTimeout(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 100); // Ensures the scroll happens after the DOM update

    return messageText; // Return the message element to replace "loading"
  }

  // Function to replace "loading" with the actual AI response
  function replaceLoadingWithAIResponse(loadingMessage, aiResponse) {
    if (loadingMessage) {
      loadingMessage.textContent = aiResponse; // Update the "loading" message with the actual response
    }
  }
});
