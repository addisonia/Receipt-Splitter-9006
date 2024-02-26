//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJGGP0B3D7wRQ1wselqrztz2Fa-Yw1lLA",
    authDomain: "receipt-splitter-7b372.firebaseapp.com",
    projectId: "receipt-splitter-7b372",
    storageBucket: "receipt-splitter-7b372.appspot.com",
    messagingSenderId: "405450216696",
    appId: "1:405450216696:web:f3ec1dbd1b92772307170d",
    measurementId: "G-LL46W91WVZ"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Assuming you want to use Analytics
  firebase.getAnalytics();
  
  // Example: Reference to your Firebase storage
  const storage = firebase.storage();