import { useAuth } from "../hooks/useAuth";
import { Loader2, AlertTriangle } from "lucide-react";
import Card from "../style/components/Card";
import Button from "../style/components/Button";
import { Navigate } from "react-router-dom";

//src/routes/ProtectedRoute.jsx
function ProtectedRoute({ allowedRoles, children, redirectTo = "/login" }) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();

  if (isLoading) {
    // 공통으로 쓸 것 데이터를 불러오는 곳에서는
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">인증 확인중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles) {
    const hasPermission = hasRole(allowedRoles);

    if (!hasPermission) {
      console.warn(`[ProtectedRoute] 접근 거부: 사용자 역할(${user?.role})이 허용된 역할(${allowedRoles})에 포함되지 않습니다.`);

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-outside">
          <Card className="max-w-md w-full">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">접근 권한이 없습니다.</h2>
              <p className="text-gray-600 mb-8">이 페이지에 접근할 수 있는 권한이 없습니다.</p>

              <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={() => window.history.back()}>
                  이전 페이지로 돌아가기
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }
  }

  return children; //jsx태그 안이 아니라 그냥 이것만 덩그러니 사용한다면 굳이 fragment를 사용하지 않고 이대로 사용해도 된다.
}

export default ProtectedRoute;
