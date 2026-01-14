import { supabase } from './SupabaseService';

export interface PaymentOrder {
    id: string;
    amount: number;
    currency: string;
    status: string;
    razorpay_order_id?: string;
}

export const paymentService = {
    createOrder: async (amount: number, plan: string, userId: string) => {
        // Call Supabase Edge Function to create Razorpay order
        const { data, error } = await supabase.functions.invoke('create-payment-order', {
            body: { amount, plan, userId }
        });

        if (error) throw error;
        return data as PaymentOrder;
    },

    verifyPayment: async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: paymentData
        });

        if (error) throw error;
        return data;
    },

    initiateRazorpay: (order: PaymentOrder, userEmail: string, onSuccess: () => void, onFailure: (error: any) => void) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount * 100, // Convert to paise
            currency: order.currency,
            name: 'GuideSoft AI',
            description: 'Subscription Payment',
            order_id: order.razorpay_order_id,
            handler: async (response: any) => {
                try {
                    await paymentService.verifyPayment(response);
                    onSuccess();
                } catch (error) {
                    onFailure(error);
                }
            },
            prefill: {
                email: userEmail,
            },
            theme: {
                color: '#6750A4'
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment cancelled');
                }
            }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    },

    getPaymentHistory: async (userId: string) => {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};
