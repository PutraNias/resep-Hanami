// Firebase configuration (ganti dengan config Anda dari Firebase Console)
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
