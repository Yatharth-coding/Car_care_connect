import { supabase } from './supabase-config.js'

export async function fetchProfiles() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('first_name, email')
            .order('created_at', { ascending: false })
            .limit(1)
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching profiles:', error)
        return []
    }
}

export async function updateProfile(email, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('email', email)
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating profile:', error)
        return null
    }
}