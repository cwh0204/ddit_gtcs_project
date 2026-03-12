/*
  src/constants/CustomsMenuStructure.js
*/

export const CUSTOMS_MENU_STRUCTURE = [
  //대시보드
  {
    id: "dashboard",
    name: "대시보드",
    path: "/customs/dashboard",
    description: "업무현황 및 통계",
  },
  {
    id: "import",
    name: "수입 심사",
    path: "/customs/import/review",
    description: "수입신고 심사 및 세액/납부 통합 관리 (Tab 방식)",
  },
  {
    id: "export",
    name: "수출 심사",
    path: "/customs/export/review",
    description: "수출신고 심사",
  },
  {
    id: "cargo",
    name: "화물 진행 상태",
    path: "/customs/cargo",
    description: "화물 진행 상태 모니터링",
    subItems: [
      {
        name: "화물 진행 현황",
        path: "tracking",
        description: "입항->반입->검사->반출 흐름 조회",
      },
    ],
  },
  //고객지원
  {
    id: "support",
    name: "고객지원",
    path: "/customs/support",
    description: "공지사항, 행정예고, HS코드 조회, 1:1 민원",
    subItems: [
      {
        name: "공지사항",
        path: "notice",
        description: "공지사항 조회 및 관리",
      },
      {
        name: "행정예고",
        path: "admin-notice",
        description: "행정예고 조회 및 관리",
      },
      {
        name: "1:1 민원사항",
        path: "inquiry",
        description: "고객 문의 및 민원 처리",
      },
    ],
  },
];

//전체 메뉴를 플랫하게 변환(검색용)
export const getAllMenuPaths = () => {
  const paths = [];
  CUSTOMS_MENU_STRUCTURE.forEach((menu) => {
    paths.push({
      id: menu.id,
      name: menu.name,
      path: menu.path,
      description: menu.description,
    });

    if (menu.subItems) {
      menu.subItems.forEach((sub) => {
        paths.push({
          id: `${menu.id}-${sub.path}`,
          name: `${menu.name}>${sub.name}`,
          path: `${menu.path}/${sub.path}`,
          description: sub.description,
        });
      });
    }
  });
  return paths;
};

/**
 * 메뉴 ID로 찾기 기능
 */
export const findMenuById = (id) => {
  return CUSTOMS_MENU_STRUCTURE.find((menu) => menu.id === id);
};

//현재경로에 해당하는 메뉴 찾기
export const findMenuByPath = (pathname) => {
  for (const menu of CUSTOMS_MENU_STRUCTURE) {
    if (pathname === menu.path || pathname.startsWith(`${menu.path}/`)) {
      return menu;
    }
  }
  return null;
};

export const findMenuByStatus = (status) => {
  for (const menu of CUSTOMS_MENU_STRUCTURE) {
    if (menu.subItems) {
      for (const subItem of menu.subItems) {
        if (subItem.states && subItem.states.includes(status)) {
          return {
            menu: menu,
            subItem: subItem,
            path: `${menu.path}/${subItem.path}`,
          };
        }
      }
    }
  }
  return null;
};
