import { fetchProfiles, updateProfile } from './profiles.js';
import { createProfileRow, showEditModal } from './ui.js';

async function initializeDashboard() {
    const profilesBody = document.getElementById('profilesBody');
    
    async function loadProfiles() {
        const profiles = await fetchProfiles();
        profilesBody.innerHTML = '';
        
        profiles.forEach(profile => {
            const row = createProfileRow(profile, (profile) => {
                showEditModal(profile, async (updates) => {
                    await updateProfile(profile.email, updates);
                    await loadProfiles();
                });
            });
            profilesBody.appendChild(row);
        });
    }
    
    // Wait for DOM and Supabase initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(loadProfiles, 100); // Small delay to ensure Supabase is ready
        });
    } else {
        setTimeout(loadProfiles, 100);
    }
}

initializeDashboard();