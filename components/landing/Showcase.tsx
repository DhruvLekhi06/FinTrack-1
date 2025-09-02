import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpCircle, BarChart, MoreHorizontal } from 'lucide-react';

const AnimatedShowcase: React.FC = () => {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item: Variants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    }
    
    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="p-4 md:p-6 grid grid-cols-3 grid-rows-3 gap-4 h-[400px]"
        >
            <motion.div variants={item} className="col-span-2 row-span-1 p-4 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-400">Total Balance</p>
                    <p className="text-2xl font-bold">₹1,42,830.00</p>
                </div>
                <BarChart className="h-8 w-8 text-[var(--accent-primary)]"/>
            </motion.div>

            <motion.div variants={item} className="col-span-1 row-span-1 p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400">Savings</p>
                <p className="text-2xl font-bold text-[var(--accent-positive)]">+₹18,210</p>
            </motion.div>
            
            <motion.div variants={item} className="col-span-1 row-span-2 p-4 bg-white/5 rounded-lg">
                <p className="text-sm font-bold mb-3">Goals</p>
                <div className="space-y-3">
                    <div >
                        <p className="text-xs">Macbook Pro</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-1"><div className="w-[75%] bg-[var(--accent-primary)] h-1.5 rounded-full"></div></div>
                    </div>
                    <div>
                        <p className="text-xs">Vacation Fund</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-1"><div className="w-[40%] bg-[var(--accent-primary)] h-1.5 rounded-full"></div></div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={item} className="col-span-2 row-span-2 p-4 bg-white/5 rounded-lg">
                 <p className="text-sm font-bold mb-3">Recent Transactions</p>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <ArrowUpCircle className="h-5 w-5 text-[var(--accent-positive)] mr-2"/>
                            <span className="text-sm">Salary Deposit</span>
                        </div>
                        <span className="text-sm font-bold">+₹75,000</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-5 w-5 text-[var(--accent-negative)] mr-2 flex items-center justify-center font-bold text-lg">-</div>
                            <span className="text-sm">Netflix Subscription</span>
                        </div>
                        <span className="text-sm font-bold">-₹649</span>
                    </div>
                 </div>
            </motion.div>
        </motion.div>
    )
}

const Showcase: React.FC = () => {
    return (
        <div 
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative"
        >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] opacity-10 rounded-full blur-[100px]"></div>
            <motion.div 
                className="lg:text-left text-center relative z-10"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl sm:text-5xl font-black mb-6">Visualize your wealth.</h2>
                <p className="text-lg text-gray-400 mb-8" style={{fontWeight: 400}}>
                    A dashboard so intuitive, you'll actually enjoy managing your finances. Track spending, monitor investments, and watch your net worth grow with our beautifully designed interface.
                </p>
            </motion.div>

            <motion.div 
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                <div className="bg-dark-primary rounded-xl md:rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="h-11 flex items-center justify-between px-4 bg-black/20 border-b border-white/10">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                        </div>
                        <div className="bg-black/30 text-xs text-gray-400 rounded-md px-4 py-1">
                            app.fintrack.com
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-gray-600"/>
                    </div>
                    {/* App Mockup */}
                    <AnimatedShowcase />
                </div>
            </motion.div>
        </div>
    );
};

export default Showcase;