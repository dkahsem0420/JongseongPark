export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const $ = (sel, root = document) => root.querySelector(sel);

// PC에서 폰 프레임이 축소돼 있을 때의 배율
export function screenScale() {
  const s = document.getElementById('screen');
  return s.getBoundingClientRect().width / s.offsetWidth || 1;
}
