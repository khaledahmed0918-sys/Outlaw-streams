import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Icons } from '../constants';
import { useI18n } from '../contexts/I18nContext';

export const LinksPage: React.FC = () => {
    const { t } = useI18n();

    // Official links with corrected colors and translations
    const officialLinks = [
        { 
            title: t('twitter'), 
            url: 'https://x.com/0utlawrp?s=21', 
            icon: <Icons.Twitter className="w-8 h-8 text-cyan-400" />,
            label: '@0utlawrp' 
        },
        { 
            title: t('twitterComm'), 
            url: 'https://x.com/i/communities/1519598160313729026', 
            icon: <Icons.Users className="w-8 h-8 text-cyan-400" />,
            label: 'Join Community' 
        },
        { 
            title: t('tiktok'), 
            url: 'https://www.tiktok.com/@outlawrpp', 
            icon: <Icons.TikTok className="w-8 h-8 text-cyan-400" />, 
            label: '@outlawrpp' 
        },
        { 
            title: t('discord'), 
            url: 'https://discord.gg/invite/0lrp', 
            icon: <Icons.Discord className="w-8 h-8 text-cyan-400" />, 
            label: 'Outlaw Community' 
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto py-10 min-h-[600px]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-white mb-2">{t('linksTitle')}</h1>
                <p className="text-cyan-400 opacity-80">{t('linksDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {officialLinks.map((link, i) => (
                    <GlassCard key={i} className="hover:scale-[1.02] hover:border-cyan-500/40 transition-all duration-300 cursor-pointer group transform-gpu">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-4">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-black/40 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all">
                                {link.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{link.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{link.label}</p>
                                <div className="flex items-center gap-2 text-xs text-cyan-500/80 mt-3 font-bold uppercase tracking-wider">
                                    <span>{t('openLink')}</span>
                                    <Icons.ExternalLink className="w-3 h-3" />
                                </div>
                            </div>
                        </a>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};