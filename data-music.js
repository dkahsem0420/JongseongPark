// ─────────────────────────────────────────────
//  음악 앱 (보관함)
// ─────────────────────────────────────────────
//  음원은 직접 올리지 않고, 재생 화면에서 Apple Music / YouTube 검색으로 연결합니다.
//  length : 재생 화면 진행 막대용 길이 '분:초' (대략값이라 정확히 고쳐도 돼요)
//  cover  : 커버 이미지 파일 이름. 이 이름으로 사진을 올리면 자동 적용 (없으면 색 그라데이션)

export const SONGS = [
  // ── 종성 보관함 (0~4) ──
  { title: 'Dried Flower',              artist: 'Yuuri',       length: '4:50', cover: 'cover-dried-flower.jpg' },
  { title: 'Save Yourself',             artist: 'ONE OK ROCK', length: '3:50', cover: 'cover-save-yourself.jpg' },
  { title: 'Englishman in New York',    artist: 'Sting',       length: '4:25', cover: 'cover-englishman.jpg' },
  { title: "Don't Look Back in Anger",  artist: 'Oasis',       length: '4:48', cover: 'cover-dont-look-back.jpg' },
  { title: 'Beloved',                   artist: 'GLAY',        length: '5:30', cover: 'cover-beloved.jpg' },

  // ── 여주 플레이리스트용 (5~10) ── library: false → 보관함 '노래' 목록에는 안 나오고 재생목록에만
  //    메모 '옛날 노래나 인디음악 플레이리스트 찾아두기' 를 보고 종성이 모아 둔 곡
  { title: '사랑했지만',               artist: '김광석',     length: '4:10', cover: 'cover-gf-1.jpg', library: false },
  { title: '소녀',                     artist: '이문세',     length: '3:40', cover: 'cover-gf-2.jpg', library: false },
  { title: '사랑하기 때문에',           artist: '유재하',     length: '4:30', cover: 'cover-gf-3.jpg', library: false },
  { title: 'Everything',               artist: '검정치마',   length: '4:40', cover: 'cover-gf-4.jpg', library: false },
  { title: '주저하는 연인들을 위해',     artist: '잔나비',     length: '4:30', cover: 'cover-gf-5.jpg', library: false },
  { title: '위잉위잉',                 artist: '혁오',       length: '4:20', cover: 'cover-gf-6.jpg', library: false },
];

// 재생목록 (보관함의 카드 → 누르면 재생목록 화면)
//  songs : 위 SONGS 의 순서 번호 (0부터 시작)
export const PLAYLISTS = [
  { title: '{name} 플레이리스트', songs: [5, 6, 7, 8, 9, 10] },
  { title: '운전할 때', songs: [1, 3, 4] },
];
