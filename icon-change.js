// Initialize Supabase client at the very top
const supabaseUrl = "https://fossoibkacvvhitsnfhv.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvc3NvaWJrYWN2dmhpdHNuZmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1OTMxODEsImV4cCI6MjA0OTE2OTE4MX0.UgiksbLKT8bNsD_fvMldt08ObaW0-chSHWBJbqNqS4E";
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Debug to confirm initialization
console.log('Supabase client initialized:', supabase);

// Now your code can safely use 'supabase'
document.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.getElementById("login-btn");
    const profileButton = document.getElementById("profile-btn");

    // Check for an active session
    const { data: session, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Error fetching session:", error.message);
    }

    if (session && session.session) {
        console.log("Session exists:", session.session);
        loginButton.style.display = "none";
        profileButton.style.display = "block";
    } else {
        console.log("No session found.");
        loginButton.style.display = "block";
        profileButton.style.display = "none";
    }
});



// Example logout function
async function logout() {
    await supabase.auth.signOut();
    alert("Logged out successfully!");
    window.location.reload();
}

// Listen for auth state changes (optional for dynamic updates)
supabase.auth.onAuthStateChange((event, session) => {
    const loginButton = document.getElementById("login-btn");
    const profileContainer = document.getElementById("profile-dropdown");

    if (session) {
        loginButton.style.display = "none";
        profileContainer.style.display = "inline-block";
    } else {
        loginButton.style.display = "block";
        profileContainer.style.display = "none";
    }
});
