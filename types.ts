export interface StreamerLinks {
  twitter?: string;
  youtube?: string;
  instagram?: string;
  discord?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface KickChannelInfo {
  id: number;
  slug: string;
  user_id: number;
  username: string;
  profile_pic: string;
  banner: string;
  followers_count: number;
  created_at: string;
  bio: string;
}

export interface KickStreamInfo {
  id: number;
  is_live: boolean;
  viewers: number;
  start_time: string;
  title: string;
  category_name: string;
  category_icon: string;
  thumbnail: string;
}

export interface Streamer {
  id: string;
  kickUsername: string;
  tags: string[];
  characters?: string[];
  isSystem: boolean;
  isFavorite: boolean;
  notificationsEnabled: boolean;
  lastUpdated: number;
  addedAt: number;
  kickData?: KickChannelInfo;
  streamData?: KickStreamInfo;
  links?: StreamerLinks;
  customTitle?: string;
}

export interface Channel {
  username: string;
  display_name: string;
  profile_pic: string;
  is_live: boolean;
  live_title: string | null;
  viewer_count: number | null;
  live_since: string | null;
  last_stream_start_time: string | null;
  live_url: string;
  profile_url: string;
  bio: string | null;
  followers_count: number | null;
  banner_image: string | null;
  live_category: string | null;
  social_links: { [key: string]: string };
  isLoading: boolean;
  error?: boolean;
  last_checked_at: string;
}

export interface KickApiResponse {
  checked_at: string;
  data: Channel[];
}

export interface StreamerRequest {
  id: string;
  username: string;
  tags: string;
  characters: string;
  votes: number;
}