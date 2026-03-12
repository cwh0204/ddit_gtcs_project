import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleUtils } from "../../constants/common/role";
import Card from "../../style/components/Card";
import Button from "../../style/components/Button";
import Input from "../../style/components/Input";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, getHomeRoute } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isShipperBlocked, setIsShipperBlocked] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // 이미 로그인된 경우 처리
  useEffect(() => {
    if (isAuthenticated) {
      const homeRoute = getHomeRoute();
      navigate(homeRoute, { replace: true });
    }
  }, [isAuthenticated, navigate, getHomeRoute]);

  // ✅ SHIPPER 차단 시 카운트다운 후 인덱스 페이지로 이동
  useEffect(() => {
    if (!isShipperBlocked) return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = window.location.origin;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isShipperBlocked]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginId || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      setIsShipperBlocked(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setIsShipperBlocked(false);

      const userData = await login({ loginId, password });
      const targetPath = roleUtils.getHomeRoute(userData.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error("로그인 실패:", err);

      // ✅ SHIPPER 접근 차단
      if (err.message === "접근 권한이 없습니다.") {
        setIsShipperBlocked(true);
        setError("");
      } else {
        setIsShipperBlocked(false);
        const msg = err.response?.data?.message || "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ 홈으로 가기
  const handleGoHome = () => {
    window.location.href = window.location.origin;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">관세청 GTCS</h1>
            <p className="text-gray-600 mt-2">통합 관세 관리 시스템</p>
          </div>

          {/* 일반 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ✅ SHIPPER 접근 차단 메시지 */}
          {isShipperBlocked && (
            <div className="mb-4 p-4 bg-white border border-white rounded-md text-center">
              <p className="text-sm font-semibold text-orange-700">접근 권한이 없습니다.</p>
              <p className="text-xs text-orange-600 mt-1">이 시스템은 세관원 및 창고관리자만 이용 가능합니다.</p>
              <p className="text-xs text-orange-500 mt-2">{countdown}초 후 홈 페이지로 이동합니다...</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
              <Input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="아이디를 입력하세요"
                disabled={loading || isShipperBlocked}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={loading || isShipperBlocked}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || isShipperBlocked}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* ✅ 홈으로 가기 버튼 */}
          <Button variant="secondary" className="w-full" onClick={handleGoHome} disabled={loading}>
            홈으로 가기
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
