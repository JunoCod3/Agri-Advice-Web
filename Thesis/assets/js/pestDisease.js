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
const storage = firebase.storage();
const database = firebase.database();
const agriAdviceDB = database.ref('plants');
const pestsContainer2 = document.getElementById('detail-pestsDisease');


// ========================== Add Pest ====================================

const images = document.getElementById('icon1');
const textTitle = document.getElementById('title1');
const textIdentify = document.getElementById('identfication1');
const textDamage = document.getElementById('damage1');
const textPhysical = document.getElementById('physical1');
const textChemical = document.getElementById('chemical1');
const progress = document.getElementById('progress');
const percentage = document.getElementById('percentage');

function uploadPest() {

    const bar = document.getElementById('uploadBar');
    bar.style.display = "inline";

    const file = images.files[0];
    const Title = textTitle.value;
    const Identify = textIdentify.value;
    const Damage = textDamage.value;
    const Physical = textPhysical.value;
    const Chemical = textChemical.value;

    const storageRef = firebase.storage().ref('images/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Calculate progress percentage
            const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + progressPercentage + '% done');

            // Update progress bar
            percentage.innerHTML = progressPercentage + "%";
            progress.style.width = progressPercentage + "%";
        },
        (error) => {
            console.error('Error uploading image:', error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebase.database().ref('Pests').push({
                    title: Title,
                    identify: Identify,
                    damage: Damage,
                    physical: Physical,
                    chemical: Chemical,
                    imageUrl: downloadURL
                }).then(() => {
                    document.getElementById('uploadBar').style.display = "none";
                    console.log('Image and text uploaded successfully.');
                    const addPestsForm = document.getElementById('addPests');
                    addPestsForm.style.display = 'none';
                    const alert = document.getElementById('alert');
                    alert.style.display = 'inline';
                    document.getElementById('okayButton').addEventListener('click', function () {
                        alert.style.display = 'none';
                        document.getElementById('sidebar').style.filter = "none";
                        document.getElementById('sidebar1').style.filter = "none";
                    });
                    resetForm2();
                }).catch((error) => {
                    console.error('Error uploading text:', error);
                });
            });
        }
    );
}


// ================= Display Pests =============================

// Function to retrieve and display uploaded images and text
// function displayPests() {
//     const uploadsRef = firebase.database().ref('Pests');

//     const pestsContainer = document.getElementById('detail-display');

//     uploadsRef.on('value', (snapshot) => {
//         pestsContainer.innerHTML = '';
//         snapshot.forEach((childSnapshot) => {
//             const pests = childSnapshot.val();
//             const imageUrl = pests.imageUrl;
//             const title = pests.title;

//             if (imageUrl && title) {
//                 const pestsDiv = document.createElement('div');
//                 pestsDiv.classList.add('divPests');

//                 const iconElement = document.createElement('img');
//                 iconElement.src = imageUrl;
//                 iconElement.classList.add('icons');

//                 const titleElement = document.createElement('h2');
//                 titleElement.textContent = title;
//                 titleElement.classList.add('titles');

//                 const edimove = document.createElement('div');
//                 edimove.classList.add("edimove");

//                 const editIcon = document.createElement('img');
//                 editIcon.src = 'assets/img/edit1.png';
//                 editIcon.classList.add('editIcon');
//                 editIcon.alt = 'Edit';

//                 const deleteIcon = document.createElement('img');
//                 deleteIcon.src = 'assets/img/delete1.png';
//                 deleteIcon.classList.add('deleteIcon');
//                 deleteIcon.alt = 'Delete';

//                 edimove.appendChild(editIcon);
//                 edimove.appendChild(deleteIcon);

//                 deleteIcon.addEventListener('click', (event) => {
//                     event.stopPropagation();
//                     edimove.style.display = "none"; // Hides the confirmation dialog and the edit/delete icons
//                     const pestsTitle = pests.title;
//                     const pestsRef = firebase.database().ref('Pests');

//                     pestsRef.orderByChild('title').equalTo(pestsTitle).once('value')
//                         .then(snapshot => {
//                             snapshot.forEach(childSnapshot => {
//                                 const plantKey = childSnapshot.key;
//                                 const plantRef = firebase.database().ref('plants/' + plantKey);

//                                 // Move plant to 'archive'
//                                 const archiveRef = firebase.database().ref('archive').push();
//                                 archiveRef.set(childSnapshot.val()) // move the data to archive

//                                 // Remove the plant from 'plants'
//                                 plantRef.remove()
//                                     .then(() => {
//                                         // Plant removed successfully from 'plants'
//                                         console.log('Plant removed successfully from plants');
//                                         // Now, let's remove the plantDiv from the UI
//                                         // You can add UI manipulation code here if needed
//                                     })
//                                     .catch(error => {
//                                         // Error occurred while removing the plant from plants
//                                         console.error('Error removing plant from plants:', error.message);
//                                         // Optionally, you can handle the error here
//                                     });
//                             });
//                         })
//                         .catch(error => {
//                             // Error occurred while querying the plants database
//                             console.error('Error querying plants database:', error.message);
//                             // Optionally, you can handle the error here
//                         });
//                 });


//                 editIcon.addEventListener('click', (event) => {
//                     event.stopPropagation();
//                     document.getElementById('edit_plant').style.display = "inline";

//                     icon.innerHTML = '';

//                     document.getElementById('title2').value = plant.title;
//                     document.getElementById('category2').value = plant.category;
//                     document.getElementById('description2').value = plant.description;
//                     document.getElementById('dept2').value = plant.depth;
//                     document.getElementById('water2').value = plant.water;
//                     document.getElementById('sun2').value = plant.sun;
//                     document.getElementById('temp2').value = plant.temperature;
//                     document.getElementById('grow2').value = plant.grow;
//                     document.getElementById('planting2').value = plant.planting;
//                     document.getElementById('feed2').value = plant.feed;
//                     document.getElementById('harv2').value = plant.harvest;
//                     document.getElementById('stor2').value = plant.storage;
//                     document.getElementById('rangeValue2').textContent = plant.rangeValue;
//                     document.querySelector(".metaData2");
//                     retrieveIcon();
//                     retrieveImages();
//                     retrievePest();


//                 });



//                 pestsDiv.addEventListener('click', () => {
//                     const detailPests = document.getElementById('detailPestandDisease');
//                     detailPests.innerHTML = '';

//                     document.getElementById('pest-container').style.display = "none";
//                     document.getElementById('disease-container').style.display = "none";
//                     document.getElementById('detailPestandDisease').style.display = "flex";
//                     document.getElementById('backButton').style.display = "inline";


//                     const detailDiv = document.createElement('div');
//                     detailDiv.classList.add('detailPestDiv');

//                     const detailDiv2 = document.createElement('div');
//                     detailDiv2.classList.add('detailPestDiv2');

//                     const detailDiv3 = document.createElement('div');
//                     detailDiv3.classList.add('detailPestDiv3');

//                     const detailPestTitle = document.createElement('h3');
//                     detailPestTitle.textContent = pests.title;
//                     detailPestTitle.classList.add('pestTitle');

//                     const detailPestImg = document.createElement('img');
//                     detailPestImg.src = pests.imageUrl;
//                     detailPestImg.classList.add('pestImg');

//                     const identify1 = document.createElement('h3');
//                     identify1.textContent = "Identification: ";
//                     identify1.classList.add('dIdentify1');

//                     const identify = document.createElement('p');
//                     identify.textContent = pests.identify;
//                     identify.classList.add('dIdentify');

//                     const ddamage1 = document.createElement('h3');
//                     ddamage1.textContent = "Damage Prevention: ";
//                     ddamage1.classList.add('ddamage1');

//                     const ddamage = document.createElement('p');
//                     ddamage.textContent = pests.damage;
//                     ddamage.classList.add('ddamage');

//                     const dPhysical1 = document.createElement('h3');
//                     dPhysical1.textContent = "Physical Control: ";
//                     dPhysical1.classList.add('dPhysical1');

//                     const dPhysical = document.createElement('p');
//                     dPhysical.textContent = pests.physical;
//                     dPhysical.classList.add('dPhysical');

//                     const dChemical1 = document.createElement('h3');
//                     dChemical1.textContent = "Chemical Control: ";
//                     dChemical1.classList.add('dChemical1');

//                     const instruc = document.createElement('h3');
//                     instruc.textContent = "Plants Affected";
//                     instruc.classList.add('instruc');

//                     const dChemical = document.createElement('p');
//                     dChemical.textContent = pests.chemical;
//                     dChemical.classList.add('dChemical');

//                     const backButton = document.getElementById('backButton');
//                     backButton.addEventListener('click', () => {

//                         document.getElementById('disease-container').style.display = "inline";
//                         document.getElementById('detailPestandDisease').style.display = "none";
//                         document.getElementById('backButton').style.display = "none";
//                         document.getElementById('pest-container').style.display = "inline";
//                     })

//                     const agriAdviceDB = database.ref('plants');
//                     agriAdviceDB.on('value', (snapshot) => {
//                         detailDiv3.innerHTML = '';
//                         console.log("Snapshot received:", snapshot.val());
//                         snapshot.forEach((childSnapshot) => {
//                             const plant = childSnapshot.val();
//                             console.log("Plant data:", plant);

//                             plant.pests.forEach(pest => {
//                                 if (pest.title === pests.title) {
//                                     const div_ = document.createElement('div');
//                                     div_.classList.add('div_');

//                                     const icon2 = document.createElement('img');
//                                     icon2.src = plant.icon;
//                                     icon2.classList.add('icons2');

//                                     const title2 = document.createElement('h2');
//                                     title2.textContent = plant.title;
//                                     title2.classList.add('titles2');

//                                     div_.appendChild(icon2);
//                                     div_.appendChild(title2);
//                                     detailDiv3.appendChild(div_);

//                                     div_.addEventListener('click', () => {
//                                         pestsContainer2.innerHTML = "";

//                                         pestsContainer2.style.display = "inline";
//                                         document.getElementById('xButton').style.display = "inline";

//                                         const plantImg = document.createElement('div');
//                                         plantImg.classList.add('divImg');

//                                         const plantImg2 = document.createElement('div');
//                                         plantImg2.classList.add('divImg2');


//                                         const iconP = document.createElement('img');
//                                         iconP.src = plant.icon;

//                                         const detailDiv = document.createElement('div');
//                                         detailDiv.classList.add('detailDiv');

//                                         const detailDiv1 = document.createElement('div');
//                                         detailDiv1.classList.add('detailDiv1');

//                                         const detailDiv2 = document.createElement('div');
//                                         detailDiv2.classList.add('detailDiv2');

//                                         const detailDiv3 = document.createElement('div');
//                                         detailDiv3.classList.add('detailDiv3');

//                                         const pestsDiv4 = document.createElement('div');
//                                         pestsDiv4.classList.add('pestsDiv4');

//                                         const diseaseDiv4 = document.createElement('div');
//                                         diseaseDiv4.classList.add('diseaseDiv4');

//                                         const c1 = document.createElement('div');
//                                         c1.classList.add('c1');

//                                         const c2 = document.createElement('div');
//                                         c2.classList.add('c2');

//                                         const c3 = document.createElement('div');
//                                         c3.classList.add('c3');

//                                         const c4 = document.createElement('div');
//                                         c4.classList.add('c4');

//                                         const detailTitle = document.createElement('h2');
//                                         detailTitle.textContent = plant.title;
//                                         detailTitle.classList.add('dTitle');

//                                         const detailCategory = document.createElement('h6');
//                                         detailCategory.textContent = "Category: " + plant.category;
//                                         detailCategory.classList.add('dCateg');

//                                         const descrip = document.createElement('h3');
//                                         descrip.textContent = plant.description;
//                                         descrip.classList.add('dDescrip');

//                                         const rangeSlider = document.createElement('h3');
//                                         rangeSlider.textContent = plant.rangeValue;
//                                         rangeSlider.classList.add('dSlider');

//                                         const depth = document.createElement('h3');
//                                         depth.textContent = plant.depth;
//                                         depth.classList.add('dDepth');

//                                         const water = document.createElement('h3');
//                                         water.textContent = plant.water;
//                                         water.classList.add('dWater');

//                                         const sun = document.createElement('h3');
//                                         sun.textContent = plant.sun;
//                                         sun.classList.add('dSun');

//                                         const temp = document.createElement('h3');
//                                         temp.textContent = plant.temperature;
//                                         temp.classList.add('dTemp');



//                                         const rangeSlider1 = document.createElement('h3');
//                                         rangeSlider1.textContent = "Spacing: ";
//                                         rangeSlider1.classList.add('dSlider1');

//                                         const depth1 = document.createElement('h3');
//                                         depth1.textContent = "Planting Depth: ";
//                                         depth1.classList.add('dDepth1');

//                                         const water1 = document.createElement('h3');
//                                         water1.textContent = "Water per week: ";
//                                         water1.classList.add('dWater1');

//                                         const sun1 = document.createElement('h3');
//                                         sun1.textContent = "Sun: ";
//                                         sun1.classList.add('dSun1');

//                                         const temp1 = document.createElement('h3');
//                                         temp1.textContent = "Growing Season: ";
//                                         temp1.classList.add('dTemp1');




//                                         const grow = document.createElement('p');
//                                         grow.textContent = plant.grow;
//                                         grow.classList.add('dGrow');

//                                         const plant1 = document.createElement('p');
//                                         plant1.textContent = plant.planting;
//                                         plant1.classList.add('dPlant');

//                                         const feed = document.createElement('p');
//                                         feed.textContent = plant.feed;
//                                         feed.classList.add('dFeed');

//                                         const harv = document.createElement('p');
//                                         harv.textContent = plant.harvest;
//                                         harv.classList.add('dHarv');

//                                         const stor = document.createElement('p');
//                                         stor.textContent = plant.storage;
//                                         stor.classList.add('dStore');

//                                         const qi = document.createElement('h3');
//                                         qi.textContent = "Quick Info";
//                                         qi.classList.add('dQuick');

//                                         const qi1 = document.createElement('h3');
//                                         qi1.textContent = "Detailed Information";
//                                         qi1.classList.add('dQuick');

//                                         const qPest = document.createElement('h3');
//                                         qPest.textContent = "Pests";
//                                         qPest.classList.add('qPest');

//                                         const qDisease = document.createElement('h3');
//                                         qDisease.textContent = "Disease";
//                                         qDisease.classList.add('qDisease');

//                                         const grow1 = document.createElement('h3');
//                                         grow1.textContent = "Growing from Seed: ";
//                                         grow1.classList.add('dGrow1');

//                                         const plant2 = document.createElement('h3');
//                                         plant2.textContent = "Planting Considerations: ";
//                                         plant2.classList.add('dPlant1');

//                                         const feed1 = document.createElement('h3');
//                                         feed1.textContent = "Feeding: ";
//                                         feed1.classList.add('dFeed1');

//                                         const harv1 = document.createElement('h3');
//                                         harv1.textContent = "Harvesting: ";
//                                         harv1.classList.add('dHarv1');

//                                         const stor1 = document.createElement('h3');
//                                         stor1.textContent = "Storage: ";
//                                         stor1.classList.add('dStore1');

//                                         plant.images.forEach(imageUrl => {
//                                             const image = document.createElement('img');
//                                             image.classList.add('dImage2');
//                                             image.src = imageUrl;
//                                             plantImg2.appendChild(image);
//                                         });

//                                         // Inside your event listener function
//                                         plant.images.forEach(imageUrl => {
//                                             var i = 0;
//                                             var images = plant.images; // Assuming plant.images is an array
//                                             var time = 3000;

//                                             function changeImg() {
//                                                 const image = document.createElement('img');
//                                                 image.classList.add('dImage');
//                                                 image.src = images[i]; // Use 'images[i]' instead of 'imageUrl'

//                                                 // Replace the existing image with the new one
//                                                 plantImg.innerHTML = ''; // Clear previous image
//                                                 plantImg.appendChild(image); // Append the new image

//                                                 i = (i + 1) % images.length; // Increment index and wrap around if necessary

//                                                 setTimeout(changeImg, time); // Use 'changeImg' instead of "changeImg()"
//                                             }

//                                             window.onload = changeImg(); // Change to window.onload = changeImg;
//                                         });

//                                         // detailDiv.appendChild(back);
//                                         detailDiv.appendChild(detailTitle);
//                                         detailDiv.appendChild(plantImg);
//                                         detailDiv.appendChild(plantImg2);
//                                         detailDiv.appendChild(detailCategory);
//                                         detailDiv.appendChild(descrip);

//                                         c3.appendChild(grow1);
//                                         c3.appendChild(grow);
//                                         c3.appendChild(plant2);
//                                         c3.appendChild(plant1);
//                                         c3.appendChild(feed1);
//                                         c3.appendChild(feed);
//                                         c3.appendChild(harv1);
//                                         c3.appendChild(harv);
//                                         c3.appendChild(stor1);
//                                         c3.appendChild(stor);

//                                         c1.appendChild(rangeSlider);
//                                         c1.appendChild(depth);
//                                         c1.appendChild(water);
//                                         c1.appendChild(sun);
//                                         c1.appendChild(temp);
//                                         c2.appendChild(rangeSlider1);
//                                         c2.appendChild(depth1);
//                                         c2.appendChild(water1);
//                                         c2.appendChild(sun1);
//                                         c2.appendChild(temp1);

//                                         if (plant.pests && plant.pests.length > 0) {
//                                             const pestsList = document.createElement('div');
//                                             pestsList.classList.add('pests-list');

//                                             plant.pests.forEach(pest => {
//                                                 const pestItem = document.createElement('div');
//                                                 pestItem.classList.add('pestItem');

//                                                 const pestIcon = document.createElement('img');
//                                                 pestIcon.src = pest.iconUrl;
//                                                 pestIcon.classList.add('pestIcon');

//                                                 const pestTitle = document.createElement('p');
//                                                 pestTitle.textContent = pest.title;
//                                                 pestTitle.classList.add('pestTitle');

//                                                 pestItem.appendChild(pestIcon);
//                                                 pestItem.appendChild(pestTitle);
//                                                 pestsList.appendChild(pestItem);


//                                                 pestItem.addEventListener('click', () => {
//                                                     const detailPestDisplay = document.getElementById('Pestdisplay');
//                                                     detailPestDisplay.style.display = "inline";
//                                                     document.getElementById('xButton').style.display = "inline";

//                                                     const divP = document.createElement('div');
//                                                     divP.classList.add('divP');

//                                                     const pestImage = document.createElement('img');
//                                                     pestImage.classList.add('pestimage');
//                                                     pestImage.src = pest.iconUrl;

//                                                     const titlePest = document.createElement('h3');
//                                                     titlePest.classList.add('Titlepest');
//                                                     titlePest.textContent = pest.title;


//                                                     const uploadsRef = firebase.database().ref('Pests');
//                                                     uploadsRef.on('value', (snapshot) => {
//                                                         detailPestDisplay.innerHTML = '';
//                                                         snapshot.forEach((childSnapshot) => {
//                                                             const pests = childSnapshot.val();
//                                                             if (pests.title === titlePest.textContent) {
//                                                                 const detailDiv = document.createElement('div');
//                                                                 detailDiv.classList.add('detailPestDiv');

//                                                                 const detailDiv2 = document.createElement('div');
//                                                                 detailDiv2.classList.add('detailPestDiv2');

//                                                                 const identify1 = document.createElement('h3');
//                                                                 identify1.textContent = "Identification: ";
//                                                                 identify1.classList.add('dIdentify1');

//                                                                 const identify = document.createElement('p');
//                                                                 identify.textContent = pests.identify;
//                                                                 identify.classList.add('dIdentify');

//                                                                 const ddamage1 = document.createElement('h3');
//                                                                 ddamage1.textContent = "Damage Prevention: ";
//                                                                 ddamage1.classList.add('ddamage1');

//                                                                 const ddamage = document.createElement('p');
//                                                                 ddamage.textContent = pests.damage;
//                                                                 ddamage.classList.add('ddamage');

//                                                                 const dPhysical1 = document.createElement('h3');
//                                                                 dPhysical1.textContent = "Physical Control: ";
//                                                                 dPhysical1.classList.add('dPhysical1');

//                                                                 const dPhysical = document.createElement('p');
//                                                                 dPhysical.textContent = pests.physical;
//                                                                 dPhysical.classList.add('dPhysical');

//                                                                 const dChemical1 = document.createElement('h3');
//                                                                 dChemical1.textContent = "Chemical Control: ";
//                                                                 dChemical1.classList.add('dChemical1');

//                                                                 const dChemical11 = document.createElement('h3');
//                                                                 dChemical11.textContent = "Chemical Control: ";
//                                                                 dChemical11.classList.add('dChemical11');


//                                                                 const instruc = document.createElement('h3');
//                                                                 instruc.textContent = "Plants Affected";
//                                                                 instruc.classList.add('instruc');

//                                                                 const dChemical = document.createElement('p');
//                                                                 dChemical.textContent = pests.chemical;
//                                                                 dChemical.classList.add('dChemical');



//                                                                 // const xButton = document.getElementById('xButton');

//                                                                 // xButton.addEventListener('click', () => {
//                                                                 //     detailPestDisplay.style.display = "none";
//                                                                 //     xButton.style.display = "none";
//                                                                 // })

//                                                                 agriAdviceDB.on('value', (snapshot) => {
//                                                                     detailPestDisplay.innerHTML = '';
//                                                                     console.log("Snapshot received:", snapshot.val()); // Log the snapshot received
//                                                                     snapshot.forEach((childSnapshot) => {
//                                                                         const plant = childSnapshot.val();
//                                                                         console.log("Plant data:", plant); // Log the plant data

//                                                                         plant.pests.forEach(pest => {
//                                                                             if (pest.title === pests.title) {
//                                                                                 const div_ = document.createElement('div');
//                                                                                 div_.classList.add('div_');

//                                                                                 const icon2 = document.createElement('img');
//                                                                                 icon2.src = plant.icon;
//                                                                                 icon2.classList.add('icons2');

//                                                                                 const title2 = document.createElement('h2');
//                                                                                 title2.textContent = plant.title;
//                                                                                 title2.classList.add('titles2');

//                                                                                 div_.appendChild(icon2);
//                                                                                 div_.appendChild(title2);
//                                                                                 detailDiv2.appendChild(div_);
//                                                                             }
//                                                                         })
//                                                                     });
//                                                                 });



//                                                                 detailDiv.appendChild(detailDiv2);
//                                                                 detailDiv.appendChild(identify1);
//                                                                 detailDiv.appendChild(identify);
//                                                                 detailDiv.appendChild(ddamage1);
//                                                                 detailDiv.appendChild(ddamage);
//                                                                 detailDiv.appendChild(dPhysical1);
//                                                                 detailDiv.appendChild(dPhysical);
//                                                                 detailDiv.appendChild(dChemical1);
//                                                                 detailDiv.appendChild(dChemical);
//                                                                 detailDiv.appendChild(dChemical11);

//                                                                 detailPestDisplay.appendChild(titlePest);
//                                                                 detailPestDisplay.appendChild(pestImage);
//                                                                 detailPestDisplay.appendChild(instruc);
//                                                                 detailPestDisplay.appendChild(detailDiv);
//                                                             }
//                                                         })
//                                                     })

//                                                     console.log("Appending elements to detailPestDisplay...");
//                                                 });



//                                             });

//                                             pestsDiv4.appendChild(pestsList);
//                                         }

//                                         if (plant.disease && plant.disease.length > 0) {
//                                             const diseaseList = document.createElement('div');
//                                             diseaseList.classList.add('disease-list');

//                                             plant.disease.forEach(pest => {
//                                                 const diseaseItem = document.createElement('div');
//                                                 diseaseItem.classList.add('diseaseItem');

//                                                 const diseaseIcon = document.createElement('img');
//                                                 diseaseIcon.src = pest.iconUrl;
//                                                 diseaseIcon.classList.add('diseaseIcon');

//                                                 const diseaseTitle = document.createElement('p');
//                                                 diseaseTitle.textContent = pest.title;
//                                                 diseaseTitle.classList.add('diseaseTitle');

//                                                 diseaseItem.appendChild(diseaseIcon);
//                                                 diseaseItem.appendChild(diseaseTitle);
//                                                 diseaseList.appendChild(diseaseItem);

//                                                 diseaseItem.addEventListener('click', () => {
//                                                     const detailPestDisplay = document.getElementById('Pestdisplay');
//                                                     detailPestDisplay.style.display = "inline";
//                                                     document.getElementById('xButton').style.display = "inline";

//                                                     const divP = document.createElement('div');
//                                                     divP.classList.add('divP');

//                                                     const pestImage = document.createElement('img');
//                                                     pestImage.classList.add('pestimage');
//                                                     pestImage.src = pest.iconUrl;

//                                                     const titlePest = document.createElement('h3');
//                                                     titlePest.classList.add('Titlepest');
//                                                     titlePest.textContent = pest.title;


//                                                     const uploadsRef = firebase.database().ref('Disease');




//                                                     uploadsRef.on('value', (snapshot) => {
//                                                         detailPestDisplay.innerHTML = '';
//                                                         snapshot.forEach((childSnapshot) => {
//                                                             const disease = childSnapshot.val();
//                                                             if (disease.title === titlePest.textContent) {
//                                                                 const detailDiv = document.createElement('div');
//                                                                 detailDiv.classList.add('detailPestDiv');

//                                                                 const detailDiv2 = document.createElement('div');
//                                                                 detailDiv2.classList.add('detailPestDiv2');

//                                                                 const identify1 = document.createElement('h3');
//                                                                 identify1.textContent = "Identification: ";
//                                                                 identify1.classList.add('dIdentify1');

//                                                                 const identify = document.createElement('p');
//                                                                 identify.textContent = disease.identify;
//                                                                 identify.classList.add('dIdentify');

//                                                                 const ddamage1 = document.createElement('h3');
//                                                                 ddamage1.textContent = "Damage Prevention: ";
//                                                                 ddamage1.classList.add('ddamage1');

//                                                                 const ddamage = document.createElement('p');
//                                                                 ddamage.textContent = disease.damage;
//                                                                 ddamage.classList.add('ddamage');

//                                                                 const dPhysical1 = document.createElement('h3');
//                                                                 dPhysical1.textContent = "Physical Control: ";
//                                                                 dPhysical1.classList.add('dPhysical1');

//                                                                 const dPhysical = document.createElement('p');
//                                                                 dPhysical.textContent = disease.physical;
//                                                                 dPhysical.classList.add('dPhysical');

//                                                                 const dChemical1 = document.createElement('h3');
//                                                                 dChemical1.textContent = "Chemical Control: ";
//                                                                 dChemical1.classList.add('dChemical1');

//                                                                 const dChemical11 = document.createElement('h3');
//                                                                 dChemical11.textContent = "Chemical Control: ";
//                                                                 dChemical11.classList.add('dChemical11');


//                                                                 const instruc = document.createElement('h3');
//                                                                 instruc.textContent = "Plants Affected";
//                                                                 instruc.classList.add('instruc');

//                                                                 const dChemical = document.createElement('p');
//                                                                 dChemical.textContent = disease.chemical;
//                                                                 dChemical.classList.add('dChemical');



//                                                                 // const xButton = document.getElementById('xButton');

//                                                                 // xButton.addEventListener('click', () => {
//                                                                 //     pestsContainer2.style.display = "none";
//                                                                 //     xButton.style.display = "none";
//                                                                 // })

//                                                                 agriAdviceDB.on('value', (snapshot) => {
//                                                                     detailPestDisplay.innerHTML = '';
//                                                                     console.log("Snapshot received:", snapshot.val()); // Log the snapshot received
//                                                                     snapshot.forEach((childSnapshot) => {
//                                                                         const plant = childSnapshot.val();
//                                                                         console.log("Plant data:", plant); // Log the plant data

//                                                                         plant.disease.forEach(pest => {
//                                                                             if (pest.title === disease.title) {
//                                                                                 const div_ = document.createElement('div');
//                                                                                 div_.classList.add('div_');

//                                                                                 const icon2 = document.createElement('img');
//                                                                                 icon2.src = plant.icon;
//                                                                                 icon2.classList.add('icons2');

//                                                                                 const title2 = document.createElement('h2');
//                                                                                 title2.textContent = plant.title;
//                                                                                 title2.classList.add('titles2');

//                                                                                 div_.appendChild(icon2);
//                                                                                 div_.appendChild(title2);
//                                                                                 detailDiv2.appendChild(div_);
//                                                                             }
//                                                                         })
//                                                                     });
//                                                                 });



//                                                                 detailDiv.appendChild(detailDiv2);
//                                                                 detailDiv.appendChild(identify1);
//                                                                 detailDiv.appendChild(identify);
//                                                                 detailDiv.appendChild(ddamage1);
//                                                                 detailDiv.appendChild(ddamage);
//                                                                 detailDiv.appendChild(dPhysical1);
//                                                                 detailDiv.appendChild(dPhysical);
//                                                                 detailDiv.appendChild(dChemical1);
//                                                                 detailDiv.appendChild(dChemical);
//                                                                 detailDiv.appendChild(dChemical11);


//                                                                 detailPestDisplay.appendChild(titlePest);
//                                                                 detailPestDisplay.appendChild(pestImage);
//                                                                 detailPestDisplay.appendChild(instruc);
//                                                                 detailPestDisplay.appendChild(detailDiv);
//                                                             }
//                                                         })
//                                                     })

//                                                     console.log("Appending elements to detailPestDisplay...");
//                                                 });
//                                             });

//                                             diseaseDiv4.appendChild(diseaseList);
//                                         }

//                                         const xButton = document.getElementById('xButton');

//                                         xButton.addEventListener('click', () => {
//                                             pestsContainer2.style.display = "none";
//                                             xButton.style.display = "none";
//                                         })

//                                         detailDiv1.appendChild(c2);
//                                         detailDiv1.appendChild(c1);
//                                         detailDiv2.appendChild(c3);

//                                         pestsContainer2.appendChild(detailDiv);
//                                         pestsContainer2.appendChild(qPest);
//                                         pestsContainer2.appendChild(pestsDiv4);
//                                         pestsContainer2.appendChild(qDisease);
//                                         pestsContainer2.appendChild(diseaseDiv4);
//                                         pestsContainer2.appendChild(qi);
//                                         pestsContainer2.appendChild(detailDiv1);
//                                         pestsContainer2.appendChild(qi1);
//                                         pestsContainer2.appendChild(detailDiv2);
//                                     })
//                                 }
//                             })
//                         });
//                     });




//                     detailDiv.appendChild(detailPestTitle);
//                     detailDiv.appendChild(detailPestImg);

//                     detailDiv2.appendChild(identify1);
//                     detailDiv2.appendChild(identify);
//                     detailDiv2.appendChild(ddamage1);
//                     detailDiv2.appendChild(ddamage);
//                     detailDiv2.appendChild(dPhysical1);
//                     detailDiv2.appendChild(dPhysical);
//                     detailDiv2.appendChild(dChemical1);
//                     detailDiv2.appendChild(dChemical);

//                     detailPests.appendChild(detailDiv);
//                     detailPests.appendChild(instruc);
//                     detailPests.appendChild(detailDiv3);
//                     detailPests.appendChild(detailDiv2);
//                 })


//                 pestsDiv.appendChild(iconElement);
//                 pestsDiv.appendChild(titleElement);
//                 pestsDiv.appendChild(edimove);
//                 pestsContainer.appendChild(pestsDiv);

//             } else {
//                 console.error('Incomplete data for pest:', pests);
//             }
//         });
//     }, (error) => {
//         console.error('Error retrieving uploaded data:', error);
//     });
// }

// displayPests();


// ========================== Add Disease ====================================

const images1 = document.getElementById('icon');
const textTitle1 = document.getElementById('title');
const textIdentify1 = document.getElementById('identfication');
const textDamage1 = document.getElementById('damage');
const textPhysical1 = document.getElementById('physical');
const textChemical1 = document.getElementById('chemical');

function uploadDisease() {

    const bar = document.getElementById('uploadBar');
    bar.style.display = "inline";

    const file = images1.files[0];
    const Title = textTitle1.value;
    const Identify = textIdentify1.value;
    const Damage = textDamage1.value;
    const Physical = textPhysical1.value;
    const Chemical = textChemical1.value;

    const storageRef = firebase.storage().ref('images/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + progressPercentage + '% done');

            percentage.innerHTML = progressPercentage + "%";
            progress.style.width = progressPercentage + "%";
        },
        (error) => {
            console.error('Error uploading image:', error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebase.database().ref('Disease').push({
                    title: Title,
                    identify: Identify,
                    damage: Damage,
                    physical: Physical,
                    chemical: Chemical,
                    imageUrl: downloadURL
                }).then(() => {
                    document.getElementById('uploadBar').style.display = "none";
                    console.log('Image and text uploaded successfully.');
                    const addDiseaseForm = document.getElementById('addDisease');
                    addDiseaseForm.style.display = 'none';
                    const alert = document.getElementById('alert');
                    alert.style.display = 'inline';
                    document.getElementById('okayButton').addEventListener('click', function () {
                        alert.style.display = 'none';
                        document.getElementById('sidebar').style.filter = "none";
                        document.getElementById('sidebar1').style.filter = "none";
                    });
                    resetForm();
                }).catch((error) => {
                    console.error('Error uploading text:', error);
                });
            });
        }
    );
}


// ================= Display Disease =============================

// Function to retrieve and display uploaded images and text
// function displayDisease() {
//     const uploadsRef = firebase.database().ref('Disease');
//     const diseaseContainer = document.getElementById('detail-disease');

//     uploadsRef.on('value', (snapshot) => {
//         diseaseContainer.innerHTML = "";

//         snapshot.forEach((childSnapshot) => {
//             const disease = childSnapshot.val();
//             const imageUrl = disease.imageUrl;
//             const title = disease.title;

//             if (imageUrl && title) {
//                 const diseaseDiv = document.createElement('div');
//                 diseaseDiv.classList.add('divPests');

//                 const iconElement = document.createElement('img');
//                 iconElement.src = imageUrl;
//                 iconElement.classList.add('icons');

//                 const titleElement = document.createElement('h2');
//                 titleElement.textContent = title;
//                 titleElement.classList.add('titles');

//                 const edimove = document.createElement('div');
//                 edimove.classList.add("edimove");

//                 const editIcon = document.createElement('img');
//                 editIcon.src = 'assets/img/edit1.png';
//                 editIcon.classList.add('editIcon');
//                 editIcon.alt = 'Edit';

//                 const deleteIcon = document.createElement('img');
//                 deleteIcon.src = 'assets/img/delete1.png';
//                 deleteIcon.classList.add('deleteIcon');
//                 deleteIcon.alt = 'Delete';

//                 edimove.appendChild(editIcon);
//                 edimove.appendChild(deleteIcon);

//                 deleteIcon.addEventListener('click', (event) => {
//                     event.stopPropagation();
//                     edimove.style.display = "none"; // Hides the confirmation dialog and the edit/delete icons
//                     const diseaseTitle = plant.title;
//                     const diseaseRef = firebase.database().ref('Disease');

//                     diseaseRef.orderByChild('title').equalTo(diseaseTitle).once('value')
//                         .then(snapshot => {
//                             snapshot.forEach(childSnapshot => {
//                                 const plantKey = childSnapshot.key;
//                                 const plantRef = firebase.database().ref('plants/' + plantKey);

//                                 // Move plant to 'archive'
//                                 const archiveRef = firebase.database().ref('archive').push();
//                                 archiveRef.set(childSnapshot.val()) // move the data to archive

//                                 // Remove the plant from 'plants'
//                                 plantRef.remove()
//                                     .then(() => {
//                                         // Plant removed successfully from 'plants'
//                                         console.log('Plant removed successfully from plants');
//                                         // Now, let's remove the plantDiv from the UI
//                                         // You can add UI manipulation code here if needed
//                                     })
//                                     .catch(error => {
//                                         // Error occurred while removing the plant from plants
//                                         console.error('Error removing plant from plants:', error.message);
//                                         // Optionally, you can handle the error here
//                                     });
//                             });
//                         })
//                         .catch(error => {
//                             // Error occurred while querying the plants database
//                             console.error('Error querying plants database:', error.message);
//                             // Optionally, you can handle the error here
//                         });
//                 });


//                 editIcon.addEventListener('click', (event) => {
//                     event.stopPropagation();
//                     document.getElementById('edit_plant').style.display = "inline";

//                     icon.innerHTML = '';

//                     document.getElementById('title2').value = plant.title;
//                     document.getElementById('category2').value = plant.category;
//                     document.getElementById('description2').value = plant.description;
//                     document.getElementById('dept2').value = plant.depth;
//                     document.getElementById('water2').value = plant.water;
//                     document.getElementById('sun2').value = plant.sun;
//                     document.getElementById('temp2').value = plant.temperature;
//                     document.getElementById('grow2').value = plant.grow;
//                     document.getElementById('planting2').value = plant.planting;
//                     document.getElementById('feed2').value = plant.feed;
//                     document.getElementById('harv2').value = plant.harvest;
//                     document.getElementById('stor2').value = plant.storage;
//                     document.getElementById('rangeValue2').textContent = plant.rangeValue;
//                     document.querySelector(".metaData2");
//                     retrieveIcon();
//                     retrieveImages();
//                     retrievePest();


//                 });

//                 diseaseDiv.addEventListener('click', () => {
//                     const detailDisease = document.getElementById('detailDisease');
//                     detailDisease.innerHTML = '';

//                     document.getElementById('pest-container').style.display = "none";
//                     document.getElementById('disease-container').style.display = "none";
//                     document.getElementById('detailDisease').style.display = "flex";
//                     document.getElementById('backButton').style.display = "inline";

//                     const detailDiv = document.createElement('div');
//                     detailDiv.classList.add('detailPestDiv');

//                     const detailDiv2 = document.createElement('div');
//                     detailDiv2.classList.add('detailPestDiv2');

//                     const detailDiv3 = document.createElement('div');
//                     detailDiv3.classList.add('detailPestDiv3');

//                     const detailPestTitle = document.createElement('h3');
//                     detailPestTitle.textContent = disease.title;
//                     detailPestTitle.classList.add('pestTitle');

//                     const detailPestImg = document.createElement('img');
//                     detailPestImg.src = disease.imageUrl;
//                     detailPestImg.classList.add('pestImg');

//                     const identify1 = document.createElement('h3');
//                     identify1.textContent = "Identification: ";
//                     identify1.classList.add('dIdentify1');

//                     const identify = document.createElement('p');
//                     identify.textContent = disease.identify;
//                     identify.classList.add('dIdentify');

//                     const ddamage1 = document.createElement('h3');
//                     ddamage1.textContent = "Damage Prevention: ";
//                     ddamage1.classList.add('ddamage1');

//                     const ddamage = document.createElement('p');
//                     ddamage.textContent = disease.damage;
//                     ddamage.classList.add('ddamage');

//                     const dPhysical1 = document.createElement('h3');
//                     dPhysical1.textContent = "Physical Control: ";
//                     dPhysical1.classList.add('dPhysical1');

//                     const dPhysical = document.createElement('p');
//                     dPhysical.textContent = disease.physical;
//                     dPhysical.classList.add('dPhysical');

//                     const dChemical1 = document.createElement('h3');
//                     dChemical1.textContent = "Chemical Control: ";
//                     dChemical1.classList.add('dChemical1');

//                     const instruc = document.createElement('h3');
//                     instruc.textContent = "Plants Affected";
//                     instruc.classList.add('instruc');


//                     const dChemical = document.createElement('p');
//                     dChemical.textContent = disease.chemical;
//                     dChemical.classList.add('dChemical');

//                     const backButton = document.getElementById('backButton');
//                     backButton.addEventListener('click', () => {
//                         document.getElementById('addPest').style.display = "inline";
//                         document.getElementById('detail-display').style.display = "grid";
//                         document.getElementById('disease-container').style.display = "inline";
//                         document.getElementById('detailDisease').style.display = "none";
//                         document.getElementById('backButton').style.display = "none";
//                         document.getElementById('pest-container').style.display = "inline";
//                     })

//                     agriAdviceDB.on('value', (snapshot) => {
//                         detailDiv3.innerHTML = '';
//                         console.log("Snapshot received:", snapshot.val()); // Log the snapshot received
//                         snapshot.forEach((childSnapshot) => {
//                             const plant = childSnapshot.val();
//                             console.log("Plant data:", plant); // Log the plant data

//                             plant.disease.forEach(pest => {
//                                 if (pest.title === disease.title) {
//                                     const div_ = document.createElement('div');
//                                     div_.classList.add('div_');

//                                     const icon2 = document.createElement('img');
//                                     icon2.src = plant.icon;
//                                     icon2.classList.add('icons2');

//                                     const title2 = document.createElement('h2');
//                                     title2.textContent = plant.title;
//                                     title2.classList.add('titles2');

//                                     div_.appendChild(icon2);
//                                     div_.appendChild(title2);
//                                     detailDiv3.appendChild(div_);

//                                     div_.addEventListener('click', () => {
//                                         pestsContainer2.innerHTML = "";
//                                         pestsContainer2.style.display = "inline";
//                                         document.getElementById('xButton').style.display = "inline";

//                                         const plantImg = document.createElement('div');
//                                         plantImg.classList.add('divImg');

//                                         const plantImg2 = document.createElement('div');
//                                         plantImg2.classList.add('divImg2');


//                                         const iconP = document.createElement('img');
//                                         iconP.src = plant.icon;

//                                         const detailDiv = document.createElement('div');
//                                         detailDiv.classList.add('detailDiv');

//                                         const detailDiv1 = document.createElement('div');
//                                         detailDiv1.classList.add('detailDiv1');

//                                         const detailDiv2 = document.createElement('div');
//                                         detailDiv2.classList.add('detailDiv2');

//                                         const detailDiv3 = document.createElement('div');
//                                         detailDiv3.classList.add('detailDiv3');

//                                         const pestsDiv4 = document.createElement('div');
//                                         pestsDiv4.classList.add('pestsDiv4');

//                                         const diseaseDiv4 = document.createElement('div');
//                                         diseaseDiv4.classList.add('diseaseDiv4');

//                                         const c1 = document.createElement('div');
//                                         c1.classList.add('c1');

//                                         const c2 = document.createElement('div');
//                                         c2.classList.add('c2');

//                                         const c3 = document.createElement('div');
//                                         c3.classList.add('c3');

//                                         const c4 = document.createElement('div');
//                                         c4.classList.add('c4');

//                                         const detailTitle = document.createElement('h2');
//                                         detailTitle.textContent = plant.title;
//                                         detailTitle.classList.add('dTitle');

//                                         const detailCategory = document.createElement('h6');
//                                         detailCategory.textContent = "Category: " + plant.category;
//                                         detailCategory.classList.add('dCateg');

//                                         const descrip = document.createElement('h3');
//                                         descrip.textContent = plant.description;
//                                         descrip.classList.add('dDescrip');

//                                         const rangeSlider = document.createElement('h3');
//                                         rangeSlider.textContent = plant.rangeValue;
//                                         rangeSlider.classList.add('dSlider');

//                                         const depth = document.createElement('h3');
//                                         depth.textContent = plant.depth;
//                                         depth.classList.add('dDepth');

//                                         const water = document.createElement('h3');
//                                         water.textContent = plant.water;
//                                         water.classList.add('dWater');

//                                         const sun = document.createElement('h3');
//                                         sun.textContent = plant.sun;
//                                         sun.classList.add('dSun');

//                                         const temp = document.createElement('h3');
//                                         temp.textContent = plant.temperature;
//                                         temp.classList.add('dTemp');



//                                         const rangeSlider1 = document.createElement('h3');
//                                         rangeSlider1.textContent = "Spacing: ";
//                                         rangeSlider1.classList.add('dSlider1');

//                                         const depth1 = document.createElement('h3');
//                                         depth1.textContent = "Planting Depth: ";
//                                         depth1.classList.add('dDepth1');

//                                         const water1 = document.createElement('h3');
//                                         water1.textContent = "Water per week: ";
//                                         water1.classList.add('dWater1');

//                                         const sun1 = document.createElement('h3');
//                                         sun1.textContent = "Sun: ";
//                                         sun1.classList.add('dSun1');

//                                         const temp1 = document.createElement('h3');
//                                         temp1.textContent = "Growing Season: ";
//                                         temp1.classList.add('dTemp1');




//                                         const grow = document.createElement('p');
//                                         grow.textContent = plant.grow;
//                                         grow.classList.add('dGrow');

//                                         const plant1 = document.createElement('p');
//                                         plant1.textContent = plant.planting;
//                                         plant1.classList.add('dPlant');

//                                         const feed = document.createElement('p');
//                                         feed.textContent = plant.feed;
//                                         feed.classList.add('dFeed');

//                                         const harv = document.createElement('p');
//                                         harv.textContent = plant.harvest;
//                                         harv.classList.add('dHarv');

//                                         const stor = document.createElement('p');
//                                         stor.textContent = plant.storage;
//                                         stor.classList.add('dStore');

//                                         const qi = document.createElement('h3');
//                                         qi.textContent = "Quick Info";
//                                         qi.classList.add('dQuick');

//                                         const qi1 = document.createElement('h3');
//                                         qi1.textContent = "Detailed Information";
//                                         qi1.classList.add('dQuick');

//                                         const qPest = document.createElement('h3');
//                                         qPest.textContent = "Pests";
//                                         qPest.classList.add('qPest');

//                                         const qDisease = document.createElement('h3');
//                                         qDisease.textContent = "Disease";
//                                         qDisease.classList.add('qDisease');

//                                         const grow1 = document.createElement('h3');
//                                         grow1.textContent = "Growing from Seed: ";
//                                         grow1.classList.add('dGrow1');

//                                         const plant2 = document.createElement('h3');
//                                         plant2.textContent = "Planting Considerations: ";
//                                         plant2.classList.add('dPlant1');

//                                         const feed1 = document.createElement('h3');
//                                         feed1.textContent = "Feeding: ";
//                                         feed1.classList.add('dFeed1');

//                                         const harv1 = document.createElement('h3');
//                                         harv1.textContent = "Harvesting: ";
//                                         harv1.classList.add('dHarv1');

//                                         const stor1 = document.createElement('h3');
//                                         stor1.textContent = "Storage: ";
//                                         stor1.classList.add('dStore1');

//                                         plant.images.forEach(imageUrl => {
//                                             const image = document.createElement('img');
//                                             image.classList.add('dImage2');
//                                             image.src = imageUrl;
//                                             plantImg2.appendChild(image);
//                                         });

//                                         // Inside your event listener function
//                                         plant.images.forEach(imageUrl => {
//                                             var i = 0;
//                                             var images = plant.images; // Assuming plant.images is an array
//                                             var time = 3000;

//                                             function changeImg() {
//                                                 const image = document.createElement('img');
//                                                 image.classList.add('dImage');
//                                                 image.src = images[i]; // Use 'images[i]' instead of 'imageUrl'

//                                                 // Replace the existing image with the new one
//                                                 plantImg.innerHTML = ''; // Clear previous image
//                                                 plantImg.appendChild(image); // Append the new image

//                                                 i = (i + 1) % images.length; // Increment index and wrap around if necessary

//                                                 setTimeout(changeImg, time); // Use 'changeImg' instead of "changeImg()"
//                                             }

//                                             window.onload = changeImg(); // Change to window.onload = changeImg;
//                                         });

//                                         // detailDiv.appendChild(back);
//                                         detailDiv.appendChild(detailTitle);
//                                         detailDiv.appendChild(plantImg);
//                                         detailDiv.appendChild(plantImg2);
//                                         detailDiv.appendChild(detailCategory);
//                                         detailDiv.appendChild(descrip);

//                                         c3.appendChild(grow1);
//                                         c3.appendChild(grow);
//                                         c3.appendChild(plant2);
//                                         c3.appendChild(plant1);
//                                         c3.appendChild(feed1);
//                                         c3.appendChild(feed);
//                                         c3.appendChild(harv1);
//                                         c3.appendChild(harv);
//                                         c3.appendChild(stor1);
//                                         c3.appendChild(stor);

//                                         c1.appendChild(rangeSlider);
//                                         c1.appendChild(depth);
//                                         c1.appendChild(water);
//                                         c1.appendChild(sun);
//                                         c1.appendChild(temp);
//                                         c2.appendChild(rangeSlider1);
//                                         c2.appendChild(depth1);
//                                         c2.appendChild(water1);
//                                         c2.appendChild(sun1);
//                                         c2.appendChild(temp1);

//                                         if (plant.pests && plant.pests.length > 0) {
//                                             const pestsList = document.createElement('div');
//                                             pestsList.classList.add('pests-list');

//                                             plant.pests.forEach(pest => {
//                                                 const pestItem = document.createElement('div');
//                                                 pestItem.classList.add('pestItem');

//                                                 const pestIcon = document.createElement('img');
//                                                 pestIcon.src = pest.iconUrl;
//                                                 pestIcon.classList.add('pestIcon');

//                                                 const pestTitle = document.createElement('p');
//                                                 pestTitle.textContent = pest.title;
//                                                 pestTitle.classList.add('pestTitle');

//                                                 pestItem.appendChild(pestIcon);
//                                                 pestItem.appendChild(pestTitle);
//                                                 pestsList.appendChild(pestItem);


//                                                 pestItem.addEventListener('click', () => {
//                                                     const detailPestDisplay = document.getElementById('Pestdisplay');
//                                                     detailPestDisplay.style.display = "inline";
//                                                     document.getElementById('xButton').style.display = "inline";

//                                                     const divP = document.createElement('div');
//                                                     divP.classList.add('divP');

//                                                     const pestImage = document.createElement('img');
//                                                     pestImage.classList.add('pestimage');
//                                                     pestImage.src = pest.iconUrl;

//                                                     const titlePest = document.createElement('h3');
//                                                     titlePest.classList.add('Titlepest');
//                                                     titlePest.textContent = pest.title;


//                                                     const uploadsRef = firebase.database().ref('Pests');




//                                                     uploadsRef.on('value', (snapshot) => {
//                                                         detailPestDisplay.innerHTML = '';
//                                                         snapshot.forEach((childSnapshot) => {
//                                                             const pests = childSnapshot.val();
//                                                             if (pests.title === titlePest.textContent) {
//                                                                 const detailDiv = document.createElement('div');
//                                                                 detailDiv.classList.add('detailPestDiv');

//                                                                 const detailDiv2 = document.createElement('div');
//                                                                 detailDiv2.classList.add('detailPestDiv2');

//                                                                 const identify1 = document.createElement('h3');
//                                                                 identify1.textContent = "Identification: ";
//                                                                 identify1.classList.add('dIdentify1');

//                                                                 const identify = document.createElement('p');
//                                                                 identify.textContent = pests.identify;
//                                                                 identify.classList.add('dIdentify');

//                                                                 const ddamage1 = document.createElement('h3');
//                                                                 ddamage1.textContent = "Damage Prevention: ";
//                                                                 ddamage1.classList.add('ddamage1');

//                                                                 const ddamage = document.createElement('p');
//                                                                 ddamage.textContent = pests.damage;
//                                                                 ddamage.classList.add('ddamage');

//                                                                 const dPhysical1 = document.createElement('h3');
//                                                                 dPhysical1.textContent = "Physical Control: ";
//                                                                 dPhysical1.classList.add('dPhysical1');

//                                                                 const dPhysical = document.createElement('p');
//                                                                 dPhysical.textContent = pests.physical;
//                                                                 dPhysical.classList.add('dPhysical');

//                                                                 const dChemical1 = document.createElement('h3');
//                                                                 dChemical1.textContent = "Chemical Control: ";
//                                                                 dChemical1.classList.add('dChemical1');

//                                                                 const dChemical11 = document.createElement('h3');
//                                                                 dChemical11.textContent = "Chemical Control: ";
//                                                                 dChemical11.classList.add('dChemical11');


//                                                                 const instruc = document.createElement('h3');
//                                                                 instruc.textContent = "Plants Affected";
//                                                                 instruc.classList.add('instruc');

//                                                                 const dChemical = document.createElement('p');
//                                                                 dChemical.textContent = pests.chemical;
//                                                                 dChemical.classList.add('dChemical');



//                                                                 // const xButton = document.getElementById('xButton');

//                                                                 // xButton.addEventListener('click', () => {
//                                                                 //     detailPestDisplay.style.display = "none";
//                                                                 //     xButton.style.display = "none";
//                                                                 // })

//                                                                 agriAdviceDB.on('value', (snapshot) => {
//                                                                     detailPestDisplay.innerHTML = '';
//                                                                     console.log("Snapshot received:", snapshot.val()); // Log the snapshot received
//                                                                     snapshot.forEach((childSnapshot) => {
//                                                                         const plant = childSnapshot.val();
//                                                                         console.log("Plant data:", plant); // Log the plant data

//                                                                         plant.pests.forEach(pest => {
//                                                                             if (pest.title === pests.title) {
//                                                                                 const div_ = document.createElement('div');
//                                                                                 div_.classList.add('div_');

//                                                                                 const icon2 = document.createElement('img');
//                                                                                 icon2.src = plant.icon;
//                                                                                 icon2.classList.add('icons2');

//                                                                                 const title2 = document.createElement('h2');
//                                                                                 title2.textContent = plant.title;
//                                                                                 title2.classList.add('titles2');

//                                                                                 div_.appendChild(icon2);
//                                                                                 div_.appendChild(title2);
//                                                                                 detailDiv2.appendChild(div_);
//                                                                             }
//                                                                         })
//                                                                     });
//                                                                 });



//                                                                 detailDiv.appendChild(detailDiv2);
//                                                                 detailDiv.appendChild(identify1);
//                                                                 detailDiv.appendChild(identify);
//                                                                 detailDiv.appendChild(ddamage1);
//                                                                 detailDiv.appendChild(ddamage);
//                                                                 detailDiv.appendChild(dPhysical1);
//                                                                 detailDiv.appendChild(dPhysical);
//                                                                 detailDiv.appendChild(dChemical1);
//                                                                 detailDiv.appendChild(dChemical);
//                                                                 detailDiv.appendChild(dChemical11);

//                                                                 detailPestDisplay.appendChild(titlePest);
//                                                                 detailPestDisplay.appendChild(pestImage);
//                                                                 detailPestDisplay.appendChild(instruc);
//                                                                 detailPestDisplay.appendChild(detailDiv);
//                                                             }
//                                                         })
//                                                     })

//                                                     console.log("Appending elements to detailPestDisplay...");
//                                                 });



//                                             });

//                                             pestsDiv4.appendChild(pestsList);
//                                         }

//                                         if (plant.disease && plant.disease.length > 0) {
//                                             const diseaseList = document.createElement('div');
//                                             diseaseList.classList.add('disease-list');

//                                             plant.disease.forEach(pest => {
//                                                 const diseaseItem = document.createElement('div');
//                                                 diseaseItem.classList.add('diseaseItem');

//                                                 const diseaseIcon = document.createElement('img');
//                                                 diseaseIcon.src = pest.iconUrl;
//                                                 diseaseIcon.classList.add('diseaseIcon');

//                                                 const diseaseTitle = document.createElement('p');
//                                                 diseaseTitle.textContent = pest.title;
//                                                 diseaseTitle.classList.add('diseaseTitle');

//                                                 diseaseItem.appendChild(diseaseIcon);
//                                                 diseaseItem.appendChild(diseaseTitle);
//                                                 diseaseList.appendChild(diseaseItem);

//                                                 diseaseItem.addEventListener('click', () => {
//                                                     const detailPestDisplay = document.getElementById('Pestdisplay');
//                                                     detailPestDisplay.style.display = "inline";
//                                                     document.getElementById('xButton').style.display = "inline";

//                                                     const divP = document.createElement('div');
//                                                     divP.classList.add('divP');

//                                                     const pestImage = document.createElement('img');
//                                                     pestImage.classList.add('pestimage');
//                                                     pestImage.src = pest.iconUrl;

//                                                     const titlePest = document.createElement('h3');
//                                                     titlePest.classList.add('Titlepest');
//                                                     titlePest.textContent = pest.title;


//                                                     const uploadsRef = firebase.database().ref('Disease');




//                                                     uploadsRef.on('value', (snapshot) => {
//                                                         detailPestDisplay.innerHTML = '';
//                                                         snapshot.forEach((childSnapshot) => {
//                                                             const disease = childSnapshot.val();
//                                                             if (disease.title === titlePest.textContent) {
//                                                                 const detailDiv = document.createElement('div');
//                                                                 detailDiv.classList.add('detailPestDiv');

//                                                                 const detailDiv2 = document.createElement('div');
//                                                                 detailDiv2.classList.add('detailPestDiv2');

//                                                                 const identify1 = document.createElement('h3');
//                                                                 identify1.textContent = "Identification: ";
//                                                                 identify1.classList.add('dIdentify1');

//                                                                 const identify = document.createElement('p');
//                                                                 identify.textContent = disease.identify;
//                                                                 identify.classList.add('dIdentify');

//                                                                 const ddamage1 = document.createElement('h3');
//                                                                 ddamage1.textContent = "Damage Prevention: ";
//                                                                 ddamage1.classList.add('ddamage1');

//                                                                 const ddamage = document.createElement('p');
//                                                                 ddamage.textContent = disease.damage;
//                                                                 ddamage.classList.add('ddamage');

//                                                                 const dPhysical1 = document.createElement('h3');
//                                                                 dPhysical1.textContent = "Physical Control: ";
//                                                                 dPhysical1.classList.add('dPhysical1');

//                                                                 const dPhysical = document.createElement('p');
//                                                                 dPhysical.textContent = disease.physical;
//                                                                 dPhysical.classList.add('dPhysical');

//                                                                 const dChemical1 = document.createElement('h3');
//                                                                 dChemical1.textContent = "Chemical Control: ";
//                                                                 dChemical1.classList.add('dChemical1');

//                                                                 const dChemical11 = document.createElement('h3');
//                                                                 dChemical11.textContent = "Chemical Control: ";
//                                                                 dChemical11.classList.add('dChemical11');


//                                                                 const instruc = document.createElement('h3');
//                                                                 instruc.textContent = "Plants Affected";
//                                                                 instruc.classList.add('instruc');

//                                                                 const dChemical = document.createElement('p');
//                                                                 dChemical.textContent = disease.chemical;
//                                                                 dChemical.classList.add('dChemical');



//                                                                 const xButton = document.getElementById('xButton');

//                                                                 xButton.addEventListener('click', () => {
//                                                                     detailPestDisplay.style.display = "none";
//                                                                     xButton.style.display = "none";
//                                                                 })

//                                                                 agriAdviceDB.on('value', (snapshot) => {
//                                                                     detailPestDisplay.innerHTML = '';
//                                                                     console.log("Snapshot received:", snapshot.val());
//                                                                     snapshot.forEach((childSnapshot) => {
//                                                                         const plant = childSnapshot.val();
//                                                                         console.log("Plant data:", plant);

//                                                                         plant.disease.forEach(pest => {
//                                                                             if (pest.title === disease.title) {
//                                                                                 const div_ = document.createElement('div');
//                                                                                 div_.classList.add('div_');

//                                                                                 const icon2 = document.createElement('img');
//                                                                                 icon2.src = plant.icon;
//                                                                                 icon2.classList.add('icons2');

//                                                                                 const title2 = document.createElement('h2');
//                                                                                 title2.textContent = plant.title;
//                                                                                 title2.classList.add('titles2');

//                                                                                 div_.appendChild(icon2);
//                                                                                 div_.appendChild(title2);
//                                                                                 detailDiv2.appendChild(div_);
//                                                                             }
//                                                                         })
//                                                                     });
//                                                                 });



//                                                                 detailDiv.appendChild(detailDiv2);
//                                                                 detailDiv.appendChild(identify1);
//                                                                 detailDiv.appendChild(identify);
//                                                                 detailDiv.appendChild(ddamage1);
//                                                                 detailDiv.appendChild(ddamage);
//                                                                 detailDiv.appendChild(dPhysical1);
//                                                                 detailDiv.appendChild(dPhysical);
//                                                                 detailDiv.appendChild(dChemical1);
//                                                                 detailDiv.appendChild(dChemical);
//                                                                 detailDiv.appendChild(dChemical11);


//                                                                 detailPestDisplay.appendChild(titlePest);
//                                                                 detailPestDisplay.appendChild(pestImage);
//                                                                 detailPestDisplay.appendChild(instruc);
//                                                                 detailPestDisplay.appendChild(detailDiv);
//                                                             }
//                                                         })
//                                                     })

//                                                     console.log("Appending elements to detailPestDisplay...");
//                                                 });
//                                             });

//                                             diseaseDiv4.appendChild(diseaseList);
//                                         }

//                                         const xButton = document.getElementById('xButton');

//                                         xButton.addEventListener('click', () => {
//                                             pestsContainer2.style.display = "none";
//                                             xButton.style.display = "none";
//                                         })

//                                         detailDiv1.appendChild(c2);
//                                         detailDiv1.appendChild(c1);
//                                         detailDiv2.appendChild(c3);

//                                         pestsContainer2.appendChild(detailDiv);
//                                         pestsContainer2.appendChild(qPest);
//                                         pestsContainer2.appendChild(pestsDiv4);
//                                         pestsContainer2.appendChild(qDisease);
//                                         pestsContainer2.appendChild(diseaseDiv4);
//                                         pestsContainer2.appendChild(qi);
//                                         pestsContainer2.appendChild(detailDiv1);
//                                         pestsContainer2.appendChild(qi1);
//                                         pestsContainer2.appendChild(detailDiv2);
//                                     })
//                                 }
//                             })
//                         });
//                     });



//                     detailDiv.appendChild(detailPestTitle);
//                     detailDiv.appendChild(detailPestImg);

//                     detailDiv2.appendChild(identify1);
//                     detailDiv2.appendChild(identify);
//                     detailDiv2.appendChild(ddamage1);
//                     detailDiv2.appendChild(ddamage);
//                     detailDiv2.appendChild(dPhysical1);
//                     detailDiv2.appendChild(dPhysical);
//                     detailDiv2.appendChild(dChemical1);
//                     detailDiv2.appendChild(dChemical);

//                     detailDisease.appendChild(detailDiv);
//                     detailDisease.appendChild(instruc);
//                     detailDisease.appendChild(detailDiv3);
//                     detailDisease.appendChild(detailDiv2);
//                 })

//                 diseaseDiv.appendChild(iconElement);
//                 diseaseDiv.appendChild(titleElement);
//                 diseaseDiv.appendChild(edimove);
//                 diseaseContainer.appendChild(diseaseDiv);
//             } else {
//                 console.error('Incomplete data for disease:', disease);
//             }
//         });
//     }, (error) => {
//         console.error('Error retrieving uploaded data:', error);
//     });
// }

// // Ensure that the function runs after the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', displayDisease);


// ================ Icon =========================

const icon = document.querySelector(".icon");
const metaData = document.querySelector(".metaData");
const icon1 = document.querySelector(".icon1");
const metaData1 = document.querySelector(".metaData1");
let files;
let files1;

const getIconData = (e) => {
    metaData.innerHTML = "";

    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        // Corrected src attribute assignment
        deselectButton.src = "assets/img/delete.png";
        deselectButton.className = "deselectButton";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        metaData.appendChild(imageData);
    }
}

const selectIcon = () => {
    icon.click();
}

const getIconData1 = (e) => {

    metaData1.innerHTML = "";
    files1 = e.target.files;
    for (let index = 0; index < files1.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files1[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        // Corrected src attribute assignment
        deselectButton.src = "assets/img/delete.png";
        deselectButton.className = "deselectButton";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        metaData1.appendChild(imageData);
    }
}

const selectIcon1 = () => {
    icon1.click();
}



// ========================= Add Plant ==============================

function resetForm() {
    // Reset the values of input fields in the form
    addDiseaseForm.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the icon image display
    const selectIcon = document.getElementById('icon_image').querySelector('.metaData');
    selectIcon.textContent = "";

    // Reset the file input for the icon image
    const iconInput = document.getElementById('icon');
    iconInput.value = '';
}

function resetForm2() {
    // Reset the values of input fields in the form
    addPestsForm2.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the icon image display
    const selectIcon = document.getElementById('icon_image1').querySelector('.metaData1');
    selectIcon.textContent = "";

    // Reset the file input for the icon image
    const iconInput = document.getElementById('icon1');
    iconInput.value = '';
}

function resetForm3() {
    // Reset the values of input fields in the form
    editPestsForm3.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });

    // Reset the icon image display
    const selectIcon = document.getElementById('icon_image1').querySelector('.metaData1');
    selectIcon.textContent = "";

    // Reset the file input for the icon image
    const iconInput = document.getElementById('icon3');
    iconInput.value = '';
}

const addDiseaseForm = document.getElementById('addDisease');
document.getElementById('addDes').addEventListener('click', function () {
    addDiseaseForm.style.display = 'inline';
    addPestsForm2.style.display = 'none';
    document.getElementById('sidebar').style.filter = "blur(5px)";
    document.getElementById('sidebar1').style.filter = "blur(5px)";
});
document.getElementById('close').addEventListener('click', function () {
    addDiseaseForm.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm(); // Reset the form fields and images
});


const addPestsForm2 = document.getElementById('addPests');
document.getElementById('addPest').addEventListener('click', function () {
    addPestsForm2.style.display = 'inline';
    addDiseaseForm.style.display = 'none';
    document.getElementById('sidebar').style.filter = "blur(5px)";
    document.getElementById('sidebar1').style.filter = "blur(5px)";
});
document.getElementById('close1').addEventListener('click', function () {
    addPestsForm2.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm2(); // Reset the form fields and images
});

const editPestsForm3 = document.getElementById('editpesdes');
document.getElementById('close3').addEventListener('click', function () {
    editPestsForm3.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm3(); // Reset the form fields and images
});

const editDiseaseForm3 = document.getElementById('editdes');
document.getElementById('close4').addEventListener('click', function () {
    editDiseaseForm3.style.display = 'none';
    document.getElementById('sidebar').style.filter = "none";
    document.getElementById('sidebar1').style.filter = "none";
    resetForm3(); // Reset the form fields and images
});


function logoutUser() {
    firebase.auth().signOut().then(() => {
        sessionStorage.setItem("isLoggedIn", "false");
        
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


let selectedIconFiles;

const getIconData3 = (e) => {
    const files = e.target.files;
    selectedIconFiles = files; // Store the files for later use

    const metaData3 = document.getElementById("metaData3");
    metaData3.innerHTML = "";

    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.src = "assets/img/delete.png";
        deselectButton.className = "deselectButton";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        metaData3.appendChild(imageData);
    }
}


const selectIcon3 = () => {
    const icon3 = document.getElementById("icon3");
    icon3.click();
}

let selectedIconFiles4;

const getIconData4 = (e) => {
    const files = e.target.files;
    selectedIconFiles4 = files;

    const metaData4 = document.getElementById("metaData4");
    metaData4.innerHTML = "";

    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "iconContainer";

        const image = document.createElement("img");
        image.className = "fileData";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.src = "assets/img/delete.png";
        deselectButton.className = "deselectButton";
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        metaData4.appendChild(imageData);
    }
}


const selectIcon4 = () => {
    const icon4 = document.getElementById("icon4");
    icon4.click();
}




const pestref = database.ref('Pests');
const pesttable = document.getElementById('table_pest');
function getpest() {
    pestref.on('value', function (snapshot) {
        pesttable.innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            const ven = childSnapshot.val();
            const pestKey = childSnapshot.key;
            const container = document.createElement('div');
            container.classList.add('container');

            const container2 = document.createElement('div');
            container2.classList.add('container2');

            const imagePest = document.createElement('img');
            imagePest.src = ven.imageUrl;
            imagePest.classList.add('imagePest');

            const pestname = document.createElement('h5');
            pestname.textContent = ven.title;
            pestname.classList.add('pestname');

            const editPest = document.createElement('h5');
            editPest.textContent = "Edit";
            editPest.classList.add('editPest');

            const deletePest = document.createElement('h5');
            deletePest.textContent = "Delete"
            deletePest.classList.add('deletePest');

            const seePest = document.createElement('img');
            seePest.src = "assets/img/visible.png";
            seePest.classList.add('seePest');

            editPest.addEventListener('click', (event) => {
                event.stopPropagation();
                const editpesdes = document.getElementById('editpesdes');
                editpesdes.style.display = "inline";

                const metaData3 = document.getElementById('metaData3');
                metaData3.innerHTML = "";

                const imageData = document.createElement('div');
                imageData.className = 'iconContainer';

                const image = document.createElement('img');
                image.className = 'fileData';
                image.src = ven.imageUrl;
                imageData.appendChild(image);

                const deselectButton = document.createElement('img');
                deselectButton.src = 'assets/img/delete.png';
                deselectButton.className = 'deselectButton';
                deselectButton.onclick = function () {
                    imageData.remove();
                };
                imageData.appendChild(deselectButton);

                metaData3.appendChild(imageData);

                document.getElementById('icon3').value;
                document.getElementById('title3').value = ven.title;
                document.getElementById('identfication3').value = ven.identify;
                document.getElementById('damage3').value = ven.damage;
                document.getElementById('physical3').value = ven.physical;
                document.getElementById('chemical3').value = ven.chemical;


                const updatePest = document.getElementById('updatePest');
                updatePest.addEventListener('click', () => {
                    const updatedTitle = document.getElementById('title3').value;
                    const updatedIdentfication = document.getElementById('identfication3').value;
                    const updatedDamage = document.getElementById('damage3').value;
                    const updatedPhysical = document.getElementById('physical3').value;
                    const updatedChemical = document.getElementById('chemical3').value;

                    const pestId = childSnapshot.key;
                    const pestRefToUpdate = pestref.child(pestId);

                    pestRefToUpdate.update({
                        title: updatedTitle,
                        identify: updatedIdentfication,
                        damage: updatedDamage,
                        physical: updatedPhysical,
                        chemical: updatedChemical
                    });

                    if (selectedIconFiles) {
                        const iconFile = selectedIconFiles[0];
                        const storageRef = firebase.storage().ref('path/to/storage');
                        const iconRef = storageRef.child(iconFile.name);

                        iconRef.put(iconFile).then((snapshot) => {
                            return snapshot.ref.getDownloadURL();
                        }).then((downloadURL) => {
                            pestRefToUpdate.update({ imageUrl: downloadURL });
                        }).catch((error) => {
                            console.error('Error uploading icon:', error);
                        });
                    }
                    const alertUpdate = document.getElementById('updateAlert');
                    alertUpdate.style.display = "inline";
                    editpesdes.style.display = "none";
                    const okayUpdate = document.getElementById('okayUpdate');
                    okayUpdate.addEventListener('click', () => {
                        alertUpdate.style.display = "none";
                    })
                });

            });


            deletePest.addEventListener('click', (event) => {
                event.stopPropagation();
                const pestRefToDelete = pestref.child(pestKey);
                const confirmDelete = confirm("Are you sure you want to delete this item?");
                if (confirmDelete) {
                    pestRefToDelete.remove()
                        .then(() => {
                            console.log('Pest removed successfully');
                            container.remove();
                        })
                        .catch(error => {
                            console.error('Error removing pest:', error.message);
                        });
                }
            });

            document.body.appendChild(container);


            container.appendChild(imagePest);
            container.appendChild(pestname);
            container.appendChild(editPest);
            container.appendChild(deletePest);
            container.appendChild(seePest);

            seePest.addEventListener('click', () => {
                const dPests = document.getElementById('detailPesDes');
                dPests.innerHTML = '';

                document.getElementById('pest-container').style.display = "none";
                document.getElementById('disease-container').style.display = "none";
                document.getElementById('pestCon').style.display = "none";
                document.getElementById('diseaseCon').style.display = "none";
                document.getElementById('ContainerPestandDisease').style.display = "flex";


                const detailDiv = document.createElement('div');
                detailDiv.classList.add('detailPestDiv');

                const detailDiv2 = document.createElement('div');
                detailDiv2.classList.add('detailPestDiv2');

                const detailDiv3 = document.createElement('div');
                detailDiv3.classList.add('detailPestDiv3');

                const detailPestTitle = document.createElement('h3');
                detailPestTitle.textContent = ven.title;
                detailPestTitle.classList.add('pestTitle');

                const detailPestImg = document.createElement('img');
                detailPestImg.src = ven.imageUrl;
                detailPestImg.classList.add('pestImg');

                const identify1 = document.createElement('h3');
                identify1.textContent = "Identification: ";
                identify1.classList.add('dIdentify1');

                const identify = document.createElement('p');
                identify.textContent = ven.identify;
                identify.classList.add('dIdentify');

                const ddamage1 = document.createElement('h3');
                ddamage1.textContent = "Damage Prevention: ";
                ddamage1.classList.add('ddamage1');

                const ddamage = document.createElement('p');
                ddamage.textContent = ven.damage;
                ddamage.classList.add('ddamage');

                const dPhysical1 = document.createElement('h3');
                dPhysical1.textContent = "Physical Control: ";
                dPhysical1.classList.add('dPhysical1');

                const dPhysical = document.createElement('p');
                dPhysical.textContent = ven.physical;
                dPhysical.classList.add('dPhysical');

                const dChemical1 = document.createElement('h3');
                dChemical1.textContent = "Chemical Control: ";
                dChemical1.classList.add('dChemical1');

                const instruc = document.createElement('h3');
                instruc.textContent = "Plants Affected";
                instruc.classList.add('instruc');

                const dChemical = document.createElement('p');
                dChemical.textContent = ven.chemical;
                dChemical.classList.add('dChemical');

                const backButton = document.getElementById('backPD');
                backButton.addEventListener('click', () => {

                    document.getElementById('ContainerPestandDisease').style.display = "none";
                    document.getElementById('pestCon').style.display = "block";
                    document.getElementById('diseaseCon').style.display = "none";
                })

                detailDiv.appendChild(detailPestTitle);
                detailDiv.appendChild(detailPestImg);

                detailDiv2.appendChild(identify1);
                detailDiv2.appendChild(identify);
                detailDiv2.appendChild(ddamage1);
                detailDiv2.appendChild(ddamage);
                detailDiv2.appendChild(dPhysical1);
                detailDiv2.appendChild(dPhysical);
                detailDiv2.appendChild(dChemical1);
                detailDiv2.appendChild(dChemical);

                dPests.appendChild(detailDiv);
                dPests.appendChild(instruc);
                dPests.appendChild(detailDiv3);
                dPests.appendChild(detailDiv2);

                agriAdviceDB.on('value', (snapshot) => {
                    detailDiv3.innerHTML = '';
                    console.log("Snapshot received:", snapshot.val());
                    snapshot.forEach((childSnapshot) => {
                        const plant = childSnapshot.val();
                        console.log("Plant data:", plant);

                        if (plant.pests && Array.isArray(plant.pests)) {
                            plant.pests.forEach(pests => {
                                console.log("Checking pest:", pests);
                                if (pests.title === ven.title) {
                                    console.log("Title matches:", pests.title);
                                    const div_ = document.createElement('div');
                                    div_.classList.add('div_');

                                    const icon2 = document.createElement('img');
                                    icon2.src = plant.icon;
                                    icon2.classList.add('icons2');

                                    const title2 = document.createElement('h2');
                                    title2.textContent = plant.title;
                                    title2.classList.add('titles2');

                                    div_.appendChild(icon2);
                                    div_.appendChild(title2);

                                    detailDiv3.appendChild(div_);
                                } else {
                                    console.log("Title does not match:", pests.title);
                                }
                            });
                        } else {
                            console.log("No disease data or not an array for plant:", plant);
                        }
                    });
                });

            })
            pesttable.appendChild(container);
        })
    })
}
getpest();

document.getElementById('toggleButton').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
});

document.getElementById('toggleButton2').addEventListener('click', function () {
    const dropdown = document.getElementById('dropdown2');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
});

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('dropdown');
    const toggleButton = document.getElementById('toggleButton');
    if (!dropdown.contains(event.target) && !toggleButton.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('dropdown2');
    const toggleButton = document.getElementById('toggleButton2');
    if (!dropdown.contains(event.target) && !toggleButton.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

document.getElementById('pestDisplay').addEventListener('click', function () {
    const pestD = document.getElementById('pestCon');
    pestD.style.display = "inline";
    const desD = document.getElementById('diseaseCon');
    desD.style.display = "none";
});

document.getElementById('diseaseDisplay').addEventListener('click', function () {
    const pestD = document.getElementById('pestCon');
    pestD.style.display = "none";
    const desD = document.getElementById('diseaseCon');
    desD.style.display = "inline";
});

document.getElementById('pestDisplay2').addEventListener('click', function () {
    const pestD = document.getElementById('pestCon');
    pestD.style.display = "inline";
    const desD = document.getElementById('diseaseCon');
    desD.style.display = "none";
});

document.getElementById('diseaseDisplay2').addEventListener('click', function () {
    const pestD = document.getElementById('pestCon');
    pestD.style.display = "none";
    const desD = document.getElementById('diseaseCon');
    desD.style.display = "inline";
});

const diseaseref = database.ref('Disease');
const diseasetable = document.getElementById('table_disease');
function getdisease() {
    diseaseref.on('value', function (snapshot) {
        diseasetable.innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            const des = childSnapshot.val();
            const desKey = childSnapshot.key;
            const container = document.createElement('div');
            container.classList.add('container');

            const container2 = document.createElement('div');
            container2.classList.add('container2');

            const imagePest = document.createElement('img');
            imagePest.src = des.imageUrl;
            imagePest.classList.add('imagePest');

            const pestname = document.createElement('h5');
            pestname.textContent = des.title;
            pestname.classList.add('pestname');

            const editPest = document.createElement('h5');
            editPest.textContent = "Edit";
            editPest.classList.add('editPest');

            const deletePest = document.createElement('h5');
            deletePest.textContent = "Delete"
            deletePest.classList.add('deletePest');

            editPest.addEventListener('click', (event) => {
                event.stopPropagation();
                const editdes = document.getElementById('editdes');
                editdes.style.display = "inline";

                const metaData4 = document.getElementById('metaData4');
                metaData4.innerHTML = "";

                const imageData = document.createElement('div');
                imageData.className = 'iconContainer';

                const image = document.createElement('img');
                image.className = 'fileData';
                image.src = des.imageUrl;
                imageData.appendChild(image);

                const deselectButton = document.createElement('img');
                deselectButton.src = 'assets/img/delete.png';
                deselectButton.className = 'deselectButton';
                deselectButton.onclick = function () {
                    imageData.remove();
                };
                imageData.appendChild(deselectButton);

                metaData4.appendChild(imageData);

                document.getElementById('icon4').value;
                document.getElementById('title4').value = des.title;
                document.getElementById('identfication4').value = des.identify;
                document.getElementById('damage4').value = des.damage;
                document.getElementById('physical4').value = des.physical;
                document.getElementById('chemical4').value = des.chemical;


                const updatePest = document.getElementById('updateDisease');
                updatePest.addEventListener('click', () => {
                    const updatedTitle = document.getElementById('title4').value;
                    const updatedIdentfication = document.getElementById('identfication4').value;
                    const updatedDamage = document.getElementById('damage4').value;
                    const updatedPhysical = document.getElementById('physical4').value;
                    const updatedChemical = document.getElementById('chemical4').value;

                    const pestId = childSnapshot.key;
                    const pestRefToUpdate = diseaseref.child(pestId);

                    pestRefToUpdate.update({
                        title: updatedTitle,
                        identify: updatedIdentfication,
                        damage: updatedDamage,
                        physical: updatedPhysical,
                        chemical: updatedChemical
                    });

                    if (selectedIconFiles4) {
                        const iconFile = selectedIconFiles4[0];
                        const storageRef = firebase.storage().ref('path/to/storage');
                        const iconRef = storageRef.child(iconFile.name);

                        iconRef.put(iconFile).then((snapshot) => {
                            return snapshot.ref.getDownloadURL();
                        }).then((downloadURL) => {
                            pestRefToUpdate.update({ imageUrl: downloadURL });
                        }).catch((error) => {
                            console.error('Error uploading icon:', error);
                        });
                    }
                    const alertUpdate = document.getElementById('updateAlert');
                    alertUpdate.style.display = "inline";
                    editdes.style.display = "none";
                    const okayUpdate = document.getElementById('okayUpdate');
                    okayUpdate.addEventListener('click', () => {
                        alertUpdate.style.display = "none";
                    })
                });

            });

            deletePest.addEventListener('click', (event) => {
                event.stopPropagation();
                const diseaseRefToDelete = diseaseref.child(desKey);
                const confirmDelete = confirm("Are you sure you want to delete this item?");
                if (confirmDelete) {
                    diseaseRefToDelete.remove()
                        .then(() => {
                            console.log('Disease removed successfully');
                            container.remove();
                        })
                        .catch(error => {
                            console.error('Error removing disease:', error.message);
                        });
                }
            });

            const seePest = document.createElement('img');
            seePest.src = "assets/img/visible.png";
            seePest.classList.add('seePest');

            seePest.addEventListener('click', () => {
                const dPests = document.getElementById('detailPesDes');
                dPests.innerHTML = '';

                document.getElementById('pest-container').style.display = "none";
                document.getElementById('disease-container').style.display = "none";
                document.getElementById('pestCon').style.display = "none";
                document.getElementById('diseaseCon').style.display = "none";
                document.getElementById('ContainerPestandDisease').style.display = "flex";

                const detailDiv = document.createElement('div');
                detailDiv.classList.add('detailPestDiv');

                const detailDiv2 = document.createElement('div');
                detailDiv2.classList.add('detailPestDiv2');

                const detailDiv3 = document.createElement('div');
                detailDiv3.classList.add('detailPestDiv3');

                const detailPestTitle = document.createElement('h3');
                detailPestTitle.textContent = des.title;
                detailPestTitle.classList.add('pestTitle');

                const detailPestImg = document.createElement('img');
                detailPestImg.src = des.imageUrl;
                detailPestImg.classList.add('pestImg');

                const identify1 = document.createElement('h3');
                identify1.textContent = "Identification: ";
                identify1.classList.add('dIdentify1');

                const identify = document.createElement('p');
                identify.textContent = des.identify;
                identify.classList.add('dIdentify');

                const ddamage1 = document.createElement('h3');
                ddamage1.textContent = "Damage Prevention: ";
                ddamage1.classList.add('ddamage1');

                const ddamage = document.createElement('p');
                ddamage.textContent = des.damage;
                ddamage.classList.add('ddamage');

                const dPhysical1 = document.createElement('h3');
                dPhysical1.textContent = "Physical Control: ";
                dPhysical1.classList.add('dPhysical1');

                const dPhysical = document.createElement('p');
                dPhysical.textContent = des.physical;
                dPhysical.classList.add('dPhysical');

                const dChemical1 = document.createElement('h3');
                dChemical1.textContent = "Chemical Control: ";
                dChemical1.classList.add('dChemical1');

                const instruc = document.createElement('h3');
                instruc.textContent = "Plants Affected";
                instruc.classList.add('instruc');

                const dChemical = document.createElement('p');
                dChemical.textContent = des.chemical;
                dChemical.classList.add('dChemical');

                const backButton = document.getElementById('backPD');
                backButton.addEventListener('click', () => {
                    document.getElementById('ContainerPestandDisease').style.display = "none";
                    document.getElementById('pestCon').style.display = "block";
                    document.getElementById('diseaseCon').style.display = "none";
                });

                detailDiv.appendChild(detailPestTitle);
                detailDiv.appendChild(detailPestImg);

                detailDiv2.appendChild(identify1);
                detailDiv2.appendChild(identify);
                detailDiv2.appendChild(ddamage1);
                detailDiv2.appendChild(ddamage);
                detailDiv2.appendChild(dPhysical1);
                detailDiv2.appendChild(dPhysical);
                detailDiv2.appendChild(dChemical1);
                detailDiv2.appendChild(dChemical);

                dPests.appendChild(detailDiv);
                dPests.appendChild(instruc);
                dPests.appendChild(detailDiv3);
                dPests.appendChild(detailDiv2);

                agriAdviceDB.on('value', (snapshot) => {
                    detailDiv3.innerHTML = '';
                    console.log("Snapshot received:", snapshot.val());
                    snapshot.forEach((childSnapshot) => {
                        const plant = childSnapshot.val();
                        console.log("Plant data:", plant);

                        // Check if plant.disease exists and is an array
                        if (plant.disease && Array.isArray(plant.disease)) {
                            plant.disease.forEach(pest => {
                                console.log("Checking pest:", pest);
                                if (pest.title === des.title) {
                                    console.log("Title matches:", pest.title);
                                    const div_ = document.createElement('div');
                                    div_.classList.add('div_');

                                    const icon2 = document.createElement('img');
                                    icon2.src = plant.icon;
                                    icon2.classList.add('icons2');

                                    const title2 = document.createElement('h2');
                                    title2.textContent = plant.title;
                                    title2.classList.add('titles2');

                                    div_.appendChild(icon2);
                                    div_.appendChild(title2);

                                    detailDiv3.appendChild(div_);
                                } else {
                                    console.log("Title does not match:", pest.title);
                                }
                            });
                        } else {
                            console.log("No disease data or not an array for plant:", plant);
                        }
                    });
                });

            });


            container.appendChild(imagePest);
            container.appendChild(pestname);
            container.appendChild(editPest);
            container.appendChild(deletePest);
            container.appendChild(seePest);


            diseasetable.appendChild(container);
        })
    })
}
getdisease();



const searchInput = document.getElementById('searchDes');
const searchResults = document.getElementById('diseaseList');

searchInput.addEventListener('input', (e) => {
    const searchText = e.target.value;

    if (searchText.trim() === '') {
        clearSearchResults();
        const diseaseTable = document.getElementById('table_disease');
        diseaseTable.style.display = "block";
    } else {
        searchDatabase(searchText.toLowerCase());
    }
});

function searchDatabase(searchText) {
    searchResults.innerHTML = "";

    database.ref('Disease')
        .once('value')
        .then(snapshot => {
            let resultsFound = false;
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();

                // Normalize the title to lower case for case-insensitive comparison
                if (data.title.toLowerCase().startsWith(searchText)) {
                    resultsFound = true;
                    document.getElementById('table_disease').style.display = 'none';

                    const container = document.createElement('div');
                    container.classList.add('container');

                    const imagePest = document.createElement('img');
                    imagePest.src = data.imageUrl;
                    imagePest.classList.add('imagePest');

                    const pestname = document.createElement('h5');
                    pestname.textContent = data.title;
                    pestname.classList.add('pestname');

                    const editPest = document.createElement('h5');
                    editPest.textContent = "Edit";
                    editPest.classList.add('editPest');

                    const deletePest = document.createElement('h5');
                    deletePest.textContent = "Delete";
                    deletePest.classList.add('deletePest');

                    const seePest = document.createElement('img');
                    seePest.src = "assets/img/visible.png";
                    seePest.classList.add('seePest');

                    container.appendChild(imagePest);
                    container.appendChild(pestname);
                    container.appendChild(editPest);
                    container.appendChild(deletePest);

                    container.addEventListener('click', () => {
                        const dPests = document.getElementById('detailPesDes');
                        dPests.innerHTML = '';

                        document.getElementById('pest-container').style.display = "none";
                        document.getElementById('disease-container').style.display = "none";
                        document.getElementById('pestCon').style.display = "none";
                        document.getElementById('diseaseCon').style.display = "none";
                        document.getElementById('ContainerPestandDisease').style.display = "flex";


                        const detailDiv = document.createElement('div');
                        detailDiv.classList.add('detailPestDiv');

                        const detailDiv2 = document.createElement('div');
                        detailDiv2.classList.add('detailPestDiv2');

                        const detailDiv3 = document.createElement('div');
                        detailDiv3.classList.add('detailPestDiv3');

                        const detailPestTitle = document.createElement('h3');
                        detailPestTitle.textContent = des.title;
                        detailPestTitle.classList.add('pestTitle');

                        const detailPestImg = document.createElement('img');
                        detailPestImg.src = des.imageUrl;
                        detailPestImg.classList.add('pestImg');

                        const identify1 = document.createElement('h3');
                        identify1.textContent = "Identification: ";
                        identify1.classList.add('dIdentify1');

                        const identify = document.createElement('p');
                        identify.textContent = des.identify;
                        identify.classList.add('dIdentify');

                        const ddamage1 = document.createElement('h3');
                        ddamage1.textContent = "Damage Prevention: ";
                        ddamage1.classList.add('ddamage1');

                        const ddamage = document.createElement('p');
                        ddamage.textContent = des.damage;
                        ddamage.classList.add('ddamage');

                        const dPhysical1 = document.createElement('h3');
                        dPhysical1.textContent = "Physical Control: ";
                        dPhysical1.classList.add('dPhysical1');

                        const dPhysical = document.createElement('p');
                        dPhysical.textContent = des.physical;
                        dPhysical.classList.add('dPhysical');

                        const dChemical1 = document.createElement('h3');
                        dChemical1.textContent = "Chemical Control: ";
                        dChemical1.classList.add('dChemical1');

                        const instruc = document.createElement('h3');
                        instruc.textContent = "Plants Affected";
                        instruc.classList.add('instruc');

                        const dChemical = document.createElement('p');
                        dChemical.textContent = des.chemical;
                        dChemical.classList.add('dChemical');

                        const backButton = document.getElementById('backPD');
                        backButton.addEventListener('click', () => {

                            document.getElementById('ContainerPestandDisease').style.display = "none";
                            document.getElementById('diseaseCon').style.display = "block";
                            document.getElementById('pestCon').style.display = "none";
                        })

                        detailDiv.appendChild(detailPestTitle);
                        detailDiv.appendChild(detailPestImg);

                        detailDiv2.appendChild(identify1);
                        detailDiv2.appendChild(identify);
                        detailDiv2.appendChild(ddamage1);
                        detailDiv2.appendChild(ddamage);
                        detailDiv2.appendChild(dPhysical1);
                        detailDiv2.appendChild(dPhysical);
                        detailDiv2.appendChild(dChemical1);
                        detailDiv2.appendChild(dChemical);

                        dPests.appendChild(detailDiv);
                        dPests.appendChild(instruc);
                        dPests.appendChild(detailDiv3);
                        dPests.appendChild(detailDiv2);
                    })

                    searchResults.appendChild(container);
                }
            });

            if (!resultsFound) {
                document.getElementById('table_disease').style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error searching database: ", error);
        });
}

function clearSearchResults() {
    searchResults.innerHTML = "";
}



// ===================== Search for Pest ====================================

const searchInputP = document.getElementById('searchPes');
const searchResultsP = document.getElementById('PestList');

searchInputP.addEventListener('input', (e) => {
    const searchText = e.target.value;

    if (searchText.trim() === '') {
        clearSearchResultsP();
        const pestTable = document.getElementById('table_pest');
        pestTable.style.display = "block";
    } else {
        searchDatabaseP(searchText.toLowerCase());
    }
});

function searchDatabaseP(searchText) {
    searchResultsP.innerHTML = "";

    database.ref('Pests')
        .once('value')
        .then(snapshot => {
            let resultsFound = false;
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();

                if (data.title.toLowerCase().startsWith(searchText)) {
                    resultsFound = true;
                    document.getElementById('table_pest').style.display = 'none';

                    const container = document.createElement('div');
                    container.classList.add('container');

                    const imagePest = document.createElement('img');
                    imagePest.src = data.imageUrl;
                    imagePest.classList.add('imagePest');

                    const pestname = document.createElement('h5');
                    pestname.textContent = data.title;
                    pestname.classList.add('pestname');

                    const editPest = document.createElement('h5');
                    editPest.textContent = "Edit";
                    editPest.classList.add('editPest');

                    const deletePest = document.createElement('h5');
                    deletePest.textContent = "Delete";
                    deletePest.classList.add('deletePest');

                    const seePest = document.createElement('img');
                    seePest.src = "assets/img/visible.png";
                    seePest.classList.add('seePest');

                    deletePest.addEventListener('click', () => {
                        const confirmDelete = confirm("Are you sure you want to delete this item?");
                        if (confirmDelete) {
                            database.ref('Pests').child(childSnapshot.key).remove();
                            container.remove();
                        }
                    });

                    // Append the container to the DOM
                    // Adjust this according to where you want to append the container
                    document.body.appendChild(container);

                    container.appendChild(imagePest);
                    container.appendChild(pestname);
                    container.appendChild(editPest);
                    container.appendChild(deletePest);

                    container.addEventListener('click', () => {
                        const dPests = document.getElementById('detailPesDes');
                        dPests.innerHTML = '';

                        document.getElementById('pest-container').style.display = "none";
                        document.getElementById('disease-container').style.display = "none";
                        document.getElementById('pestCon').style.display = "none";
                        document.getElementById('diseaseCon').style.display = "none";
                        document.getElementById('ContainerPestandDisease').style.display = "flex";


                        const detailDiv = document.createElement('div');
                        detailDiv.classList.add('detailPestDiv');

                        const detailDiv2 = document.createElement('div');
                        detailDiv2.classList.add('detailPestDiv2');

                        const detailDiv3 = document.createElement('div');
                        detailDiv3.classList.add('detailPestDiv3');

                        const detailPestTitle = document.createElement('h3');
                        detailPestTitle.textContent = data.title;
                        detailPestTitle.classList.add('pestTitle');

                        const detailPestImg = document.createElement('img');
                        detailPestImg.src = data.imageUrl;
                        detailPestImg.classList.add('pestImg');

                        const identify1 = document.createElement('h3');
                        identify1.textContent = "Identification: ";
                        identify1.classList.add('dIdentify1');

                        const identify = document.createElement('p');
                        identify.textContent = data.identify;
                        identify.classList.add('dIdentify');

                        const ddamage1 = document.createElement('h3');
                        ddamage1.textContent = "Damage Prevention: ";
                        ddamage1.classList.add('ddamage1');

                        const ddamage = document.createElement('p');
                        ddamage.textContent = data.damage;
                        ddamage.classList.add('ddamage');

                        const dPhysical1 = document.createElement('h3');
                        dPhysical1.textContent = "Physical Control: ";
                        dPhysical1.classList.add('dPhysical1');

                        const dPhysical = document.createElement('p');
                        dPhysical.textContent = data.physical;
                        dPhysical.classList.add('dPhysical');

                        const dChemical1 = document.createElement('h3');
                        dChemical1.textContent = "Chemical Control: ";
                        dChemical1.classList.add('dChemical1');

                        const instruc = document.createElement('h3');
                        instruc.textContent = "Plants Affected";
                        instruc.classList.add('instruc');

                        const dChemical = document.createElement('p');
                        dChemical.textContent = data.chemical;
                        dChemical.classList.add('dChemical');

                        const backButton = document.getElementById('backPD');
                        backButton.addEventListener('click', () => {

                            document.getElementById('ContainerPestandDisease').style.display = "none";
                            document.getElementById('pestCon').style.display = "block";
                            document.getElementById('diseaseCon').style.display = "none";
                        })

                        detailDiv.appendChild(detailPestTitle);
                        detailDiv.appendChild(detailPestImg);

                        detailDiv2.appendChild(identify1);
                        detailDiv2.appendChild(identify);
                        detailDiv2.appendChild(ddamage1);
                        detailDiv2.appendChild(ddamage);
                        detailDiv2.appendChild(dPhysical1);
                        detailDiv2.appendChild(dPhysical);
                        detailDiv2.appendChild(dChemical1);
                        detailDiv2.appendChild(dChemical);

                        dPests.appendChild(detailDiv);
                        dPests.appendChild(instruc);
                        dPests.appendChild(detailDiv3);
                        dPests.appendChild(detailDiv2);
                    })

                    searchResultsP.appendChild(container);
                }
            });

            if (!resultsFound) {
                document.getElementById('table_pest').style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Error searching database: ", error);
        });
}

function clearSearchResultsP() {
    searchResultsP.innerHTML = "";
}

