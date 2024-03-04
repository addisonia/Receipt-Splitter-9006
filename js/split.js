

//home button
const home = () => {
  window.location.href = "../index.html";
};

//-------------------------------------------\\

//allows you to swap between buyer, tax, item, and price inputs using arrow keys
document.addEventListener("DOMContentLoaded", () => {
  const itemNameInput = document.getElementById("itemName");
  const itemPriceInput = document.getElementById("itemPrice");
  const buyerNameInput = document.getElementById("buyerName");
  const taxAmountInput = document.getElementById("taxAmount");

  //default input focus to buyer box unless already in item box
  buyerNameInput.focus();

  if (document.activeElement === itemNameInput) {
    itemNameInput.focus();
  }

  //swap function
  const handleArrowKeyNavigation = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (document.activeElement === itemNameInput) {
        itemPriceInput.focus();
      } else if (document.activeElement === buyerNameInput) {
        taxAmountInput.focus();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (document.activeElement === itemPriceInput) {
        itemNameInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        buyerNameInput.focus();
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (document.activeElement === buyerNameInput) {
        itemNameInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        itemPriceInput.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (document.activeElement === itemNameInput) {
        buyerNameInput.focus();
      } else if (document.activeElement === itemPriceInput) {
        taxAmountInput.focus();
      }
    } else if (event.key === "Tab") {
      event.preventDefault();

      if (document.activeElement === buyerNameInput) {
        taxAmountInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        itemNameInput.focus();
      } else if (document.activeElement === itemNameInput) {
        itemPriceInput.focus();
      } else if (document.activeElement === itemPriceInput) {
        buyerNameInput.focus();
      }
    } else if (
      event.key === "Enter" &&
      document.activeElement === itemNameInput
    ) {
      itemPriceInput.focus();
    }
  };

  //call function
  itemNameInput.addEventListener("keydown", handleArrowKeyNavigation);
  itemPriceInput.addEventListener("keydown", handleArrowKeyNavigation);
  buyerNameInput.addEventListener("keydown", handleArrowKeyNavigation);
  taxAmountInput.addEventListener("keydown", handleArrowKeyNavigation);
});


//------------------------------------------------------\\

//Settings Button
document.addEventListener('DOMContentLoaded', () => {
  const settingsButton = document.getElementById('settingsButton');
  const settingsPopup = document.getElementById('settingsPopup');

  settingsButton.addEventListener('click', () => {
    // Toggle the popup display on button click
    settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
  });

  window.addEventListener('click', (event) => {
    if (!settingsPopup.contains(event.target) && !settingsButton.contains(event.target)) {
      settingsPopup.style.display = 'none';
    }
  });

});

function closeSettingsPopup() {
  const settingsPopup = document.getElementById('settingsPopup');
  if (settingsPopup && settingsPopup.style.display === 'block') {
      settingsPopup.style.display = 'none';
  }
}

// Make it globally accessible
window.closeSettingsPopup = closeSettingsPopup;



//Dark Mode
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  darkModeToggle.addEventListener('change', function() {
    if(this.checked) {
      document.body.classList.add('dark-mode');
      document.getElementById('darkModeStylesheet').disabled = false;
    } else {
      document.body.classList.remove('dark-mode');
      document.getElementById('darkModeStylesheet').disabled = true;
    }
    saveState(); // Save the updated state to local storage

  });
});







//------------------------------------------------------\\

//Info storage

document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners inside this DOMContentLoaded callback
  document.getElementById("itemForm").addEventListener("submit", (event) => {
    event.preventDefault();
    submitItem();
  });

  document.getElementById("buyersForm").addEventListener("submit", (event) => {
    event.preventDefault();
    addBuyer();
  });

  updateCostPerBuyerDisplay();

  const taxAmountInput = document.getElementById("taxAmount");

  document.getElementById("taxForm").addEventListener("submit", (event) => {
    event.preventDefault();
    addTax();
  });

  // Update tax whenever the tax input value changes
  taxAmountInput.addEventListener("change", addTax);
});

let items = [];
let buyers = [];

const submitItem = () => {
  const itemName = document.getElementById("itemName").value.trim();
  const itemPrice = parseFloat(document.getElementById("itemPrice").value);

  if (itemName !== "" && !isNaN(itemPrice) && itemPrice > 0) {
    const item = {
      item: itemName,
      price: itemPrice,
      buyers: buyers.map((buyer) => ({ ...buyer })),
    };
    items.push(item);

    updateItemsDisplay();
    document.getElementById("itemForm").reset();
    document.getElementById("itemName").focus();
    updateCostPerBuyerDisplay();

    saveState(); // Save the updated state to local storage
  }
};

const addBuyer = () => {
  const buyerName = document.getElementById("buyerName").value.trim();

  if (buyerName !== "") {
    buyers.push({
      name: buyerName,
      selected: true,
    });
    document.getElementById("buyersForm").reset();
    updateCostPerBuyerDisplay(); // Update cost per buyer display
    saveState(); // Save the updated state to local storage

  }
};

const updateItemsDisplay = () => {
  const displayInfoContainer = document.querySelector("#display-info");
  displayInfoContainer.innerHTML = ""; // Clear previous content

  items.forEach((item, itemIndex) => {
    // Create a container for each item row
    const itemRowDiv = document.createElement("div");
    itemRowDiv.classList.add("item-row");

    // Create and append the item name
    appendItemInfo(itemRowDiv, item.item, "item-name");

    // Create and append the item price
    appendItemInfo(itemRowDiv, `$${item.price.toFixed(2)}`, "item-price");

    // Create and append the buyers
    const buyersDiv = document.createElement("div");
    buyersDiv.classList.add("item-buyers");
    item.buyers.forEach((buyer, buyerIndex) => {
      // Use the appendBuyer function to add each buyer
      appendBuyer(buyersDiv, buyer, itemIndex, buyerIndex);
    });
    itemRowDiv.appendChild(buyersDiv);

    // Append the item row to the display info container
    displayInfoContainer.appendChild(itemRowDiv);
  });
};

const appendItemInfo = (container, text, className) => {
  const infoDiv = document.createElement("div");
  infoDiv.textContent = text;
  infoDiv.classList.add(className);
  container.appendChild(infoDiv);
};

const appendBuyer = (buyersDiv, buyer, itemIndex, buyerIndex) => {
  const buyerContainer = document.createElement("div");
  buyerContainer.classList.add("buyer-container");

  const buyerCheckbox = document.createElement("input");
  buyerCheckbox.type = "checkbox";
  buyerCheckbox.id = `buyer-${buyerIndex}-item-${itemIndex}`;
  buyerCheckbox.checked = buyer.selected;
  buyerCheckbox.onchange = () => toggleBuyerSelection(itemIndex, buyerIndex);

  const buyerLabel = document.createElement("label");
  buyerLabel.htmlFor = buyerCheckbox.id;
  buyerLabel.textContent = buyer.name;
  buyerLabel.classList.add("buyer-label");

  buyerContainer.appendChild(buyerCheckbox);
  buyerContainer.appendChild(buyerLabel);
  buyersDiv.appendChild(buyerContainer);
};

//addTax button functionality
let tax = 0;

const addTax = () => {
  const taxAmountInput = document.getElementById("taxAmount");
  let taxAmount = parseFloat(taxAmountInput.value);

  // If tax input is not a number (which includes empty string), default tax to 0
  tax = !isNaN(taxAmount) ? taxAmount : 0;

  updateCostPerBuyerDisplay();
  const itemNameInput = document.getElementById("itemName");
  itemNameInput.focus();
  saveState(); // Save the updated state to local storage

};

document.addEventListener('DOMContentLoaded', () => {
  const splitTaxToggle = document.getElementById('splitTaxToggle');

  splitTaxToggle.addEventListener('change', function() {
    calculateAndDisplayCosts(); // Call a function to recalculate and display costs
  });
});


//cost per buyer
const calculateBuyerOwes = () => {
  const splitEvenly = document.getElementById('splitTaxToggle').checked;
  // Initialize buyer totals with zero values
  const buyerTotals = buyers.map(() => 0);
  let totalCostWithoutTax = 0;

  // Calculate the total cost per item and accumulate total cost without tax
  items.forEach((item) => {
    const itemTotalBuyers = item.buyers.filter((buyer) => buyer.selected).length;
    if (itemTotalBuyers === 0) return;

    const itemCostPerBuyer = item.price / itemTotalBuyers;
    item.buyers.forEach((buyer, index) => {
      if (buyer.selected) {
        buyerTotals[index] += itemCostPerBuyer;
        totalCostWithoutTax += itemCostPerBuyer;
      }
    });
  });

  if (splitEvenly) {
    const taxPerBuyer = tax / buyers.length;
    buyerTotals.forEach((_, index) => buyerTotals[index] += taxPerBuyer);
  }
  // If no items, split tax evenly among all buyers
  else if (items.length === 0 && buyers.length > 0) {
    const taxPerBuyer = tax / buyers.length;
    buyerTotals.forEach((_, index) => buyerTotals[index] += taxPerBuyer);
  } else if (totalCostWithoutTax > 0) { // Only divide tax if there are items
    // Calculate the proportional tax for each buyer
    buyers.forEach((buyer, index) => {
      if (buyerTotals[index] === 0) return; // Skip buyers who didn't buy anything
      const buyerProportionalCost = buyerTotals[index] / totalCostWithoutTax;
      const taxContribution = buyerProportionalCost * tax;
      buyerTotals[index] += taxContribution; // Add the tax contribution to the buyer's total
    });
  }

  return buyerTotals;
};




const updateCostPerBuyerDisplay = () => {
  // Call the calculate function to get the latest totals
  const buyerTotals = calculateBuyerOwes();
  const costPerBuyerList = document.getElementById("cost-per-buyer-list");
  costPerBuyerList.innerHTML = ""; // Clear previous content

  // Make sure buyers array is not empty
  if (buyers.length > 0) {
    buyers.forEach((buyer, index) => {
      const buyerCostDiv = document.createElement("div");
      buyerCostDiv.textContent = `${buyer.name}: $${buyerTotals[index].toFixed(
        2
      )}`;
      costPerBuyerList.appendChild(buyerCostDiv);
    });
  } else {
    // Display a default value or message if no buyers are present
    costPerBuyerList.textContent = "No buyers added.";
  }

  if (buyers.length === 0) {
    document.getElementById("buyerName").placeholder = "Enter a buyer";
  }

};

function calculateAndDisplayCosts() {
  updateCostPerBuyerDisplay();
  saveState();
}

const toggleBuyerSelection = (itemIndex, buyerIndex) => {
  // Toggle the 'selected' state of the buyer for this item
  items[itemIndex].buyers[buyerIndex].selected =
    !items[itemIndex].buyers[buyerIndex].selected;

  updateItemsDisplay(); // Re-render the items display
  updateCostPerBuyerDisplay(); // Update the cost per buyer display
  saveState(); // Save the updated state to local storage

};



//---------------------------------------------------\\

//Save receipt data locally for guests


function saveReceiptDataLocally(receiptData) {
  localStorage.setItem("receiptData", JSON.stringify(receiptData));
}

function getLocalReceiptData() {
  const data = localStorage.getItem("receiptData");
  return data ? JSON.parse(data) : null;
}

function saveState() {
  const receiptData = {
    items: items,
    buyers: buyers,
    tax: tax,
    darkMode: document.body.classList.contains('dark-mode'),
    splitTaxEvenly: document.getElementById('splitTaxToggle').checked // Save the toggle state
  };
  saveReceiptDataLocally(receiptData);
}


document.addEventListener('DOMContentLoaded', () => {
  // Load local data if it exists
  const savedData = getLocalReceiptData();
  if (savedData) {
    items = savedData.items || [];
    buyers = savedData.buyers || [];
    tax = savedData.tax || 0; // Restore saved tax amount
    document.getElementById('taxAmount').value = tax; // Set the input box to show the saved tax amount

    updateItemsDisplay();
    updateCostPerBuyerDisplay();

    if (savedData.darkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('darkModeStylesheet').disabled = false;
      document.getElementById('darkModeToggle').checked = true;
    }

    if (savedData.splitTaxEvenly !== undefined) {
      const splitTaxToggle = document.getElementById('splitTaxToggle');
      splitTaxToggle.checked = savedData.splitTaxEvenly;
      calculateAndDisplayCosts(); // Recalculate costs based on the restored setting
    }
  }
});





// Clear Data Button

document.getElementById("clearDataButton").addEventListener("click", clearData);

function clearData() {
  // Clear local storage
  localStorage.removeItem("receiptData");

  // Also reset your application state
  items = [];
  buyers = [];
  updateItemsDisplay();
  updateCostPerBuyerDisplay();

  // Clear input fields
  document.getElementById("buyerName").value = '';
  document.getElementById("taxAmount").value = '';
  document.getElementById("itemName").value = '';
  document.getElementById("itemPrice").value = '';
}











