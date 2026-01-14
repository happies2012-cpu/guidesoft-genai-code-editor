// User Access Control Service
export interface UserAccess {
    email: string;
    role: 'super_admin' | 'admin' | 'pro' | 'free';
    permissions: string[];
    features: string[];
}

const SUPER_ADMINS = ['pranu21m@gmail.com'];

export const accessControl = {
    checkAccess: (email: string): UserAccess => {
        if (SUPER_ADMINS.includes(email.toLowerCase())) {
            return {
                email,
                role: 'super_admin',
                permissions: ['*'], // All permissions
                features: [
                    'unlimited_ai',
                    'collaboration',
                    'deployment',
                    'testing',
                    'mcp_plugins',
                    'custom_models',
                    'team_management',
                    'analytics',
                    'priority_support'
                ]
            };
        }

        // Default free tier
        return {
            email,
            role: 'free',
            permissions: ['read', 'write'],
            features: ['basic_ai', 'single_project']
        };
    },

    hasPermission: (userAccess: UserAccess, permission: string): boolean => {
        return userAccess.permissions.includes('*') || userAccess.permissions.includes(permission);
    },

    hasFeature: (userAccess: UserAccess, feature: string): boolean => {
        return userAccess.features.includes(feature);
    },

    isSuperAdmin: (email: string): boolean => {
        return SUPER_ADMINS.includes(email.toLowerCase());
    }
};

// Store current user in localStorage
export const currentUserService = {
    setUser: (email: string) => {
        const access = accessControl.checkAccess(email);
        localStorage.setItem('currentUser', JSON.stringify(access));

        // Show notification for super admin
        if (access.role === 'super_admin') {
            console.log('🎉 Full Access Granted - Super Admin Mode Activated');
        }
    },

    getUser: (): UserAccess | null => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    },

    clearUser: () => {
        localStorage.removeItem('currentUser');
    }
};
