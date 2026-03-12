//사용하진 않지만, 참고용으로 가지고 있으면 된다.

import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { layoutStyles } from "../layout.styles";

function MainLayout() {
  return (
    // [가장 바깥 배경]
    // 화면 전체를 덮는 배경색 (회색 여백이 생기더라도 자연스럽게 보이도록)
    <div className="w-full min-h-screen bg-[#f4f6f8] overflow-x-auto">
      {/* [레이아웃 컨테이너] - 여기가 핵심입니다! */}
      <div
        className="
        flex flex-col h-screen 
        min-w-[1440px]           /* 1. 최소폭 방어 (작아지면 스크롤) */
        max-w-[1920px]           /* 2. 최대폭 제한 (너무 커지면 멈춤) */
        mx-auto                  /* 3. 화면이 1920px 넘으면 중앙 정렬 */
        bg-white                 /* 콘텐츠 영역 배경 */
        shadow-2xl               /* 중앙에 떠 있는 느낌을 주는 그림자 */
      "
      >
        {/* 1. Header */}
        <div className={layoutStyles.header()}>
          <Topbar />
        </div>

        {/* 2. Body Wrapper */}
        <div className={layoutStyles.bodyWrapper()}>
          <div className={layoutStyles.aside()}>
            <Sidebar />
          </div>

          <main className={layoutStyles.main()}>
            <div className="w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
