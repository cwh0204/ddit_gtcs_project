/*
src/constants/role.js
  📌 권한 관련 상수 정의
    - 로그인 시 권한에 따라 세관원, 창고관리자, 상급자로 라우팅을 분기시킨다.
*/

export const ROLES = {
  CUSTOMS_OFFICER: "CUSTOMS_OFFICER",
  WAREHOUSE_MANAGER: "WAREHOUSE_MANAGER",
  SUPERVISOR: "SUPERVISOR",
  ADMIN: "ADMIN",
};

export const ROLE_LABELS = {
  CUSTOMS_OFFICER: "세관원",
  WAREHOUSE_MANAGER: "창고관리자",
  SUPERVISOR: "상급자",
  ADMIN: "시스템 관리자",
};

/**
 * ROLE 기본 경로 랜딩 페이지(역할별 INDEX 페이지) 정의
 */
export const ROLE_HOME_ROUTES = {
  CUSTOMS_OFFICER: "/customs/dashboard",
  WAREHOUSE_MANAGER: "/warehouse/cargo",
  SUPERVISOR: "/supervisor/dashboard",
  ADMIN: "/customs/dashboard",
};

/**
 * ROLE 접근 가능한 경로 정의
 */
export const ROLE_ALLOWED_ROUTES = {
  CUSTOMS_OFFICER: ["/customs/*"],
  WAREHOUSE_MANAGER: ["/warehouse/*"],
  SUPERVISOR: ["/supervisor/*"],
  ADMIN: ["/customs/*", "/warehouse/*", "/supervisor/*", "/admin/*"],
};

/**
 * ROLE 우선순위 (높을수록 높은 권한)
 */
export const ROLE_PRIORITY = {
  ADMIN: 100,
  SUPERVISOR: 50,
  CUSTOMS_OFFICER: 30,
  WAREHOUSE_MANAGER: 20,
};

//ROLE 유효성 확인코드
export const roleUtils = {
  isValidRole: (role) => {
    return Object.values(ROLES).includes(role);
  },

  //ROLE의 우선순위
  getRolePriority: (role) => {
    return ROLE_PRIORITY[role] || 0;
  },

  //우선순위 비교 -> 버튼을 보여줄지 말지 정할 수 있고, 목록의 정렬, 위임, 결재 로직(결재자보다 낮은 권한은 승인 불가) 이런걸 하기 위해 작성한다.
  compareRoles: (role1, role2) => {
    return roleUtils.getRolePriority(role1) - roleUtils.getRolePriority(role2);
  },

  //역할에 따른 홈경로 반환
  getHomeRoute: (role) => {
    return ROLE_HOME_ROUTES[role] || "/login";
  },

  getRoleLabel: (role) => {
    return ROLE_LABELS[role] || "알 수 없음";
  },
};
