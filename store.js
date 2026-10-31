// 방문자 이름·아이디를 이 브라우저(localStorage)에만 저장. 서버로 보내지 않음.

const KEY = 'jsphone.visitor.v1';
let memVisitor = null;
let memUnlocked = false;
const listeners = new Set();

export function getVisitor() {
  let v = memVisitor;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) v = JSON.parse(raw);
  } catch { /* 저장소를 쓸 수 없는 환경이면 메모리 값 사용 */ }
  return v && v.name ? v : null;
}

export function setVisitor(v) {
  memVisitor = { name: String(v.name).trim(), igId: String(v.igId || '').trim() };
  try { localStorage.setItem(KEY, JSON.stringify(memVisitor)); } catch {}
  listeners.forEach((f) => f(memVisitor));
}

export function clearVisitor() {
  memVisitor = null;
  try { localStorage.removeItem(KEY); } catch {}
  listeners.forEach((f) => f(null));
}

export const onVisitorChange = (f) => listeners.add(f);

// 잠금 해제 여부는 저장하지 않음 → 새로고침하거나 다시 들어오면 항상 잠금화면부터
export const session = {
  get unlocked() { return memUnlocked; },
  set unlocked(v) { memUnlocked = !!v; },
};
