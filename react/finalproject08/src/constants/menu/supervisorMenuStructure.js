// src/constants/common/supervisorMenuStructure.js

export const SUPERVISOR_MENU_STRUCTURE = [
  {
    id: "dashboard",
    name: "대시보드",
    path: "/supervisor/dashboard",
    description: "결재 대기 및 KPI 현황",
    code: "SUPERVISOR-01",
  },
  {
    id: "monitoring-backlog",
    name: "적체/지연 모니터링",
    path: "/supervisor/monitoring/backlog",
    description: "단계별 적체 및 SLA 지연 현황",
    code: "SUPERVISOR-COMMON-01-01",
  },
  {
    id: "assignment-officer",
    name: "담당자 재배정",
    path: "/supervisor/assignment/officer",
    description: "심사/검사/사후 담당자 배정",
    code: "SUPERVISOR-COMMON-02-01",
  },
  {
    id: "approval",
    name: "결재 목록",
    path: "/supervisor/approval",
    description: "세관원 결재 요청 승인/반려",
    code: "SUPERVISOR-03",
  },
  {
    id: "statistics",
    name: "운영 통계",
    path: "/supervisor/statistics",
    description: "창고 운영 통계 및 분석",
    subItems: [
      {
        name: "창고구역 통계",
        path: "zone",
        description: "구역별 화물 현황",
      },
      {
        name: "수입/수출 통계",
        path: "time",
        description: "시간대별 처리 현황",
      },
      {
        name: "리스크 통계",
        path: "blockage",
        description: "차단 사유 분석",
      },
    ],
  },
];

// ============================================================
// 유틸리티 함수
// ============================================================

export const getAllSupervisorMenuPaths = () => {
  const paths = [];
  SUPERVISOR_MENU_STRUCTURE.forEach((menu) => {
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

export const findSupervisorMenuById = (id) => {
  return SUPERVISOR_MENU_STRUCTURE.find((menu) => menu.id === id);
};

export const findSupervisorMenuByPath = (pathname) => {
  for (const menu of SUPERVISOR_MENU_STRUCTURE) {
    if (pathname === menu.path || pathname.startsWith(`${menu.path}/`)) {
      return menu;
    }
  }
  return null;
};
