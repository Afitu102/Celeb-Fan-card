// ==========================================
// FAN MEMBERSHIP CARD BUILDER
// JavaScript: app.js
// ==========================================

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
getFirestore,
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import {
getAuth,
signInAnonymously
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================

// Replace these placeholder values with your
// actual Firebase project configuration.

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT_ID.appspot.com",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID"
};

let db = null;
let auth = null;
let firebaseReady = false;

// Connect to Firebase
async function connectFirebase() {

if (
!firebaseConfig.apiKey ||
firebaseConfig.apiKey === "YOUR_API_KEY" ||
!firebaseConfig.projectId ||
firebaseConfig.projectId === "YOUR_PROJECT_ID"
) {
console.warn("Firebase configuration has not been added.");
return;
}

try {

const firebaseApp = initializeApp(firebaseConfig);

db = getFirestore(firebaseApp);
auth = getAuth(firebaseApp);

await signInAnonymously(auth);

firebaseReady = true;

console.log("Firebase connected successfully.");

} catch (error) {

console.error("Firebase connection error:", error);

firebaseReady = false;

}
}

// ==========================================
// 2. LOAD REQUIRED LIBRARIES
// ==========================================

function loadScript(src) {

return new Promise((resolve, reject) => {

const script = document.createElement("script");

script.src = src;
script.onload = resolve;
script.onerror = reject;

document.head.appendChild(script);

});

}

async function loadLibraries() {

try {

await Promise.all([

  loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
  ),

  loadScript(
    "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"
  ),

  loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
  )

]);

console.log("Card libraries loaded.");

} catch (error) {

console.error("Could not load card libraries:", error);

showStatus(
  "Some card features could not load. Please refresh the page.",
  "error"
);

}

}

// ==========================================
// 3. CELEBRITY DATABASE
// ==========================================

const celebrities = [

// AMERICAN CELEBRITIES

{ name: "Taylor Swift", category: "American" },
{ name: "Beyoncé", category: "American" },
{ name: "Ariana Grande", category: "American" },
{ name: "Selena Gomez", category: "American" },
{ name: "Jennifer Lopez", category: "American" },
{ name: "Kim Kardashian", category: "American" },
{ name: "Zendaya", category: "American" },
{ name: "Billie Eilish", category: "American" },
{ name: "Lady Gaga", category: "American" },
{ name: "Miley Cyrus", category: "American" },
{ name: "Keanu Reeves", category: "American" },
{ name: "Elon Musk", category: "American" },
{ name: "Will Smith", category: "American" },
{ name: "Leonardo DiCaprio", category: "American" },
{ name: "Tom Cruise", category: "American" },
{ name: "Denzel Washington", category: "American" },
{ name: "Robert Downey Jr.", category: "American" },
{ name: "Scarlett Johansson", category: "American" },
{ name: "Oprah Winfrey", category: "American" },
{ name: "Chris Evans", category: "American" },
{ name: "Jennifer Aniston", category: "American" },

// BRITISH CELEBRITIES

{ name: "David Beckham", category: "British" },
{ name: "Victoria Beckham", category: "British" },
{ name: "Tom Holland", category: "British" },
{ name: "Emma Watson", category: "British" },
{ name: "Daniel Radcliffe", category: "British" },
{ name: "Harry Styles", category: "British" },
{ name: "Ed Sheeran", category: "British" },
{ name: "Adele", category: "British" },
{ name: "Dua Lipa", category: "British" },
{ name: "Jason Statham", category: "British" },
{ name: "Rowan Atkinson", category: "British" },
{ name: "Henry Cavill", category: "British" },
{ name: "Benedict Cumberbatch", category: "British" },
{ name: "Kate Winslet", category: "British" },
{ name: "Simon Cowell", category: "British" },

// INTERNATIONAL CELEBRITIES

{ name: "Will Parfitt", category: "International" },
{ name: "Justin Bieber", category: "International" },
{ name: "Rihanna", category: "International" }

];

// ==========================================
// 4. ELEMENT SELECTORS
// ==========================================

const celebrityGrid = document.getElementById("celebrityGrid");
const celebritySearch = document.getElementById("celebritySearch");

const fanNameInput = document.getElementById("fanName");
const sexInput = document.getElementById("sex");
const cardTypeInput = document.getElementById("cardType");
const countryInput = document.getElementById("country");
const favoriteInput = document.getElementById("favorite");
const fanPhotoInput = document.getElementById("fanPhoto");

const benefitsInput = document.getElementById("benefits");
const termsInput = document.getElementById("terms");
const validityInput = document.getElementById("validity");
const contactInput = document.getElementById("contact");
const disclaimerInput = document.getElementById("disclaimer");

const generateButton = document.getElementById("generateCard");

const frontCard = document.getElementById("frontCard");
const backCard = document.getElementById("backCard");

const statusMessage = document.getElementById("statusMessage");

// ==========================================
// 5. PREVIEW ELEMENTS
// ==========================================

const previewCelebrity = document.getElementById("previewCelebrity");
const previewFanPhoto = document.getElementById("previewFanPhoto");
const previewName = document.getElementById("previewName");
const previewID = document.getElementById("previewID");
const previewSex = document.getElementById("previewSex");
const previewType = document.getElementById("previewType");
const previewCountry = document.getElementById("previewCountry");
const previewYear = document.getElementById("previewYear");
const previewFavorite = document.getElementById("previewFavorite");

const previewCelebrityPhoto = document.getElementById("previewCelebrityPhoto");
const previewCelebrityName = document.getElementById("previewCelebrityName");
const previewSignature = document.getElementById("previewSignature");

const barcode = document.getElementById("barcode");
const barcodeID = document.getElementById("barcodeID");

const frontQR = document.getElementById("frontQR");
const backQR = document.getElementById("backQR");

const previewBenefits = document.getElementById("previewBenefits");
const previewTerms = document.getElementById("previewTerms");
const previewValidity = document.getElementById("previewValidity");
const previewContact = document.getElementById("previewContact");

const backCardID = document.getElementById("backCardID");

const previewFrontDisclaimer = document.getElementById("previewFrontDisclaimer");
const previewBackDisclaimer = document.getElementById("previewBackDisclaimer");

const verificationStatus = document.getElementById("verificationStatus");

// ==========================================
// 6. APPLICATION VARIABLES
// ==========================================

let selectedCelebrity = null;
let selectedCelebrityImage = "";
let uploadedFanPhoto = "";

let currentFanID = "";
let currentVerificationURL = "";

let activeCategory = "All";

// ==========================================
// 7. STATUS MESSAGE
// ==========================================

function showStatus(message, type = "success") {

if (!statusMessage) return;

statusMessage.textContent = message;

statusMessage.className = "status-message";

statusMessage.classList.add(type);

}

// ==========================================
// 8. CELEBRITY IMAGE LOADER
// ==========================================

function avatarFallback(name) {

return "https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=172554&color=ffffff&size=300";

}

async function getCelebrityImage(name) {

try {

const response = await fetch(
  `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replaceAll(" ", "_"))}`
);

if (!response.ok) {
  throw new Error("Celebrity image not found.");
}

const data = await response.json();

if (data.thumbnail && data.thumbnail.source) {

  return data.thumbnail.source;

}

} catch (error) {

console.warn("Image loading failed for:", name);

}

return avatarFallback(name);

}

// ==========================================
// 9. DISPLAY CELEBRITIES
// ==========================================

function displayCelebrities(list) {

if (!celebrityGrid) return;

celebrityGrid.innerHTML = "";

if (list.length === 0) {

celebrityGrid.innerHTML = "<p>No celebrities found.</p>";

return;

}

list.forEach((celebrity) => {

const card = document.createElement("button");

card.type = "button";
card.className = "celebrity-card";

card.dataset.name = celebrity.name;

card.innerHTML = `

  <img
    src="${avatarFallback(celebrity.name)}"
    alt="${celebrity.name}"
    loading="lazy"
  >

  <span>${celebrity.name}</span>

  <small>${celebrity.category}</small>

`;

const image = card.querySelector("img");

getCelebrityImage(celebrity.name).then((imageURL) => {

  image.src = imageURL;

  image.onerror = () => {
    image.src = avatarFallback(celebrity.name);
  };

});

card.addEventListener("click", () => {

  selectCelebrity(celebrity, card);

});

celebrityGrid.appendChild(card);

});

}

// ==========================================
// 10. SELECT CELEBRITY
// ==========================================

function selectCelebrity(celebrity, selectedCard) {

selectedCelebrity = celebrity.name;

selectedCelebrityImage = selectedCard.querySelector("img").src;

document.querySelectorAll(".celebrity-card").forEach((card) => {

card.classList.remove("selected");

});

selectedCard.classList.add("selected");

if (previewCelebrity) {
previewCelebrity.textContent = celebrity.name;
}

if (previewCelebrityName) {
previewCelebrityName.textContent = celebrity.name;
}

if (previewCelebrityPhoto) {
previewCelebrityPhoto.src = selectedCelebrityImage;
}

if (previewSignature) {
previewSignature.textContent = celebrity.name;
}

showStatus("${celebrity.name} selected.", "success");

}

// ==========================================
// 11. CELEBRITY SEARCH
// ==========================================

if (celebritySearch) {

celebritySearch.addEventListener("input", () => {

const searchValue = celebritySearch.value.toLowerCase().trim();

const filtered = celebrities.filter((celebrity) => {

  const matchesName = celebrity.name.toLowerCase().includes(searchValue);

  const matchesCategory =
    activeCategory === "All" ||
    celebrity.category === activeCategory;

  return matchesName && matchesCategory;

});

displayCelebrities(filtered);

});

}

// ==========================================
// 12. CELEBRITY CATEGORY FILTER
// ==========================================

document.querySelectorAll("[data-category]").forEach((button) => {

button.addEventListener("click", () => {

activeCategory = button.dataset.category;

document.querySelectorAll("[data-category]").forEach((item) => {

  item.classList.remove("active");

});

button.classList.add("active");

const searchValue = celebritySearch
  ? celebritySearch.value.toLowerCase().trim()
  : "";

const filtered = celebrities.filter((celebrity) => {

  const matchesName = celebrity.name.toLowerCase().includes(searchValue);

  const matchesCategory =
    activeCategory === "All" ||
    celebrity.category === activeCategory;

  return matchesName && matchesCategory;

});

displayCelebrities(filtered);

});

});

// ==========================================
// 13. CARD COLOUR THEMES
// ==========================================

function applyTheme(mainColor, accentColor) {

document.querySelectorAll(".card").forEach((card) => {

card.style.setProperty("--main", mainColor);
card.style.setProperty("--accent", accentColor);

});

}

document.querySelectorAll(".theme-grid button").forEach((button) => {

button.addEventListener("click", () => {

const mainColor = button.dataset.main;
const accentColor = button.dataset.accent;

if (!mainColor || !accentColor) return;

applyTheme(mainColor, accentColor);

document.querySelectorAll(".theme-grid button").forEach((item) => {

  item.classList.remove("active");

});

button.classList.add("active");

});

});

// Custom colour selection

const customColor = document.getElementById("customColor");

if (customColor) {

customColor.addEventListener("input", () => {

const mainColor = customColor.value;

applyTheme(mainColor, "#ffffff");

});

}

// ==========================================
// 14. FAN PHOTO UPLOAD
// ==========================================

if (fanPhotoInput) {

fanPhotoInput.addEventListener("change", (event) => {

const file = event.target.files[0];

if (!file) return;

if (!file.type.startsWith("image/")) {

  showStatus("Please select a valid image.", "error");

  return;

}

const reader = new FileReader();

reader.onload = (e) => {

  uploadedFanPhoto = e.target.result;

  if (previewFanPhoto) {

    previewFanPhoto.src = uploadedFanPhoto;

  }

};

reader.readAsDataURL(file);

});

}

// ==========================================
// 15. GENERATE UNIQUE FAN ID
// ==========================================

function generateFanID() {

const randomPart = crypto.randomUUID()
.replaceAll("-", "")
.substring(0, 10)
.toUpperCase();

return "FAN-${Date.now()}-${randomPart}";

}

// ==========================================
// 16. GENERATE QR CODE
// ==========================================

function createQRCode(element, url) {

if (!element || !window.QRCode) return;

element.innerHTML = "";

new QRCode(element, {

text: url,

width: 110,

height: 110,

colorDark: "#000000",

colorLight: "#ffffff",

correctLevel: QRCode.CorrectLevel.H

});

}

// ==========================================
// 17. GENERATE BARCODE
// ==========================================

function createBarcode(fanID) {

if (!barcode || !window.JsBarcode) return;

try {

JsBarcode(barcode, fanID, {

  format: "CODE128",

  lineColor: "#000000",

  width: 1.5,

  height: 35,

  displayValue: false,

  margin: 2

});

} catch (error) {

console.error("Barcode generation failed:", error);

}

}

// ==========================================
// 18. SAVE FAN CARD TO FIREBASE
// ==========================================

async function saveFanCard(data) {

if (!firebaseReady || !db) {

return false;

}

try {

await setDoc(doc(db, "fanCards", data.fanId), {

  fanId: data.fanId,

  celebrity: data.celebrity,

  fanName: data.fanName,

  sex: data.sex,

  cardType: data.cardType,

  country: data.country,

  favorite: data.favorite,

  memberSince: data.memberSince,

  status: "active",

  verificationURL: data.verificationURL,

  createdAt: serverTimestamp()

});

return true;

} catch (error) {

console.error("Could not save fan card:", error);

return false;

}

}

// ==========================================
// 19. GENERATE MEMBERSHIP CARD
// ==========================================

async function generateCard() {

const fanName = fanNameInput.value.trim();

const sex = sexInput.value;

const cardType = cardTypeInput.value;

const country = countryInput.value.trim();

const favorite = favoriteInput.value.trim();

const benefits = benefitsInput.value.trim();

const terms = termsInput.value.trim();

const validity = validityInput.value.trim();

const contact = contactInput.value.trim();

const disclaimer = disclaimerInput.value.trim();

// Validate required fields

if (!selectedCelebrity) {

showStatus("Please select a celebrity first.", "error");

return;

}

if (!fanName) {

showStatus("Please enter the fan's name.", "error");

fanNameInput.focus();

return;

}

if (!country) {

showStatus("Please enter the country.", "error");

countryInput.focus();

return;

}

if (!window.QRCode || !window.JsBarcode) {

showStatus("Card libraries are still loading. Please try again.", "error");

return;

}

generateButton.disabled = true;

generateButton.textContent = "Generating...";

try {

currentFanID = generateFanID();

const memberYear = new Date().getFullYear();


// Build verification link

const verificationPage = new URL(
  "verify.html",
  window.location.href
);

verificationPage.searchParams.set("id", currentFanID);

currentVerificationURL = verificationPage.href;


// Update front card

previewCelebrity.textContent = selectedCelebrity;

previewName.textContent = fanName;

previewID.textContent = currentFanID;

previewSex.textContent = sex || "Not specified";

previewType.textContent = cardType || "Standard";

previewCountry.textContent = country;

previewYear.textContent = memberYear;

previewFavorite.textContent = favorite || "Not specified";


// Update celebrity section

previewCelebrityName.textContent = selectedCelebrity;

previewCelebrityPhoto.src =
  selectedCelebrityImage || avatarFallback(selectedCelebrity);

previewSignature.textContent = selectedCelebrity;


// Update back card

previewBenefits.textContent =
  benefits || "No benefits have been added.";

previewTerms.textContent =
  terms || "No terms have been added.";

previewValidity.textContent =
  validity || "Not specified";

previewContact.textContent =
  contact || "Not specified";


// Update disclaimers

previewFrontDisclaimer.textContent = disclaimer;

previewBackDisclaimer.textContent = disclaimer;


// Update IDs

barcodeID.textContent = currentFanID;

backCardID.textContent = currentFanID;


// Update fan photo

if (uploadedFanPhoto) {

  previewFanPhoto.src = uploadedFanPhoto;

}


// Generate barcode and QR codes

createBarcode(currentFanID);

createQRCode(frontQR, currentVerificationURL);

createQRCode(backQR, currentVerificationURL);


// Prepare data for Firebase

const fanData = {

  fanId: currentFanID,

  celebrity: selectedCelebrity,

  fanName: fanName,

  sex: sex,

  cardType: cardType,

  country: country,

  favorite: favorite,

  memberSince: memberYear,

  verificationURL: currentVerificationURL

};


// Save to Firebase

const saved = await saveFanCard(fanData);


// Show card preview

frontCard.classList.remove("hidden");

backCard.classList.remove("hidden");


if (verificationStatus) {

  if (saved) {

    verificationStatus.textContent =
      "Card created and saved. Verification record is available.";

  } else {

    verificationStatus.textContent =
      "Preview generated. Firebase is not connected, so this card cannot yet be verified online.";

  }

}


if (saved) {

  showStatus(
    "Fan card generated and saved successfully!",
    "success"
  );

} else {

  showStatus(
    "Card preview generated. Connect Firebase to activate online verification.",
    "success"
  );

}


// Scroll to card preview

frontCard.scrollIntoView({

  behavior: "smooth",

  block: "center"

});

} catch (error) {

console.error("Card generation error:", error);

showStatus(
  "Something went wrong while generating the card.",
  "error"
);

} finally {

generateButton.disabled = false;

generateButton.textContent = "Generate Card";

}

}

// ==========================================
// 20. GENERATE BUTTON
// ==========================================

if (generateButton) {

generateButton.addEventListener("click", generateCard);

}

// ==========================================
// 21. DOWNLOAD CARD AS PNG
// ==========================================

async function downloadCard(cardElement, fileName) {

if (!cardElement) return;

if (!window.html2canvas) {

showStatus("Download library is not ready. Please try again.", "error");

return;

}

try {

showStatus("Preparing your card download...", "success");

const canvas = await html2canvas(cardElement, {

  scale: 3,

  useCORS: true,

  allowTaint: false,

  backgroundColor: null,

  logging: false

});


const link = document.createElement("a");

link.download = fileName;

link.href = canvas.toDataURL("image/png");

link.click();


showStatus("Your card has been downloaded.", "success");

} catch (error) {

console.error("Card download error:", error);

showStatus(
  "Download failed. Try again or check the card images.",
  "error"
);

}

}

// Front card download

const downloadFront = document.getElementById("downloadFront");

if (downloadFront) {

downloadFront.addEventListener("click", () => {

if (!currentFanID) {

  showStatus("Generate a card before downloading.", "error");

  return;

}

downloadCard(frontCard, `${currentFanID}-front.png`);

});

}

// Back card download

const downloadBack = document.getElementById("downloadBack");

if (downloadBack) {

downloadBack.addEventListener("click", () => {

if (!currentFanID) {

  showStatus("Generate a card before downloading.", "error");

  return;

}

downloadCard(backCard, `${currentFanID}-back.png`);

});

}

// ==========================================
// 22. INITIALIZE APPLICATION
// ==========================================

async function initializeAppFeatures() {

// Display all 39 celebrities

displayCelebrities(celebrities);

// Select All category by default

const allButton = document.querySelector(
'[data-category="All"]'
);

if (allButton) {

allButton.classList.add("active");

}

// Load external libraries

await loadLibraries();

// Connect Firebase

await connectFirebase();

console.log("Fan Membership Card Builder is ready.");

}

// Start application

initializeAppFeatures();
