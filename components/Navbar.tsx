import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { RobustImage } from './ui/RobustImage';

interface NavbarProps {
    currentTab: 'live' | 'links';
    setTab: (tab: 'live' | 'links') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
    const { lang, setLang, t } = useI18n();

    const toggleLang = () => {
        setLang(lang === 'en' ? 'ar' : 'en');
    };

    return (
        <nav className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 pr-3 flex items-center justify-between shadow-2xl transition-all duration-300">
                {/* Logo Area */}
                <div className="px-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] bg-black">
                        <RobustImage 
                            src="https://i.postimg.cc/vH9VNdH8/IMG-8915.jpg" 
                            alt="Outlaw" 
                            className="w-full h-full object-cover" 
                            isCircular 
                        />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white hidden sm:block">
                        OUTLAW <span className="text-cyan-400">NEWS</span>
                    </span>
                </div>

                {/* Navigation Pills */}
                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
                    <button 
                        onClick={() => setTab('live')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${currentTab === 'live' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t('navLive')}
                    </button>
                    <button 
                        onClick={() => setTab('links')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${currentTab === 'links' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t('navLinks')}
                    </button>
                </div>

                {/* Language Toggle */}
                <div className="pl-2">
                    <button 
                        onClick={toggleLang}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-xs hover:bg-white/20 transition-all text-cyan-400"
                    >
                        {lang === 'en' ? 'AR' : 'EN'}
                    </button>
                </div>
            </div>
        </nav>
    );
};