export const securityService = {
    logAuditEvent: (event: string, meta: any) => {
        console.info('[AUDIT]', new Date().toISOString(), event, meta);
    },
    checkPermissions: (role: string, resource: string) => {
        const matrix: any = { admin: ['*'], user: ['read'] };
        return matrix[role]?.includes('*') || matrix[role]?.includes(resource);
    }
};
