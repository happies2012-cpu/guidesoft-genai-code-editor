import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: 'free' | 'pro' | 'enterprise' | 'super_admin';
    subscription_status: string;
    ai_credits: number;
    created_at: string;
    updated_at: string;
}

export const supabaseAuthService = {
    signUp: async (email: string, password: string, fullName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                email,
                full_name: fullName,
                role: email === 'pranu21m@gmail.com' ? 'super_admin' : 'free'
            });

            if (profileError) throw profileError;
        }

        return data;
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        return { user: data.user, profile: profile as UserProfile };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return { user, profile: profile as UserProfile };
    },

    updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as UserProfile;
    }
};
