// ─────────────────────────────────────────────
//  사진 앱
// ─────────────────────────────────────────────
//  file   : 올릴 사진(.jpg) 또는 영상(.mp4) 파일 이름
//  alt    : 사진이 없을 때 회색 칸에 보이는 설명 (어떤 사진이 들어갈 자리인지)
//  at     : 찍은 날짜·시간 (보관함은 오래된 것 → 최신 순으로, 맨 아래가 최근)
//  albums : 들어갈 앨범 id (아래 PHOTO_ALBUMS)
//  fav    : true 면 '즐겨찾는 항목'에도 들어감
//  ※ 여자친구 얼굴이 나오는 사진은 넣지 않습니다.

export const PHOTO_ALBUMS = [
  { id: 'us',      title: '우리' },
  { id: 'guitar',  title: '기타' },
  { id: 'f1',      title: 'F1' },
  { id: 'cook',    title: '요리' },
  { id: 'friends', title: '친구들' },
];

export const PHOTOS = [
  { file: 'photo-guitar-1.jpg',  alt: '기타 사진',                 at: '2026-08-14 20:58', albums: ['guitar'] },
  { file: 'photo-guitar-2.jpg',  alt: '합주실에서 기타',            at: '2026-08-30 16:20', albums: ['guitar'] },
  { file: 'photo-friends-1.jpg', alt: '친구들과 일상',              at: '2026-09-06 22:41', albums: ['friends'] },
  { file: 'photo-cook-1.jpg',    alt: '직접 만든 요리',             at: '2026-09-13 19:05', albums: ['cook'] },
  { file: 'photo-jay-1.jpg',     alt: '종성 본인 사진',             at: '2026-09-21 18:47' },
  { file: 'photo-us-1.jpg',      alt: '전망대에서 본 야경',          at: '2026-09-27 20:12', albums: ['us'], fav: true },
  { file: 'photo-us-2.jpg',      alt: '꽃다발',                    at: '2026-10-02 19:30', albums: ['us'], fav: true },
  { file: 'photo-f1-1.jpg',      alt: 'F1 경기장',                 at: '2026-10-11 13:02', albums: ['f1'], fav: true },
  { file: 'photo-f1-2.jpg',      alt: 'F1 보러 간 종성 뒷모습',      at: '2026-10-11 13:10', albums: ['f1'] },
  { file: 'photo-f1-3.jpg',      alt: 'F1 굿즈',                   at: '2026-10-11 17:44', albums: ['f1'] },
  { file: 'photo-cook-2.jpg',    alt: '파스타 연습',                at: '2026-10-14 20:15', albums: ['cook'] },
  { file: 'photo-us-3.jpg',      alt: '여자친구가 찍어준 종성 사진',  at: '2026-10-18 15:32', albums: ['us'], fav: true },
  { file: 'photo-us-4.jpg',      alt: '데이트 카페',                at: '2026-10-18 16:05', albums: ['us'] },
  { file: 'photo-us-5.jpg',      alt: '데이트 장소 풍경',            at: '2026-10-25 17:20', albums: ['us'] },
  { file: 'photo-friends-2.jpg', alt: '친구들과 피시방',             at: '2026-10-27 23:10', albums: ['friends'] },
  { file: 'photo-guitar-3.jpg',  alt: '새 기타 언박싱',              at: '2026-10-31 14:20', albums: ['guitar'], fav: true },
  { file: 'photo-cook-3.jpg',    alt: '오늘 저녁',                  at: '2026-11-01 19:12', albums: ['cook'] },
];
