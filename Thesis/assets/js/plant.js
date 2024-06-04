const fbConfig = {
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

firebase.initializeApp(fbConfig);

const firestore = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();


//Add Plant
document.getElementById('btnUpload').addEventListener('click', function () {
    event.preventDefault();
    
    if(!checkNewPlantFields()){
        Swal.fire({
            title: 'Incomplete Details',
            text: 'Fill up all details to add plant',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal();

        return;
    }

    AddPlant();

    resetModal();

});

//Update Plant
document.getElementById('btnUpdatePlant').addEventListener('click', function () {
    event.preventDefault();
    
    const hiddenPlantId = document.getElementById('hiddenPlantId').value;

    if(!checkUpdateFields()){
        Swal.fire({
            title: 'No Title',
            text: 'Fill up the Title',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal();

        return;
    }

    updatePlant(hiddenPlantId);

    resetModal();

});


function checkNewPlantFields() {
   
    //Add Modal
    var Title = document.getElementById('pdf-title');
    var pdfFileInput = document.getElementById("pdf-file");
    var thumbnailFileInput = document.getElementById("thumbnail-file");

    console.log("title=>",Title.value.length);
    console.log("Pdf",pdfFileInput.files.length);
    console.log("Icon",thumbnailFileInput.files.length);

    if (Title.value.length > 0 && pdfFileInput.files.length > 0 && thumbnailFileInput.files.length > 0) {
        return true;
    }

    return false;
}

function checkUpdateFields(){
    //Update Modal
    var Title = document.getElementById('update-plant-title');
    var pdfFileInput = document.getElementById("update-pdf-file");
    var thumbnailFileInput = document.getElementById("update-thumbnail-file");

    console.log("title=>",Title.value.length);
    console.log("Pdf",pdfFileInput.files.length);
    console.log("Icon",thumbnailFileInput.files.length);

    if (Title.value.length > 0 ) {
        return true;
    }

    return false;
}

async function AddPlant() {

    try {

        // Modal
        const Title = document.getElementById('pdf-title').value;
        const pdfFileInput = document.getElementById("pdf-file");
        const thumbnailFileInput = document.getElementById("thumbnail-file");

        const pdfFileName = pdfFileInput.files[0].name;

        
        console.log(pdfFileInput.files[0].name);
        console.log(thumbnailFileInput.files[0].name);


        var uploadPromises = [];

        uploadPromises.push(uploadPlantFile(thumbnailFileInput.files[0]));
        uploadPromises.push(uploadPlantFile(pdfFileInput.files[0]));

        // const pdfPath = await uploadPlantFile(pdfFileInput.files[0]);

        var fileURLs = await Promise.all(uploadPromises);

        var plantData = {
            iconUrl: fileURLs[0],
            name: pdfFileName,
            pdfUrl: fileURLs[1],
            plantTitle: Title,
            uploadedAt: Date.now()
        };
        console.log(plantData);
        

        firestore.collection("Plant Pdfs").add(plantData)
        .then((docRef) => {

            console.log("Document written with ID: ", docRef.id);
            Swal.fire({
                title: 'New Plant Added',
                text: 'Successfully added new plant.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {

                window.location.href = window.location.href;

            });
        })
        .catch((error) => {

            console.error("Error adding document: ", error);

            Swal.fire({
                title: 'Error adding document',
                text: error,
                icon: 'warning',
                confirmButtonText: 'OK'
            });

            
        displayPlants();
        });

       
    } catch (error) {
        console.error("Error adding document: ", error);
        Swal.fire({
            title: 'Error adding document',
            text: error,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function updatePlant(hiddenPlantId) {
    try {

        // Modal elements
        const UpdateTitle = document.getElementById('update-plant-title').value;
        const UpdatepdfFileInput = document.getElementById("update-pdf-file");
        const UpdatethumbnailFileInput = document.getElementById("update-thumbnail-file");
     
        // Construct the update data
        var plantData = {
            plantTitle: UpdateTitle,
            updatedAt: Date.now()
        };

        if(UpdatepdfFileInput.files.length > 0){
            
            pdfUrl = await uploadPlantFile(UpdatepdfFileInput.files[0]);
            plantData.pdfUrl = pdfUrl;
            
        }

        if(UpdatethumbnailFileInput.files.length > 0){
            
            iconUrl = await uploadPlantFile(UpdatethumbnailFileInput.files[0]);
            
            plantData.iconUrl = iconUrl; 
        }

        // Update the Firestore document
        await firestore.collection("Plant Pdfs").doc(hiddenPlantId).update(plantData);

        Swal.fire({
            title: 'Plant Updated',
            text: 'Successfully updated plant.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            
            window.location.href = window.location.href;

        });

        displayPlants();
    } catch (error) {
        console.error("Error updating document: ", error);
        Swal.fire({
            title: 'Error updating document',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function uploadPlantFile(file) {
    return new Promise(function(resolve, reject) {
        var storageRef = storage.ref('Plant Pdfs/' + file.name);
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed', 
            function(snapshot) {
                // Handle progress here
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            function(error) {
                // Handle unsuccessful uploads
                console.error('Error uploading file: ', error);
                reject(error);
            }, 
            function() {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    resolve(downloadURL);
                });
            }
        );
    });
}

function resetModal(){

    const Title = document.getElementById('pdf-title');
    const pdfFileInput = document.getElementById("pdf-file");
    const thumbnailFileInput = document.getElementById("thumbnail-file");

    Title.value = "";
    pdfFileInput.value = "";
    thumbnailFileInput.value = "";

    Title.focus();

}


// ################ RETREIVE PLANTS DATA #####################

function displayPlants() {
   
    firestore.collection("Plant Pdfs").get().then((querySnapshot) => {

        querySnapshot.forEach((plant) => {

            // Retrieve data from the document
            const plantData = plant.data();

            // Create a new div element
            const newPlantDiv = document.createElement('div');
            newPlantDiv.className = 'plantDiv';
            newPlantDiv.style = "margin: 10px";
            // Construct the HTML content
            newPlantDiv.innerHTML = `
                <div class="card plant-card" style="width: 12rem;">
                    <img src="${plantData.iconUrl}" class="card-img-top" alt="Plant Icon">
                    <div class="card-body">
                        <h5 class="card-title">${plantData.plantTitle}</h5>
                        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" class="btn btn-info edit-btn btn-sm">
                                <i class="bi bi-pencil-square"></i> Edit
                            </button>
                            <button type="button" class="btn btn-danger delete-btn btn-sm">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Add event listener to show modal with plant details
            newPlantDiv.querySelector('.plant-card').addEventListener('click', function() {
                // Set modal title
                document.getElementById('plantModalLabel').innerText = plantData.plantTitle;
                // Set PDF content (assuming plantData.pdfUrl contains the URL to the PDF file)
                document.getElementById('pdfContent').src = plantData.pdfUrl;
                // Show the modal
                var plantModal = new bootstrap.Modal(document.getElementById('plantModal'));
                plantModal.show();

            });

            // Add event listener to the edit button
            newPlantDiv.querySelector('.edit-btn').addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent the card click event
                
                // Set the plant title and id in the update modal
                document.getElementById('hiddenPlantId').value = plant.id;

                document.getElementById('update-plant-title').value = plantData.plantTitle;

                document.getElementById('update-pdf-file').src = plantData.pdfUrl; 
                
                document.getElementById('update-thumbnail-file').src = plantData.iconUrl; 

                // Show the update modal
                var updatePlantModal = new bootstrap.Modal(document.getElementById('updatePlantModal'));
                updatePlantModal.show();
            });

            // Add event listener to the delete button
            newPlantDiv.querySelector('.delete-btn').addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent the card click event

                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to delete the plant. This action cannot be undone.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, cancel it!'
                }).then((result) => {

                    if (result.isConfirmed) {
                        
                        
                        firestore.collection("Plant Pdfs").doc(plant.id).delete().then(() => {
                      
                            Swal.fire(
                                'Plant successfully deleted!!',
                                'Plant ' + plantData.plantTitle +' has been cancelled.',
                                'success'
                            );
                            
                            window.location.href = window.location.href;

                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                            alert("An error occurred while deleting the plant. Please try again later.");
                        });

                     
                    }
                });


            });

            // Append the new div to the plants-container
            document.getElementById('plants-container').appendChild(newPlantDiv);
        });
    });
}

displayPlants();


function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        window.location.href = "index.html";
        sessionStorage.setItem("isLoggedIn", "false");
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}