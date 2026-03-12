// src/routes/SupervisorRoutes.jsx

import { ROLES } from "../constants/common/role";
import ProtectedRoute from "./ProtectedRoute";
import SupervisorLayout from "../style/layout/supervisor/SupervisorLayout";

// ========== 대시보드 ==========
import SupervisorDashboardPage from "../pages/supervisor/SupervisorDashboardPage";

// ========== 업무 모니터링 ==========
import MonitoringBacklogPage from "../pages/supervisor/monitoring/MonitoringBacklogPage";
import MonitoringBacklogDetailPage from "../pages/supervisor/monitoring/MonitoringBacklogDetailPage";

// ========== 배정 관리 ==========
import AssignmentOfficerPage from "../pages/supervisor/assignment/AssignmentOfficerPage";

// ========== 결재 ==========
import ApprovalListPage from "../pages/supervisor/ApprovalListPage";
import ApprovalDetailPage from "../pages/supervisor/ApprovalDetailPage";

// ========== 마이페이지 ==========
import MyPage from "../pages/common/MyPage";

// ========== 운영 통계 ==========
import ZoneStatisticsPage from "../pages/warehouse/report/ZoneStatisticsPage";
import TimeStatisticsPage from "../pages/warehouse/report/TimeStatisticsPage";
import AiRiskStatisticsPage from "../pages/warehouse/report/AiRiskStatisticsPage";

export const supervisorRoutes = [
  {
    path: "/supervisor",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.ADMIN]}>
        <SupervisorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SupervisorDashboardPage /> },
      { path: "dashboard", element: <SupervisorDashboardPage /> },

      // 업무 모니터링 (1뎁스)
      {
        path: "monitoring",
        children: [
          { path: "backlog", element: <MonitoringBacklogPage /> },
          { path: "backlog/:declType/:declNo", element: <MonitoringBacklogDetailPage /> },
        ],
      },

      // 배정 관리 (1뎁스)
      {
        path: "assignment",
        children: [{ path: "officer", element: <AssignmentOfficerPage /> }],
      },

      // 결재
      { path: "approval", element: <ApprovalListPage declType="ALL" defaultStatus="ESCALATED" pageTitle="결재 목록" /> },
      { path: "approval/:approvalId", element: <ApprovalDetailPage /> },

      // 운영 통계 (subItems 유지 → overview 경로 추가)
      {
        path: "statistics",
        children: [
          { path: "zone", element: <ZoneStatisticsPage /> },
          { path: "time", element: <TimeStatisticsPage /> },
          { path: "blockage", element: <AiRiskStatisticsPage /> },
        ],
      },

      // 마이페이지
      { path: "mypage", element: <MyPage /> },
    ],
  },
];

export default supervisorRoutes;
