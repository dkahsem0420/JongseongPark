// 기본 앱 아이콘 — iOS 느낌으로 직접 그린 SVG입니다 (공식 로고 복제 아님).
// 다른 아이콘을 쓰고 싶으면 data/apps.js 에서 image 경로를 지정하세요.
import { CONFIG } from '../data/config.js';
import { storyDate, storyMinutes, WEEK } from './clock.js';

const svg = (inner) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
const lin = (id, stops, x2 = 0, y2 = 1) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map((c, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${c}"/>`)
    .join('')}</linearGradient></defs>`;

const HANDSET =
  'M22.6 15.5c-1.5 0-3.8 1.7-4.4 3.8-1 3.5.7 9.3 6.3 15 5.8 5.8 11.8 7.6 15.3 6.6 2.1-.6 3.8-2.9 3.8-4.4 0-.8-.5-1.5-1.3-1.9l-4.8-2.7c-.8-.4-1.8-.3-2.4.4l-1.7 1.9c-.4.4-1 .5-1.5.2-1.6-.9-3.3-2.3-4.8-3.7-1.4-1.5-2.8-3.2-3.7-4.8-.3-.5-.2-1.1.2-1.5l1.9-1.7c.7-.6.8-1.6.4-2.4l-2.7-4.8c-.4-.8-1.1-1.3-1.9-1.3z';

export const ICONS = {
  phone: () => svg(`${lin('gPh', ['#62F57B', '#14C033'])}<rect width="60" height="60" fill="url(#gPh)"/><path d="${HANDSET}" fill="#fff"/>`),

  messages: () =>
    svg(`${lin('gMs', ['#66F37E', '#12BE31'])}<rect width="60" height="60" fill="url(#gMs)"/>
      <path d="M30 13.5c-10.8 0-19.5 7.1-19.5 15.8 0 5 2.9 9.5 7.4 12.3-.4 2.4-1.7 4.5-3.5 6 3.4.2 6.7-.9 9.2-3 2 .5 4.1.8 6.4.8 10.8 0 19.5-7.1 19.5-15.9S40.8 13.5 30 13.5z" fill="#fff"/>`),

  kakao: () =>
    svg(`<rect width="60" height="60" fill="#FFE312"/>
      <path d="M30 14c-10.5 0-19 6.6-19 14.8 0 5.2 3.5 9.8 8.7 12.4l-1.9 6.6c-.2.6.5 1.1 1 .7l7.6-5.1c1.2.2 2.4.2 3.6.2 10.5 0 19-6.6 19-14.8S40.5 14 30 14z" fill="#3B2A28"/>
      <circle cx="22.5" cy="29" r="2.4" fill="#FFE312"/><circle cx="30" cy="29" r="2.4" fill="#FFE312"/><circle cx="37.5" cy="29" r="2.4" fill="#FFE312"/>`),

  photos: () =>
    svg(`<rect width="60" height="60" fill="#fff"/>
      <rect x="11" y="15" width="38" height="30" rx="5" fill="#EAF4FF"/>
      <circle cx="39.5" cy="23.5" r="4" fill="#FFB020"/>
      <path d="M11 39l10-11 7 7.5 5-5 16 13.5V40a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5z" fill="#34C759"/>
      <path d="M28 35.5l5-5 16 13.5c-.8.6-2 1-3 1H22z" fill="#1E9E4A"/>`),

  calendar: () => {
    const d = storyDate();
    return svg(`<rect width="60" height="60" fill="#fff"/>
      <text x="30" y="17.5" text-anchor="middle" font-size="9.5" font-weight="600" fill="#FF3B30" font-family="-apple-system,system-ui,sans-serif">${WEEK[d.getDay()]}요일</text>
      <text x="30" y="47" text-anchor="middle" font-size="31" font-weight="300" fill="#111" font-family="-apple-system,system-ui,sans-serif">${d.getDate()}</text>`);
  },

  instagram: () =>
    svg(`${lin('gIg', ['#FFC85A', '#FA7E1E', '#E1306C', '#A23BC7', '#5B5BD6'], 1, 1)}<rect width="60" height="60" fill="url(#gIg)"/>
      <rect x="22" y="15" width="11" height="6" rx="2" fill="#fff"/>
      <rect x="14" y="19.5" width="32" height="24" rx="6.5" fill="none" stroke="#fff" stroke-width="3.4"/>
      <circle cx="30" cy="31.5" r="6.6" fill="none" stroke="#fff" stroke-width="3.4"/>
      <circle cx="40" cy="25" r="1.8" fill="#fff"/>`),

  music: () =>
    svg(`${lin('gMu', ['#FF6B82', '#F7253F'])}<rect width="60" height="60" fill="url(#gMu)"/>
      <path d="M24 18.5l17-4v5l-17 4z" fill="#fff"/>
      <rect x="24" y="19" width="3" height="22.5" fill="#fff"/><rect x="38" y="15" width="3" height="23.5" fill="#fff"/>
      <ellipse cx="21.5" cy="41.5" rx="5.6" ry="4.5" fill="#fff"/><ellipse cx="35.5" cy="38.5" rx="5.6" ry="4.5" fill="#fff"/>`),

  notes: () =>
    svg(`${lin('gNt', ['#FFDA45', '#FFC400'])}<rect width="60" height="60" fill="#fff"/>
      <rect width="60" height="16" fill="url(#gNt)"/>
      <path d="M8 16.5h44" stroke="#E2B100" stroke-width="1"/>
      ${[27, 35, 43, 51].map((y) => `<path d="M8 ${y}h44" stroke="#DADADF" stroke-width="1.2"/>`).join('')}`),

  safari: () =>
    svg(`${lin('gSfB', ['#ffffff', '#E7E7EC'])}${lin('gSf', ['#2BD2FF', '#1F6BF2'])}
      <rect width="60" height="60" fill="url(#gSfB)"/>
      <circle cx="30" cy="30" r="22" fill="url(#gSf)"/>
      ${Array.from({ length: 24 }, (_, i) => `<path d="M30 9.5v${i % 6 ? 2.2 : 3.4}" stroke="#fff" stroke-width="${i % 6 ? 0.8 : 1.3}" transform="rotate(${i * 15} 30 30)" opacity=".85"/>`).join('')}
      <g transform="rotate(45 30 30)"><path d="M30 13l3.6 17h-7.2z" fill="#FF3B30"/><path d="M30 47l3.6-17h-7.2z" fill="#fff"/></g>`),

  clock: () => {
    const x = storyMinutes();
    const h = ((Math.floor(x / 60) % 12) + (x % 60) / 60) * 30;
    const m = (x % 60) * 6;
    return svg(`<rect width="60" height="60" fill="#111"/>
      <circle cx="30" cy="30" r="24" fill="#fff"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M30 8.5v3" stroke="#111" stroke-width="1.6" transform="rotate(${i * 30} 30 30)"/>`).join('')}
      <path d="M30 30V18" stroke="#111" stroke-width="2.6" stroke-linecap="round" transform="rotate(${h} 30 30)"/>
      <path d="M30 30V11.5" stroke="#111" stroke-width="1.8" stroke-linecap="round" transform="rotate(${m} 30 30)"/>
      <path d="M30 34V12" stroke="#FF9500" stroke-width=".9" transform="rotate(200 30 30)"/>
      <circle cx="30" cy="30" r="1.8" fill="#FF9500"/>`);
  },

  settings: () =>
    svg(`${lin('gSt', ['#D9D9DE', '#8F8F96'])}<rect width="60" height="60" fill="url(#gSt)"/>
      <g fill="#48484D">${Array.from({ length: 12 }, (_, i) => `<rect x="27.6" y="8" width="4.8" height="9" rx="1.4" transform="rotate(${i * 30} 30 30)"/>`).join('')}
      <circle cx="30" cy="30" r="15.5"/></g>
      <circle cx="30" cy="30" r="11" fill="#9C9CA2"/><circle cx="30" cy="30" r="5.5" fill="#48484D"/>`),
};

// 상태 표시줄·잠금화면 등에 쓰는 작은 아이콘
export const GLYPH = {
  signal: `<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>`,
  wifi: `<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .6C5.2.6 2.7 1.7.8 3.5L2 4.8a8.6 8.6 0 0 1 6-2.4z" fill="currentColor"/><path d="M8 5.9c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 4.1 7 7 0 0 0 3.2 6l1.2 1.3c1-.9 2.2-1.4 3.6-1.4z" fill="currentColor"/><path d="M8 9.4c.5 0 1 .2 1.3.5L8 11.4 6.7 9.9c.3-.3.8-.5 1.3-.5z" fill="currentColor"/><path d="M8 7.6a4 4 0 0 1 2.4.8L8 11.2 5.6 8.4A4 4 0 0 1 8 7.6z" fill="currentColor"/></svg>`,
  battery: (p) =>
    `<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="${(20 * p) / 100}" height="9" rx="2.4" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill="currentColor" opacity=".45"/></svg>`,
  padlock: `<svg width="16" height="21" viewBox="0 0 16 21"><path d="M3.5 9V6a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="1" y="8.5" width="14" height="11.5" rx="2.5" fill="currentColor"/></svg>`,
  flashlight: `<svg width="20" height="24" viewBox="0 0 20 24"><path d="M5 1h10v4l-2.5 4v13a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V9L5 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="10" cy="13" r="1.4" fill="currentColor"/></svg>`,
  camera: `<svg width="24" height="20" viewBox="0 0 24 20"><path d="M3 5h4l2-3h6l2 3h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="11.5" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  search: `<svg width="15" height="15" viewBox="0 0 15 15"><circle cx="6.3" cy="6.3" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 10l4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  chevronLeft: `<svg width="12" height="21" viewBox="0 0 12 21"><path d="M10.5 1.5l-9 9 9 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronRight: `<svg width="8" height="13" viewBox="0 0 8 13"><path d="M1.5 1.5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

// 설정 앱 목록용 작은 색 아이콘
export const ROW_ICON = {
  airplane: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M21 15.5v-1.8l-7.5-4.6V4a1.5 1.5 0 0 0-3 0v5.1L3 13.7v1.8l7.5-2.3v4.9l-2 1.5V21l3.5-1 3.5 1v-1.4l-2-1.5v-4.9z" fill="#fff"/></svg>`,
  wifi: `<svg viewBox="0 0 16 12" width="17" height="13"><path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .6C5.2.6 2.7 1.7.8 3.5L2 4.8a8.6 8.6 0 0 1 6-2.4zM8 5.9c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 4.1 7 7 0 0 0 3.2 6l1.2 1.3c1-.9 2.2-1.4 3.6-1.4zM8 7.6a4 4 0 0 1 2.4.8L8 11.2 5.6 8.4A4 4 0 0 1 8 7.6z" fill="#fff"/></svg>`,
  bluetooth: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M7 7l10 10-5 4V3l5 4L7 17" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`,
  cellular: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="12" r="2.2" fill="#fff"/><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" fill="#fff"/></svg>`,
  sound: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="#fff"/></svg>`,
  hourglass: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M6 3h12v3.5L13.5 12l4.5 5.5V21H6v-3.5l4.5-5.5L6 6.5z" fill="#fff"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" width="18" height="18"><g fill="#fff">${Array.from({ length: 8 }, (_, i) => `<rect x="10.6" y="2" width="2.8" height="5" rx=".8" transform="rotate(${i * 45} 12 12)"/>`).join('')}<circle cx="12" cy="12" r="6.6"/></g><circle cx="12" cy="12" r="2.6" fill="#8E8E93"/></svg>`,
  wallpaper: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 3l2.2 4.5L19 8.2l-3.5 3.4.8 4.9L12 14.2l-4.3 2.3.8-4.9L5 8.2l4.8-.7z" fill="#fff"/></svg>`,
  person: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="8.5" r="4" fill="#fff"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0z" fill="#fff"/></svg>`,
  lock: `<svg viewBox="0 0 16 21" width="12" height="16"><path d="M3.5 9V6a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="#fff" stroke-width="2"/><rect x="1" y="8.5" width="14" height="11.5" rx="2.5" fill="#fff"/></svg>`,
  reset: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M4 3.5V8h4.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export function appIconHtml(app) {
  if (app.image) return `<img src="${app.image}" alt="" draggable="false">`;
  return (ICONS[app.icon] || ICONS.settings)();
}

export const batteryGlyph = () => GLYPH.battery(CONFIG.batteryPercent);
