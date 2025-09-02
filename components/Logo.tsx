import React from 'react';

interface LogoProps {
    isCollapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isCollapsed = false }) => {
    return (
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center md:justify-start'}`}>
            <div className="bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] p-2 rounded-lg shadow-lg shadow-[var(--accent-primary-glow)]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="url(#paint0_linear_logo)"/>
                    <path d="M10 8C10 7.44772 10.4477 7 11 7H13C13.5523 7 14 7.44772 14 8V16C14 16.5523 13.5523 17 13 17H11C10.4477 17 10 16.5523 10 16V8Z" fill="white" fillOpacity="0.5"/>
                    <path d="M6 12C6 11.4477 6.44772 11 7 11H9C9.55228 11 10 11.4477 10 12V16C10 16.5523 9.55228 17 9 17H7C6.44772 17 6 16.5523 6 16V12Z" fill="white"/>
                    <path d="M14 12C14 11.4477 14.4477 11 15 11H17C17.5523 11 18 11.4477 18 12V16C18 16.5523 17.5523 17 17 17H15C14.4477 17 14 16.5523 14 16V12Z" fill="white"/>
                    <defs>
                    <linearGradient id="paint0_linear_logo" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor={getComputedStyle(document.documentElement).getPropertyValue('--gradient-start')}/>
                    <stop offset="1" stopColor={getComputedStyle(document.documentElement).getPropertyValue('--gradient-end')}/>
                    </linearGradient>
                    </defs>
                </svg>
            </div>
            {!isCollapsed && (
                 <h1 className="ml-3 text-2xl font-black hidden md:inline text-[var(--text-primary)] tracking-tighter">
                    FinTrack
                </h1>
            )}
        </div>
    );
};

export default Logo;