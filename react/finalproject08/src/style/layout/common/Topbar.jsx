import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";

// src/style/layout/common/Topbar.jsx

/**
 * <Topbar icon={<Home className="h-6 w-6" />} title="G-TCS" homeUrl="/customs/dashboard"/>
 */
function Topbar({ icon, title, homeUrl }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHome = () => {
    navigate(homeUrl);
  };

  const handleMyPage = () => {
    const base = homeUrl?.replace(/\/dashboard$/, "") || "";
    navigate(`${base}/mypage`);
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-[#123150] shadow-md text-white shrink-0">
      {/* 왼쪽: 로고 */}
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-90" onClick={handleHome}>
        {icon}
        <span className="text-xl font-bold tracking-wide text-white">{title}</span>
      </div>

      {/* 오른쪽: 사용자 정보 */}
      <div className="flex items-center gap-4">
        {/* 마이페이지 */}
        <button onClick={handleMyPage} className="p-1 hover:bg-white/10 rounded-full transition-colors" title="마이페이지">
          <UserCircle className="h-5 w-5" />
        </button>

        {/* 구분선 */}
        <div className="h-4 w-px bg-white/30 mx-2" />

        {/* 사용자 정보 */}
        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={handleMyPage} className="text-sm font-medium hover:underline hover:opacity-90 transition-opacity" title="마이페이지">
              {user.name}님
            </button>
          ) : (
            <span className="text-sm font-medium">사용자님</span>
          )}

          <button onClick={handleLogout} className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors" title="로그아웃">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
