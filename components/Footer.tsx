import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { RobustImage } from './ui/RobustImage';
import { Icons } from '../constants';

export const Footer: React.FC = () => {
    const { t } = useI18n();
    const [copied, setCopied] = React.useState(false);

    const handleDiscordCopy = () => {
        navigator.clipboard.writeText('221.k');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <footer className="w-full bg-black/90 backdrop-blur-xl border-t border-white/5 py-12 mt-12 relative z-50">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="font-black text-2xl text-white mb-4 tracking-tighter">OUTLAW <span className="text-cyan-400">NEWS</span></h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        {t('footerDesc')}
                    </p>
                </div>
                
                <div className="flex flex-col items-center md:items-start gap-4">
                    <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest">{t('footerFounded')}</h3>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 pr-6 w-fit">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30">
                            <RobustImage 
                                src="https://i.postimg.cc/vH9VNdH8/IMG-8915.jpg" 
                                className="w-full h-full object-cover" 
                                isCircular 
                            />
                        </div>
                        <span className="text-white font-bold text-lg">{t('founderName')}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start gap-4">
                    <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest">{t('footerDev')}</h3>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 pr-4 w-fit">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
                        <span className="text-white font-bold text-lg mr-2">{t('devName')}</span>
                        
                        <div className="h-6 w-px bg-white/10 mx-1"></div>
                        
                        <div className="flex items-center gap-2">
                             {/* Discord Button */}
                            <button 
                                onClick={handleDiscordCopy}
                                className="p-1.5 bg-[#5865F2]/20 hover:bg-[#5865F2] text-[#5865F2] hover:text-white rounded-lg transition-colors relative group"
                                title="Copy Discord ID: 221.k"
                            >
                                <Icons.Discord className="w-4 h-4" />
                                {copied && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-white text-black px-2 py-1 rounded font-bold whitespace-nowrap">
                                        Copied!
                                    </span>
                                )}
                            </button>

                            {/* Twitter Button */}
                            <a 
                                href="https://x.com/i_mohammedqht?s=21" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1.5 bg-cyan-400/20 hover:bg-cyan-400 text-cyan-400 hover:text-black rounded-lg transition-colors"
                            >
                                <Icons.Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-12 pt-8 border-t border-white/5 text-[10px] text-gray-700 uppercase tracking-widest font-bold">
                &copy; {new Date().getFullYear()} Outlaw NEWS. {t('rights')}
            </div>
        </footer>
    );
};