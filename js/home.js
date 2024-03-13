const startSplitting = () => {
    window.location.href = 'html/split.html';
}



//cookies consent

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user has already accepted the policy
    const hasConsented = localStorage.getItem('userConsent');
    
    if (!hasConsented) {
      const modal = document.getElementById('privacyPolicyModal');
      const span = document.getElementsByClassName('close')[0];
      const acceptButton = document.getElementById('acceptPrivacyPolicy');
  
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }
  
      // When the user clicks on "I Agree", close the modal and save consent
      acceptButton.onclick = function() {
        modal.style.display = "none";
        localStorage.setItem('userConsent', 'true');
      }
  
      // Show the modal
      modal.style.display = "block";
    }


    // Event listener for the spacebar key press
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) { // Check if spacebar was pressed and the target is the body to avoid triggering when focused on other elements
          e.preventDefault(); // Prevent the default spacebar action (scrolling)
          document.getElementById('startSplittingBtn').click(); // Programmatically click the button
      }
    });
  });




// Icon changer
function updateFavicon() {
  // Determine the current icon
  const currentIcon = document.querySelector('link[rel="icon"]');
  let newIconPath;

  if (currentIcon && currentIcon.href.includes('receipt_icon.ico')) {
      newIconPath = 'other/snake2.ico';
  } else {
      newIconPath = 'other/receipt_icon.ico';
  }

  // Update or create the favicon element
  const link = currentIcon || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  // Add cache busting query parameter
  link.href = `${newIconPath}?v=${new Date().getTime()}`;
  if (!currentIcon) {
      document.getElementsByTagName('head')[0].appendChild(link);
  }
}

// Call updateFavicon every 2 seconds to switch between icons
setInterval(updateFavicon, 2000);



  




  


// User Manual Button

document.addEventListener('DOMContentLoaded', () => {
  const userManualBtn = document.getElementById('userManualBtn');
  let userManualPanel = document.getElementById('userManualPanel');

  if (!userManualPanel) {
      userManualPanel = document.createElement('div');
      userManualPanel.id = 'userManualPanel';
      userManualPanel.style.display = 'none';
      userManualPanel.style.position = 'fixed';
      userManualPanel.style.top = '50%'; // Center vertically
      userManualPanel.style.left = '50%'; // Center horizontally
      userManualPanel.style.transform = 'translate(-50%, -50%)'; // Adjust both horizontally and vertically
      userManualPanel.style.width = '75%';
      userManualPanel.style.height = '75%';
      userManualPanel.style.backgroundColor = '#fffef5';
      userManualPanel.style.padding = '25px';
      userManualPanel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      userManualPanel.style.overflow = 'auto';
      userManualPanel.style.zIndex = '1000';
      document.body.appendChild(userManualPanel);


  }

  userManualBtn.addEventListener('click', () => {
      const isVisible = userManualPanel.style.display === 'block';
      userManualPanel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
          // Assuming 'User Manual.md' exists and is accessible
          fetch('../User Manual.md')
              .then(response => response.text())
              .then(markdown => {
                  userManualPanel.innerHTML = markdownToHTML(markdown); // Ensure this replaces existing content
              })
              .catch(error => console.error('Fetch error:', error));
      }
  });


//markdown to HTML function
function markdownToHTML(markdown) {
  // Convert headings
  markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>')
                     .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                     .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                     .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
                     .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
                     .replace(/^###### (.*$)/gim, '<h6>$1</h6>');

  // Convert bold and italic
  markdown = markdown.replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
                     .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                     .replace(/\*(.*)\*/gim, '<em>$1</em>');

  // Handle lines starting with dashes, including indentation
  markdown = markdown.split('\n').map(line => {
      const matches = line.match(/^(\s*)-\s(.*)/);
      if (matches) {
          const indentLevel = matches[1].length / 2; // Assuming 2 spaces per indent level
          return `<div style="margin-left: ${indentLevel * 20}px;">- ${matches[2]}</div>`;
      }
      return line;
  }).join('\n');

  // Convert horizontal rules
  markdown = markdown.replace(/^-{3,}$/gim, '<hr>');

  // Convert line breaks to <br>
  markdown = markdown.replace(/([^\n])\n([^\n])/gim, '$1<br>$2');

  return markdown;
}


});


// Event listener for opening and closing the user manual
document.addEventListener('DOMContentLoaded', () => {
  const userManualBtn = document.getElementById('userManualBtn');
  const userManualModal = document.getElementById('userManualModal');
  const userManualIcon = userManualBtn.querySelector('i'); // Assuming there's only one <i> inside this button

  userManualBtn.addEventListener('click', () => {
    let isModalOpen = userManualModal.classList.contains('active');

    if (isModalOpen) {
      // Hide the modal
      userManualModal.classList.remove('active');
      userManualBtn.classList.remove('active');

      // Reset the button style to default and change the icon back to the book
      userManualBtn.style.top = ''; // Removes the inline style for top
      userManualBtn.style.position = ''; // Resets position to default or CSS value
      userManualBtn.style.zIndex = ''; // Resets zIndex to default or CSS value
      userManualIcon.className = 'fa-solid fa-book'; // Changes icon back to book
    } else {
      // Show the modal and change the icon to a house
      userManualModal.classList.add('active');
      userManualBtn.classList.add('active');

      // Move the button 3vh from the top and ensure it's visible above the modal
      userManualBtn.style.top = '3vh';
      userManualBtn.style.position = 'fixed';
      userManualBtn.style.zIndex = 101; // Ensure it's above the modal
      userManualIcon.className = 'fa-solid fa-house'; // Changes icon to house
    }
  });
});










//Snake game button
document.addEventListener('DOMContentLoaded', () => {
  const snakeGameBtn = document.getElementById('snakeGameBtn');

  snakeGameBtn.addEventListener('click', () => {
    window.location.href = "html/snake.html";
  });

});



//Privacy policy button
document.addEventListener('DOMContentLoaded', () => {
  const realPrivacyPolicyBtn = document.getElementById('realPrivacyPolicyBtn');

  realPrivacyPolicyBtn.addEventListener('click', () => {
    window.location.href = "html/privacy-policy.html";
  });

});



// chevron arrows

function scrollPageDown() {
  // Scroll to the bottom of the page
  window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
  });
  
  // Hide the chevron down immediately
  document.getElementById('chevron-down').style.display = 'none';

  // Use setTimeout to delay the appearance of the chevron up
  setTimeout(function() {
    document.getElementById('chevron-up').style.display = 'flex';
  }, 1000); // Delay in milliseconds (500ms = 0.5 seconds)

  // Use setTimeout to delay the background change
  setTimeout(function() {
    document.body.classList.add('body-scrolled');
  }, 500); 
}

function scrollPageUp() {
  // Scroll to the top of the page
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
  
  // Hide the chevron up and show the chevron down with a delay
  document.getElementById('chevron-up').style.display = 'none';
  setTimeout(function() {
    document.getElementById('chevron-down').style.display = 'flex';
  }, 1000); 

  // Remove the background class from the body with a delay
  setTimeout(function() {
    document.body.classList.remove('body-scrolled');
  }, 500); 
}


// Listen for scroll events on the window
window.addEventListener('scroll', function() {
  // Get the current scroll position
  var scrollPosition = window.scrollY || window.pageYOffset;

  var transitionPoint = window.innerHeight * 0.6;
  

  if (scrollPosition > transitionPoint) {
    document.body.classList.add('past-transition-point');
  } else {
    document.body.classList.remove('past-transition-point');
  }
});


//make arrows move when manually scrolling
document.addEventListener('DOMContentLoaded', function() {
  function handleScroll() {
      const scrolledDown = (window.innerHeight + window.scrollY) / document.body.offsetHeight > 0.6;
      
      // Manage chevron visibility based on scroll position
      document.getElementById('chevron-down').style.display = scrolledDown ? 'none' : 'flex';
      document.getElementById('chevron-up').style.display = scrolledDown ? 'flex' : 'none';
      
      // Smoothly transition background color based on scroll position
      document.body.style.backgroundColor = scrolledDown ? 'var(--yuckLight)' : 'var(--yuck)';
  }

  window.addEventListener('scroll', handleScroll);

  // Initialize to set correct state when page loads
  handleScroll();
});





