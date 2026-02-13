import type { Channel, KickApiResponse } from '../types';

// --- IMPORTANT ---
// This is a client-side implementation.
// Kick's API is protected by Cloudflare. Direct client-side calls often fail (CORS).
// We use a rotation of CORS proxies to attempt to bypass this.

const DEFAULT_PROFILE_PIC = 'https://picsum.photos/150/150';

// List of proxies to try in order. 
// "corsproxy.io" is usually best but can be blocked.
// "api.allorigins.win" is a good fallback.
const PROXY_LIST = [
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

/**
 * Extracts a clean username from a string, which can be a username or a full Kick URL.
 */
export const extractUsername = (input: string): string => {
    if (input.includes('kick.com/')) {
        return input.split('/').pop()?.split('?')[0].split('#')[0] || input;
    }
    return input;
};

/**
 * Helper to fetch with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { 
            ...options, 
            signal: controller.signal,
            // Try to avoid sending referrer to keep traffic looking cleaner to the proxy
            referrerPolicy: 'no-referrer' 
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

/**
 * Returns a default/error channel object to prevent UI crashes
 */
const getSafeChannelObj = (username: string, error = false): Channel => ({
      username: username,
      display_name: username,
      profile_pic: DEFAULT_PROFILE_PIC,
      is_live: false,
      live_title: null,
      viewer_count: null,
      live_since: null,
      last_stream_start_time: null,
      live_url: `https://kick.com/${username}`,
      profile_url: `https://kick.com/${username}`,
      error: error,
      last_checked_at: new Date().toISOString(),
      bio: null,
      followers_count: null,
      banner_image: null,
      live_category: null,
      social_links: {},
      isLoading: false,
});

/**
 * Fetches data for a single Kick channel using multi-proxy rotation.
 */
export const fetchKickChannel = async (originalUsername: string): Promise<Channel> => {
  const timestamp = Date.now();
  // We append a timestamp to the Kick URL to prevent the Proxy from returning cached stale data
  const targetUrl = `https://kick.com/api/v1/channels/${originalUsername}?_=${timestamp}`;
  
  let data: any = null;
  let usedProxyIndex = -1;

  // 1. Try fetching main channel data using proxy rotation
  for (let i = 0; i < PROXY_LIST.length; i++) {
      try {
          const proxyUrl = PROXY_LIST[i](targetUrl);
          // 6s timeout per proxy to allow failover reasonably quickly
          const response = await fetchWithTimeout(proxyUrl, {}, 6000); 
          
          if (response.status === 404) {
              // Valid 404 from Kick means user doesn't exist. Don't retry.
              return getSafeChannelObj(originalUsername, false);
          }

          if (!response.ok) continue; // Server error or proxy error, try next

          const json = await response.json();
          if (json && json.user) {
              data = json;
              usedProxyIndex = i;
              break; // Success!
          }
      } catch (e) {
          // Network error or timeout, try next proxy
          continue;
      }
  }

  // If no data found after all proxies
  if (!data) {
      console.warn(`All proxies failed for ${originalUsername}`);
      return getSafeChannelObj(originalUsername, true);
  }

  // 2. Process Data
  try {
      const isLive = data.livestream !== null;
      let lastStreamStartTime = null;

      // Try fetching previous livestreams/videos if not live to get "Last Seen" data
      if (!isLive) {
          // Use the proxy that worked for the main request, or fallback to first
          const proxyFn = usedProxyIndex >= 0 ? PROXY_LIST[usedProxyIndex] : PROXY_LIST[0];
          
          // Strategy A: Check data.previous_livestreams (often included in channel payload)
          if (data.previous_livestreams && data.previous_livestreams.length > 0) {
              lastStreamStartTime = data.previous_livestreams[0].start_time;
          } else {
               // Strategy B: Fetch videos endpoint
               try {
                   const videosUrl = `https://kick.com/api/v2/channels/${originalUsername}/videos?_=${timestamp}`;
                   const vResponse = await fetchWithTimeout(proxyFn(videosUrl), {}, 5000);
                   if (vResponse.ok) {
                       const vData = await vResponse.json();
                       if (vData && vData.length > 0) {
                           lastStreamStartTime = vData[0].created_at;
                       }
                   }
               } catch (e) { /* ignore video fetch error, it's optional data */ }
          }
      }

      const socialLinks: { [key: string]: string } = {};
      if (data.user?.twitter) socialLinks.twitter = data.user.twitter;
      if (data.user?.youtube) socialLinks.youtube = data.user.youtube;
      if (data.user?.instagram) socialLinks.instagram = data.user.instagram;
      if (data.user?.discord) socialLinks.discord = data.user.discord;
      if (data.user?.tiktok) socialLinks.tiktok = data.user.tiktok;

      const followersCount = data.followers_count ?? data.followersCount ?? data.user?.followers_count ?? 0;

      return {
          username: originalUsername,
          display_name: data.user.username || originalUsername, 
          profile_pic: data.user.profile_pic || DEFAULT_PROFILE_PIC,
          is_live: isLive,
          live_title: data.livestream?.session_title || null,
          viewer_count: data.livestream?.viewer_count ?? null,
          live_since: data.livestream?.start_time || null,
          last_stream_start_time: lastStreamStartTime,
          live_url: `https://kick.com/${originalUsername}`,
          profile_url: `https://kick.com/${originalUsername}`,
          bio: data.user.bio || null,
          followers_count: Number(followersCount),
          banner_image: data.banner_image?.url || null,
          live_category: data.livestream?.category?.name || null,
          social_links: socialLinks,
          isLoading: false,
          last_checked_at: new Date().toISOString(),
      };

  } catch (error) {
      console.error(`Error processing data for ${originalUsername}`, error);
      return getSafeChannelObj(originalUsername, true);
  }
};

/**
 * Legacy support
 */
export const fetchChannelStatuses = async (streamers: any[]) => {
    return { checked_at: new Date().toISOString(), data: [] };
};