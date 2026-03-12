//사용하진 않지만, 참고용으로 가지고 있으면 된다.

import { Bell, Home, LogOut, Mail } from "lucide-react";
import { cn } from "../../utils";

function Topbar({ className }) {
  return (
    <header className={cn("flex h-16 w-full items-center justify-between bg-[#0f4c81] px-4 shadow-md text-white shrink-0", className)}>
      {/* 1. 왼쪽: 로고 영역 */}
      <div className="flex items-center gap-3 cursor-pointer hover:opacity-90">
        <Home className="h-6 w-6 text-white" />
        <span className="text-xl font-bold tracking-wide text-white">G-TCS</span>
      </div>

      {/* 2. 오른쪽 전체 그룹 (아이콘/구분선/프로필) */}
      <div className="flex items-center gap-4">
        {/* 아이콘 버튼들 */}
        <div className="flex items-center gap-2">
          <button className="relative p-1 hover:bg-white/10 rounded-full transition-colors">
            <Mail className="h-5 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0f4c81]" title="메일" />
          </button>

          <button className="relative p-1 hover:bg-white/10 rounded-full transition-colors" title="알림">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0f4c81]" />
          </button>
        </div>

        {/* 구분선 (이제 독립적인 태그) */}
        <div className="h-4 w-px bg-white/30 mx-2"></div>

        {/* 사용자 정보 (구분선 밖으로 나옴) */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">홍길동 세관원님</span>
          <button className="flex items-center gap-1 text-gray-200 hover:text-white transition-colors" title="로그아웃">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
