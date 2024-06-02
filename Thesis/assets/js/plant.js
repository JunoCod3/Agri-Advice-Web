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
const firestore = firebase.firestore();

const pdfFileInput = document.getElementById('pdf-file');
const pdfTitleInput = document.getElementById('pdf-title');
const thumbnailFileInput = document.getElementById('thumbnail-file');
const pdfFrame = document.getElementById('pdf-frame');
const pdfPreview = document.getElementById('pdf-preview');
const thumbnailImg = document.getElementById('thumbnail-img');
const thumbnailPreview = document.getElementById('thumbnail-preview');
const statusDiv = document.getElementById('upload-status');
const uploadFormContainer = document.querySelector('.upload-form-container');
const showFormButton = document.getElementById('showformPdf');

showFormButton.addEventListener('click', function() {
    if (uploadFormContainer.style.display === 'none' || uploadFormContainer.style.display === '') {
        uploadFormContainer.style.display = 'inline';
    } else {
        uploadFormContainer.style.display = 'none';
    }
});

pdfFileInput.addEventListener('change', function() {
    const file = pdfFileInput.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        pdfFrame.src = fileURL;
        pdfPreview.classList.remove('hidden');
    } else {
        pdfFrame.src = '';
        pdfPreview.classList.add('hidden');
    }
});

thumbnailFileInput.addEventListener('change', function() {
    const file = thumbnailFileInput.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        thumbnailImg.src = fileURL;
        thumbnailPreview.classList.remove('hidden');
    } else {
        thumbnailImg.src = '';
        thumbnailPreview.classList.add('hidden');
    }
});

document.getElementById('pdf-upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    if (pdfFileInput.files.length === 0 || !pdfTitleInput.value) {
        statusDiv.textContent = 'Please select a PDF file, enter a title, and optionally choose a thumbnail.';
        return;
    }

    const file = pdfFileInput.files[0];
    const title = pdfTitleInput.value;
    const storageRef = storage.ref(`Plant Pdfs/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        function(snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            statusDiv.textContent = 'Upload is ' + progress + '% done';
        }, 
        function(error) {
            statusDiv.textContent = 'Upload failed: ' + error.message;
        }, 
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                let thumbnailURL = '';

                if (thumbnailFileInput.files.length > 0) {
                    const thumbnailFile = thumbnailFileInput.files[0];
                    const thumbnailStorageRef = storage.ref(`thumbnails/${thumbnailFile.name}`);
                    const thumbnailUploadTask = thumbnailStorageRef.put(thumbnailFile);

                    thumbnailUploadTask.on('state_changed',
                        null,
                        function(error) {
                            statusDiv.textContent = 'Thumbnail upload failed: ' + error.message;
                        },
                        function() {
                            thumbnailUploadTask.snapshot.ref.getDownloadURL().then(function(url) {
                                thumbnailURL = url;
                                saveFileMetadata(downloadURL, title, thumbnailURL);
                            });
                        }
                    );
                } else {
                    saveFileMetadata(downloadURL, title, thumbnailURL);
                }
            });
        }
    );
});

function saveFileMetadata(pdfURL, title, thumbnailURL) {
    firestore.collection("Plant Pdfs").add({
        pdfName: pdfFileInput.files[0].name,
        plantTitle: title,
        pdfUrl: pdfURL,
        iconUrl: thumbnailURL,
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        statusDiv.textContent = 'File and thumbnail uploaded successfully!';
        pdfFrame.src = '';
        pdfPreview.classList.add('hidden');
        pdfFileInput.value = '';
        pdfTitleInput.value = '';
        thumbnailImg.src = '';
        thumbnailPreview.classList.add('hidden');
        thumbnailFileInput.value = '';
        uploadFormContainer.classList.add('hidden');
    }).catch((error) => {
        statusDiv.textContent = 'Error saving file info: ' + error.message;
    });
}

// ===================== Add Button ==========================

