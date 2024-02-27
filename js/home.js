const startSplitting = () => {
    window.location.href = 'html/split.html';
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

  // Convert horizontal rule
  markdown = markdown.replace(/____________________________________________________________________/gim, '<hr>');

  // Handling dashes directly and ensure proper indentation
  // Replace lines starting with dash with a div that simulates a list item
  markdown = markdown.replace(/^\- (.*)$/gm, '<div style="margin-left: 20px;">- $1</div>');

  // Ensure paragraphs are separated by proper line breaks
  // Use double newline to separate paragraphs
  markdown = markdown.replace(/\n\n/g, '<br><br>');

  // Convert single line breaks to <br>, preserving existing spacing for non-paragraph breaks
  markdown = markdown.replace(/([^\n])\n([^\n])/gim, '$1<br>$2');

  return markdown;
}

  
});




