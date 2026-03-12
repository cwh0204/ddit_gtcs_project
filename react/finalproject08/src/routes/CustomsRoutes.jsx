import { ROLES } from "../constants/common/role";
import ProtectedRoute from "./ProtectedRoute";
import CustomsLayout from "../style/layout/customslayout/CustomsLayout";
import DashboardPage from "../pages/customs/dashboard/DashboardPage";
import ImportReviewPage from "../pages/customs/import/ImportReviewPage";
import ImportDetailPage from "../pages/customs/import/ImportDetailPage";
import ExportReviewPage from "../pages/customs/export/ExportReviewPage";
import ExportDetailPage from "../pages/customs/export/ExportDetailPage";
import TaxDetailPage from "../pages/customs/tax/TaxDetailPage";
import CargoTrackingPage from "../pages/customs/cargo/CargoTrackingPage";
import CargoTrackingDetailPage from "../pages/customs/cargo/CargoTrackingDetailPage";
import NoticeListPage from "../pages/customs/support/NoticeListPage";
import NoticeDetailPage from "../pages/customs/support/NoticeDetailPage";
import NoticeFormPage from "../pages/customs/support/NoticeFormPage";
import MyPage from "../pages/common/MyPage";

//src/routes/CustomsRoutes.jsx

export const customsRoutes = [
  {
    path: "/customs",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CUSTOMS_OFFICER, ROLES.SUPERVISOR, ROLES.ADMIN]}>
        <CustomsLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "import",
        children: [
          {
            path: "review",
            element: <ImportReviewPage />,
          },
          {
            path: "detail/:declarationId",
            element: <ImportDetailPage />,
          },
          {
            path: "list",
            children: [
              {
                index: true,
                element: <ImportReviewPage />,
              },
              {
                path: "detail/:declarationId",
                element: <ImportDetailPage />,
              },
            ],
          },
        ],
      },
      {
        path: "export",
        children: [
          { path: "review", element: <ExportReviewPage /> },
          { path: "detail/:declarationId", element: <ExportDetailPage /> },
        ],
      },
      {
        path: "tax",
        children: [
          {
            path: "detail/:declarationId",
            element: <TaxDetailPage />,
          },
        ],
      },

      //화물 진행 상태
      {
        path: "cargo",
        children: [
          {
            path: "tracking",
            element: <CargoTrackingPage />,
          },
          {
            path: "tracking/:cargoId",
            element: <CargoTrackingDetailPage />,
          },
        ],
      },

      //고객지원
      {
        path: "support",
        children: [
          // 공지사항
          {
            path: "notice",
            element: <NoticeListPage type="notice" basePath="/customs/support/notice" />,
          },
          {
            path: "notice/:noticeId",
            element: <NoticeDetailPage basePath="/customs/support/notice" />,
          },
          {
            path: "notice/create",
            element: <NoticeFormPage type="notice" basePath="/customs/support/notice" />,
          },
          {
            path: "notice/edit/:noticeId",
            element: <NoticeFormPage type="notice" basePath="/customs/support/notice" />,
          },

          // 행정예고
          {
            path: "admin-notice",
            element: <NoticeListPage type="admin" basePath="/customs/support/admin-notice" />,
          },
          {
            path: "admin-notice/:noticeId",
            element: <NoticeDetailPage basePath="/customs/support/admin-notice" />,
          },
          {
            path: "admin-notice/create",
            element: <NoticeFormPage type="admin" basePath="/customs/support/admin-notice" />,
          },
          {
            path: "admin-notice/edit/:noticeId",
            element: <NoticeFormPage type="admin" basePath="/customs/support/admin-notice" />,
          },

          {
            path: "inquiry",
            element: <NoticeListPage type="inquiry" basePath="/customs/support/inquiry" />,
          },
          {
            path: "inquiry/:noticeId",
            element: <NoticeDetailPage basePath="/customs/support/inquiry" />,
          },
          {
            path: "inquiry/create",
            element: <NoticeFormPage type="inquiry" basePath="/customs/support/inquiry" />,
          },
          {
            path: "inquiry/edit/:noticeId",
            element: <NoticeFormPage type="inquiry" basePath="/customs/support/inquiry" />,
          },
        ],
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
];

export default customsRoutes;
