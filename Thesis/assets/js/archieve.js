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
const storage = firebase.storage();
const database = firebase.database();
const ref = database.ref('archive');


const archieveContainer = document.getElementById('archieve-container');
const divContainer = document.getElementById('div');



function retrieveDataFromFirebase() {
    ref.once("value", function (snapshot) {
        divContainer.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const arcdata = childSnapshot.val();
            const arcKey = childSnapshot.key;

            const arcDiv = document.createElement('div');
            arcDiv.classList.add('arcDiv');

            const icon = document.createElement('img');
            icon.src = arcdata.icon;
            icon.classList.add('icons');

            const title = document.createElement('h2');
            title.textContent = arcdata.title;
            title.classList.add('titles');

            const edimove = document.createElement('div');
            edimove.classList.add("edimove");

            const editIcon = document.createElement('img');
            editIcon.src = 'assets/img/restore.png';
            editIcon.classList.add('editIcon');
            editIcon.alt = 'Edit';

            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'assets/img/delete1.png';
            deleteIcon.classList.add('deleteIcon');
            deleteIcon.alt = 'Delete';

            edimove.appendChild(editIcon);
            edimove.appendChild(deleteIcon);

            arcDiv.appendChild(icon);
            arcDiv.appendChild(title);
            arcDiv.appendChild(edimove);
            divContainer.appendChild(arcDiv);

            deleteIcon.addEventListener('click', () => {
                const archiveItemRef = firebase.database().ref('archive/' + arcKey);
                const confirmDelete = confirm("Are you sure you want to delete this permenantly?");
                if (confirmDelete) {
                    archiveItemRef.remove()
                        .then(() => {
                            console.log('Plant removed successfully from archive');
                            arcDiv.remove();
                        })
                        .catch(error => {
                            console.error('Error removing plant from archive:', error.message);
                        });
                }
                
            });

            editIcon.addEventListener('click', (event) => {
                event.stopPropagation();

                edimove.style.display = "none";
                arcDiv.style.display = "none";

                const plantTitle = arcdata.title;
                const archiveRef = firebase.database().ref('archive');

                archiveRef.orderByChild('title').equalTo(plantTitle).once('value')
                    .then(snapshot => {
                        snapshot.forEach(childSnapshot => {
                            const archiveKey = childSnapshot.key;
                            const archiveItemRef = firebase.database().ref('archive/' + archiveKey);

                            // Retrieve the plant data from 'archive'
                            archiveItemRef.once('value')
                                .then(archiveSnapshot => {
                                    const plantData = archiveSnapshot.val();

                                    // Push the retrieved plant data back to 'plants'
                                    const plantsRef = firebase.database().ref('plants').push();
                                    plantsRef.set(plantData)
                                        .then(() => {
                                            // Plant successfully added back to 'plants'
                                            console.log('Plant added back to plants successfully');
                                            // Now, if you need to manipulate UI, you can do it here
                                        })
                                        .catch(error => {
                                            // Error occurred while adding the plant back to 'plants'
                                            console.error('Error adding plant back to plants:', error.message);
                                            // Optionally, you can handle the error here
                                        });

                                    // Remove the plant from 'archive'
                                    archiveItemRef.remove()
                                        .then(() => {
                                            // Plant removed successfully from 'archive'
                                            console.log('Plant removed successfully from archive');
                                            // Optionally, you can handle the success here
                                        })
                                        .catch(error => {
                                            // Error occurred while removing the plant from 'archive'
                                            console.error('Error removing plant from archive:', error.message);
                                            // Optionally, you can handle the error here
                                        });
                                })
                                .catch(error => {
                                    // Error occurred while retrieving the plant data from 'archive'
                                    console.error('Error retrieving plant data from archive:', error.message);
                                    // Optionally, you can handle the error here
                                });
                        });
                    })
                    .catch(error => {
                        // Error occurred while querying the archive
                        console.error('Error querying archive:', error.message);
                        // Optionally, you can handle the error here
                    });
            });

        });
    });
}

retrieveDataFromFirebase();

function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        window.location.href = "index.html";
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}

document.getElementById("logoutButton").addEventListener("click", function () {
    logoutUser();
});

function preventBack() {
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function () {
        history.pushState(null, document.title, location.href);
    });
}

window.onload = function () {
    preventBack();
}

