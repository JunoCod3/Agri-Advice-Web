const firebaseConfig = {
  apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
  authDomain: "final-database-9493d.firebaseapp.com",
  databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
  projectId: "final-database-9493d",
  storageBucket: "final-database-9493d.appspot.com",
  messagingSenderId: "798360016853",
  appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function loginUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      user.reload().then(() => {
        if (user.emailVerified) {
          alert("Successfully Login.");
          sessionStorage.setItem("isLoggedIn", "true");
          window.location.href = "index1.html";
        } else {
          sessionStorage.setItem("isLoggedIn", "false");
          alert("Please check your email for verification and proceed to Login.");
        }
      });
    })
    .catch((error) => {
      sessionStorage.setItem("isLoggedIn", "false");
      alert("Login failed: Please check your email for verification");
    });
}

function showVerificationAlert() {
  document.querySelector('.alert').style.display = 'flex';
  document.querySelector('.main').style.filter = "blur(2px)";
  const alertButton = document.querySelector('.button');
  alertButton.addEventListener("click", function () {
    document.querySelector('.alert').style.display = 'none';
    document.querySelector('.main').style.filter = "none";
  });
}

function redirectToPlantPage() {
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var email = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  loginUser(email, password);
});
