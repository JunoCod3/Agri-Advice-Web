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
console.log(isLoggedIn);
if (!isLoggedIn) {
  window.location.href = "index.html";
}

firebase.initializeApp(fbConfig);

const firestore = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();
var markerplaceRef = firebase.database().ref('Marketplace');
var vendorsRef = firebase.database().ref('Vendors');
var paymentRef = firebase.database().ref('Order');
var usersCollectionRef = firestore.collection('Users');
var Complaints = firestore.collection('Complaints');

// Function to fetch documents from Firestore and populate the table
function fetchComplaints() {

    var row = "";

    firestore.collection("Complaints").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Retrieve data from the document
            const complaintData = doc.data();

            
            if (complaintData.isResolved === null || typeof complaintData.isResolved === "undefined") {
                firestore.collection("Complaints").doc(doc.id).update({
                    isResolved: "Unresolved" 
                }).then(() => {
                    console.log("Document successfully updated with isResolved field.");
                }).catch((error) => {
                    console.error("Error updating document:", error);
                });
            }
            const path = `Complaints/${doc.id}/Chats`;

            firestore.collection(path).orderBy("timestamp", "asc").limit(1).get().then((querySnapshot) => {

                querySnapshot.forEach((doc1) => {
                    const chatData = doc1.data();

                    row = `
                        <tr>
                            <td>${chatData.sender}</td>
                            <td>${chatData.senderName}</td>
                            <td>${chatData.sender}</td>
                            <td>${chatData.message}</td>
                            <td><img src="${chatData.images}" alt="Evidence" width="50"/></td>
                            <td>
                                <button class="btn ${complaintData.isResolved === 'Resolved' ? 'btn-success' : 'btn-danger'}">
                                    ${complaintData.isResolved === 'Resolved' ? complaintData.isResolved : 'Unresolved'}
                                </button>
                            </td>
                            <td>
                                <button id="${doc.id}" class="btn btn-success chats-btn">Chats</button>
                                <button class="btn btn-secondary view-btn" data-complaint-number="${chatData.sender}" data-customer="${chatData.senderName}"
                                data-email="${chatData.sender}" data-complaint="${chatData.message}"
                                data-evidence="${chatData.images}" data-status="${complaintData.isResolved}"">View</button>
                            </td>
                        </tr>
                    `;

                    document.getElementById('hiddenFieldOrgsender').value = chatData.senderName;
                    document.getElementById('hiddenFieldOrgSenderemail').value = chatData.sender;
                    document.getElementById('hiddenFieldOrgAdmin').value = chatData.receiverName;
                    document.getElementById('hiddenFieldOrgAdminEmail').value = chatData.receiver;

                    const participants = complaintData.participants;

                    if (participants && Array.isArray(participants)) {
                        for (let i = 0; i < participants.length; i++) {
                            const email = participants[i];

                            // Now you can use the email value as needed
                            if(i ==1)
                                {
                                    document.getElementById('hiddenFieldOrgAdminEmail').value = email;
                                }
                                else
                                {
                                    document.getElementById('hiddenFieldOrgSenderemail').value = email;
                                }
                        }
                    }


                    $('#example').DataTable().row.add($(row)[0]).draw();

                    //Open Chat (button)
                    document.getElementById(doc.id).addEventListener('click', function () {
                        $('#chats').modal('show');

                        //Get Chats from Firestore
                        const path = `Complaints/${doc.id}/Chats`;

                        firestore.collection(path).orderBy("timestamp", "asc").get().then((querySnapshot) => {

                            document.getElementById('chatBody').innerHTML = '';

                            querySnapshot.forEach((doc1) => {

                                const chatsData = doc1.data();

                                // Create a new div element for each chat message
                                const newChatDiv = document.createElement('div');
                                document.getElementById('hiddenField').value = doc.id;

                                appendMessage(chatsData,complaintData.participants[0]);
                              
                            });



                        });
                    });

                    //View Complaint Details
                    $('.view-btn').on('click', function () {
                        var complaintNumber = $(this).data('complaint-number');
                        var customer = $(this).data('customer');
                        var email = $(this).data('email');
                        var complaint = $(this).data('complaint');
                        var evidence = $(this).data('evidence');
                        var status = $(this).data('status');

                        $('#modalComplaintNumber').text(complaintNumber);
                        $('#modalCustomer').text(customer);
                        $('#modalEmail').text(email);
                        $('#modalComplaintText').text(complaint);
                        $('#modalEvidence').attr('src', evidence);
                        $('#modalStatus').text(status);

                        $('#complaintModal').modal('show');
                    });

                });
                
            });
        });
    });

    $('#example').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                pageSize: 'A4'
            },
            {
                extend: 'excelHtml5'
            }
        ]
    });
}

fetchComplaints();



function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        window.location.href = "index.html";
        sessionStorage.setItem("isLoggedIn", "false");
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}

document.getElementById("fileInput").addEventListener("change", function() {
    attachFiles();
});

document.getElementById('sendmessage').addEventListener('click',async function () {
    // Get the message from the input field
    const message = document.getElementById('message').value;
    
    var attachments = document.querySelectorAll(".attachment-item img");

    // Check if the message is not empty
    if (message.trim() !== '') {

        var compaintId =  document.getElementById('hiddenField').value;
         

        // Upload files and get their URLs
        var fileInput = document.getElementById("fileInput");

        var files = fileInput.files;
        
        var uploadPromises = [];

        for (var i = 0; i < files.length; i++) {
            uploadPromises.push(uploadFile(files[i]));
        }

        var fileURLs = await Promise.all(uploadPromises);


        // Pass the message to your desired function or process
        const img  = [];
        // Assuming you have the required data
        const data = {
            images : fileURLs,
            message: message,
            receiver: document.getElementById('hiddenFieldOrgSenderemail').value,
            receiverName: document.getElementById('hiddenFieldOrgsender').value,
            sender: document.getElementById('hiddenFieldOrgAdmin').value,
            senderName: document.getElementById('hiddenFieldOrgAdminEmail').value,
            timestamp: Date.now()
        };


        // Constructing the path
        const path = `Complaints/${document.getElementById('hiddenField').value}/Chats`;

        // Adding data to Firestore
        firestore.collection(path).add(data)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

      


        $("#message").val('');
        $("#message").focus();

        var attachmentPreview = document.getElementById("attachmentPreview");
        attachmentPreview.innerHTML = "";

        // Here you can add code to send the message to Firestore or perform any other action
    } else {
        // Handle case where message is empty
        console.log("Message is empty");
    }
});

firestore.collection("Complaints").onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {

        const complaintId = change.doc.id;

        const user = change.doc.data().participants[0];

        const chatsRef = firestore.collection(`Complaints/${complaintId}/Chats`);

        chatsRef.onSnapshot((chatsSnapshot) => {
            chatsSnapshot.docChanges().forEach((chatChange) => {
                if (chatChange.type === "added") {

                    const chatsData = chatChange.doc.data();

                    appendMessage(chatsData,user);
                }
            });
        });
    });
});


function appendMessage(chatsData, user) {

    const newChatDiv = document.createElement('div');
    
    // Function to format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    const formattedTimestamp = formatTimestamp(chatsData.timestamp);
    const isSender = chatsData.sender == user;
    // const messageClass = isSender ? "bg-blue-500 text-white" : "bg-white";
    const messageClass ="bg-blue-500 text-white";
    const alignmentClass = isSender ? "justify-end" : "";
    const avatarAlignmentClass = isSender ? "ml-2" : "mr-2";
    

    let imageurldiv = '';
    if (chatsData.images && Array.isArray(chatsData.images)) {
        imageurldiv = chatsData.images
            .filter(image => image)
            .map(image => `
                <div class="flex ${alignmentClass} items-center mb-2">${isSender ? '' : '<img src="" alt="" class="w-0 h-8 rounded-full mr-2" crossorigin="anonymous">'}
                    <div class="${messageClass} p-2 rounded-lg">
                    ${
                        getFileNameFromUrl(image).toLowerCase().endsWith('.pdf') ? 
                                 `<a href="`+ image +`" target="_blank">PDF File: `+getFileNameFromUrl(image)+`</a></div>` :
                                 `<img src="`+ image +`" class="max-w-xs"></div>` 
                    }
                                        
                    ${isSender ? '<img src="" alt="" class="w-0 h-8 rounded-full ml-2" crossorigin="anonymous">' : ''}
                </div>
            `).join('');
    }

    
    newChatDiv.innerHTML = `
        <div class="flex ${alignmentClass} items-center mb-2 ">
            ${isSender ? '' : '<img src="" alt="John Doe" class="w-0 h-8 rounded-full mr-2" crossorigin="anonymous">'}
            <div class="${messageClass} p-2 rounded-lg max-w-md">${chatsData.message}</div>
            ${isSender ? '<img src="" alt="" class="w-0 h-8 rounded-full ml-2" crossorigin="anonymous">' : ''}
        </div>
        ${imageurldiv}
        <div class="flex ${alignmentClass} items-center mb-2 text-xs text-gray-500 mt-1">
            ${formattedTimestamp}
        </div>
    `;

    document.getElementById('chatBody').appendChild(newChatDiv);
}

function getFileNameFromUrl(url) {
    // Create a URL object

    const parsedUrl = new URL(url);

    // Get the pathname (which includes the file name)
    const pathname = parsedUrl.pathname;

    // Split the pathname by '/' and get the last segment (the file name)
    const fileName = pathname.split('/').pop();

    const fileName1 = fileName.replace('images%2F','');
    const fileName2 =  fileName1.replace('%20/g',' ');
    
    return fileName2;
}

function uploadFile(file) {
    return new Promise(function(resolve, reject) {
        var storageRef = storage.ref('images/' + file.name);
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed', 
            function(snapshot){
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


function attachFiles() {
    
    var fileInput = document.getElementById("fileInput");
    var files = fileInput.files;

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(e) {
                    var attachmentPreview = document.getElementById("attachmentPreview");

                    var imagePreview = document.createElement("div");
                    imagePreview.classList.add("attachment-item");

                    var image = document.createElement("img");
                    image.src = e.target.result;

                    var removeButton = document.createElement("button");
                    removeButton.innerHTML = "&times;";
                    removeButton.classList.add("remove-button");
                    removeButton.addEventListener("click", function() {
                        imagePreview.remove();
                    });

                    imagePreview.appendChild(image);
                    imagePreview.appendChild(removeButton);

                    attachmentPreview.appendChild(imagePreview);
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
}

document.getElementById('resolved').addEventListener('click', function() {
    const complaintId = document.getElementById('hiddenField').value;
    const complaintRef = firestore.collection('Complaints').doc(complaintId);

    // Update the isResolved field to "Resolved" in Firestore
    complaintRef.update({
        isResolved: "Resolved"
    })
    .then(() => {
        console.log('Complaint marked as resolved successfully.');
        // fetchComplaints();
        window.location.href = window.location.href;
    })
    .catch((error) => {
        console.error('Error marking complaint as resolved:', error);
    });

});



