

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
      } else if (document.activeElement === taxAmountInput) {
        itemNameInput.focus();
      } else if (document.activeElement === itemPriceInput) {
        itemNameInput.focus();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (document.activeElement === itemPriceInput) {
        itemNameInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        buyerNameInput.focus();
      } else if (document.activeElement === buyerNameInput) {
        receiptNameInput.focus();
      } else if (document.activeElement === itemNameInput) {
        taxAmountInput.focus();
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (document.activeElement === buyerNameInput) {
        taxAmountInput.focus();
      } else if (document.activeElement === taxAmountInput) {
        itemNameInput.focus();
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
      document.activeElement === taxAmountInput
    ) {
      itemNameInput.focus();
    } else if (
      event.key === "Enter" &&
      document.activeElement === itemNameInput &&
      itemNameInput.value.trim() !== ""
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
    if (this.checked) {
      document.body.classList.add('dark-mode');
      document.getElementById('darkModeStylesheet').disabled = false;
      localStorage.setItem('darkModeState', 'true'); // Save state to local storage
    } else {
      document.body.classList.remove('dark-mode');
      document.getElementById('darkModeStylesheet').disabled = true;
      localStorage.setItem('darkModeState', 'false'); // Save state to local storage
    }
    saveState();
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
  updateTotalCostDisplay();

  document.getElementById("taxForm").addEventListener("submit", (event) => {
    event.preventDefault();
    addTax();
  });

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
          item: itemName + quantityText,
          price: itemPrice,
          quantity: 1, // Set default quantity to 1
          buyers: buyers.map(buyer => ({ ...buyer, selected: [true] })), // Initialize selected array with true for quantity 1
        };
        items.push(item);

        updateItemsDisplay();
        document.getElementById("itemForm").reset();
        itemNameInput.focus(); // Focus back to the item name input
        updateCostPerBuyerDisplay();
        updateTotalCostDisplay();
        saveState(); // Assuming there's a function to save the state
      } 
      // If the evaluation or input is invalid, the function simply exits without action
  } catch (error) {
      // Log error for debugging purposes; in production, this could be removed or handled differently
      console.error("Error evaluating expression: ", error);
  }
};



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
    let newBuyerName = buyerName;
    let duplicateCount = 1;

    while (buyers.some(buyer => buyer.name === newBuyerName)) {
      duplicateCount++;
      newBuyerName = `${buyerName} (${duplicateCount})`;
    }

    const newBuyer = {
      name: newBuyerName,
      selected: [],
    };
    buyers.push(newBuyer);
    
    // Update existing items to include the new buyer
    items = items.map(item => {
      return {
        ...item,
        buyers: [...item.buyers, { ...newBuyer, selected: Array(item.quantity).fill(true) }], // Initialize selected array based on item quantity
      };
    });

    document.getElementById("buyersForm").reset();
    updateItemsDisplay(); // Update items to include the new buyer
    updateCostPerBuyerDisplay(); // Recalculate and display costs
    updateTotalCostDisplay();
    saveState(); // Optionally save the updated state
  }
};


const updateItemsDisplay = () => {
  const displayInfoContainer = document.querySelector("#display-info");
  const displayTitlesContainer = document.querySelector("#display-titles");
  const totalCostDisplay = document.querySelector("#total-cost-display");
  displayInfoContainer.innerHTML = ""; // Clear previous content

  if (items.length === 0) {
    displayInfoContainer.style.display = "none";
    displayTitlesContainer.style.display = "none";
    totalCostDisplay.classList.remove("grid-visible");
  } else {
    displayInfoContainer.style.display = "grid";
    displayTitlesContainer.style.display = "grid";
    totalCostDisplay.classList.add("grid-visible");

    items.forEach((item, itemIndex) => {
      // Create a container for each item row
      const itemRowDiv = document.createElement("div");
      itemRowDiv.classList.add("item-row");

    // Create a container for the item name and delete icon
    const itemNameContainer = document.createElement("div");
    itemNameContainer.classList.add("item-name-container");

    // Create and append the delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash", "delete-icon");
    deleteIcon.addEventListener("click", () => deleteItem(itemIndex));
    itemNameContainer.appendChild(deleteIcon);

    // Create and append the item name
    const itemNameDiv = document.createElement("div");
    itemNameDiv.textContent = item.item;
    itemNameDiv.classList.add("item-name");
    itemNameContainer.appendChild(itemNameDiv);

    itemRowDiv.appendChild(itemNameContainer);

      // Create and append the item price
      appendItemInfo(itemRowDiv, `$${item.price.toFixed(2)}`, "item-price");

      // Create and append the quantity
      const quantityDiv = document.createElement("div");
      quantityDiv.classList.add("item-quantity");
      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.min = "1";
      quantityInput.value = item.quantity;
      quantityInput.addEventListener("change", (event) => {
        const newQuantity = parseInt(event.target.value);
        if (newQuantity !== item.quantity) {
          const prevQuantity = item.quantity;
          item.quantity = newQuantity;
          item.buyers = item.buyers.map(buyer => ({
            ...buyer,
            selected: newQuantity === 1 && prevQuantity !== 1 ? [true] : buyer.selected.slice(0, newQuantity),
          }));
          updateItemsDisplay();
          updateCostPerBuyerDisplay();
          updateTotalCostDisplay();
          saveState();
        }
      });
      quantityDiv.appendChild(quantityInput);
      itemRowDiv.appendChild(quantityDiv);

      // Create and append the buyers
      const buyersDiv = document.createElement("div");
      buyersDiv.classList.add("item-buyers");
      for (let i = 0; i < item.quantity; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("buyer-row");
        item.buyers.forEach((buyer, buyerIndex) => {
          appendBuyer(rowDiv, buyer, itemIndex, buyerIndex, i);
        });
        buyersDiv.appendChild(rowDiv);

        // Add a small gap between buyer rows, except for the last row
        if (i < item.quantity - 1) {
          const gapDiv = document.createElement("div");
          gapDiv.classList.add("buyer-row-gap");
          buyersDiv.appendChild(gapDiv);
        }
      }
      itemRowDiv.appendChild(buyersDiv);

      // Append the item row to the display info container
      displayInfoContainer.appendChild(itemRowDiv);
    });
  }
};

const deleteItem = (itemIndex) => {
  items.splice(itemIndex, 1);
  updateItemsDisplay();
  updateCostPerBuyerDisplay();
  updateTotalCostDisplay();
  saveState();
};


const appendItemInfo = (container, text, className) => {
  const infoDiv = document.createElement("div");
  infoDiv.textContent = text;
  infoDiv.classList.add(className);
  container.appendChild(infoDiv);
};

const appendBuyer = (buyersDiv, buyer, itemIndex, buyerIndex, quantityIndex) => {
  const buyerContainer = document.createElement("div");
  buyerContainer.classList.add("buyer-container");

  const buyerCheckbox = document.createElement("input");
  buyerCheckbox.type = "checkbox";
  buyerCheckbox.id = `buyer-${buyerIndex}-item-${itemIndex}-qty-${quantityIndex}`;
  buyerCheckbox.checked = buyer.selected[quantityIndex];
  buyerCheckbox.onchange = () => toggleBuyerSelection(itemIndex, buyerIndex, quantityIndex);

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


  // Update the display of the tax amount
  console.log("Tax before update: ", tax);
  updateTaxAmountDisplay();
  console.log("Tax after update: ", tax);
  updateCostPerBuyerDisplay();
  updateTotalCostDisplay();

  // Clear the input field after submission
  taxAmountInput.value = '';
  const itemNameInput = document.getElementById("itemName");
  itemNameInput.focus();

  saveState(); // Save the updated state to local storage

};


// function to update the tax amount display
const updateTaxAmountDisplay = () => {
  const taxAmountDisplay = document.getElementById("tax-amount-display");
  taxAmountDisplay.innerHTML = `<strong>Tax Amount:</strong> $${tax.toFixed(2)}`;
};

// Listen for the Enter key within the taxAmount input.
document.getElementById("taxAmount").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    addTax();
    document.getElementById("itemName").focus(); // Explicitly set focus to itemNameInput
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const splitTaxToggle = document.getElementById('splitTaxToggle');

  splitTaxToggle.addEventListener('change', function() {
    calculateAndDisplayCosts(); // Call a function to recalculate and display costs
  });

});


//cost per buyer
const calculateBuyerOwes = () => {
  const splitEvenly = document.getElementById('splitTaxToggle').checked;
  const buyerTotals = buyers.map(() => 0);
  let totalCostWithoutTax = 0;

  items.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      const selectedBuyers = item.buyers.filter((buyer) => buyer.selected[i]);
      const itemTotalBuyers = selectedBuyers.length;
      if (itemTotalBuyers === 0) continue;

      const itemCostPerBuyer = item.price / itemTotalBuyers;
      selectedBuyers.forEach((buyer) => {
        const buyerIndex = buyers.findIndex((b) => b.name === buyer.name);
        buyerTotals[buyerIndex] += itemCostPerBuyer;
        totalCostWithoutTax += itemCostPerBuyer;
      });
    }
  });

  if (items.length === 0 && tax > 0) {
    const taxPerBuyer = tax / buyers.length;
    buyerTotals.forEach((_, index) => buyerTotals[index] += taxPerBuyer);
  } else if (splitEvenly) {
    const taxPerBuyer = tax / buyers.length;
    buyerTotals.forEach((_, index) => buyerTotals[index] += taxPerBuyer);
  } else if (totalCostWithoutTax > 0) {
    buyers.forEach((buyer, index) => {
      if (buyerTotals[index] === 0) return;
      const buyerProportionalCost = buyerTotals[index] / totalCostWithoutTax;
      const taxContribution = buyerProportionalCost * tax;
      buyerTotals[index] += taxContribution;
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


const toggleBuyerSelection = (itemIndex, buyerIndex, quantityIndex) => {
  items[itemIndex].buyers[buyerIndex].selected[quantityIndex] = !items[itemIndex].buyers[buyerIndex].selected[quantityIndex];
  updateItemsDisplay();
  updateCostPerBuyerDisplay();
  updateTotalCostDisplay();
  saveState();
};

function calculateTotalCost() {
  let totalCost = 0;
  items.forEach(item => {
    totalCost += item.price * item.quantity;
  });
  return totalCost + tax;
}

function updateTotalCostDisplay() {
  const totalCostDisplay = document.getElementById("total-cost-display");
  totalCostDisplay.innerHTML = `<strong>Total Cost:</strong> $${calculateTotalCost().toFixed(2)}`;
}



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
    updateTaxAmountDisplay();
    updateTotalCostDisplay();

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
  tax = 0;
  updateItemsDisplay();
  updateCostPerBuyerDisplay();
  updateTaxAmountDisplay();
  updateTotalCostDisplay();

  // Clear input fields
  document.getElementById("receiptName").value = '';
  document.getElementById("buyerName").value = '';
  document.getElementById("taxAmount").value = '';
  document.getElementById("itemName").value = '';
  document.getElementById("itemPrice").value = '';
}







//-----------------------------------------------\\


// Dynamic screen size adjuster for item/price inputs 

function adjustLabelMargin() {
  // Only run this adjustment for screens 750px and wider
  if (window.innerWidth >= 750) {
      // Define the screen widths and corresponding margin-left values
      const minWidth = 750;
      const maxWidth = 3000; // Extended to 3000px
      const minMargin = 22; // Percentage for 750px width
      // Adjust maxMargin as needed for 3000px width
      // This example linearly extrapolates the margin increase, but you may adjust it as needed
      const maxMargin = 22 + ((36 - 22) / (1500 - 750)) * (3000 - 750);

      // Calculate the current screen width's relative position between minWidth and maxWidth
      const screenPosition = Math.min((window.innerWidth - minWidth) / (maxWidth - minWidth), 1); // Ensure it doesn't exceed 1

      // Interpolate the margin-left value for the current screen width
      const currentMargin = minMargin + (maxMargin - minMargin) * screenPosition;

      // Apply the calculated margin-left to the labels
      document.querySelectorAll('.item-name-container label, .item-price-container label').forEach(label => {
          label.style.marginLeft = `${currentMargin}%`;
      });
  } else {
      // For screens smaller than 750px, reset to default if needed
      document.querySelectorAll('.item-name-container label, .item-price-container label').forEach(label => {
          label.style.marginLeft = ''; // Resets to the CSS file value
      });
  }
}

// Call the function on initial load
adjustLabelMargin();

// Add event listener to adjust the margins when the window is resized
window.addEventListener('resize', adjustLabelMargin);






