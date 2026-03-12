import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";
import Card from "../style/components/Card";
import Button from "../style/components/Button";

/**
 * src/pages/NotFoundPage.jsx
 *
 * 📌 404 Not Found 페이지
 * - 존재하지 않는 경로 접근 시 표시
 * - 이전 페이지 또는 홈으로 이동 가능
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          {/* 아이콘 */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          {/* 404 텍스트 */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

          {/* 메시지 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>

          {/* 버튼 */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              이전 페이지
            </Button>
            <Button onClick={() => navigate("/")} variant="primary">
              <Home className="h-4 w-4 mr-2" />
              홈으로
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default NotFoundPage;
