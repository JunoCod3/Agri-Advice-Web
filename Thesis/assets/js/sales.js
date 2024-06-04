const firebaseConfig = {
    apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
    authDomain: "final-database-9493d.firebaseapp.com",
    databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
    projectId: "final-database-9493d",
    storageBucket: "final-database-9493d.appspot.com",
    messagingSenderId: "798360016853",
    appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

const isLoggedIn = sessionStorage.getItem("isLoggedIn");
if (!isLoggedIn) {
  window.location.href = "index.html";
}

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();



