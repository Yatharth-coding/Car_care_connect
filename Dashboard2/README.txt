How to Run the Profile Dashboard Locally

1. Setup Requirements:
   - Visual Studio Code (VS Code)
   - Live Server extension for VS Code
   - Modern web browser (Chrome, Firefox, or Edge recommended)

2. Project Setup:
   - Download all project files to your local machine
   - Open the project folder in VS Code
   - Make sure all files are in their correct directories:
     └── project-root/
         ├── index.html
         ├── css/
         │   └── styles.css
         └── js/
             ├── config.js
             ├── main.js
             ├── profiles.js
             ├── supabase-config.js
             └── ui.js

3. Configure Supabase:
   - Open js/config.js
   - Verify that SUPABASE_URL and SUPABASE_ANON_KEY are correctly set
   - If you need to use your own Supabase project:
     - Replace SUPABASE_URL with your project URL
     - Replace SUPABASE_ANON_KEY with your project's anon/public key

4. Running the Application:
   Method 1 (Using Live Server):
   - Right-click on index.html in VS Code
   - Select "Open with Live Server"
   - The application will automatically open in your default browser

   Method 2 (Direct Browser Opening):
   - Simply double-click the index.html file
   - It will open in your default web browser

5. Using the Dashboard:
   - View all profiles from your Supabase database
   - Click "Edit" to modify a profile
   - Changes are automatically saved to Supabase
   - The dashboard updates in real-time

Note: Make sure you have an active internet connection as the application needs to communicate with Supabase.

Troubleshooting:
- If the data doesn't load, check your browser's console (F12) for any errors
- Verify that your Supabase credentials are correct in config.js
- Ensure all files are in their correct locations
- Check that your Supabase database has a "profiles" table with "first_name" and "email" columns