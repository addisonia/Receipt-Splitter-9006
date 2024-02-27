const startSplitting = () => {
    window.location.href = 'split.html'
}



//privacy policy

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
  });
  


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
      userManualPanel.style.backgroundColor = 'white';
      userManualPanel.style.padding = '20px';
      userManualPanel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      userManualPanel.style.overflow = 'auto';
      userManualPanel.style.zIndex = '1000';
      document.body.appendChild(userManualPanel);

      // Close button
      const closeButton = document.createElement('button');
      closeButton.innerText = 'Close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '1rem'; // Use rem for better scaling across devices
      closeButton.style.right = '1rem';
      closeButton.onclick = function() {
          userManualPanel.style.display = 'none';
      };
      userManualPanel.appendChild(closeButton);
  }

  userManualBtn.addEventListener('click', () => {
      const isVisible = userManualPanel.style.display === 'block';
      userManualPanel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
          // Assuming 'User Manual.md' exists and is accessible
          fetch('User Manual.md')
              .then(response => response.text())
              .then(markdown => {
                  userManualPanel.innerHTML = markdownToHTML(markdown); // Ensure this replaces existing content
              })
              .catch(error => console.error('Fetch error:', error));
      }
  });

  // Simple Markdown to HTML conversion function (placeholder)
  function markdownToHTML(markdown) {
    // Replace Markdown headings with HTML headings as an example
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      // Add more Markdown syntax replacements as needed
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*)\*/gim, '<i>$1</i>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
      .replace(/\n$/gim, '<br />');
  }
});




