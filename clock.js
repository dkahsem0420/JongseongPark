// 이야기 속 시간: 항상 2026년 11월 1일 21:41에서 시작
import { CONFIG } from './config.js';

const T0_KEY = 'jsphone.t0';

function startedAt() {
  try {
    let v = sessionStorage.getItem(T0_KEY);
    if (!v) { v = String(Date.now()); sessionStorage.setItem(T0_KEY, v); }
    return +v;
  } catch {
    return (window.__jsT0 ||= Date.now());
  }
}

export function storyMinutes() {
  const [h, m] = CONFIG.story.time.split(':').map(Number);
  let x = h * 60 + m;
  if (CONFIG.story.clockRuns) {
    const t0 = startedAt();
    x += Math.floor(Math.max(0, Date.now() - t0) / 60000);
  }
  return Math.min(x, 23 * 60 + 59);
}

export function storyTime() {
  const x = storyMinutes();
  return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`;
}

const ymd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const storyDate = () => ymd(CONFIG.story.date);
export const WEEK = '일월화수목금토';

export function storyDateLabel() {
  const d = storyDate();
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEK[d.getDay()]}요일`;
}

// 사귄 날을 1일로 셈
export function ddayCount() {
  return Math.round((storyDate() - ymd(CONFIG.couple.startDate)) / 86400000) + 1;
}

export function formatDot(s) {
  const d = ymd(s);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
