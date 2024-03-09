
// Function to handle sign-in with Google
function signInWithGoogle() {
const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    console.log("Sign-in successful, user:", user);
    }).catch((error) => {
    // Handle Errors here.
    console.error("Sign-in error:", error);
    });
}



// User popup things
document.addEventListener('DOMContentLoaded', () => {
    const signInButton = document.getElementById('signInButton');
    const signInPopup = document.getElementById('signInPopup');
    const initialSignInContent = document.getElementById('initialSignInContent');
    const postSignInContent = document.getElementById('postSignInContent');
    const signInText = document.getElementById('signInText');
    const signOutButton = document.getElementById('signOutButton');


    // Function to toggle popup content based on sign-in state
    const togglePopupContent = (isSignedIn) => {
        if (isSignedIn) {
        initialSignInContent.style.display = 'none';
        postSignInContent.style.display = 'block';
        } else {
        initialSignInContent.style.display = 'block';
        postSignInContent.style.display = 'none';
        }
    };

    // Sign out functionality
    signOutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
        console.log("User signed out.");
        togglePopupContent(false); // Revert to initial content
        }).catch((error) => {
        console.error("Sign out error:", error);
        });
    });


    // Initial sign-in button event listener
    signInButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the event from bubbling up to the window
        if (typeof window.closeSettingsPopup === 'function') {
            window.closeSettingsPopup(); // Close the settings popup if it's open
        }

        // Toggle the display of the sign-in popup
        if (signInPopup.style.display === 'block') {
            signInPopup.style.display = 'none';
        } else {
            signInPopup.style.display = 'block';
        }
    });

    // Close the sign-in popup if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (!signInPopup.contains(event.target) && !signInButton.contains(event.target)) {
            signInPopup.style.display = 'none';
        }
      });

    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            console.log("User is signed in:", user);
            togglePopupContent(true); // Show post-sign-in content

            // Show the receipt name input field
            document.getElementById("receiptNameContainer").style.display = "block";
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
            togglePopupContent(false); // Show initial sign-in content
            
            // Hide the receipt name input field
            document.getElementById("receiptNameContainer").style.display = "none";
        }
    });
    

    // Prevent the popup from closing when clicking inside it
    signInPopup.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Initiate sign-in process when the sign-in text/button is clicked
    if (signInText) {
        signInText.addEventListener('click', (event) => {
        // Prevents the window click listener from being triggered
        event.stopPropagation();
        signInWithGoogle();
        });
    }


    // This function checks if a receipt with the given name already exists for the user.
    function checkReceiptNameExists(userId, receiptName) {
        const userReceiptsRef = window.firebaseDatabase.ref(window.database, `receipts/${userId}`);
        
        return window.firebaseDatabase.get(userReceiptsRef).then((snapshot) => {
            return snapshot.child(receiptName).exists();
        }).catch((error) => {
            console.error("Firebase read failed: ", error);
            return false;
        });
    }
    


    //save receipt button
    const saveReceiptButton = document.getElementById('saveReceiptButton');
    if (saveReceiptButton) {
      saveReceiptButton.addEventListener('click', function() {
        const user = window.auth.currentUser;
        if (user) {
          const receiptNameInputValue = document.getElementById('receiptName').value.trim() || "placeholder";
  
          checkReceiptNameExists(user.uid, receiptNameInputValue).then((exists) => {
            if (exists) {
              const overwrite = confirm(`You already have a receipt named ${receiptNameInputValue}, would you like to override its data?`);
              if (!overwrite) {
                return; // Exit if the user does not want to overwrite
              }
            }
  
            const receiptData = getReceiptData();
            const receiptRef = window.firebaseDatabase.ref(window.database, `receipts/${user.uid}/${receiptNameInputValue}`);
  
            window.firebaseDatabase.set(receiptRef, receiptData)
              .then(() => {
                console.log('Receipt data saved successfully');
                animateSaveSuccess(saveReceiptButton);
              })
              .catch((error) => {
                console.error('Failed to save receipt data', error);
              });
          });
        } else {
          console.log('No user is signed in');
        }
      });
    }
    
    function animateSaveSuccess() {
      // Add the flash-success class to trigger the animation
      saveReceiptButton.classList.add('flash-success');
      saveReceiptButton.classList.add('flash-border-success');
    
      // Remove the class after the animation duration to reset the state
      setTimeout(() => saveReceiptButton.classList.remove('flash-success'), 2000);
      setTimeout(() => saveReceiptButton.classList.remove('flash-border-success'), 1000);
    
      // Show and animate the overlay
      flashOverlay.style.display = 'block';
      flashOverlay.style.animation = 'flash 0.5s ease-out forwards';
    
      // Hide the overlay after the animation completes
      setTimeout(() => {
        flashOverlay.style.display = 'none';
        flashOverlay.style.animation = ''; // Reset animation
      }, 500); // Adjust to match the flash animation duration
    }

});


function getReceiptData() {
    const receiptName = document.getElementById('receiptName').value.trim() || "placeholder";

    return {
        name: receiptName,
        items: items, // Assuming 'items' is an array of your items
        buyers: buyers, // Assuming 'buyers' is an array of your buyers
        tax: tax, // Assuming 'tax' is your tax amount
    };
}



  
