// 잠금을 푸는 순간부터 사진을 뒤에서 미리 받아 둠 → 인스타·사진첩을 열면 바로 보임
import { IG_ACCOUNTS, IG_POSTS, IG_STORIES, IG_DMS } from './data-instagram.js';
import { PHOTOS } from './data-photos.js';
import { SONGS } from './data-music.js';

let started = false;

export function preloadImages() {
  if (started) return;
  started = true;
  const posts = [...IG_POSTS].sort((a, b) => (b.feedTop ? 1 : 0) - (a.feedTop ? 1 : 0) || String(b.at).localeCompare(String(a.at)));
  const list = [
    ...Object.values(IG_ACCOUNTS).map((a) => a.avatar),          // 프사
    ...posts.map((p) => p.image),                                 // 피드 (맨 위 게시물부터)
    ...IG_STORIES.flatMap((s) => s.items.map((i) => i.image)),    // 스토리
    ...[...PHOTOS].reverse().map((p) => p.file),                  // 사진첩 (최근 사진부터)
    ...IG_DMS.flatMap((d) => d.messages.map((m) => m.share?.image)),
    ...SONGS.map((s) => s.cover),                                 // 음악 커버
  ].filter((f) => f && !/\.(mp4|mov|webm)$/i.test(f));
  const queue = [...new Set(list)];

  // 동시에 3장씩 차례대로
  const next = () => {
    const f = queue.shift();
    if (!f) return;
    const img = new Image();
    img.decoding = 'async';
    img.onload = img.onerror = next;
    img.src = f;
  };
  for (let i = 0; i < 3; i++) next();
}
