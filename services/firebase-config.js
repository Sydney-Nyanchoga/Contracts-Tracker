// firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxEyY33ubLsIwrJIeDdim01T-_lxW-n2I",
  authDomain: "contracts-management-d9ebf.firebaseapp.com",
  databaseURL: "https://contracts-management-d9ebf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "contracts-management-d9ebf",
  storageBucket: "contracts-management-d9ebf.appspot.com",
  messagingSenderId: "512501422982",
  appId: "1:512501422982:web:7b61420bb65c155d4faa07",
  measurementId: "G-HD4K3Q2MBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth to use in login/register
export const auth = getAuth(app);
