// 사람 이름·프로필 사진 처리
// 'gf' → '{name} ♡', 'mom' → '엄마', 'dad' → '아빠', 'me' → 박종성, 그 외는 적힌 이름 그대로
import { CONFIG } from './config.js';
import { t } from './text.js';
import { esc } from './dom.js';

export function personName(key) {
  const c = CONFIG.contacts;
  if (key === 'gf') return t(c.gf);
  if (key === 'mom') return c.mom;
  if (key === 'dad') return c.dad;
  if (key === 'me') return CONFIG.owner.name;
  return t(key);
}

// 프로필 사진: config.js 의 avatars 에 { gf: 'gf.jpg', '박성훈': 'sh.jpg' } 처럼 적으면 사용
export const avatarSrc = (key) => (CONFIG.avatars || {})[key] || '';

const SILHOUETTE = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15.5" r="7.2" fill="currentColor"/><path d="M6.5 37c1.4-7.6 7-11.6 13.5-11.6S32.1 29.4 33.5 37z" fill="currentColor"/></svg>`;

// 사진이 있으면 사진, 없으면 기본 사람 모양
export function avatarHtml(key) {
  const src = avatarSrc(key);
  // 사진 파일이 없거나 이름이 틀리면 사진이 지워지고 뒤의 기본 모양이 보임
  return src
    ? `${SILHOUETTE}<img class="av-img" src="${esc(src)}" alt="" draggable="false" onerror="this.remove()">`
    : SILHOUETTE;
}
