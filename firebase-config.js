<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDTYczJwTGXiq01NqDok_TJT2jP1frGYTY",
    authDomain: "fir-config-d102b.firebaseapp.com",
    projectId: "fir-config-d102b",
    storageBucket: "fir-config-d102b.firebasestorage.app",
    messagingSenderId: "339985470764",
    appId: "1:339985470764:web:a03bd4d68e0c59bd84c889",
    measurementId: "G-Q1K2GGCEP2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
