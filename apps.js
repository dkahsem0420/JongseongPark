// ─────────────────────────────────────────────
//  홈화면 앱 목록과 배치
// ─────────────────────────────────────────────
//  icon  : js/icons.js 에 그려 둔 기본 아이콘 이름
//  image : 직접 만든 아이콘 이미지를 쓰고 싶으면 경로를 적으세요
//          (예: 'assets/icons/kakao.png'). 적으면 기본 아이콘 대신 사용됩니다.
//  badge : 아이콘 오른쪽 위 빨간 숫자 (0 또는 생략하면 없음)
//  stage : 아직 만들지 않은 앱은 몇 단계에서 채울지 표시용

export const APPS = [
  { id: 'phone',     name: '전화',      icon: 'phone',     stage: 2 },
  { id: 'kakao',     name: '카카오톡',  icon: 'kakao',     stage: 2, badge: 1 },
  { id: 'messages',  name: '메시지',    icon: 'messages',  stage: 2 },
  { id: 'photos',    name: '사진',      icon: 'photos',    stage: 4 },
  { id: 'calendar',  name: '캘린더',    icon: 'calendar',  stage: 4 },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', stage: 3 },
  { id: 'music',     name: '음악',      icon: 'music',     stage: 4 },
  { id: 'notes',     name: '메모',      icon: 'notes',     stage: 2 },
  { id: 'safari',    name: 'Safari',    icon: 'safari',    stage: 4 },
  { id: 'clock',     name: '시계',      icon: 'clock',     stage: 4 },
  { id: 'settings',  name: '설정',      icon: 'settings' },
];

// 'widget:dday' 는 2×2 칸을 차지합니다.
export const HOME_LAYOUT = {
  page: ['widget:dday', 'photos', 'calendar', 'instagram', 'music', 'notes', 'clock', 'settings'],
  dock: ['phone', 'messages', 'kakao', 'safari'],
};

export const appById = (id) => APPS.find((a) => a.id === id);
