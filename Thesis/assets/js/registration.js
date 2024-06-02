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
const database = firebase.database();

function registerUser(username, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userCredential.user.sendEmailVerification()
        .then(() => {
          var userId = userCredential.user.uid;
          database.ref('Admin/' + userId).set({
            username: username,
            password: password,
            email: email 
          })
            .then(() => {
              alert("Admin registered, please check your email for verification and proceed to Login.");
              window.location.href = "index.html";
            })
            .catch((error) => {
              alert("Error uploading admin data: ", error);
            });
        })
        .catch((error) => {
          alert("Error sending verification email: ", error);
        });
    })
    .catch((error) => {
      alert.error("Error registering user: ", error);
    });
}

document.getElementById("registrationForm").addEventListener("submit", function(event) {
  event.preventDefault();
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  registerUser(username, email, password);
});