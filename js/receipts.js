//buttons
const home = () => {
    window.location.href = "../index.html";
  };
  

const splitPage = () => {
    window.location.href = "../html/split.html";
};
  



// Display

// Assuming Firebase SDKs are already loaded in the page, we can use firebase directly.
document.addEventListener('DOMContentLoaded', async () => {
    // Ensure the Firebase services are initialized before using them
    if (window.auth && window.database) {
        const user = window.auth.currentUser;
        if (user) {
            const userReceiptsRef = window.database.ref(`receipts/${user.uid}`);
            const snapshot = await window.database.get(userReceiptsRef);
            if (snapshot.exists()) {
                const receipts = snapshot.val();
                displayReceipts(receipts);
            } else {
                document.getElementById('receiptsContainer').innerHTML = '<p>No receipts found.</p>';
            }
        } else {
            console.log("No user is signed in.");
        }
    }


    //make sure user is signed in
    const auth = window.auth; 
    
    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, now fetch receipts
        fetchAndDisplayReceipts(user);
        console.log("User is signed in")
      } else {
        // No user is signed in, handle accordingly
        console.log("No user is signed in.");
        // Optionally redirect back to login or display a message
      }
    });
});


async function fetchAndDisplayReceipts(user) {
    // Ensure you use the correct methods to create a reference and then get data
    const userReceiptsRef = window.firebaseDatabase.ref(window.database, `receipts/${user.uid}`);
    try {
        const snapshot = await window.firebaseDatabase.get(userReceiptsRef);
        if (snapshot.exists()) {
            const receipts = snapshot.val();
            displayReceipts(receipts);
        } else {
            document.getElementById('receiptsContainer').innerHTML = '<p>No receipts found.</p>';
        }
    } catch (error) {
        console.error("Failed to fetch receipts:", error);
    }
}



function displayReceipts(receipts) {
  const container = document.getElementById('receiptsContainer');
  container.innerHTML = ''; // Clear existing content

  const sortedReceipts = Object.entries(receipts).sort((a, b) => {
    return new Date(b[1].time_and_date) - new Date(a[1].time_and_date);
  });

  sortedReceipts.forEach(([receiptName, receipt]) => {
    const receiptDiv = document.createElement('div');
    receiptDiv.classList.add('receipt');

    const header = document.createElement('h3');
    header.textContent = receiptName;
    receiptDiv.appendChild(header);

    const totalCost = receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + receipt.tax;
    const totalCostParagraph = document.createElement('p');
    totalCostParagraph.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    receiptDiv.appendChild(totalCostParagraph);

    const costPerBuyerParagraph = document.createElement('p');
    const costPerBuyer = calculateCostPerBuyer(receipt);
    const costPerBuyerList = Object.entries(costPerBuyer)
      .map(([buyerName, cost]) => `${buyerName}: $${cost.toFixed(2)}`)
      .join(', ');
    costPerBuyerParagraph.textContent = `Cost per Buyer: ${costPerBuyerList}`;
    receiptDiv.appendChild(costPerBuyerParagraph);

    const dateParagraph = document.createElement('p');
    dateParagraph.textContent = `Date: ${new Date(receipt.time_and_date).toLocaleString()}`;
    receiptDiv.appendChild(dateParagraph);

    if (receipt.items && receipt.items.length > 0) {
      const list = document.createElement('ul');
      receipt.items.forEach(item => {
        const itemElement = document.createElement('li');
        let itemText = item.item;

        if (item.quantity > 1) {
          itemText += ` (x${item.quantity})`;
        }

        const priceMultiplier = item.item.match(/\(x(\d+)\)/);
        if (priceMultiplier) {
          itemText = itemText.replace(priceMultiplier[0], '').trim();
          itemText += `: $${(item.price / priceMultiplier[1]).toFixed(2)} (x${priceMultiplier[1]})`;
        } else {
          itemText += `: $${item.price.toFixed(2)}`;
        }

        const buyersList = [];
        for (let i = 0; i < item.quantity; i++) {
          const buyersNames = item.buyers
            .filter(buyer => buyer.selected[i])
            .map(buyer => buyer.name)
            .join(', ');
          if (buyersNames) {
            buyersList.push(buyersNames);
          }
        }

        if (buyersList.length > 0) {
          itemText += `, Buyers: ${buyersList.join('; ')}`;
        }

        itemElement.textContent = itemText;
        list.appendChild(itemElement);
      });
      receiptDiv.appendChild(list);
    } else {
      const noItemsMessage = document.createElement('p');
      noItemsMessage.textContent = 'No items found in this receipt.';
      receiptDiv.appendChild(noItemsMessage);
    }

    container.appendChild(receiptDiv);
  });
}


function calculateCostPerBuyer(receipt) {
  const buyerTotals = {};

  receipt.items.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      const selectedBuyers = item.buyers.filter(buyer => buyer.selected[i]);
      const itemTotalBuyers = selectedBuyers.length;
      if (itemTotalBuyers === 0) continue;

      const itemCostPerBuyer = item.price / itemTotalBuyers;
      selectedBuyers.forEach(buyer => {
        if (buyerTotals[buyer.name]) {
          buyerTotals[buyer.name] += itemCostPerBuyer;
        } else {
          buyerTotals[buyer.name] = itemCostPerBuyer;
        }
      });
    }
  });

  if (receipt.splitTaxEvenly) {
    const taxPerBuyer = receipt.tax / Object.keys(buyerTotals).length;
    Object.keys(buyerTotals).forEach(buyerName => {
      buyerTotals[buyerName] += taxPerBuyer;
    });
  } else {
    const totalCostWithoutTax = Object.values(buyerTotals).reduce((sum, cost) => sum + cost, 0);
    Object.keys(buyerTotals).forEach(buyerName => {
      const buyerProportionalCost = buyerTotals[buyerName] / totalCostWithoutTax;
      const taxContribution = buyerProportionalCost * receipt.tax;
      buyerTotals[buyerName] += taxContribution;
    });
  }

  return buyerTotals;
}


  

