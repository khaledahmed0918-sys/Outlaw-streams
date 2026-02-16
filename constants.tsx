import React from 'react';
import { 
  Search, Bell, BellOff, Star, Video, X, Wifi, 
  Eye, Play, Users, Link, Tv, ExternalLink, Globe,
  Twitter, Youtube, Instagram, MessageCircle
} from 'lucide-react';

// Custom TikTok Icon since it might not be in the Lucide version
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const defaultStreamersList = [
  "https://kick.com/5ald",
  "https://kick.com/irellax",
  "https://kick.com/7arith",
  "https://kick.com/S0VE",
  "https://kick.com/idew",
  "https://kick.com/id7d7",
  "https://kick.com/1saadx",
  "https://kick.com/fttir",
  "https://kick.com/Dahrooj",
  "https://kick.com/rashed7cr", 
  "https://kick.com/Maramjk",
  "https://kick.com/mezaar",
  "https://kick.com/11hussin",
  "https://kick.com/d7dn",
  "https://kick.com/only3bed",
  "https://kick.com/iclassie",
  "https://kick.com/dozaro",
  "https://kick.com/rsyq",
  "https://kick.com/i_nax",
  "https://kick.com/txlal",
  "https://kick.com/lsalman",
  "https://kick.com/il7rkaz",
  "https://kick.com/osamaaah",
  "https://kick.com/alqallaf",
  "https://kick.com/imod",
  "https://kick.com/abu_samrah",
  "https://kick.com/uhaj",
  "https://kick.com/1beki",
  "https://kick.com/xellily",
  "https://kick.com/hessa_ha",
  "https://kick.com/iHIMO",
  "https://kick.com/iaz00zi",
  "https://kick.com/jlaad",
  "https://kick.com/iiryoof",
  "https://kick.com/mjbor",
  "https://kick.com/fwaz",
  "https://kick.com/inq", 
  "https://kick.com/2lovx",
  "https://kick.com/7qof",
  "https://kick.com/perfct",
  "https://kick.com/r3dulz",
  "https://kick.com/ltxmax",
  "https://kick.com/aboalfz",
  "https://kick.com/SKY7C",
  "https://kick.com/suul3",
  "https://kick.com/sxb",
  "https://kick.com/lunedee",
  "https://kick.com/mo7x"
];

export const Icons = {
  Search,
  Bell,
  BellOff,
  Star,
  Video,
  X,
  Wifi,
  Eye,
  Play,
  Users,
  Link,
  Kick: Tv, // Using TV icon as Kick placeholder
  Discord: MessageCircle,
  Twitter,
  YouTube: Youtube,
  Instagram,
  ExternalLink,
  Globe,
  TikTok: TikTokIcon
};

export const translations = {
  en: {
    live: "LIVE",
    offline: "OFFLINE",
    viewers: "Viewers",
    streamTitle: "Stream Title",
    noBio: "No bio available.",
    watchChannel: "Watch Channel",
    watchStream: "Watch Stream",
    liveNow: "Live Now",
    about: "About",
    characters: "Characters",
    socials: "Socials",
    followers: "Followers",
    searchLive: "Search streamers...",
    navLive: "Live Streams",
    navLinks: "Links",
    footerFounded: "Founded by",
    footerDev: "Developed by",
    footerContrib: "Contributors",
    linksTitle: "Social Media Links",
    linksDesc: "Official resources and community links",
    founderName: "Outlaw News",
    devName: "Mohammed",
    footerDesc: "Professional streaming news providing real-time updates for the community.",
    openLink: "OPEN LINK",
    rights: "All rights reserved.",
    twitter: "Twitter",
    twitterComm: "Twitter Community",
    tiktok: "TikTok",
    discord: "Discord Server"
  },
  ar: {
    live: "مباشر",
    offline: "غير متصل",
    viewers: "مشاهد",
    streamTitle: "عنوان البث",
    noBio: "لا يوجد نبذة تعريفية.",
    watchChannel: "شاهد القناة",
    watchStream: "شاهد البث",
    liveNow: "مباشر الآن",
    about: "نبذة",
    characters: "الشخصيات",
    socials: "التواصل الاجتماعي",
    followers: "متابع",
    searchLive: "ابحث عن ستريمر...",
    navLive: "البثوث المباشرة",
    navLinks: "الروابط",
    footerFounded: "المؤسس",
    footerDev: "برمجة وتطوير",
    footerContrib: "المساهمون",
    linksTitle: "روابط التواصل الاجتماعي",
    linksDesc: "المصادر الرسمية وروابط المجتمع",
    founderName: "Outlaw News",
    devName: "Mohammed",
    footerDesc: "اخبار بثوث احترافية توفر تحديثات في الوقت الفعلي للمجتمع.",
    openLink: "فتح الرابط",
    rights: "جميع الحقوق محفوظة.",
    twitter: "تويتر",
    twitterComm: "مجتمع تويتر",
    tiktok: "تيك توك",
    discord: "سيرفر الديسكورد"
  }
};