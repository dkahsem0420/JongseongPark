// 문장 속 {name}, {name아/야} 같은 자리표시자를 방문자 정보로 바꿔 줌
import { CONFIG } from '../data/config.js';
import { getVisitor } from './store.js';
import { withJosa } from './utils/josa.js';
import { esc } from './dom.js';

function vars() {
  const v = getVisitor() || { name: '', igId: '' };
  const o = CONFIG.owner;
  return {
    name: v.name || '여자친구',
    id: v.igId || '',
    owner: o.name,
    ownerFirst: o.firstName,
    ownerNick: o.nickname,
    ownerId: o.instagram,
  };
}

const RE = /\{(name|id|ownerNick|ownerFirst|ownerId|owner)([^{}]*)\}/g;

export function t(str) {
  const v = vars();
  return String(str ?? '').replace(RE, (m, key, suf) => {
    const w = v[key] ?? '';
    if (!suf) return w;
    return suf.includes('/') ? withJosa(w, suf) : w + suf;
  });
}

// HTML에 넣을 때 사용 (이름에 특수문자가 있어도 안전)
export const T = (str) => esc(t(str));
