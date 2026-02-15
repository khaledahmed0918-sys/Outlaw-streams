import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { Streamer, KickChannelInfo, KickStreamInfo, StreamerRequest, StreamerLinks } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultStreamersList } from '../constants';
import { robustFetch } from '../utils/apiWrapper';
import { fetchKickChannel } from '../services/KickService';

// --- CONFIGURATION CONSTANTS ---
const REFRESH_INTERVAL_MS = 60000; // Total Refresh every 60s
const BATCH_SIZE = 2;              // Fetch 2 streamers at a time
// Default delay, but now we use dynamic delay based on success/failure
const MIN_BATCH_DELAY_MS = 1200;   

interface LiveContextType {
    streamers: Streamer[];
    loading: boolean;
    refresh: () => Promise<void>;
    totalStreamersCount: number;
    toggleFavorite: (id: string) => void;
    toggleNotify: (id: string) => Promise<boolean>;
    submitStreamerRequest: (username: string, tags: string, characters: string) => Promise<void>;
    getStreamerRequests: () => Promise<StreamerRequest[]>;
    acceptStreamerRequest: (id: string, username: string, tags: string[], characters: string[]) => Promise<void>;
    deleteStreamerRequest: (id: string) => Promise<void>;
    addLocalStreamer: (streamer: Streamer) => void;
    loadBatch: (start: number, count: number) => Promise<void>;
    retryStreamer: (id: string) => Promise<void>;
    retryFailed: () => Promise<void>;
}

const LiveContext = createContext<LiveContextType | null>(null);

export const LiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [localPreferences, setLocalPreferences] = useLocalStorage<Record<string, { isFavorite: boolean, notify: boolean }>>('mtnews-streamer-prefs', {});
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    // Sorting Logic: Loaded > Favorites > Live > Viewers > Others
    const sortStreamers = useCallback((list: Streamer[]) => {
        return [...list].sort((a, b) => {
            // 1. Data Loaded Status (Bubbles loaded cards to top)
            const aLoaded = !!a.kickData && !a.error;
            const bLoaded = !!b.kickData && !b.error;
            if (aLoaded !== bLoaded) return aLoaded ? -1 : 1;

            // 2. Favorites
            if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
            
            // 3. Live Status
            const aLive = a.streamData?.is_live || false;
            const bLive = b.streamData?.is_live || false;
            if (aLive !== bLive) return aLive ? -1 : 1;
            
            // 4. Viewers
            if (aLive && bLive) {
                return (b.streamData?.viewers || 0) - (a.streamData?.viewers || 0);
            }
            
            return 0; 
        });
    }, []);

    const getStaticStreamers = useCallback(() => {
        return defaultStreamersList.map(url => {
            const username = url.split('/').pop()!;
            const pref = localPreferences[username] || { isFavorite: false, notify: false };
            return {
                id: username,
                kickUsername: username,
                tags: [],
                isSystem: true,
                isFavorite: pref.isFavorite,
                notificationsEnabled: pref.notify,
                lastUpdated: 0,
                addedAt: 0,
                kickData: undefined // Loading state
            } as Streamer;
        });
    }, [localPreferences]);

    // Batch Processor using KickService with Retries
    const runBatchFetching = async (allStreamers: Streamer[]) => {
        // Helper to fetch single streamer
        // Note: fetchKickChannel now handles multi-proxy rotation and retries internally
        const fetchStreamerData = async (username: string) => {
            return await fetchKickChannel(username);
        };

        for (let i = 0; i < allStreamers.length; i += BATCH_SIZE) {
            const batch = allStreamers.slice(i, i + BATCH_SIZE);
            
            let batchHasError = false;

            // Process batch in parallel
            await Promise.all(batch.map(async (streamer) => {
                const data = await fetchStreamerData(streamer.kickUsername);
                
                // Check for error in response to adjust rate limit
                if (data.error) {
                    batchHasError = true;
                }

                setStreamers(prev => {
                    const index = prev.findIndex(s => s.id === streamer.id);
                    if (index === -1) return prev;

                    // Map Channel to Streamer structure
                    const updatedStreamer: Streamer = {
                        ...prev[index],
                        error: data.error, // Track error state
                        kickData: data.error ? undefined : {
                            id: 0,
                            slug: data.username,
                            user_id: 0,
                            username: data.display_name,
                            profile_pic: data.profile_pic,
                            banner: data.banner_image || '',
                            followers_count: data.followers_count || 0,
                            created_at: '',
                            bio: data.bio || ''
                        },
                        streamData: data.error ? undefined : {
                            id: 0,
                            is_live: data.is_live,
                            viewers: data.viewer_count || 0,
                            start_time: data.live_since || data.last_stream_start_time || '',
                            title: data.live_title || '',
                            category_name: data.live_category || '',
                            category_icon: '',
                            thumbnail: ''
                        },
                        // Merge Social Links
                        links: data.error ? prev[index].links : {
                            ...prev[index].links,
                            ...data.social_links as StreamerLinks
                        },
                        lastUpdated: Date.now()
                    };

                    const newList = [...prev];
                    newList[index] = updatedStreamer;
                    return sortStreamers(newList);
                });
            }));

            if (i + BATCH_SIZE < allStreamers.length) {
                // Dynamic Rate Limiting
                const dynamicDelay = batchHasError ? 3500 : MIN_BATCH_DELAY_MS;
                await new Promise(resolve => setTimeout(resolve, dynamicDelay));
            }
        }
    };

    // Retry a specific streamer immediately
    const retryStreamer = async (id: string) => {
        setStreamers(prev => prev.map(s => s.id === id ? { ...s, kickData: undefined, error: undefined } : s));
        const data = await fetchKickChannel(id);
        
        setStreamers(prev => {
            const index = prev.findIndex(s => s.id === id);
            if (index === -1) return prev;
            
            const updatedStreamer: Streamer = {
                ...prev[index],
                error: data.error,
                kickData: data.error ? undefined : {
                    id: 0, slug: data.username, user_id: 0, username: data.display_name,
                    profile_pic: data.profile_pic, banner: data.banner_image || '',
                    followers_count: data.followers_count || 0, created_at: '', bio: data.bio || ''
                },
                streamData: data.error ? undefined : {
                    id: 0, is_live: data.is_live, viewers: data.viewer_count || 0,
                    start_time: data.live_since || data.last_stream_start_time || '',
                    title: data.live_title || '', category_name: data.live_category || '', category_icon: '', thumbnail: ''
                },
                links: data.error ? prev[index].links : { ...prev[index].links, ...data.social_links as StreamerLinks },
                lastUpdated: Date.now()
            };
            
            const newList = [...prev];
            newList[index] = updatedStreamer;
            return sortStreamers(newList);
        });
    };

    // Retry all failed streamers
    const retryFailed = async () => {
        const failedStreamers = streamers.filter(s => s.error);
        // Reset their state to loading first
        setStreamers(prev => prev.map(s => s.error ? { ...s, error: undefined, kickData: undefined } : s));
        // Process them through the batch system
        await runBatchFetching(failedStreamers);
    };

    useEffect(() => {
        if (initialized) return;

        const initLoad = async () => {
            setLoading(true);
            const initialList = getStaticStreamers();
            
            const sortedInitial = initialList.sort((a, b) => (a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1));
            setStreamers(sortedInitial);

            runBatchFetching(sortedInitial);

            setLoading(false);
            setInitialized(true);
        };

        initLoad();
    }, [initialized, getStaticStreamers, sortStreamers]);

    // Background Refresh
    useEffect(() => {
        if (!initialized) return;
        const intervalId = setInterval(() => {
            runBatchFetching(streamers);
        }, REFRESH_INTERVAL_MS); 
        return () => clearInterval(intervalId);
    }, [initialized, streamers]);

    const refresh = async () => {
        setLoading(true);
        await runBatchFetching(streamers);
        setLoading(false);
    };

    const toggleFavorite = (id: string) => {
        setLocalPreferences(prev => ({
            ...prev,
            [id]: { ...prev[id], isFavorite: !prev[id]?.isFavorite }
        }));
        setStreamers(prev => {
            const updated = prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s);
            return sortStreamers(updated);
        });
    };

    const toggleNotify = async (id: string): Promise<boolean> => {
        if (!("Notification" in window)) return false;
        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return false;
        }
        setLocalPreferences(prev => ({
            ...prev,
            [id]: { ...prev[id], notify: !prev[id]?.notify }
        }));
        setStreamers(prev => prev.map(s => s.id === id ? { ...s, notificationsEnabled: !s.notificationsEnabled } : s));
        return true;
    };

    // API Functions (Mocked for Client Side)
    const submitStreamerRequest = async (username: string, tags: string, characters: string) => {
        const res = await robustFetch('/streamrequest/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, tags, characters })
        });
        if (!res.ok) throw new Error("Failed to submit request");
    };

    const getStreamerRequests = async () => {
        const res = await robustFetch('/streamerrequests');
        if (res.ok) return await res.json();
        return [];
    };

    const deleteStreamerRequest = async (id: string) => {
        await robustFetch('/streamrequest/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    };

    const acceptStreamerRequest = async (id: string, username: string, tags: string[], characters: string[]) => {
        const newStreamer: Streamer = {
            id: username,
            kickUsername: username,
            tags: tags,
            characters: characters,
            isSystem: false,
            isFavorite: false,
            notificationsEnabled: false,
            lastUpdated: 0,
            addedAt: Date.now()
        };
        setStreamers(prev => [newStreamer, ...prev]);
        
        fetchKickChannel(username).then(data => {
            if(data) {
                setStreamers(prev => {
                    const idx = prev.findIndex(s => s.id === username);
                    if(idx === -1) return prev;
                    const updated = {
                        ...prev[idx],
                        error: data.error,
                        kickData: data.error ? undefined : {
                            id: 0, slug: data.username, user_id: 0, username: data.display_name,
                            profile_pic: data.profile_pic, banner: data.banner_image || '',
                            followers_count: data.followers_count || 0, created_at: '', bio: data.bio || ''
                        },
                        streamData: data.error ? undefined : {
                            id: 0, is_live: data.is_live, viewers: data.viewer_count || 0,
                            start_time: data.live_since || '', title: data.live_title || '',
                            category_name: data.live_category || '', category_icon: '', thumbnail: ''
                        },
                        links: data.error ? prev[idx].links : { ...prev[idx].links, ...data.social_links as StreamerLinks }
                    };
                    const list = [...prev];
                    list[idx] = updated;
                    return sortStreamers(list);
                });
            }
        });
        await deleteStreamerRequest(id);
    };

    const addLocalStreamer = (streamer: Streamer) => {
        setStreamers(prev => [streamer, ...prev]);
    };

    const loadBatch = async (start: number, count: number) => {};

    return (
        <LiveContext.Provider value={{ 
            streamers, loading, refresh, loadBatch,
            totalStreamersCount: defaultStreamersList.length,
            toggleFavorite, toggleNotify,
            submitStreamerRequest,
            getStreamerRequests,
            acceptStreamerRequest,
            deleteStreamerRequest,
            addLocalStreamer,
            retryStreamer,
            retryFailed
        }}>
            {children}
        </LiveContext.Provider>
    );
};

export const useLive = () => {
    const context = useContext(LiveContext);
    if (!context) throw new Error("useLive must be used within LiveProvider");
    return context;
};