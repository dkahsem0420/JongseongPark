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
//  [프로필 사진]  avatar 에 적힌 파일 이름으로 사진을 올리면 자동 적용 (없으면 기본 모양)
//
//  [댓글과 답글]
//   comments: [{ by, text, at, replies: [{ by, to, text, at }] }]
//   to = 누구에게 답글을 다는지 → 앞에 @아이디 가 자동으로 붙음
//
//  {name}, {name아/야} 등은 방문자 이름으로 바뀝니다. 줄바꿈은 \n

export const IG_ACCOUNTS = {
  jay:       { username: '{ownerId}',   name: '박종성', bio: '🎸 🏎️', avatar: 'pf-jay.jpg',       followers: 412, following: 287 },
  gf:        { username: '{id}',        name: '{name}', bio: '',       avatar: 'pf-gf.jpg',        followers: 538, following: 361 },
  jaeyoon:   { username: 'jaeyoon.sim', name: '심재윤', bio: '',       avatar: 'pf-jaeyoon.jpg',   followers: 655, following: 702 },
  seonghoon: { username: 'seonghoon_p', name: '박성훈', bio: '🏋️',     avatar: 'pf-seonghoon.jpg', followers: 389, following: 255 },
  seoa:      { username: 'seoa.yoon',   name: '윤서아', bio: '',       avatar: 'pf-seoa.jpg',      followers: 921, following: 610 },

  // DM 에만 나오는 계정 (postsCount = 게시물 수 표시용)
  dog:       { username: 'daily.mungmung',  name: '오늘의 댕댕',   avatar: 'pf-dog.jpg',    followers: 284000, following: 12, postsCount: 1532 },
  food:      { username: 'seoul.matjip.log', name: '서울 맛집 기록', avatar: 'pf-food.jpg',  followers: 96400,  following: 88, postsCount: 812 },
  watch:     { username: 'timepiece.lab',   name: '타임피스랩',    avatar: 'pf-watch.jpg',  followers: 128000, following: 3,  postsCount: 2047, verified: true, bio: '시계 정보 · 공식 계정\nDM 문의 평일 10:00~18:00' },
};

// 종성이가 팔로우하는 사람 (홈 피드·스토리 줄에 나오는 사람)
export const IG_FOLLOWING = ['gf', 'jaeyoon', 'seonghoon', 'seoa'];

//  게시물
//   feedTop : true 면 홈 피드 맨 위에 고정 (나머지는 최신순)
//   liked   : 종성이가 좋아요를 눌렀는지 / likes : 좋아요 수
export const IG_POSTS = [
  // ── 종성 ──
  {
    id: 'jay-guitar', by: 'jay', at: '2026-08-14 21:10',
    image: 'ig-jay-guitar.jpg', alt: '기타 사진',
    caption: '줄 갈았다 🎸',
    likes: 64,
    comments: [
      { by: 'seonghoon', text: '공연 언제 함', at: '2026-08-14 21:30' },
      { by: 'gf', text: '선배 나중에 저도 한 곡만 쳐주세요!!', at: '2026-08-15 00:12',
        replies: [
          { by: 'jay', to: 'gf', text: '언제든 쳐줄 수 있지\n말만 해', at: '2026-08-15 00:20' },
        ] },
    ],
  },
  {
    id: 'jay-self', by: 'jay', at: '2026-05-05 12:30',
    image: 'ig-jay-child.jpg', alt: '종성 어린 시절 사진',
    caption: '어린이날이길래',
    likes: 103,
    comments: [
      { by: 'gf', text: '헐ㅋㅋㅋ 귀엽다\n선배 저때부터 누룽지였네요', at: '2026-05-05 12:41',
        replies: [
          { by: 'jay', to: 'gf', text: '저때부터 선크림을 발랐어야 하는데...', at: '2026-05-05 12:50' },
          { by: 'gf', to: 'jay', text: '누룽지라서 좋은 건데', at: '2026-05-05 12:52' },
        ] },
      { by: 'jaeyoon', text: '저때가 낫다', at: '2026-05-05 13:10',
        replies: [
          { by: 'seonghoon', to: 'jaeyoon', text: 'ㅇㅈ', at: '2026-05-05 13:15' },
        ] },
    ],
  },
  {
    id: 'jay-daily', by: 'jay', at: '2026-10-20 20:45',
    image: 'ig-jay-f1.jpg', alt: 'F1 보러 간 종성 (뒷모습)',
    caption: '꿈을 이룬 날',
    likes: 148,
    comments: [
      { by: 'gf', text: '뒷모습밖에 없는데 좀 설렜어요', at: '2026-10-20 20:52',
        replies: [
          { by: 'seonghoon', to: 'gf', text: '뒷모습밖에 없어서 그런 거 아니에요? ㅎㅎ', at: '2026-10-20 21:01' },
          { by: 'jay', to: 'seonghoon', text: '시끄러워', at: '2026-10-20 21:03' },
          { by: 'jay', to: 'gf', text: '헉...// 보고싶어ㅠㅠ', at: '2026-10-20 21:03' },
        ] },
      { by: 'jaeyoon', text: '어깨에 힘 잔뜩 줬네 ㅋㅋ', at: '2026-10-20 21:20' },
    ],
  },

  // ── 여자친구 ──
  {
    id: 'gf-flowers', by: 'gf', at: '2026-10-02 22:30', feedTop: true,
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
    caption: '내 최애 사진 ㅋㅋ',
    liked: true, likes: 97,
    comments: [
      { by: 'jay', text: '??? {name아/야}...ㅜㅜ', at: '2026-10-18 18:24',
        replies: [
          { by: 'gf', to: 'jay', text: '왜여 ㅎㅎㅎ', at: '2026-10-18 18:26' },
          { by: 'jay', to: 'gf', text: '아냐 너가 좋다면 난 행복해', at: '2026-10-18 18:29' },
        ] },
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
    image: 'ig-jaeyoon-1.jpg', alt: '심재윤 본인 사진 (탈색)',
    caption: '가을 🍂',
    liked: true, likes: 142,
    comments: [
      { by: 'seonghoon', text: '가을 제대로 타네', at: '2026-10-27 19:20' },
      { by: 'gf', text: '헉 재윤선배 탈색하셨네요?!', at: '2026-10-27 19:31',
        replies: [
          { by: 'jay', to: 'gf', text: '{name아/야}... 이런거 보지마...\n나는 오늘 머리 잘랐어', at: '2026-10-27 19:35' },
          { by: 'jaeyoon', to: 'gf', text: 'ㅋㅋ 맞아 어때? 괜찮아?', at: '2026-10-27 19:38' },
          { by: 'jay', to: 'jaeyoon', text: '괜찮긴 뭐가 괜찮아 할아버지같음', at: '2026-10-27 19:39' },
        ] },
    ],
  },
  {
    id: 'seonghoon-1', by: 'seonghoon', at: '2026-10-29 21:40',
    image: 'ig-seonghoon-milano.jpg', alt: '박성훈 밀라노 여행 사진',
    caption: '밀라노',
    liked: true, likes: 77,
    comments: [
      { by: 'jaeyoon', text: '나 좀 데려가지', at: '2026-10-29 21:44' },
      { by: 'jay', text: '네 얼굴 말고 뒤에 있는 대성당을 좀 자세히 보고 싶은데', at: '2026-10-29 21:50' },
      { by: 'seoa', text: '언제 갔어?!!', at: '2026-10-29 22:13' },
    ],
  },
];

//  스토리 (24시간 안에 올린 것: 10/31 21:41 이후)
export const IG_STORIES = [
  { by: 'jay',       items: [{ image: 'story-jay-1.jpg', alt: '종성 스토리', at: '2026-11-01 18:20' }] },
  { by: 'gf',        items: [{ image: 'story-gf-1.jpg', alt: '여자친구 스토리', at: '2026-11-01 13:05' }, { image: 'story-gf-2.jpg', alt: '여자친구 스토리 2', at: '2026-11-01 20:10' }] },
  { by: 'jaeyoon',   items: [{ image: 'story-jaeyoon-1.jpg', alt: '심재윤 스토리', at: '2026-11-01 16:40' }] },
  { by: 'seonghoon', items: [{ image: 'story-seonghoon-gym.jpg', alt: '박성훈 헬스장 사진', at: '2026-11-01 08:30' }] },
];

//  DM
//   메시지 : { from: 'me' | 'them', at, text }
//   공유   : { from, at, share: { kind: 'reel' | 'post', by: '계정 열쇠', image, alt, caption } }
//   seen   : true 면 마지막 내 메시지 아래 '읽음'
//   목록은 최근 메시지 순으로 자동 정렬
export const IG_DMS = [
  {
    id: 'gf',
    with: 'gf',
    seen: true,
    messages: [
      { from: 'them', at: '2026-10-27 23:12', share: { kind: 'reel', by: 'dog', image: 'dm-reel-dog.jpg', alt: '강아지 릴스', caption: '산책 가자는 말에 고장 난 댕댕이 🐶' } },
      { from: 'me',   at: '2026-10-27 23:15', text: '귀엽다 ㅎㅎㅎ {name} 닮았어' },
      { from: 'them', at: '2026-10-29 20:31', share: { kind: 'post', by: 'food', image: 'dm-post-food.jpg', alt: '맛집 소개 게시물', caption: '웨이팅 필수! 생면 파스타 맛집 🍝' } },
      { from: 'me',   at: '2026-10-29 20:34', text: '이번 주말에 갈까?' },
      { from: 'them', at: '2026-10-29 20:35', text: '넹 좋아요' },
    ],
  },
  {
    id: 'watch',
    with: 'watch',
    seen: true,
    messages: [
      { from: 'me',   at: '2026-10-28 01:12', text: '안녕하세요! 여자친구 선물로 시계를 알아보고 있는데, 손목이 얇은 편이면 케이스는 몇 mm 정도가 좋을까요?' },
      { from: 'them', at: '2026-10-28 10:05', text: '안녕하세요, 타임피스랩입니다 😊\n손목이 얇으신 분께는 28~32mm 케이스를 추천드리며, 가죽 스트랩 모델이 착용감이 편안합니다.' },
      { from: 'them', at: '2026-10-28 10:06', text: '선물 포장과 뒷면 각인 서비스도 무료로 제공되고 있으니 참고 부탁드립니다. 감사합니다!' },
      { from: 'me',   at: '2026-10-28 10:20', text: '감사합니다!!' },
    ],
  },
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
