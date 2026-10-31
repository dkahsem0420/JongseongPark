// 날짜·시간 표기 도우미 (기준: 이야기 속 현재 = 2026-11-01 21:41)
import { CONFIG } from './config.js';
import { storyMinutes } from './clock.js';

export const WEEKDAY = '일월화수목금토';

// '2026-10-30 14:12' → Date
export function parseDT(s) {
  const [d, tm = '00:00'] = String(s).trim().split(/\s+/);
  const [y, m, dd] = d.split('-').map(Number);
  const [h, mi] = tm.split(':').map(Number);
  return new Date(y, m - 1, dd, h || 0, mi || 0);
}

export function now() {
  const [y, m, d] = CONFIG.story.date.split('-').map(Number);
  const x = storyMinutes();
  return new Date(y, m - 1, d, Math.floor(x / 60), x % 60);
}

const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const daysAgo = (d) => Math.round((dayStart(now()) - dayStart(d)) / 86400000);

// 오후 9:41
export function ampm(d) {
  const h = d.getHours();
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 카카오톡 채팅 목록: 오후 9:41 / 어제 / 10월 30일
export function kakaoListLabel(d) {
  const k = daysAgo(d);
  if (k <= 0) return ampm(d);
  if (k === 1) return '어제';
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// iOS 목록(전화·메시지·메모): 오후 9:41 / 어제 / 금요일 / 26. 10. 24.
export function iosListLabel(d) {
  const k = daysAgo(d);
  if (k <= 0) return ampm(d);
  if (k === 1) return '어제';
  if (k < 7) return `${WEEKDAY[d.getDay()]}요일`;
  return `${String(d.getFullYear()).slice(2)}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

// 2026년 10월 30일 금요일
export const fullDate = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAY[d.getDay()]}요일`;

// 메시지 앱 대화 중간 시간 표시
export function imsgStamp(d) {
  const k = daysAgo(d);
  const t = ampm(d);
  if (k <= 0) return `오늘 ${t}`;
  if (k === 1) return `어제 ${t}`;
  if (k < 7) return `${WEEKDAY[d.getDay()]}요일 ${t}`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]}) ${t}`;
}

// '2:14:09' / '6:31' / '0:42' → 초
export function toSeconds(s) {
  if (!s) return 0;
  return String(s).split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
}

// 통화 시간: 2시간 14분 / 6분 31초 / 42초
export function durationKo(s) {
  const sec = toSeconds(s);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), r = sec % 60;
  if (h) return `${h}시간 ${m}분`;
  if (m) return r ? `${m}분 ${r}초` : `${m}분`;
  return `${r}초`;
}
