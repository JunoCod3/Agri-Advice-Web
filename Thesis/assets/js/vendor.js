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
const venref = database.ref('Vendors');
const ver_ = document.getElementById('p-1');
const notver_ = document.getElementById('v-1');
const vendor = document.getElementById('vendor');
const notvendor = document.getElementById('notVendor');
const displayVendor = document.getElementById('vendorContainer');

function ver() {
    notver_.style.color = "white";
    notver_.style.backgroundColor = "#527a63";
    notver_.style.width = "200px";
    notver_.style.transform = "none"
    notver_.style.fontSize = "17px"
    notver_.style.fontWeight = "bold"

    ver_.style.color = "black";
    ver_.style.backgroundColor = "aliceblue";
    ver_.style.width = "410px";
    ver_.style.transform = "scale(1.2)"
    ver_.style.fontWeight = "600"
    ver_.style.marginLeft = "40px"
    ver_.style.fontSize = "20px"

    vendor.style.display = "flex";
    notvendor.style.display = "none";
}

function notver() {
    ver_.style.color = "white";
    ver_.style.backgroundColor = "#527a63";
    ver_.style.width = "200px";
    ver_.style.transform = "none"
    ver_.style.marginLeft = "100px"
    ver_.style.fontSize = "17px"
    ver_.style.fontWeight = "bold"

    notver_.style.color = "black";
    notver_.style.backgroundColor = "aliceblue";
    notver_.style.width = "410px";
    notver_.style.transform = "scale(1.2)"
    notver_.style.fontWeight = "600"
    notver_.style.fontSize = "20px"

    vendor.style.display = "none";
    notvendor.style.display = "flex";
}


function getnotVendor() {
    venref.on('value', function (snapshot) {
        notvendor.innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            const ven = childSnapshot.val();

            if (ven.vendor == "false") {
                const container = document.createElement('div');
                container.classList.add('container');

                const container2 = document.createElement('div');
                container2.classList.add('container2');

                const vendorCon = document.createElement('div');
                vendorCon.classList.add('vendorCon');

                const vendorCon2 = document.createElement('div');
                vendorCon2.classList.add('vendorCon2');

                const vendorCon3 = document.createElement('div');
                vendorCon3.classList.add('vendorCon3');

                const Vendorname = document.createElement('h4');
                Vendorname.textContent = ven.vendorName;
                Vendorname.classList.add('Vendorname');

                const approve = document.createElement('h5');
                approve.textContent = "Approve"
                approve.classList.add('approve');

                approve.addEventListener('click', function (event) {
                    event.stopPropagation();
                    childSnapshot.ref.update({ vendor: "true" });
                    displayVendor.style.display = "none";
                });

                const notapprove = document.createElement('h5');
                notapprove.textContent = "Decline"
                notapprove.classList.add('notapprove');

                const venImage = document.createElement('img');
                if (ven.profileImage == null) {
                    venImage.src = "/assets/img/person.png";
                } else {
                    venImage.src = ven.profileImage;
                }
                venImage.classList.add('venImage');

                vendorCon3.appendChild(venImage);
                vendorCon.appendChild(Vendorname);
                vendorCon2.appendChild(approve);
                vendorCon2.appendChild(notapprove);
                container.appendChild(vendorCon3);
                container.appendChild(vendorCon);
                container.appendChild(vendorCon2);

                container.addEventListener("click", function () {

                    const displayVendor = document.getElementById('vendorContainer');
                    displayVendor.style.display = "flex";
                    displayVendor.innerHTML = "";

                    const imageVendor = document.createElement('img');
                    if (ven.profileImage == null) {
                        imageVendor.src = "/assets/img/person.png";
                    } else {
                        imageVendor.src = ven.profileImage;
                    }
                    imageVendor.classList.add('imageVendor');

                    const vName = document.createElement('h4');
                    vName.textContent = ven.vendorName;
                    vName.classList.add('vName');

                    const typeID = document.createElement('h4');
                    typeID.textContent = "Type of ID: " + ven.id;
                    typeID.classList.add('typeID');

                    const numID = document.createElement('h4');
                    numID.textContent = "ID No: " + ven.idNumber;
                    numID.classList.add('numID');

                    const idImage = document.createElement('img');
                    idImage.src = ven.idImageUrl;
                    idImage.classList.add('idImage');

                    const isVendor = document.createElement('h4');
                    if (ven.vendor == "true") {
                        isVendor.textContent = "Vendor";
                    } else {
                        isVendor.textContent = "Not Vendor";
                    }
                    isVendor.classList.add('isVendor');

                    const xButton = document.createElement('h4');
                    xButton.textContent = "Back";
                    xButton.classList.add('xButton');

                    xButton.addEventListener("click", function () {
                        displayVendor.style.display = "none";
                    })

                    const d1 = document.createElement('div');
                    d1.classList.add('d1');

                    const d2 = document.createElement('div');
                    d2.classList.add('d2');
                    
                    d2.appendChild(vName);
                    d2.appendChild(typeID);
                    d2.appendChild(numID);

                    d1.appendChild(imageVendor);
                    d1.appendChild(d2);

                    displayVendor.appendChild(xButton);
                    displayVendor.appendChild(d1);
                    displayVendor.appendChild(idImage);
                    displayVendor.appendChild(isVendor);
                })

                notvendor.appendChild(container);
            }
        })
    })
}
getnotVendor();

function getVendor() {
    venref.on('value', function (snapshot) {
        vendor.innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            const ven = childSnapshot.val();

            if (ven.vendor == "true") {
                const container = document.createElement('div');
                container.classList.add('container');

                const container2 = document.createElement('div');
                container2.classList.add('container2');

                const vendorCon = document.createElement('div');
                vendorCon.classList.add('vendorCon');

                const vendorCon2 = document.createElement('div');
                vendorCon2.classList.add('vendorCon2');

                const vendorCon3 = document.createElement('div');
                vendorCon3.classList.add('vendorCon3');

                const Vendorname = document.createElement('h4');
                Vendorname.textContent = ven.vendorName;
                Vendorname.classList.add('Vendorname');

                const disable = document.createElement('h5');
                disable.textContent = "Disable"
                disable.classList.add('disable');

                disable.addEventListener('click', function (event) {
                    event.stopPropagation();
                    childSnapshot.ref.update({ vendor: "false" });
                    //displayVendor.style.display = "none";
                });

                const venImage = document.createElement('img');
                if (ven.profileImage == null) {
                    venImage.src = "/assets/img/person.png";
                } else {
                    venImage.src = ven.profileImage;
                }
                venImage.classList.add('venImage');

                vendorCon3.appendChild(venImage);
                vendorCon.appendChild(Vendorname);
                vendorCon2.appendChild(disable);
                container.appendChild(vendorCon3);
                container.appendChild(vendorCon);
                container.appendChild(vendorCon2);

                container.addEventListener("click", function () {

                    displayVendor.style.display = "flex";
                    displayVendor.innerHTML = "";

                    const imageVendor = document.createElement('img');
                    if (ven.profileImage == null) {
                        imageVendor.src = "/assets/img/person.png";
                    } else {
                        imageVendor.src = ven.profileImage;
                    }
                    imageVendor.classList.add('imageVendor');

                    const vName = document.createElement('h4');
                    vName.textContent = ven.vendorName;
                    vName.classList.add('vName');

                    const typeID = document.createElement('h4');
                    typeID.textContent = ven.id;
                    typeID.classList.add('typeID');

                    const numID = document.createElement('h4');
                    numID.textContent = ven.idNumber;
                    numID.classList.add('numID');

                    const idImage = document.createElement('img');
                    idImage.src = ven.idImageUrl;
                    idImage.classList.add('idImage');

                    const isVendor = document.createElement('h4');
                    if (ven.vendor == "true") {
                        const vendor = document.createElement('h4');
                        isVendor.textContent = "Vendor";
                    } else {
                        veisVendorndor.textContent = "Not Vendor";
                    }
                    isVendor.classList.add('isVendor');

                    const xButton = document.createElement('h4');
                    xButton.textContent = "Back";
                    xButton.classList.add('xButton');

                    xButton.addEventListener("click", function () {
                        displayVendor.style.display = "none";
                    })

                    const d1 = document.createElement('div');
                    d1.classList.add('d1');

                    const d2 = document.createElement('div');
                    d2.classList.add('d2');
                    
                    d2.appendChild(vName);
                    d2.appendChild(typeID);
                    d2.appendChild(numID);

                    d1.appendChild(imageVendor);
                    d1.appendChild(d2);

                    displayVendor.appendChild(xButton);
                    displayVendor.appendChild(d1);
                    displayVendor.appendChild(idImage);
                    displayVendor.appendChild(isVendor);
                })

                vendor.appendChild(container);
            }
        })
    })
}
getVendor();

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

