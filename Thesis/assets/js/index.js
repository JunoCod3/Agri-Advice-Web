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

const firestore = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();
var markerplaceRef = firebase.database().ref('Marketplace');
var vendorsRef = firebase.database().ref('Vendors');
var paymentRef = firebase.database().ref('Order');
var usersCollectionRef = firestore.collection('Users');

function getNodeCounts() {


    markerplaceRef.orderByChild("category").equalTo("2").once('value')
        .then(function (markerplaceSnapshot) {
            const total_product = document.getElementById('totalP');
            var markerplaceCount = markerplaceSnapshot.numChildren();
            console.log("Number of nodes in Marketplace with mTitle equal to '2': " + markerplaceCount);
            total_product.textContent = markerplaceCount;
        })
        .catch(function (error) {
            console.error("Error fetching Marketplace data:", error);
        });

    vendorsRef.orderByChild("vendor").equalTo("true").once('value')
        .then(function (vendorsSnapshot) {
            const total_vendors = document.getElementById('totalV');
            var vendorsCount = vendorsSnapshot.numChildren();
            console.log("Number of vendors with value equal to 'true': " + vendorsCount);
            total_vendors.textContent = vendorsCount;
        })
        .catch(function (error) {
            console.error("Error fetching Vendors data:", error);
        });

    paymentRef.orderByChild("recieved").equalTo("true").once('value')
        .then(function (orderSnapshot) {
            const total_order = document.getElementById('totalO');
            var ordersCount = orderSnapshot.numChildren();
            console.log("Number of vendors with value equal to 'true': " + ordersCount);
            total_order.textContent = ordersCount;
        })
        .catch(function (error) {
            console.error("Error fetching Vendors data:", error);
        });
    usersCollectionRef.get()
        .then(function (querySnapshot) {
            const total_users = document.getElementById('totalA');
            var usersCount = querySnapshot.size;
            console.log("Number of documents in Users: " + usersCount);
            total_users.textContent = usersCount;
        })
        .catch(function (error) {
            console.error("Error fetching Users data:", error);
        });
}

getNodeCounts();


var orderRef = firebase.database().ref('Order');

function sales() {
    var salesCon = document.getElementById('container');

    orderRef.on('value', function(snapshot) {
        salesCon.innerHTML = '';

        const salesData = [];
        const titleReceivedCounts = {}; // Object to track received counts for each title
        const displayedTitles = {}; // Object to track displayed titles

        snapshot.forEach(function(childSnapshot) {
            const postData = childSnapshot.val();
            salesData.push(postData);
            // Increment count if received is true
            if (postData.recieved === "true") {
                // Increment received count for the title
                if (titleReceivedCounts[postData.title]) {
                    titleReceivedCounts[postData.title]++;
                } else {
                    titleReceivedCounts[postData.title] = 1;
                }
            }
        });

        // Sort salesData based on the count of received orders in descending order
        salesData.sort(function(a, b) {
            const countA = titleReceivedCounts[a.title] || 0;
            const countB = titleReceivedCounts[b.title] || 0;
            return countB - countA; // Sort descending
        });

        salesData.forEach(function(postData) {
            const receivedCount = titleReceivedCounts[postData.title];

            // Display the title only if it hasn't been displayed yet and received count is not null
            if (!displayedTitles[postData.title] && receivedCount != null) {
                const div = document.createElement('div');
                div.classList.add('saleDiv');

                const imageM = document.createElement('img');
                imageM.classList.add('imageM');
                imageM.src = postData.image;

                const titleM = document.createElement('h3');
                titleM.classList.add('titleM');
                titleM.textContent = postData.title;

                const vendorM = document.createElement('h3');
                vendorM.classList.add('vendorM');
                vendorM.textContent = postData.vendor;

                const orderNo = document.createElement('h3');
                orderNo.classList.add('orderNo');
                // Display the count of received orders for the title
                orderNo.textContent = receivedCount;

                div.appendChild(imageM);
                div.appendChild(titleM);
                div.appendChild(vendorM);
                div.appendChild(orderNo);

                salesCon.appendChild(div);

                // Mark the title as displayed
                displayedTitles[postData.title] = true;
            }
        });
    });
}

sales();



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


