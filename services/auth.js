import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// REGISTER
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("✅ Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        alert("❌ Registration failed: " + error.message);
      });
  });
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("✅ Login successful! Redirecting to home...");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("❌ Login failed: " + error.message);
      });
  });
}
