import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// LOGIN
const loginBtn = document.getElementById("loginBtn");
console.log("Login button found:", loginBtn); // Debug log

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    console.log("Login button clicked"); // Debug log

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    console.log("Email:", email, "Password:", password); // Debug log

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  });
}


// REGISTER
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "login.html"; // ✅ Redirect after registration
        }, 1000); // 1.0s delay
      })
      .catch((error) => {
        alert("Registration failed: " + error.message);
      });
  });
}
