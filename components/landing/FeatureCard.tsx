import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType<LucideProps>;
  title: string;
  description: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      className="feature-card-wrapper" // Use the new wrapper for hover effect
      variants={itemVariants}
    >
      <div className="inline-block p-4 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-xl mb-6">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400" style={{fontWeight: 400}}>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;