import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart2, Zap, Star, Lock, Server } from 'lucide-react';
import AuthLayout from '../components/ui/AuthLayout';
import Button from '../components/ui/Button';
import SignUpModal from '../components/SignUpModal';
import FeatureCard from '../components/landing/FeatureCard';
import Showcase from '../components/landing/Showcase';
import TestimonialCard from '../components/landing/TestimonialCard';
import CallToAction from '../components/landing/CallToAction';
import HeroStatCards from '../components/landing/HeroStatCards';
import TrustSignal from '../components/landing/TrustSignal';

interface SignUpProps {
  onSignUp: (name: string, email: string, password_hash: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error: string | null;
  onExploreDemo: () => void;
}

const SectionWrapper: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <motion.section
        className={`py-24 px-4 sm:px-6 lg:px-8 ${className}`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
    >
        {children}
    </motion.section>
);

const SignUp: React.FC<SignUpProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-dark-primary text-white overflow-x-hidden">
      <div className="animated-aurora-bg"></div>
      
      {/* Hero Section */}
      <header className="relative h-screen">
          <AuthLayout
            headline={<>The Future of Financial Control.</>}
            subheadline="An intelligent platform designed for modern life. Secure, simple, and powerful enough to manage your entire financial world."
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="button-glow">
                    Open Account
                </Button>
                <Button variant="secondary" size="lg" onClick={props.onExploreDemo}>
                    Explore Demo
                </Button>
            </div>
          </AuthLayout>
          <HeroStatCards />
      </header>
      
      <main className="relative z-10 bg-dark-primary">
        {/* Features Section */}
        <SectionWrapper>
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={BarChart2} title="Track Everything" description="Real-time expense & income tracking." />
                    <FeatureCard icon={ShieldCheck} title="Secure by Design" description="Bank-level security, end-to-end encrypted." />
                    <FeatureCard icon={Zap} title="Grow Smarter" description="AI-driven insights for savings & investments." />
                </div>
            </div>
        </SectionWrapper>

        {/* Showcase Section */}
        <SectionWrapper>
           <Showcase />
        </SectionWrapper>

        {/* Trust & Social Proof Section */}
        <SectionWrapper className="bg-white/5">
             <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl sm:text-5xl font-black text-center mb-16">Join a community of savvy financiers.</h2>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="text-center">
                        <p className="text-5xl font-black text-[var(--accent-primary)]">10,000+</p>
                        <p className="text-gray-400 mt-2 font-sans">Active Users</p>
                    </div>
                     <div className="text-center">
                        <p className="text-5xl font-black text-[var(--accent-primary)]">$50M+</p>
                        <p className="text-gray-400 mt-2 font-sans">Tracked Monthly</p>
                    </div>
                     <div className="text-center">
                        <p className="text-5xl font-black text-[var(--accent-primary)] flex justify-center items-center">4.9 <Star className="h-8 w-8 ml-2 text-amber-400 fill-current" /></p>
                        <p className="text-gray-400 mt-2 font-sans">User Rating</p>
                    </div>
                </div>

                {/* Testimonial Carousel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard quote="FinTrack helped me save 20% more every month. The AI advisor is a game-changer." name="Sarah J." title="Freelance Designer" />
                    <TestimonialCard quote="Finally, a finance app that's both powerful and beautiful to use. I'm in control of my financial future." name="Michael B." title="Software Engineer" />
                    <TestimonialCard quote="I've tried them all. This is the one. The goal tracking and budgeting tools are top-notch." name="Emily K." title="Marketing Manager" />
                </div>
                
                 {/* Trust Logos */}
                <div className="mt-20 flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                    <TrustSignal icon={Lock} text="End-to-End Encrypted" />
                    <TrustSignal icon={Server} text="SSL Secured Connection" />
                    <TrustSignal icon={ShieldCheck} text="GDPR Compliant" />
                </div>
             </div>
        </SectionWrapper>

        {/* Final CTA */}
        <CallToAction onOpenAccount={() => setIsModalOpen(true)} />
      </main>

      <SignUpModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...props}
      />
    </div>
  );
};

export default SignUp;