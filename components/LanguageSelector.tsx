import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSelectorProps {
    isCollapsed: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isCollapsed }) => {
    const { language, setLanguage, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = {
        en: 'English',
        hi: 'हिन्दी',
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center w-full p-3 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ${isCollapsed ? 'justify-center' : 'md:bg-[var(--bg-primary)] md:rounded-lg'}`}
                 title={isCollapsed ? t('sidebar.language') : ''}
            >
                <Languages className="h-5 w-5" />
                {!isCollapsed && <span className="hidden md:inline ml-2">{t('sidebar.language')}</span>}
                {!isCollapsed && <ChevronDown className={`h-4 w-4 hidden md:inline ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 w-full md:w-auto bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-lg shadow-lg z-10 origin-bottom"
                    >
                        <ul className="p-1">
                            {(Object.keys(languages) as Array<keyof typeof languages>).map((lang) => (
                                <li key={lang}>
                                    <button
                                        onClick={() => {
                                            setLanguage(lang);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${
                                            language === lang ? 'font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[var(--text-secondary)]'
                                        } hover:bg-[var(--border-subtle)]`}
                                    >
                                        {languages[lang]}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;