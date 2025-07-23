// Import and initialize Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Replace with your Supabase project credentials
const SUPABASE_URL = 'https://fossoibkacvvhitsnfhv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvc3NvaWJrYWN2dmhpdHNuZmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1OTMxODEsImV4cCI6MjA0OTE2OTE4MX0.UgiksbLKT8bNsD_fvMldt08ObaW0-chSHWBJbqNqS4E'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  // Get mechanic details from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const mechanicName = decodeURIComponent(urlParams.get("name"));
  const mechanicAddress = decodeURIComponent(urlParams.get("address"));

  document.getElementById('mechanic-name').textContent = mechanicName;
  document.getElementById('mechanic-address').textContent = mechanicAddress;

  const bookNowButton = document.getElementById('book-now');

  bookNowButton.addEventListener('click', async () => {
    const buttonText = bookNowButton.querySelector('.button-text');
    const originalText = buttonText.innerHTML;
    
    try {
      // Add loading state
      bookNowButton.classList.add('button-loading');
      buttonText.innerHTML = 'Processing...';
      bookNowButton.disabled = true;

      // Fetch the currently logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      if (!user) {
        console.error("No user is currently logged in.");
        return;
      }

      // Extract customer details
      const customerName = user.user_metadata?.first_name || "Unknown Customer";
      const customerEmail = user.email;

      // Insert the booking into the 'service' table
      const { data, error } = await supabase
        .from('service')
        .insert([
          {
            customer_name: customerName,
            customer_email: customerEmail,
            mechanic_name: mechanicName,
            mechanic_address: mechanicAddress
          }
        ]);

      if (error) {
        console.error("Error inserting booking:", error);
        return;
      }

      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Smooth transition to confirmation
      document.getElementById('booking-container').style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, 300));
      document.getElementById('booking-container').style.display = 'none';
      document.getElementById('confirm-message').style.display = 'block';

      // Redirect to index.html after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = '../index.html';

    } catch (err) {
      console.error("Unexpected error:", err);
      buttonText.innerHTML = originalText;
    } finally {
      bookNowButton.classList.remove('button-loading');
      bookNowButton.disabled = false;
    }
  });
});
