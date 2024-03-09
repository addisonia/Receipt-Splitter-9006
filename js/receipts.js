//buttons
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
    // Clear existing content
    container.innerHTML = '';

    // Check if there are any receipts to display
    if (!receipts || Object.keys(receipts).length === 0) {
        container.innerHTML = '<p>No receipts found.</p>';
        return;
    }

    // Loop through each receipt and display it
    Object.entries(receipts).forEach(([receiptName, receipt]) => {
        const receiptDiv = document.createElement('div');
        receiptDiv.classList.add('receipt');

        const header = document.createElement('h3');
        header.textContent = receiptName;
        receiptDiv.appendChild(header);

        // Check if the current receipt has any items
        if (receipt.items && receipt.items.length > 0) {
            const list = document.createElement('ul');
            receipt.items.forEach(item => {
                const itemElement = document.createElement('li');
                // Assuming each item's buyers are an array of objects with 'name' property
                const buyersNames = item.buyers.map(buyer => buyer.name).join(', ');
                itemElement.textContent = `${item.item}: $${item.price.toFixed(2)}, Buyers: ${buyersNames}`;
                list.appendChild(itemElement);
            });
            receiptDiv.appendChild(list);
        } else {
            // If the receipt has no items, display a message indicating this
            const noItemsMessage = document.createElement('p');
            noItemsMessage.textContent = 'No items found in this receipt.';
            receiptDiv.appendChild(noItemsMessage);
        }

        container.appendChild(receiptDiv);
    });
}


  

