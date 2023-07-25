// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Configure Firebase app settings (currently empty, but should contain databaseURL)
const appSettings = {
    // databaseURL: "Database URL from Firebase goes here"
};

// Initialize the Firebase app with the provided settings
const app = initializeApp(appSettings);

// Get a reference to the Firebase database instance
const database = getDatabase(app);

// Get a reference to the "shoppingList" location in the database
const shoppingListInDB = ref(database, "shoppingList");

// Get references to HTML elements in the DOM
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

// Add a click event listener to the "Add" button
addButtonEl.addEventListener("click", function() {
    // Retrieve the value from the input field
    let inputValue = inputFieldEl.value;
    
    // Push the input value to the "shoppingList" location in the database
    push(shoppingListInDB, inputValue);
    
    // Clear the input field after adding the item
    clearInputFieldEl();
});

// Add a listener to the "shoppingList" location in the database
onValue(shoppingListInDB, function(snapshot) {
    // Check if the database location has any data (items)
    if (snapshot.exists()) {
        // Convert the object of items to an array of [key, value] pairs
        let itemsArray = Object.entries(snapshot.val());
    
        // Clear the shopping list element before updating it
        clearShoppingListEl();
        
        // Iterate through the items and append each one to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            
            appendItemToShoppingListEl(currentItem);
        }    
    } else {
        // If no items in the database, show a message in the shopping list element
        shoppingListEl.innerHTML = "No items here... yet";
    }
});

// Function to clear the content of the shopping list element
function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

// Function to clear the content of the input field
function clearInputFieldEl() {
    inputFieldEl.value = "";
}

// Function to append a new item to the shopping list element
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    // Create a new list item element
    let newEl = document.createElement("li");
    
    // Set the text content of the new element to the item value
    newEl.textContent = itemValue;
    
    // Add a click event listener to the new element to handle item removal
    newEl.addEventListener("click", function() {
        // Get the exact location of the item in the database
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        
        // Remove the item from the database
        remove(exactLocationOfItemInDB);
    });
    
    // Append the new element to the shopping list element in the DOM
    shoppingListEl.append(newEl);
}

// The code sets up a basic shopping list app that uses Firebase Realtime Database to store and manage the list items. When the "Add" button is clicked, the entered item is added to the database, and the shopping list on the webpage is updated in real-time. Clicking on an item in the list will remove it from both the database and the UI.

// Remember that for this code to work, you need to have a Firebase project set up and configure the appSettings object with the appropriate databaseURL. Additionally, the HTML structure should include the required elements with their corresponding IDs, such as the input field with ID "input-field," the "Add" button with ID "add-button," and the shopping list container with ID "shopping-list."