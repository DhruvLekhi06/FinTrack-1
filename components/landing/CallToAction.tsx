import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface CallToActionProps {
    onOpenAccount: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onOpenAccount }) => {
    return (
        <section className="py-24 text-center px-4 sm:px-6 lg:px-8 cta-gradient-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl sm:text-5xl font-black mb-4">Take control of your finances today.</h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto" style={{fontWeight: 400}}>
                    It only takes 2 minutes to sign up for your free account.
                </p>
                <Button onClick={onOpenAccount} size="lg" className="button-glow">
                    Open Account
                </Button>
            </motion.div>
        </section>
    );
};

export default CallToAction;