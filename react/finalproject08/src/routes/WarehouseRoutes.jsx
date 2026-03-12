import { ROLES } from "../constants/common/role";
import ProtectedRoute from "./ProtectedRoute";
import WarehouseLayout from "../style/layout/warehouselayout/WarehouseLayout";

// ========== 대시보드 ==========
import WarehouseDashboard from "../pages/warehouse/dashboard/WarehouseDashboard";

// ========== 화물 관리 ==========
import CargoManagementPage from "../pages/warehouse/cargo/CargoManagementPage";
import CargoDetailPage from "../pages/warehouse/cargo/CargoDetailPage";

// ========== 입고 등록 ==========
import CargoEntryPage from "../pages/warehouse/cargo/CargoEntryPage";

// ========== 기존 화물 페이지 ==========
import ImportCargoPage from "../pages/warehouse/import/ImportCargoPage";
import ExportCargoPage from "../pages/warehouse/export/ExportCargoPage";
import MyPage from "../pages/common/MyPage";

// ========== 검사/예외 ==========
import InspectionPage from "../pages/warehouse/inspection/InspectionPage";
import ExceptionPage from "../pages/warehouse/exception/ExceptionPage";

// src/routes/WarehouseRoutes.jsx

/**
 * 창고관리자 라우팅
 *
 * 순서:
 * 1. 화물 관리 (최우선)
 * 2. 운영 통계
 * 3. 대시보드 (3D 뷰)
 * 4. 검사 관리
 * 5. 예외 처리
 */
export const warehouseRoutes = [
  {
    path: "/warehouse",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE_MANAGER, ROLES.SUPERVISOR, ROLES.ADMIN]}>
        <WarehouseLayout />
      </ProtectedRoute>
    ),
    children: [
      // ========================================
      // 1. 화물 관리 (최우선)
      // ========================================
      {
        path: "cargo",
        children: [
          {
            index: true,
            element: <CargoManagementPage />, // 목록 (탭 구조)
          },
          {
            path: "entry",
            element: <CargoEntryPage />, // 보세구역 입고 등록
          },
          {
            path: ":cargoId",
            element: <CargoDetailPage />, // 상세
          },
        ],
      },

      // ========================================
      // 마이페이지
      // ========================================
      {
        path: "mypage",
        element: <MyPage />,
      },

      // ========================================
      // 3. 대시보드 (3D 뷰)
      // ========================================
      {
        path: "dashboard",
        element: <WarehouseDashboard />,
      },
    ],
  },
];

export default warehouseRoutes;
