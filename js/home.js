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
  