import { createBrowserRouter, Navigate } from "react-router-dom";
import CustomsRoutes from "./CustomsRoutes";
import WarehouseRoutes from "./WarehouseRoutes";
import SupervisorRoutes from "./SupervisorRoutes";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

//src/routes/AppRoutes.jsx
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="login" replace />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  ...CustomsRoutes,
  ...WarehouseRoutes,
  ...SupervisorRoutes,

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
//아이디: officer
//비밀번호: password
