import React from 'react';

export const PrivacyPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">Privacy Policy</h1>
        <div className="prose prose-invert prose-lg">
            <p className="text-gray-400 mb-6">Last updated: January 2026</p>
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="text-gray-400">
                    We collect information you provide directly to us, such as when you create an account, update your profile, or use our interactive features. This includes:
                </p>
                <ul className="list-disc pl-6 text-gray-400 mt-2 space-y-2">
                    <li>Account information (name, email, password)</li>
                    <li>Code snippets and project data processed by our AI</li>
                    <li>Usage data and interaction metrics</li>
                </ul>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
                <p className="text-gray-400">
                    We use the information we collect to provide, maintain, and improve our services, including to:
                </p>
                <ul className="list-disc pl-6 text-gray-400 mt-2 space-y-2">
                    <li>Process your transactions and manage your account</li>
                    <li>Improve our AI models (anonymized data only)</li>
                    <li>Send you technical notices and support messages</li>
                </ul>
            </section>
        </div>
    </div>
);

export const TermsPage: React.FC = () => (
    <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">Terms of Service</h1>
        <div className="prose prose-invert prose-lg">
            <p className="text-gray-400 mb-6">Last updated: January 2026</p>
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-400">
                    By accessing or using GuideSoft AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.
                </p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Usage Rights</h2>
                <p className="text-gray-400">
                    Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use our services for your own internal business or personal purposes.
                </p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. AI Generated Code</h2>
                <p className="text-gray-400">
                    You retain all rights to the code you generate using our platform. GuideSoft claims no ownership over the output produced by our AI models based on your inputs.
                </p>
            </section>
        </div>
    </div>
);
