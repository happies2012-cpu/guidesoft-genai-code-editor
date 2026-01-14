import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
    return (
        <div className="py-24 px-6 bg-[#050505]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
                    <p className="text-gray-400 text-lg">
                        Have questions? We're here to help.
                    </p>
                </div>

                <div className="space-y-4">
                    <FAQItem
                        question="How is GuideSoft different from VS Code?"
                        answer="GuideSoft is built from the ground up for AI-native development. While VS Code uses extensions for AI, GuideSoft integrates agents directly into the core editor loop, file system, and terminal, allowing for true autonomy and context awareness."
                    />
                    <FAQItem
                        question="Does my code leave my machine?"
                        answer="By default, no. We use local RAG and open-source models for basic tasks. If you choose to use cloud models like GPT-4, only the relevant code snippets are securely transmitted. We are SOC2 compliant."
                    />
                    <FAQItem
                        question="Can I use my own API keys?"
                        answer="Yes! You can bring your own keys for OpenAI, Anthropic, or Mistral. In 'Hobby' mode, this is required. Pro plans include usage limits for our managed models."
                    />
                    <FAQItem
                        question="Is there a free tier?"
                        answer="Absolutely. The Hobby tier is free forever and includes unlimited public projects, basic completions, and community support."
                    />
                    <FAQItem
                        question="What languages do you support?"
                        answer="We support all major languages including TypeScript, Python, Rust, Go, Java, and C++. Our agents are specialized for web development stacks but capable of adapting to any codebase."
                    />
                </div>

                <div className="mt-20 p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
                        <MessageCircle size={24} className="text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-gray-400 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <button className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors">
                        Get in Touch
                    </button>
                </div>
            </div>
        </div>
    );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/5 rounded-xl bg-[#0a0a0a] overflow-hidden transition-all hover:border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-semibold text-lg">{question}</span>
                <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
