

//home button
const home = () => {
  window.location.href = "../index.html";
};

//-------------------------------------------\\

//allows you to swap between buyer, tax, item, and price inputs using arrow keys
document.addEventListener("DOMContentLoaded", () => {
  const receiptNameInput = document.getElementById("receiptName");
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
      } else if (document.activeElement === receiptNameInput) {
        buyerNameInput.focus();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (document.activeElement === itemPriceInput) {
        itemNameInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        buyerNameInput.focus();
      } else if (document.activeElement === buyerNameInput) {
        receiptNameInput.focus();
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (document.activeElement === buyerNameInput) {
        itemNameInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        itemPriceInput.focus();
      } else if (document.activeElement === itemNameInput) {
        itemPriceInput.focus();
      } else if (document.activeElement === receiptNameInput) {
        buyerNameInput.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (document.activeElement === itemNameInput) {
        buyerNameInput.focus();
      } else if (document.activeElement === itemPriceInput) {
        taxAmountInput.focus();
      } else if (document.activeElement === buyerNameInput) {
        receiptNameInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        buyerNameInput.focus();
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
  receiptNameInput.addEventListener("keydown", handleArrowKeyNavigation);
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
  document.getElementById("receiptNameForm").addEventListener("submit", (event) => {
    event.preventDefault();
    addReceiptName();
  });

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

let receiptName = "";
let items = [];
let buyers = [];





function evaluatePriceInput() {
  const itemPriceInput = document.getElementById("itemPrice");
  let itemPriceValue = itemPriceInput.value.trim();

  try {
      let evaluatedValue = eval(itemPriceValue);
      if (!isNaN(evaluatedValue)) {
          itemPriceInput.value = evaluatedValue; // Update with evaluated result
          return true; // Evaluation successful
      }
  } catch (error) {
      itemPriceInput.value = ""; // Clear input
      itemPriceInput.focus();
      return false; // Evaluation failed
  }
}



document.getElementById("itemForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Move the evaluatePriceInput call here if needed, or ensure its logic is properly integrated
  if (evaluatePriceInput()) { // Ensure this returns true only if the price is valid
      submitItem(); // Proceed with adding the item only if the price is valid
  }
});



const submitItem = () => {
  const itemNameInput = document.getElementById("itemName");
  const itemPriceInput = document.getElementById("itemPrice");
  let itemName = itemNameInput.value.trim();
  let itemPriceExpression = itemPriceInput.value;
  let quantityText = ""; // To hold the quantity text, if applicable

  // Updated check to allow decimals before '*'
  if ((itemPriceExpression.match(/\*/g) || []).length === 1 && /^[\d.]+[*][\d.]+$/.test(itemPriceExpression)) {
      const multiplicationParts = itemPriceExpression.split('*');
      if (multiplicationParts.length === 2 && multiplicationParts[1].trim() !== "") {
          // Ensure the part after '*' is purely numerical without any decimal to apply quantity text
          if (/^\d+$/.test(multiplicationParts[1].trim())) {
              quantityText = ` (x${multiplicationParts[1].trim()})`;
          }
      }
  }

  try {
      let itemPrice = eval(itemPriceExpression);

      if (itemName !== "" && !isNaN(itemPrice) && itemPrice > 0) {
          const item = {
              item: itemName + quantityText, // Append the quantity text to the item name, if applicable
              price: itemPrice,
              buyers: buyers.map(buyer => ({ ...buyer })),
          };
          items.push(item);

          updateItemsDisplay();
          document.getElementById("itemForm").reset();
          itemNameInput.focus(); // Focus back to the item name input
          updateCostPerBuyerDisplay();
          saveState(); // Assuming there's a function to save the state
      } 
      // If the evaluation or input is invalid, the function simply exits without action
  } catch (error) {
      // Log error for debugging purposes; in production, this could be removed or handled differently
      console.error("Error evaluating expression: ", error);
  }
};




// Function to validate the expression
function isValidExpression(expression) {
  return /^[\d+\-*/. ()]+$/.test(expression);
}


// Upon submission, save the actual value or an empty string if nothing is entered
const addReceiptName = () => {
  const inputReceiptName = document.getElementById('receiptName').value.trim();
  // Save the input value or an empty string if nothing is entered
  receiptName = inputReceiptName || "placeholder";
  // Save to local storage and only default to "placeholder" when saving if nothing is entered
  localStorage.setItem('receiptName', receiptName);

  saveState(); // Make sure to save the updated state
}

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
    receiptName: receiptName,
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
  // Set receipt name from local storage if it exists
  const savedReceiptName = localStorage.getItem('receiptName');
  if (savedReceiptName) {
    document.getElementById('receiptName').value = savedReceiptName;
  } else {
    // If there's no savedReceiptName or it's an empty string, set it to "placeholder"
    document.getElementById('receiptName').value = "placeholder";
  }
  

  const savedData = getLocalReceiptData();
  if (savedData) {
    receiptName = savedData.receiptName || "";
    items = savedData.items || [];
    buyers = savedData.buyers || [];
    tax = savedData.tax || 0; // Restore saved tax amount
    document.getElementById('receiptName').value = receiptName;
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
  receiptName = "";
  items = [];
  buyers = [];
  updateItemsDisplay();
  updateCostPerBuyerDisplay();

  // Clear input fields
  document.getElementById("receiptName").value = '';
  document.getElementById("buyerName").value = '';
  document.getElementById("taxAmount").value = '';
  document.getElementById("itemName").value = '';
  document.getElementById("itemPrice").value = '';
}











