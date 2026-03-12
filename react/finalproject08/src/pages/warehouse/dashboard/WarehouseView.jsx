import { useState, useRef, useEffect } from "react";
import SearchPanel from "../../../style/layout/warehouselayout/components/SearchPanel";
import createWarehouse from "../../../domain/warehouse/warehouseScene";
import { use3DHighlight } from "../../../controller/warehouse/use3DHighlight";

// src/pages/warehouse/dashboard/WarehouseView.jsx

function WarehouseView() {
  const canvasRef = useRef(null);
  const warehouseRef = useRef(null);
  const [warehouseType, setWarehouseType] = useState("bonded");
  const [searchResult, setSearchResult] = useState(null);
  const [zonePanel, setZonePanel] = useState(null); // { zone: "A", list: [...] }
  const [highlightedCargoId, setHighlightedCargoId] = useState(null);

  const { highlightByWarehouseId, resetHighlight } = use3DHighlight(warehouseRef);

  useEffect(() => {
    if (!canvasRef.current) return;

    warehouseRef.current = createWarehouse(canvasRef.current);

    const handleResize = () => {
      if (warehouseRef.current?.onResize) {
        warehouseRef.current.onResize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (warehouseRef.current?.dispose) {
        warehouseRef.current.dispose();
      }
    };
  }, []);

  const handleWarehouseTypeChange = (type) => {
    setWarehouseType(type);
    setSearchResult(null);
    setZonePanel(null);
    setHighlightedCargoId(null);
    if (warehouseRef.current?.resetHighlight) {
      warehouseRef.current.resetHighlight();
    }
  };

  const handleSearchResult = (result) => {
    setSearchResult(result);
    if (result) setZonePanel(null);
  };

  const handleZoneSelect = (data) => {
    setHighlightedCargoId(null);
    setZonePanel(data);
  };

  // ⭐ 좌측 리스트 화물 클릭 → SearchPanel 검색과 동일한 줌인 + 하이라이트 효과
  const handleCargoClick = (cargo) => {
    const warehouseId = cargo.warehouseId;
    if (!warehouseId) return;

    setHighlightedCargoId(warehouseId);
    highlightByWarehouseId(warehouseId);
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ background: "#1a2132" }} />

      {/* 좌측 구역 화물 리스트 패널 */}
      {zonePanel && (
        <div
          className="absolute top-4 left-4 z-50 w-72 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 flex flex-col"
          style={{ maxHeight: "calc(100% - 2rem)" }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-white font-semibold text-sm">{zonePanel.zone}구역 적재 화물</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{zonePanel.list.length}건</span>
              <button onClick={() => setZonePanel(null)} className="text-gray-500 hover:text-white transition-colors text-sm">
                ✕
              </button>
            </div>
          </div>

          {/* 리스트 */}
          <div className="overflow-y-auto flex-1 p-3 space-y-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}>
            {zonePanel.list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-gray-500 text-xs">적재된 화물이 없습니다.</p>
              </div>
            ) : (
              zonePanel.list.map((cargo, idx) => {
                const isHighlighted = highlightedCargoId === cargo.warehouseId;
                return (
                  <div
                    key={cargo.stockId || idx}
                    onClick={() => handleCargoClick(cargo)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isHighlighted
                        ? "bg-green-500/20 border-green-500/60 shadow-lg shadow-green-500/10"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-green-500/30"
                    }`}
                  >
                    {/* 컨테이너 번호 + 위치 */}
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs font-mono font-bold tracking-wide ${isHighlighted ? "text-green-300" : "text-white"}`}>
                        {cargo.contNo || cargo.contNumber || "-"}
                      </span>
                      <span
                        className={`text-xs font-mono px-1.5 py-0.5 rounded ${isHighlighted ? "text-green-300 bg-green-500/20" : "text-green-400 bg-green-500/10"}`}
                      >
                        {cargo.warehouseId || "-"}
                      </span>
                    </div>
                    {/* 품명 */}
                    <div className={`text-xs truncate mb-1.5 ${isHighlighted ? "text-white" : "text-gray-200"}`}>{cargo.itemName || "일반화물"}</div>
                    {/* 화주 + 수량 */}
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>{cargo.repName || "-"}</span>
                      <span>{cargo.qty ? `${Number(cargo.qty).toLocaleString()}개` : "-"}</span>
                    </div>
                    {/* 하이라이트 중 표시 */}
                    {isHighlighted && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">위치 추적 중</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 우측 검색 패널 */}
      <SearchPanel
        warehouseRef={warehouseRef}
        onSearchResult={handleSearchResult}
        onWarehouseTypeChange={handleWarehouseTypeChange}
        onZoneSelect={handleZoneSelect}
        initialWarehouseType={warehouseType}
      />

      {import.meta.env.DEV && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
          <div>창고타입: {warehouseType === "bonded" ? "보세구역" : "국내창고"}</div>
          {searchResult && (
            <>
              <div>화물구분: {searchResult.cargoType === "import" ? "수입" : "수출"}</div>
              <div>검색결과: {searchResult.name}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default WarehouseView;
