//Example of how to add firebase database to your project! :

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-652c2-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Rest of the code

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "groceries");

// To check if it is communicating with Firebase database - console log app varaible - console.log(app) and  console.log(database);
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  push(shoppingListInDB, inputValue);
  clearInputField();

  console.log(`${inputValue} added to database`);
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingList.innerHTML = "No items here... yet";
  }
}); // using snapshot.exists() method to avoid errors once one item is left to be deleted in database. (FIREBASE)

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

// Clears out the input field after clicking "Add button" - we will call this function in the eventListener function above!
function clearInputField() {
  inputFieldEl.value = "";
}

// It appends inserted value to shopping list - we will call this function in the eventListener function above!
function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");

  newEl.addEventListener("click", function () {
    console.log(itemID);
    let exactLocationOfItemInDB = ref(database, `groceries/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  newEl.textContent = itemValue;
  shoppingList.append(newEl);
}
