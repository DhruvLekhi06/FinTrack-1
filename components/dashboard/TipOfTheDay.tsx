import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import Card from '../ui/Card';

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const financialTips = [
    "Review your bank statements each month to catch fraudulent charges.",
    "Automate your savings to ensure you're consistently putting money away.",
    "The 50/30/20 rule: 50% on needs, 30% on wants, and 20% on savings.",
    "Build an emergency fund that covers 3-6 months of living expenses.",
    "Pay off high-interest debt, like credit cards, as quickly as possible.",
    "Check your credit score regularly and understand what affects it.",
    "Always pay your bills on time to avoid late fees and protect your credit.",
    "Negotiate your bills, such as cable and internet, to lower your monthly costs.",
    "Create a detailed budget to track where your money is going.",
    "Take full advantage of employer-sponsored retirement plans, like a 401(k) match.",
    "Diversify your investments to spread risk.",
    "Understand the power of compound interest and start investing early.",
    "Avoid making emotional investment decisions. Stick to your long-term plan.",
    "Increase your insurance deductibles to lower your premiums.",
    "Use a cashback credit card for everyday purchases, but pay it off monthly.",
    "Plan your meals for the week to save money on groceries and eating out.",
    "Unsubscribe from marketing emails to reduce the temptation of impulse buys.",
    "Wait 24 hours before making a large, non-essential purchase.",
    "Set clear financial goals to stay motivated.",
    "Educate yourself about personal finance through books, podcasts, and blogs.",
    "Review your insurance coverage annually to ensure it still meets your needs.",
    "When you get a raise, increase your savings rate, not just your spending.",
    "Don't be afraid to talk about money with your partner or family.",
    "Keep your financial records organized in one secure place.",
    "Understand the tax implications of your financial decisions.",
    "Create a will and an estate plan to protect your assets and loved ones.",
    "Use a high-yield savings account for your emergency fund to earn more interest.",
    "Compare prices before making significant purchases.",
    "Prioritize experiences over material possessions for greater long-term happiness.",
    "Regularly contribute to a retirement account, even if it's a small amount.",
];


const TipOfTheDay: React.FC = () => {
    const dayOfMonth = new Date().getDate();
    const tipIndex = (dayOfMonth - 1) % financialTips.length;
    const tip = financialTips[tipIndex];

    return (
        <motion.div variants={itemVariants}>
            <Card className="h-full flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Tip of the Day</h3>
                    <Lightbulb className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1 flex items-center">
                    <p className="text-[var(--text-secondary)] text-center text-sm md:text-base italic leading-relaxed">
                        "{tip}"
                    </p>
                </div>
            </Card>
        </motion.div>
    )
}

export default TipOfTheDay;