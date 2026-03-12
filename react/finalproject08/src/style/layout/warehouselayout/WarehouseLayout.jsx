import { Outlet } from "react-router-dom";
import { WAREHOUSE_MENU_STRUCTURE } from "../../../constants/menu/warehouseMenuStructure";
import WarehouseSidebar from "../common/WarehouseSidebar";

// src/style/layout/warehouselayout/WarehouseLayout.jsx
function WarehouseLayout() {
  return (
    <div className="w-full min-h-screen bg-bg-outside overflow-x-auto">
      <div className="flex flex-col h-screen min-w-[1440px] max-w-[1920px] mx-auto bg-[#1a2132]">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-shrink-0">
            <WarehouseSidebar menuStructure={WAREHOUSE_MENU_STRUCTURE} title="창고관리 시스템" footer="창고관리자 모드" />
          </div>
          <main className="flex-1 bg-[#1a2132] overflow-auto">
            <div className="w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default WarehouseLayout;
