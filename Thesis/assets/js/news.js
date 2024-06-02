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



// ================ Add News ===========================


const image = document.querySelector(".images");
const metaData2 = document.querySelector(".metaData2");
const imageDa = document.querySelector(".imageDa");
let files;


const getImageData = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "imageContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = '/assets/img/delete1.png';
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        imageDa.appendChild(imageData);
    }
}

const selectImage = () => {
    image.click();
}


// ================ Edit News ===========================

let selectedImagesFiles;
const imageDa1 = document.querySelector(".imageDa1");


const getImageData1 = (e) => {
    const files = e.target.files;
    selectedImagesFiles = files;

    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "imageContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton";
        deselectButton.src = '/assets/img/delete1.png';
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };

        imageData.appendChild(image);
        imageData.appendChild(deselectButton);

        imageDa1.appendChild(imageData);
    }
}

const selectImage1 = () => {
    const image1 = document.querySelector(".images1");
    image1.click();
}


// ========================= Reset ============================

function resetForm() {
    // Reset the values of input fields in the form
    addPlantForm.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the displayed image data for the additional images
    const imageDataSpan = document.querySelector('.imageDa');
    imageDataSpan.textContent = "";

    addPlantForm1.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the displayed image data for the additional images
    const imageDataSpan1 = document.querySelector('.imageDa1');
    imageDataSpan.textContent = "";


}

const addPlantForm = document.getElementById('addNews');
document.getElementById('showFormButton').addEventListener('click', function () {
    addPlantForm.style.display = 'inline';
    document.getElementById('sidebar').style.filter = "blur(2px)";
    document.getElementById('sidebar1').style.filter = "blur(2px)";
    resetForm();
});
document.getElementById('close').addEventListener('click', function () {
    addPlantForm.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm();
});

const addPlantForm1 = document.getElementById('addNews1');
document.getElementById('close1').addEventListener('click', function () {
    addPlantForm1.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm();
});







// ======================= Upload to Firebase ================================

const progress = document.getElementById('progress');
const percentage = document.getElementById('percentage');

function uploadData() {
    const bar = document.getElementById('uploadBar');
    bar.style.display = "inline";

    var title = document.getElementById('identification').value;
    var descrip1 = document.getElementById('descrip').value;
    var input = document.getElementById('images');
    var imageFiles = input.files;

    var currentDate = new Date();
    var currentDateNumber = currentDate.getDate();
    var currentMonth = currentDate.getMonth() + 1;
    var currentYear = currentDate.getFullYear();

    var formattedDate = `${currentMonth}/${currentDateNumber}/${currentYear}`;

    var currentHours = currentDate.getHours();
    var amOrPm = currentHours >= 12 ? 'PM' : 'AM';
    var currentHour12 = currentHours % 12 || 12;
    var currentMinutes = currentDate.getMinutes();
    var currentSeconds = currentDate.getSeconds();

    var formattedTime = `${currentHour12}:${currentMinutes}:${currentSeconds} ${amOrPm}`;

    var uploadPromises = [];

    // Get the current user
    var user = firebase.auth().currentUser;

    if (!user) {
        console.error('No user is signed in.');
        return; // Exit the function if no user is signed in
    }

    for (var i = 0; i < imageFiles.length; i++) {
        var imageFile = imageFiles[i];
        var imageName = imageFile.name;
        var storageRef = firebase.storage().ref('images/' + imageName);
        var uploadTask = storageRef.put(imageFile);

        // Update progress bar while uploading
        uploadTask.on('state_changed',
            function progress(snapshot) {
                var progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log('Upload is ' + progressPercentage + '% done');

                // Update progress bar
                percentage.innerHTML = progressPercentage + "%";
                progress.style.width = progressPercentage + "%";
            },
            function error(error) {
                console.error('Error uploading images: ', error);
            },
            function complete() {
                console.log('Upload completed successfully!');
            }
        );


        uploadPromises.push(uploadTask);
    }

    Promise.all(uploadPromises).then(function (snapshot) {

        var imageUrls = [];

        snapshot.forEach(function (childSnapshot) {
            childSnapshot.ref.getDownloadURL().then(function (downloadURL) {
                imageUrls.push(downloadURL);
                const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log('Upload is ' + progressPercentage + '% done');

                // Update progress bar
                percentage.innerHTML = progressPercentage + "%";
                progress.style.width = progressPercentage + "%";

                if (imageUrls.length === imageFiles.length) {
                    // Retrieve the username from the "Admin" node in the database
                    firebase.database().ref('Admin/' + user.uid + '/username').once('value').then(function (snapshot) {
                        var username = snapshot.val(); // Retrieve the username

                        var postData = {
                            title: title,
                            descrip: descrip1,
                            imageUrls: imageUrls,
                            uploadDate: formattedDate,
                            uploadTime: formattedTime,
                            userId: user.uid,
                            username: username
                        };

                        var postId = firebase.database().ref().child('News').push().key;
                        firebase.database().ref('News/' + postId).set(postData).then(function () {
                            console.log('Data uploaded successfully!');
                            document.getElementById('uploadBar').style.display = "none";
                            const addNews = document.getElementById('addNews');
                            const alert = document.getElementById('alert');
                            document.getElementById('sidebar').style.filter = "none";
                            document.getElementById('sidebar1').style.filter = "none";
                            document.getElementById('sidebar').style.filter = "blur(5px)";
                            document.getElementById('sidebar1').style.filter = "blur(5px)";
                            addNews.style.display = 'none';
                            alert.style.display = 'inline';
                            document.getElementById('okayButton').addEventListener('click', function () {
                                alert.style.display = 'none';
                                document.getElementById('sidebar').style.filter = "none";
                                document.getElementById('sidebar1').style.filter = "none";
                            });
                        }).catch(function (error) {
                            console.error('Error uploading data: ', error);
                        });
                    }).catch(function (error) {
                        console.error('Error retrieving username from database: ', error);
                    });
                }
            });
        });
    }).catch(function (error) {
        console.error('Error uploading images: ', error);
    });
}


//   ====================== Display News ============================

function retrieveAndDisplayData() {
    var postsRef = database.ref('News');
    var postsContainer = document.getElementById('postsContainer');

    postsRef.on('value', function (snapshot) {
        postsContainer.innerHTML = '';

        // Collect posts data in an array for sorting
        var postsArray = [];

        snapshot.forEach(function (childSnapshot) {
            var postData = childSnapshot.val();
            var postId = childSnapshot.key;

            postsArray.push({
                id: postId,
                data: postData
            });
        });

        // Sort posts by uploadDate and uploadTime (assuming uploadDate is in format 'YYYY-MM-DD' and uploadTime is in 'HH:MM' 24-hour format)
        postsArray.sort(function (a, b) {
            var dateA = new Date(a.data.uploadDate + ' ' + a.data.uploadTime);
            var dateB = new Date(b.data.uploadDate + ' ' + b.data.uploadTime);
            return dateB - dateA; // Sort in descending order (most recent first)
        });

        // Display sorted posts
        postsArray.forEach(function (postObj) {
            var postData = postObj.data;
            var postId = postObj.id;
            var title = postData.title;
            var imageUrls = postData.imageUrls;

            var postDiv = document.createElement('div');
            postDiv.classList.add('post');

            var postDiv2 = document.createElement('div');
            postDiv2.classList.add('post2');

            var postDiv3 = document.createElement('div');
            postDiv3.classList.add('post3');

            var postDiv4 = document.createElement('div');
            postDiv4.classList.add('post4');

            var postDiv5 = document.createElement('div');
            postDiv5.classList.add('post5');

            var postDiv6 = document.createElement('div');
            postDiv6.classList.add('post6');

            var postDiv7 = document.createElement('div');
            postDiv7.classList.add('post7');

            var postDiv8 = document.createElement('div');
            postDiv8.classList.add('post8');

            var imagesDiv = document.createElement('div');
            imagesDiv.classList.add('imagesDiv');

            var titleElement = document.createElement('h3');
            titleElement.textContent = title;
            titleElement.classList.add('titleElement');

            var description = document.createElement('h3');
            description.textContent = postData.descrip;
            description.classList.add('description');

            if (imageUrls) {
                imageUrls.forEach(function (imageUrl) {
                    var imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.classList.add('post-image');
                    imagesDiv.appendChild(imgElement);
                });
            }

            var deleteB = document.createElement('h3');
            deleteB.textContent = "Delete";
            deleteB.classList.add('deleteB');

            var editB = document.createElement('h3');
            editB.textContent = "Edit";
            editB.classList.add('editB');

            deleteB.addEventListener("click", function (event) {
                event.stopPropagation();
                const confirmDelete = confirm("Are you sure you want to delete this item?");
                if (confirmDelete) {
                    deletePostFromFirebase(postId);
                }
            });

            editB.addEventListener("click", function (event) {
                event.stopPropagation();

                document.getElementById('addNews1').style.display = "inline";
                document.getElementById('sidebar').style.filter = "blur(2px)";
                document.getElementById('sidebar1').style.filter = "blur(2px)";

                const newsKey = postId;
                const newsRef = firebase.database().ref('News/' + newsKey);

                const imageDa1 = document.getElementById('imageDa1');
                imageDa1.innerHTML = "";

                if (postData.imageUrls) {
                    postData.imageUrls.forEach((imageURL, index) => {
                        const imageData = document.createElement("div");
                        imageData.className = "imageContainer";

                        const image = document.createElement("img");
                        image.className = "fileData";
                        image.src = imageURL;

                        const deselectButton = document.createElement("img");
                        deselectButton.className = "deselectButton";
                        deselectButton.src = "/assets/img/delete1.png";
                        deselectButton.onclick = function () {
                            imageData.remove();
                        };

                        imageData.appendChild(image);
                        imageData.appendChild(deselectButton);
                        imageDa1.appendChild(imageData);
                    });
                }

                document.getElementById('identification1').value = postData.title;
                document.getElementById('descrip1').value = postData.descrip;

                document.getElementById('uploadAlldata1').addEventListener('click', () => {
                    const updatedTtile = document.getElementById('identification1').value;
                    const updateddescrip = document.getElementById('descrip1').value;

                    newsRef.update({
                        title: updatedTtile,
                        descrip: updateddescrip
                    });

                    if (selectedImagesFiles) {
                        const promises = [];
                        for (let i = 0; i < selectedImagesFiles.length; i++) {
                            const file = selectedImagesFiles[i];
                            const storageRef = firebase.storage().ref('path/to/storage');
                            const imageRef = storageRef.child(file.name);

                            const uploadTask = imageRef.put(file).then((snapshot) => {
                                return snapshot.ref.getDownloadURL();
                            }).then((downloadURL) => {
                                return downloadURL;
                            }).catch((error) => {
                                console.error('Error uploading image:', error);
                            });

                            promises.push(uploadTask);
                        }

                        Promise.all(promises).then((urls) => {
                            newsRef.update({ imageUrls: urls });
                        }).catch((error) => {
                            console.error('Error updating images:', error);
                        });
                    }

                    const alertUpdate = document.getElementById('updateAlert');
                    alertUpdate.style.display = "inline";
                    document.getElementById('addNews1').style.display = "none";

                    const okayUpdate = document.getElementById('okayUpdate');
                    okayUpdate.addEventListener('click', () => {
                        alertUpdate.style.display = "none";
                        document.getElementById('sidebar').style.filter = "none";
                        document.getElementById('sidebar1').style.filter = "none";
                    });
                });
            });

            const pageName = document.createElement('h3');
            pageName.textContent = "Agri-Advice";
            pageName.classList.add('pageName');

            const time = document.createElement('h3');
            time.textContent = postData.uploadTime;
            time.classList.add('time');

            const admin = document.createElement('h3');
            admin.textContent = "by: " + postData.username;
            admin.classList.add('admin');

            const dateA = document.createElement('h3');
            dateA.textContent = postData.uploadDate;
            dateA.classList.add('dateA');

            var adminImg = document.createElement('img');
            adminImg.src = "/assets/img/logo.png";
            adminImg.classList.add('adminImg');

            postDiv7.appendChild(pageName);
            postDiv7.appendChild(dateA);

            postDiv3.appendChild(postDiv7);
            postDiv3.appendChild(time);
            postDiv3.appendChild(admin);

            postDiv4.appendChild(adminImg);

            postDiv5.appendChild(postDiv4);
            postDiv5.appendChild(postDiv3);

            postDiv8.appendChild(editB);
            postDiv8.appendChild(deleteB);

            postDiv6.appendChild(postDiv5);
            postDiv6.appendChild(titleElement);
            postDiv6.appendChild(description);
            postDiv6.appendChild(imagesDiv);
            postDiv6.appendChild(postDiv8);

            postsContainer.appendChild(postDiv6);
        });
    });
}



function deletePostFromFirebase(postId) {
    database.ref('News/' + postId).remove()
        .then(function () {
            console.log("Post deleted successfully!");
        })
        .catch(function (error) {
            console.error("Error deleting post: ", error);
        }
    );
}

retrieveAndDisplayData();


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


