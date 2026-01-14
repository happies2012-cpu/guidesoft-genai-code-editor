export const billingService = {
    // Generate UPI Payment String (for QR Codes)
    generateUPIQR: (amount: number, note: string) => {
        const vpa = import.meta.env.VITE_UPI_VPA || 'guidesoft@upi'; // Merchant VPA
        const name = import.meta.env.VITE_MERCHANT_NAME || 'GuideSoft AI';
        // Construct standard UPI URI
        return `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
    },

    // Mock Google Pay Intent (Mobile Deep Link)
    generateGPayIntent: (amount: number) => {
        const vpa = import.meta.env.VITE_UPI_VPA || 'guidesoft@upi';
        const name = import.meta.env.VITE_MERCHANT_NAME || 'GuideSoft';
        return `gpay://upi/pay?pa=${vpa}&pn=${name}&am=${amount}&cu=INR`;
    },

    // Poll for payment success (Mock)
    pollPaymentStatus: async (transactionId: string) => {
        console.log(`Polling status for txn ${transactionId}...`);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 2000));
        // Random success response
        return Math.random() > 0.1 ? 'SUCCESS' : 'PENDING';
    },

    verifyVPA: (vpa: string) => {
        return /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(vpa);
    }
};
