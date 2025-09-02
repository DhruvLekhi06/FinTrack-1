import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title }) => {
  return (
    <motion.div 
      className="bg-white/5 p-8 rounded-2xl border border-white/10 h-full flex flex-col"
      variants={itemVariants}
    >
      <p className="text-gray-300 italic mb-6 flex-grow text-lg" style={{fontWeight: 400}}>"{quote}"</p>
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-white"/>
        </div>
        <div>
            <p className="font-bold text-white">{name}</p>
            <p className="text-sm text-gray-400" style={{fontWeight: 400}}>{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;