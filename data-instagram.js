// ─────────────────────────────────────────────
//  Instagram — 계정, 게시물, 댓글, 스토리, DM
// ─────────────────────────────────────────────
//  [사진 넣는 법]
//   사진 파일을 다른 파일들과 같은 곳에 올리고, image 에 파일 이름을 적으면 됩니다.
//   파일이 없으면 alt 에 적은 설명이 회색 칸에 표시됩니다 (어떤 사진이 들어갈 자리인지).
//
//  [사람 표시]  by / from 에는 아래 IG_ACCOUNTS 의 열쇠 이름을 씁니다.
//   'jay' = 종성, 'gf' = 여자친구(방문자), 'jaeyoon' = 심재윤, 'seonghoon' = 박성훈, 'seoa' = 여자 동기
//
//  ※ 캡션·댓글은 구조를 보여주기 위한 '예시'입니다. 확정본을 주시면 교체합니다.

export const IG_ACCOUNTS = {
  jay: {
    username: '{ownerId}',          // jayPark02
    name: '박종성',
    bio: '🎸 🏎️',
    avatar: '',                      // 예: 'ig-jay-profile.jpg'
    followers: 412,
    following: 287,
  },
  gf: {
    username: '{id}',               // 방문자가 입력한 인스타 아이디
    name: '{name}',
    bio: '',
    avatar: '',
    followers: 538,
    following: 361,
  },
  jaeyoon: {
    username: 'jaeyoon.sim',
    name: '심재윤',
    bio: '',
    avatar: '',
    followers: 655,
    following: 702,
  },
  seonghoon: {
    username: 'seonghoon_p',
    name: '박성훈',
    bio: '🏋️',
    avatar: '',
    followers: 389,
    following: 255,
  },
  seoa: {
    username: 'seoa.yoon',
    name: '윤서아',
    bio: '',
    avatar: '',
    followers: 921,
    following: 610,
  },
};

// 종성이가 팔로우하는 사람 (홈 피드·스토리 줄에 나오는 사람)
export const IG_FOLLOWING = ['gf', 'jaeyoon', 'seonghoon', 'seoa'];

//  게시물
//   liked : 종성이가 좋아요를 눌렀는지
//   likes : 좋아요 수 (liked 가 true 면 종성이 포함한 숫자)
//   comments : { by, text, at }   (@아이디 는 파란 글씨로 표시)
export const IG_POSTS = [
  // ── 종성 ──
  {
    id: 'jay-guitar', by: 'jay', at: '2026-08-14 21:10',
    image: 'ig-jay-guitar.jpg', alt: '기타 사진',
    caption: '줄 갈았다 🎸',
    likes: 64,
    comments: [
      { by: 'seonghoon', text: '공연 언제 함', at: '2026-08-14 21:30' },
      { by: 'gf', text: '선배 나중에 저도 한 곡만 쳐주세요!!', at: '2026-08-15 00:12' },
    ],
  },
  {
    id: 'jay-self', by: 'jay', at: '2026-09-21 19:30',
    image: 'ig-jay-self.jpg', alt: '종성 본인 사진',
    caption: '',
    likes: 103,
    comments: [
      { by: 'jaeyoon', text: '누구세요', at: '2026-09-21 19:41' },
      { by: 'seonghoon', text: '잘생겼다 (진심 아님)', at: '2026-09-21 20:02' },
      { by: 'gf', text: '선배 사진 누가 찍어줬어요?', at: '2026-09-21 22:15' },
    ],
  },
  {
    id: 'jay-daily', by: 'jay', at: '2026-10-20 20:45',
    image: 'ig-jay-daily.jpg', alt: '종성 일상 사진',
    caption: '🍝',
    likes: 88,
    comments: [
      { by: 'gf', text: '선배 이거 언제 해줘요', at: '2026-10-20 20:51' },
      { by: 'jaeyoon', text: '나도 해줘', at: '2026-10-20 21:03' },
      { by: 'jay', text: '@jaeyoon.sim 싫어', at: '2026-10-20 21:05' },
    ],
  },

  // ── 여자친구 ──
  {
    id: 'gf-flowers', by: 'gf', at: '2026-10-02 22:30',
    image: 'ig-gf-flowers.jpg', alt: '종성에게 받은 꽃다발',
    caption: '💐',
    liked: true, likes: 121,
    comments: [
      { by: 'jay', text: '🤍', at: '2026-10-02 22:31' },
    ],
  },
  {
    id: 'gf-bf', by: 'gf', at: '2026-10-18 18:20',
    image: 'ig-gf-bf.jpg', alt: '여자친구가 찍은 종성 사진 (남친짤)',
    caption: '📸',
    liked: true, likes: 97,
    comments: [
      { by: 'jaeyoon', text: '사진 잘 찍으시네요 실물보다 나음', at: '2026-10-18 18:40' },
      { by: 'jay', text: '고마워..', at: '2026-10-18 18:52' },
    ],
  },
  {
    id: 'gf-date', by: 'gf', at: '2026-10-25 21:05',
    image: 'ig-gf-date.jpg', alt: '데이트 사진',
    caption: '토요일',
    liked: true, likes: 84,
    comments: [
      { by: 'jay', text: '또 가자', at: '2026-10-25 21:07' },
    ],
  },

  // ── 친구들 ──
  {
    id: 'jaeyoon-1', by: 'jaeyoon', at: '2026-10-27 19:15',
    image: 'ig-jaeyoon-1.jpg', alt: '심재윤 본인 사진',
    caption: '가을 🍂',
    liked: true, likes: 142,
    comments: [
      { by: 'seonghoon', text: '가을 타냐', at: '2026-10-27 19:20' },
      { by: 'jay', text: 'ㅋㅋㅋㅋ 외로워 보인다', at: '2026-10-27 19:22' },
      { by: 'jaeyoon', text: '@jayPark02 너는 조용히 해', at: '2026-10-27 19:23' },
    ],
  },
  {
    id: 'seonghoon-1', by: 'seonghoon', at: '2026-10-29 21:40',
    image: 'ig-seonghoon-1.jpg', alt: '박성훈 헬스장 사진',
    caption: '오운완',
    liked: true, likes: 77,
    comments: [
      { by: 'jaeyoon', text: '또 감?', at: '2026-10-29 21:44' },
    ],
  },
];

//  스토리 (24시간 안에 올린 것만 보이는 게 자연스러워요: 10/31 21:41 이후)
export const IG_STORIES = [
  { by: 'jay',       items: [{ image: 'story-jay-1.jpg', alt: '종성 스토리', at: '2026-11-01 18:20' }] },
  { by: 'gf',        items: [{ image: 'story-gf-1.jpg', alt: '여자친구 스토리', at: '2026-11-01 13:05' }, { image: 'story-gf-2.jpg', alt: '여자친구 스토리 2', at: '2026-11-01 20:10' }] },
  { by: 'jaeyoon',   items: [{ image: 'story-jaeyoon-1.jpg', alt: '심재윤 스토리', at: '2026-11-01 16:40' }] },
  { by: 'seonghoon', items: [{ image: 'story-seonghoon-1.jpg', alt: '박성훈 스토리', at: '2026-11-01 08:30' }] },
];

//  DM
//   messages : { from: 'me' | 'them', at, text }
//   seen     : true 면 마지막 내 메시지 아래 '읽음'
export const IG_DMS = [
  {
    id: 'seoa',
    with: 'seoa',
    seen: true,
    messages: [
      { from: 'them', at: '2026-10-13 13:02', text: '종성 요즘 바빠? 밥 한 번 먹자 ㅎㅎ' },
      { from: 'me',   at: '2026-10-24 23:40', text: '아 온 줄 몰랐네 미안ㅋㅋㅋ 요즘 여자친구랑 맨날 같이 있어' },
    ],
  },
];
