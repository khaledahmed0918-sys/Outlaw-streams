import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    isSnowy?: boolean; // Kept for interface compatibility but inactive
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6
                hover:border-cyan-500/30 hover:bg-black/40 transition-all duration-300
                shadow-lg relative overflow-hidden
                ${className}
            `}
        >
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};