// 한국어 조사 자동 처리 (받침 유무에 따라 이/가, 아/야, 이랑/랑 …)

// 0 = 받침 없음, 8 = ㄹ 받침, 그 외 = 받침 있음
export function finalCode(word) {
  const s = String(word ?? '').trim();
  for (let i = s.length - 1; i >= 0; i--) {
    const ch = s[i];
    const c = ch.charCodeAt(0);
    if (c >= 0xac00 && c <= 0xd7a3) return (c - 0xac00) % 28;
    if (/[0-9]/.test(ch)) return '178'.includes(ch) ? 8 : '036'.includes(ch) ? 1 : 0;
    if (/[a-zA-Z]/.test(ch)) {
      const l = ch.toLowerCase();
      if (l === 'l') return 8;
      return 'mnkpbdgt'.includes(l) ? 1 : 0;
    }
    // 공백·이모지·문장부호는 건너뛰고 앞 글자를 봄
  }
  return 0;
}

export const hasBatchim = (word) => finalCode(word) !== 0;

// spec 예: '이/가', '아/야', '이랑/랑', '이/', '으로/로'
export function withJosa(word, spec) {
  const [a, b = ''] = spec.split('/');
  const f = finalCode(word);
  if (a.startsWith('으로')) return word + (f === 0 || f === 8 ? b : a);
  return word + (f !== 0 ? a : b);
}
