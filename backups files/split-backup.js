//home button
const home = () => {
    window.location.href = 'index.html'
}

//-------------------------------------------\\


//allows you to swap between buyer, tax, item, and price inputs using arrow keys
document.addEventListener('DOMContentLoaded', () => {
    const itemNameInput = document.getElementById("itemName")
    const itemPriceInput = document.getElementById("itemPrice")
    const buyerNameInput = document.getElementById('buyerName')
    const taxAmountInput = document.getElementById('taxAmount')

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
        }

    };

    //call function
    itemNameInput.addEventListener('keydown', handleArrowKeyNavigation);
    itemPriceInput.addEventListener('keydown', handleArrowKeyNavigation);
    buyerNameInput.addEventListener('keydown', handleArrowKeyNavigation);
    taxAmountInput.addEventListener('keydown', handleArrowKeyNavigation);
});


//------------------------------------------------------\\

//Info storage


document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners inside this DOMContentLoaded callback
    document.getElementById('itemForm').addEventListener('submit', (event) => {
        event.preventDefault();
        submitItem();
    });

    document.getElementById('buyersForm').addEventListener('submit', (event) => {
        event.preventDefault();
        addBuyer();
    });

    updateCostPerBuyerDisplay();

    const taxAmountInput = document.getElementById('taxAmount');

    document.getElementById('taxForm').addEventListener('submit', (event) => {
        event.preventDefault();
        addTax();
    });

    // Update tax whenever the tax input value changes
    taxAmountInput.addEventListener('change', addTax);
});


let items = [];
let buyers = [];


const submitItem = () => {
    const itemName = document.getElementById('itemName').value.trim();
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);

    if (itemName !== "" && !isNaN(itemPrice) && itemPrice > 0) {
        const item = { 
            item: itemName, 
            price: itemPrice, 
            buyers: buyers.map(buyer => ({...buyer})) 
        };
        items.push(item);

        updateItemsDisplay();
        document.getElementById('itemForm').reset();
        document.getElementById('itemName').focus();
        updateCostPerBuyerDisplay();
    }
};





const addBuyer = () => {
    const buyerName = document.getElementById('buyerName').value.trim();

    if (buyerName !== "") {
        buyers.push({ 
            name: buyerName, selected: true 
        });
        document.getElementById('buyersForm').reset();
        updateCostPerBuyerDisplay(); // Update cost per buyer display
    }
};

const updateItemsDisplay = () => {
    const displayInfoContainer = document.querySelector('#display-info');
    displayInfoContainer.innerHTML = ''; // Clear previous content

    items.forEach((item, itemIndex) => {
        // Create a container for each item row
        const itemRowDiv = document.createElement('div');
        itemRowDiv.classList.add('item-row');

        // Create and append the item name
        appendItemInfo(itemRowDiv, item.item, 'item-name');
        
        // Create and append the item price
        appendItemInfo(itemRowDiv, `$${item.price.toFixed(2)}`, 'item-price');

        // Create and append the buyers
        const buyersDiv = document.createElement('div');
        buyersDiv.classList.add('item-buyers');
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
    const infoDiv = document.createElement('div');
    infoDiv.textContent = text;
    infoDiv.classList.add(className);
    container.appendChild(infoDiv);
};

const appendBuyer = (buyersDiv, buyer, itemIndex, buyerIndex) => {
    const buyerContainer = document.createElement('div');
    buyerContainer.classList.add('buyer-container');

    const buyerCheckbox = document.createElement('input');
    buyerCheckbox.type = 'checkbox';
    buyerCheckbox.id = `buyer-${buyerIndex}-item-${itemIndex}`;
    buyerCheckbox.checked = buyer.selected;
    buyerCheckbox.onchange = () => toggleBuyerSelection(itemIndex, buyerIndex);

    const buyerLabel = document.createElement('label');
    buyerLabel.htmlFor = buyerCheckbox.id;
    buyerLabel.textContent = buyer.name;
    buyerLabel.classList.add('buyer-label');

    buyerContainer.appendChild(buyerCheckbox);
    buyerContainer.appendChild(buyerLabel);
    buyersDiv.appendChild(buyerContainer);
};



//addTax button functionality
let tax;

const addTax = () => {
    const taxAmountInput = document.getElementById('taxAmount');
    let taxAmount = parseFloat(taxAmountInput.value);

    if (!isNaN(taxAmount)) {
        tax = taxAmount; // Set the tax
        updateCostPerBuyerDisplay(); 

        const itemNameInput = document.getElementById("itemName");
        itemNameInput.focus();
    }
};

document.getElementById('taxForm').addEventListener('submit', (event) => {
    event.preventDefault();
    addTax();
})



//cost per buyer
const calculateBuyerOwes = () => {
    // Initialize buyer totals with zero values
    const buyerTotals = buyers.map(() => 0);
    let totalCostWithoutTax = 0;

    // Calculate the total cost per item and accumulate total cost without tax
    items.forEach(item => {
        const itemTotalBuyers = item.buyers.filter(buyer => buyer.selected).length;
        if(itemTotalBuyers === 0) return;

        const itemCostPerBuyer = item.price / itemTotalBuyers;

        item.buyers.forEach((buyer, index) => {
            if (buyer.selected) {
                buyerTotals[index] += itemCostPerBuyer;
                totalCostWithoutTax += itemCostPerBuyer;
            }
        });
    });

    // Calculate the proportional tax for each buyer
    buyers.forEach((buyer, index) => {
        if (buyerTotals[index] === 0) return; // Skip buyers who didn't buy anything
        const buyerProportionalCost = buyerTotals[index] / totalCostWithoutTax;
        const taxContribution = buyerProportionalCost * tax;
        buyerTotals[index] += taxContribution; // Add the tax contribution to the buyer's total
    });

    return buyerTotals;
};



const updateCostPerBuyerDisplay = () => {
    // Call the calculate function to get the latest totals
    const buyerTotals = calculateBuyerOwes();
    const costPerBuyerList = document.getElementById('cost-per-buyer-list');
    costPerBuyerList.innerHTML = ''; // Clear previous content

    // Make sure buyers array is not empty
    if (buyers.length > 0) {
        buyers.forEach((buyer, index) => {
            const buyerCostDiv = document.createElement('div');
            buyerCostDiv.textContent = `${buyer.name}: $${buyerTotals[index].toFixed(2)}`;
            costPerBuyerList.appendChild(buyerCostDiv);
        });
    } else {
        // Display a default value or message if no buyers are present
        costPerBuyerList.textContent = "No buyers added.";
    }
};


const toggleBuyerSelection = (itemIndex, buyerIndex) => {
    // Toggle the 'selected' state of the buyer for this item
    items[itemIndex].buyers[buyerIndex].selected = !items[itemIndex].buyers[buyerIndex].selected;

    updateItemsDisplay(); // Re-render the items display
    updateCostPerBuyerDisplay(); // Update the cost per buyer display
}


//---------------------------------------------------\\















