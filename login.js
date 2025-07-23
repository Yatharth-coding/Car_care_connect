document.addEventListener("DOMContentLoaded", () => {
  // Replace with your Supabase credentials
  const supabaseUrl = "https://fossoibkacvvhitsnfhv.supabase.co"; // Replace with your Supabase URL
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvc3NvaWJrYWN2dmhpdHNuZmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1OTMxODEsImV4cCI6MjA0OTE2OTE4MX0.UgiksbLKT8bNsD_fvMldt08ObaW0-chSHWBJbqNqS4E"; // Replace with your Supabase Key

  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  // Handle email/password sign-in
  const emailSignInForm = document.getElementById("email-signin-form");
  if (emailSignInForm) {
    emailSignInForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const userType = document.getElementById("user-type").value;

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Email Sign-in Error:", error.message);
        alert("Error logging in with email. Check your credentials.");
      } else {
        // alert(`Login successful as ${userType}!`);
        window.location.href = '../project.html'; // Redirect to home page
      }
    });
  }

  // Handle email/password sign-up
  const emailSignUpForm = document.getElementById("email-signup-form");
  if (emailSignUpForm) {
    emailSignUpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const userType = document.getElementById("user-type").value;

      const errorMessageDiv = document.getElementById("signup-error");
      errorMessageDiv.textContent = ""; // Clear previous errors

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            customer_type: userType, // Include user type
          },
        },
      });

      if (error) {
        // Display the error message below the password field
        errorMessageDiv.textContent = error.message;
      } else {
        // alert("Sign-up successful!");
        // Redirect to your main app page or login page
        window.location.href = '../project.html'; // Redirect to home page
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector(".dropdown-item[onclick='logout()']");
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        await supabase.auth.signOut();
        // alert("Logged out successfully!");
        window.location.href = '../project.html'; // Refresh the page after logging out
      });
    }
});