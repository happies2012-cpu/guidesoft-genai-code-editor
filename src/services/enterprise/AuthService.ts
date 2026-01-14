export const authService = {
    loginWithProvider: async (provider: 'github' | 'google' | 'gitlab') => {
        console.log(`Simulating OAuth flow for ${provider}...`);
        return { success: true, token: 'mock-jwt-token' };
    },
    verifyMFA: async (code: string) => {
        return code === '123456';
    },
    ssoLogin: async (domain: string) => {
        console.log(`Initiating SAML SSO for ${domain}`);
    }
};
