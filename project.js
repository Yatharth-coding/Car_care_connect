document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.nav-item');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            dropdown.querySelector('.dropdown-content').style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            timer = setTimeout(() => {
                dropdown.querySelector('.dropdown-content').style.display = 'none';
            }, 100); // Adds a slight delay before hiding the dropdown
        });
    });
});

function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    elements.forEach((element) => {
      const file = element.getAttribute('data-include');
      fetch(file)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch ' + file);
          return response.text();
        })
        .then((data) => {
          element.innerHTML = data;

          //CHATBOT-  Execute scripts in the included HTML
          element.querySelectorAll('script').forEach((script) => {
            const newScript = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = script.textContent;
            document.head.appendChild(newScript);
          });
          //CHATBOT ENDS

        })
        .catch((error) => console.error(error));
    });
  }
  
  // Call includeHTML on page load
document.addEventListener('DOMContentLoaded', includeHTML);

// Function to handle login button click (redirect to login page)
function handleLogin() {
    window.location.href = "user-type.html";
  }


