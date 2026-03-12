// src/constants/warehouseMenuStructure.js

export const WAREHOUSE_MENU_STRUCTURE = [
  {
    id: "cargo",
    name: "화물 관리",
    path: "/warehouse/cargo",
    description: "전체 화물 현황 및 관리",
    subItems: [
      {
        path: "",
        name: "화물 목록",
        description: "전체 화물 현황 (탭 구조)",
      },
      {
        path: "entry",
        name: "화물 입고 등록",
        description: "화물 입고 등록",
        badge: "NEW",
        badgeColor: "green",
      },
    ],
  },

  {
    id: "dashboard",
    name: "화물위치관리",
    path: "/warehouse/dashboard",
    description: "3D 창고 뷰 및 실시간 현황",
    badge: "3D",
    badgeColor: "blue",
    subItems: [],
  },
];

export const getAllWarehouseMenuPaths = () => {
  const paths = [];
  WAREHOUSE_MENU_STRUCTURE.forEach((menu) => {
    paths.push({
      id: menu.id,
      name: menu.name,
      path: menu.path,
      description: menu.description,
      icon: menu.icon,
      badge: menu.badge,
      badgeColor: menu.badgeColor,
    });

    if (menu.subItems && menu.subItems.length > 0) {
      menu.subItems.forEach((sub) => {
        paths.push({
          id: `${menu.id}-${sub.path.split("/").pop()}`,
          name: `${menu.name} > ${sub.name}`,
          path: sub.path,
          description: sub.description,
          icon: sub.icon,
          badge: sub.badge,
          badgeColor: sub.badgeColor,
        });
      });
    }
  });
  return paths;
};

export const findWarehouseMenuById = (id) => {
  return WAREHOUSE_MENU_STRUCTURE.find((menu) => menu.id === id);
};

export const findWarehouseMenuByPath = (pathname) => {
  for (const menu of WAREHOUSE_MENU_STRUCTURE) {
    // 정확한 경로 매칭
    if (pathname === menu.path) {
      return menu;
    }

    // 하위 경로 매칭
    if (pathname.startsWith(`${menu.path}/`)) {
      return menu;
    }

    // 서브 메뉴 확인
    if (menu.subItems) {
      for (const sub of menu.subItems) {
        if (pathname === sub.path || pathname.startsWith(`${sub.path}/`)) {
          return { ...menu, activeSubItem: sub };
        }
      }
    }
  }
  return null;
};

export const BADGE_STYLES = {
  NEW: "bg-green-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
  HOT: "bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
  BETA: "bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
  "3D": "bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
};

export const BADGE_COLOR_STYLES = {
  blue: "bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
  green: "bg-green-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
  red: "bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
  yellow: "bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full ml-2",
};

export default WAREHOUSE_MENU_STRUCTURE;
