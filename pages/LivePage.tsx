import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../constants';
import { useI18n } from '../contexts/I18nContext';
import { Streamer } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { StreamerDetailModal, StreamerCard } from './LiveComponents';
import { useLive } from '../contexts/LiveContext';

// --- Skeleton Component for Grid ---
const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <GlassCard key={i} className="flex flex-col !p-0 overflow-hidden h-full border border-white/5 opacity-50">
                <div className="h-28 w-full bg-white/5 animate-pulse" />
                <div className="px-4 pb-4 flex-1 flex flex-col gap-3 mt-4">
                    <div className="flex gap-4 items-end -mt-10">
                        <div className="w-16 h-16 rounded-xl bg-white/10 animate-pulse border-4 border-[#1a1a1a]" />
                    </div>
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                </div>
            </GlassCard>
        ))}
    </div>
);

export const LivePage: React.FC<{ snowEnabled: boolean, isAdmin: boolean }> = ({ snowEnabled }) => {
    const { t, dir } = useI18n();
    const { streamers, loading, toggleFavorite, toggleNotify, retryFailed } = useLive();
    
    const [search, setSearch] = useState('');
    const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);
    const [retryingAll, setRetryingAll] = useState(false);

    const filteredStreamers = streamers.filter(s => 
        !search || (s.kickUsername || '').toLowerCase().includes(search.toLowerCase())
    );

    const hasErrors = streamers.some(s => s.error);

    const handleRetryAll = async () => {
        setRetryingAll(true);
        await retryFailed();
        setRetryingAll(false);
    };

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 relative min-h-[600px] pb-24">
            {/* Top Control Bar */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative z-20">
                
                {/* Search Bar */}
                <div className="w-full max-w-2xl relative group order-2 md:order-1">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                    <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center shadow-2xl transition-all duration-300 focus-within:border-cyan-500/50 focus-within:bg-black/80">
                        <Icons.Search className={`absolute text-gray-400 w-5 h-5 ${dir==='rtl' ? 'right-6' : 'left-6'}`} />
                        <input 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            placeholder={t('searchLive')} 
                            className={`w-full bg-transparent p-4 py-3.5 outline-none text-white placeholder-gray-500 font-medium ${dir==='rtl' ? 'pr-14 pl-6' : 'pl-14 pr-6'}`} 
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-4 p-1 rounded-full hover:bg-white/10">
                                <Icons.X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Reload All Button - Only shows if there are errors */}
                {hasErrors && (
                    <button 
                        onClick={handleRetryAll} 
                        disabled={retryingAll}
                        className="order-1 md:order-2 flex items-center gap-2 px-6 py-3.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/50 hover:border-red-500 text-red-400 rounded-full font-bold transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        <Icons.Wifi className={`w-4 h-4 ${retryingAll ? 'animate-pulse' : ''}`} />
                        {retryingAll ? 'Retrying Failed...' : 'Reload Failed'}
                    </button>
                )}
            </div>

            {/* Content Area */}
            {streamers.length === 0 && loading ? (
                <SkeletonGrid />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStreamers.map(streamer => (
                        <div key={streamer.id} className="h-full">
                            <StreamerCard 
                                streamer={streamer} 
                                onClick={() => setSelectedStreamer(streamer)} 
                                onToggleFavorite={toggleFavorite} 
                                onToggleNotify={toggleNotify} 
                                snowEnabled={snowEnabled} 
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>{selectedStreamer && <StreamerDetailModal streamer={selectedStreamer} onClose={() => setSelectedStreamer(null)} onDelete={() => {}} snowEnabled={snowEnabled} />}</AnimatePresence>
        </div>
    );
};