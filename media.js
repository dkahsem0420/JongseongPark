// 사진·영상 자리 공통 도우미
// 파일이 있으면 사진(또는 .mp4 영상), 없으면 설명이 적힌 색 칸
import { esc } from './dom.js';

export function hueOf(seed) {
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export const isVideo = (f) => /\.(mp4|mov|webm)$/i.test(f || '');

/**
 * @param {string} file   파일 이름
 * @param {string} alt    파일이 없을 때 보일 설명
 * @param {object} [o]
 * @param {boolean} [o.thumb]   썸네일(작은 칸)이면 영상 자동재생 안 함
 * @param {boolean} [o.contain] 전체화면 보기처럼 잘리지 않게
 */
export function mediaHtml(file, alt, { thumb = false, contain = false } = {}) {
  const fit = contain ? ' contain' : '';
  let m = '';
  if (file && isVideo(file)) {
    m = thumb
      ? `<video src="${esc(file)}#t=0.1" muted playsinline preload="metadata" onerror="this.remove()"></video>`
      : `<video src="${esc(file)}" autoplay muted loop playsinline controls onerror="this.remove()"></video>`;
  } else if (file) {
    m = `<img src="${esc(file)}" alt="" draggable="false" onerror="this.remove()">`;
  }
  return `<span class="mph${fit}" style="--h:${hueOf(file || alt)}"><span class="mph-label">${esc(alt || '')}</span>${m}</span>`;
}
