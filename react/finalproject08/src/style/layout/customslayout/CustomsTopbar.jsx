import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Home, LogOut, UserCircle } from "lucide-react";

//src/style/layout/customslayout/CustomsTopbar.jsx
function CustomsTopbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between bg-[#123150] shadow-md text-white shrink-0">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-90">
          <Home className="h-6 w-6 text-white" />
          <span className="text-xl font-bold tracking-wide text-white">G-TCS</span>
        </div>

        <div className="flex items-center gap-4">
          {/* 마이페이지 */}
          <button onClick={() => navigate("/customs/mypage")} className="p-1 hover:bg-white/10 rounded-full transition-colors" title="마이페이지">
            <UserCircle className="h-5 w-5" />
          </button>

          <div className="h-4 w-px bg-white/30 mx-2" />

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate("/customs/mypage")}
                className="text-sm font-medium hover:underline hover:opacity-90 transition-opacity"
                title="마이페이지"
              >
                {user.name}님
              </button>
            ) : (
              <span className="text-sm font-medium">세관원님</span>
            )}

            <button onClick={handleLogout} className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors" title="로그아웃">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default CustomsTopbar;
