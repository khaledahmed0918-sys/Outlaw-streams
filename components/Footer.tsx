import React from 'react';
import { useI18n } from '../contexts/I18nContext';
import { RobustImage } from './ui/RobustImage';

export const Footer: React.FC = () => {
    const { t } = useI18n();

    return (
        <footer className="w-full bg-black/90 backdrop-blur-xl border-t border-white/5 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="font-black text-2xl text-white mb-4 tracking-tighter">OUTLAW <span className="text-cyan-400">NEWS</span></h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        {t('footerDesc')}
                    </p>
                </div>
                
                <div className="flex flex-col items-center md:items-start gap-4">
                    <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest">{t('footerFounded')}</h3>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 pr-6">
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

                <div className="flex flex-col items-center md:items-start gap-2">
                    <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-2">{t('footerDev')}</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-white font-bold text-xl tracking-tight">{t('devName')}</span>
                    </div>
                </div>
            </div>
            <div className="text-center mt-12 pt-8 border-t border-white/5 text-[10px] text-gray-700 uppercase tracking-widest font-bold">
                &copy; {new Date().getFullYear()} Outlaw NEWS. {t('rights')}
            </div>
        </footer>
    );
};