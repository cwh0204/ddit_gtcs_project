// src/style/layout/supervisorlayout/SupervisorLayout.jsx

import { Outlet } from "react-router-dom";
import { layoutStyles } from "../layout.styles";
import { SUPERVISOR_MENU_STRUCTURE } from "../../../constants/menu/supervisorMenuStructure";
import Sidebar from "../common/Sidebar";
import Topbar from "../common/Topbar";
import { ShieldCheck } from "lucide-react";

/**
 * 상급자(Supervisor) 전용 레이아웃
 *
 * CustomsLayout과 동일한 구조 사용:
 * - Topbar (상단 헤더)
 * - Sidebar (좌측 — SUPERVISOR_MENU_STRUCTURE 주입)
 * - Outlet (콘텐츠 영역)
 */
function SupervisorLayout() {
  return (
    <>
      <div className="w-full min-h-screen bg-bg-outside overflow-x-auto">
        <div className="flex flex-col h-screen min-w-[1440px] max-w-[1920px] mx-auto bg-white shadow-2xl">
          <div className={layoutStyles.header()}>
            <Topbar icon={<ShieldCheck className="h-6 w-6" />} title="G-TCS" homeUrl="/supervisor/dashboard" />
          </div>

          <div className={layoutStyles.bodyWrapper()}>
            <div className={layoutStyles.aside()}>
              <Sidebar menuStructure={SUPERVISOR_MENU_STRUCTURE} title="상급자 업무 시스템" footer="상급자 모드" />
            </div>
            <main className={layoutStyles.main()}>
              <div className="w-full h-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupervisorLayout;
