const firebaseConfig = {
  apiKey: "AIzaSyCXjHbA2As9AMfZciUvyFojZI5gv7Y5Qlw",
  authDomain: "emier-50769.firebaseapp.com",
  projectId: "emier-50769",
  storageBucket: "emier-50769.firebasestorage.app",
  messagingSenderId: "127452588622",
  appId: "1:127452588622:web:a6544fbe837de99974b11f",
  measurementId: "G-QV526R4PMD"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();