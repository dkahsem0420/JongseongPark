// 한글 이름 → 영문 (국어의 로마자 표기법 기반, 인스타 아이디 추천용)

const INI = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const MED = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const FIN = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];

export function romanize(text) {
  let out = '';
  let prevFinal = '';
  for (const ch of String(text ?? '')) {
    const c = ch.charCodeAt(0);
    if (c >= 0xac00 && c <= 0xd7a3) {
      const n = c - 0xac00;
      let ini = INI[Math.floor(n / 588)];
      if (ini === 'r' && (out === '' || prevFinal === 'l')) ini = out === '' ? 'r' : 'l';
      const syl = ini + MED[Math.floor((n % 588) / 28)] + FIN[n % 28];
      prevFinal = FIN[n % 28];
      out += syl;
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      out += ch.toLowerCase();
      prevFinal = '';
    }
  }
  return out;
}

export function suggestIds(name) {
  const r = romanize(name).replace(/[^a-z0-9]/g, '').slice(0, 20);
  if (!r) return [];
  return [r, `${r}_`, `${r}.04`, `_${r}_`];
}

export const cleanId = (s) => String(s ?? '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
