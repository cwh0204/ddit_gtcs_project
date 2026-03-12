import { Outlet } from "react-router-dom";
import { layoutStyles } from "../layout.styles";
import { CUSTOMS_MENU_STRUCTURE } from "../../../constants/menu/customsMenuStructure";
import Sidebar from "../../layout/common/Sidebar";
import Topbar from "../../layout/common/Topbar";
import { Home } from "lucide-react";

//src/style/layout/customslayout/CustomsLayout.jsx
function CustomsLayout() {
  return (
    <>
      <div className="w-full min-h-screen bg-bg-outside overflow-x-auto">
        <div className="flex flex-col h-screen min-w-[1440px] max-w-[1920px] mx-auto bg-white shadow-2xl">
          <div className={layoutStyles.header()}>
            <Topbar icon={<Home className="h-6 w-6" />} title="G-TCS" homeUrl="/customs/dashboard" />
          </div>

          <div className={layoutStyles.bodyWrapper()}>
            <div className={layoutStyles.aside()}>
              <Sidebar menuStructure={CUSTOMS_MENU_STRUCTURE} title="세관원 업무 시스템" footer="세관원 모드" />
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

export default CustomsLayout;
