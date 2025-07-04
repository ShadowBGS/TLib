function authorizedFetch(url, options = {}) {
  const token = sessionStorage.getItem("token"); // Your JWT token
  const apiKey = "your-api-key"; // Replace with your actual API key

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

if (sessionStorage.getItem("isLoggedIn")) {
  window.location.href = "Dashboard.html";
}
function togglePassword() {
  var passwordField = document.getElementById("password");
  var toggleText = document.querySelector(".toggle-password");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleText.textContent = "Hide Password";
  } else {
    passwordField.type = "password";
    toggleText.textContent = "Show Password";
  }
}


async function login() {
  const button = document.querySelector(".login-btn");
  button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...`;
  button.disabled = true; 
  const userId = document.getElementById("StaffId").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");
  const API_BASE_URL = "https://a-z3tq.onrender.com/api/userlogin";
  try {
    const response = await authorizedFetch(
      `${API_BASE_URL}/lecturer?UserId=${encodeURIComponent(
        userId
      )}&password=${password}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    sessionStorage.setItem("sessionExpiry", data.sessionExpiry);
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("isLoggedIn", "true");
    const token = data.token;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userType", "Lecturer");
    localStorage.setItem("email", data.email);
    alert(`Lecturer login successful!`);
    window.location.href = "Dashboard.html";
  } catch (error) {
    console.error("Login error:", error.message);
    errorMessage.textContent = error.message;
    setTimeout(() => {
      errorMessage.textContent = ""; // Clear the error message after 3 seconds
    }, 3000);
  } finally {
    button.innerHTML = "Login";
    button.disabled = false; // Re-enable the button after login attempt
  }
  
}

function openSidebar() {
  const main = document.getElementById("Main");
  const sidebar = document.getElementById("SideH");
  if (sidebar) {
    sidebar.style.display = "flex "; // Hide the sidebar
    main.style.display = "none";
  }
}
function closeSidebar() {
  const main = document.getElementById("Main");
  const sidebar = document.getElementById("SideH");
  if (sidebar) {
    sidebar.style.display = "none "; // Hide the sidebar
    main.style.display = "flex";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.getElementById("close");
  const openButton = document.getElementById("open");

  if (closeButton) {
    closeButton.addEventListener("click", closeSidebar);
  }
  document.querySelector(".login-btn").addEventListener("click", login);

  if (openButton) {
    openButton.addEventListener("click", openSidebar);
  }
});
