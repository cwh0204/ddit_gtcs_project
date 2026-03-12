// src/style/layout/warehouselayout/components/SearchPanel.jsx

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { WAREHOUSE_TYPE_DATA, getZoneStatus } from "../../../../domain/warehouse/warehouseTypeData";
import { useCargoByContainerNumber, useCargoByItemName, useCargoList } from "../../../../controller/warehouse/useZonesAndCargo";
import { use3DHighlight } from "../../../../controller/warehouse/use3DHighlight";
import warehouseApi from "../../../../api/warehouse/warehouseApi";
import {
  getImportSteps,
  getExportSteps,
  getStepIndexByStatus,
  getCargoStatus,
  getCargoType,
  getStepStyle,
} from "../../../../domain/warehouse/utils/cargoTrackingSteps";

const SearchPanel = ({ warehouseRef, onSearchResult, onWarehouseTypeChange, onZoneSelect, initialWarehouseType = "bonded" }) => {
  const searchInputRef = useRef(null);
  const [isZoneStatusVisible, setIsZoneStatusVisible] = useState(true);
  const [warehouseType, setWarehouseType] = useState(initialWarehouseType);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState(null); // 클릭된 구역 (예: "A")

  const currentData = WAREHOUSE_TYPE_DATA[warehouseType];

  // ✅ "local" 통일 (이전: "domestic")
  const positionArea = warehouseType === "bonded" ? "BONDED" : "LOCAL";

  // ✅ 백엔드에서 구역별 카운트 조회
  const { data: areaCountData } = useQuery({
    queryKey: ["warehouseAreaCount", positionArea],
    queryFn: () => warehouseApi.getAreaCount(positionArea),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  // API 데이터를 zones 형식으로 변환
  const zones = (areaCountData || []).map((item) => ({
    zone: `${item.area}구역`,
    count: item.count || 0,
    status: getZoneStatus(item.count || 0),
  }));

  // ⭐ 입력값이 컨테이너 번호 형식인지 판별 (예: A-01-02-03 또는 영문+숫자 혼합 패턴)
  const isContainerNumber = (query) => /^[A-Za-z]-\d{2}-\d{2}-\d{2}$/.test(query) || /^[A-Z]{4}\d{6,}/.test(query);

  const isContNo = !!searchQuery && isContainerNumber(searchQuery);
  const isItemName = !!searchQuery && !isContainerNumber(searchQuery);

  const contNoResult = useCargoByContainerNumber(isContNo ? searchQuery : "", positionArea);
  const itemNameResult = useCargoByItemName(isItemName ? searchQuery : "", positionArea, true);

  // 검색 방식에 따라 결과 선택
  const foundCargo = isContNo ? contNoResult.data || null : itemNameResult.data || null;
  const isLoading = contNoResult.isLoading || contNoResult.isFetching || itemNameResult.isLoading || itemNameResult.isFetching;
  const error =
    !foundCargo &&
    !isLoading &&
    searchQuery &&
    (contNoResult.error || itemNameResult.error || (isItemName && itemNameResult.isFetched && !itemNameResult.data));

  // 구역별 화물 목록 (구역 클릭 시 사용)
  const listCargoType = positionArea === "BONDED" ? "import" : "local";
  const { data: allCargoList } = useCargoList({ cargoType: listCargoType });
  const zoneCargoList = selectedZone ? (allCargoList || []).filter((c) => (c.warehouseId || "").charAt(0) === selectedZone) : [];

  // 구역 선택/해제 시 부모에 데이터 전달 (allCargoList 선언 이후에 위치)
  useEffect(() => {
    if (!onZoneSelect) return;
    if (!selectedZone) {
      onZoneSelect(null);
      return;
    }
    const list = (allCargoList || []).filter((c) => (c.warehouseId || "").charAt(0) === selectedZone);
    onZoneSelect({ zone: selectedZone, list });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone, allCargoList]);
  const { highlightByWarehouseId, resetHighlight, highlightZone } = use3DHighlight(warehouseRef);

  const cargoStatus = getCargoStatus(foundCargo);
  const cargoType = getCargoType(foundCargo);
  const locatedWarehouseId = foundCargo?.warehouseId || foundCargo?.name;
  const currentSteps = cargoType === "export" ? getExportSteps(cargoStatus) : getImportSteps(cargoStatus);
  const currentStepIndex = getStepIndexByStatus(cargoStatus, currentSteps);

  const handleSearch = () => {
    const trimmedId = searchInputRef.current?.value.trim() || "";
    if (!trimmedId) {
      alert("품명을 입력해주세요.");
      return;
    }
    setSearchQuery(trimmedId);
  };

  useEffect(() => {
    if (!locatedWarehouseId) return;
    highlightByWarehouseId(locatedWarehouseId);
    if (onSearchResult) {
      onSearchResult({
        name: locatedWarehouseId,
        zone: locatedWarehouseId?.charAt(0),
        count: 1,
        status: "active",
        warehouseType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locatedWarehouseId]);

  const handleReset = () => {
    if (searchInputRef.current) searchInputRef.current.value = "";
    setSearchQuery("");
    setSelectedZone(null);
    resetHighlight();
    if (onSearchResult) onSearchResult(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleZoneClick = (zoneName) => {
    if (foundCargo) return;
    const zoneCode = zoneName.replace("구역", "").trim();
    if (selectedZone === zoneCode) {
      setSelectedZone(null);
      resetHighlight();
      if (onZoneSelect) onZoneSelect(null);
    } else {
      setSelectedZone(zoneCode);
      highlightZone(zoneName);
    }
  };

  const handleWarehouseTypeChange = (type) => {
    setWarehouseType(type);
    handleReset();
    if (onWarehouseTypeChange) onWarehouseTypeChange(type);
  };

  const displayCargo = foundCargo
    ? {
        id: locatedWarehouseId || foundCargo.contNumber,
        zone: (locatedWarehouseId?.charAt(0) || "A") + "구역",
        zoneCode: locatedWarehouseId?.charAt(0) || "A",
        position: {
          row: parseInt(locatedWarehouseId?.split("-")[1]) || 0,
          col: parseInt(locatedWarehouseId?.split("-")[2]) || 0,
          floor: parseInt(locatedWarehouseId?.split("-")[3]) || 0,
        },
        declarationNumber: foundCargo.declNo || "-",
        uniqueNumber: foundCargo.uniqueNo || "-",
        containerNumber: foundCargo.contNumber || foundCargo.contNo || "-",
        itemName: foundCargo.itemName || "일반화물",
        quantity: foundCargo.qty || 0,
        weight: foundCargo.grossWeight ? `${foundCargo.grossWeight}kg` : "-",
        entryDate: foundCargo.entryDate ? new Date(foundCargo.entryDate).toLocaleDateString("ko-KR") : "-",
        repName: foundCargo.repName || "-",
        positionAreaLabel: foundCargo.positionArea === "BONDED" ? "보세구역" : "국내창고",
        cargoTypeLabel: cargoType === "export" ? "수출" : "수입",
      }
    : null;

  return (
    <div className="absolute top-4 right-4 z-50 space-y-1">
      {/* 창고 구분 탭 */}
      <div className="w-80 p-3 rounded-lg bg-black/45 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white font-semibold w-16">창고 구분</span>
          <div className="flex-1 inline-flex bg-black/40 rounded-md p-0.5 border border-white/10">
            <button
              onClick={() => handleWarehouseTypeChange("bonded")}
              disabled={isLoading}
              className={`flex-1 px-4 py-1.5 rounded text-xs font-semibold transition-all duration-300 ease-in-out transform disabled:opacity-50 ${
                warehouseType === "bonded"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              보세구역
            </button>
            {/* ✅ "domestic" → "local" 통일 */}
            <button
              onClick={() => handleWarehouseTypeChange("local")}
              disabled={isLoading}
              className={`flex-1 px-4 py-1.5 rounded text-xs font-semibold transition-all duration-300 ease-in-out transform disabled:opacity-50 ${
                warehouseType === "local"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              국내창고
            </button>
          </div>
        </div>
      </div>

      {/* 검색 패널 */}
      <div className="w-80 flex items-center gap-2 p-3 rounded-lg bg-black/45 backdrop-blur-sm">
        <input
          ref={searchInputRef}
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="품명을 입력해주세요"
          disabled={isLoading}
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-200 disabled:opacity-50"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-2 py-2 rounded-lg bg-green-500/95 hover:bg-green-500 text-white font-bold text-xs transition-all duration-200 hover:scale-105 shrink-0 disabled:opacity-50"
        >
          {isLoading ? "검색중..." : "찾기"}
        </button>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-2 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all duration-200 hover:scale-105 shrink-0 disabled:opacity-50"
        >
          초기화
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <div className="w-80 p-3 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/50">
          <p className="text-red-300 text-xs">화물을 찾을 수 없습니다.</p>
        </div>
      )}

      {/* 화물 정보 / 구역 상태 */}
      <div className="w-80 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-4">
        {displayCargo ? (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-blue-400 font-semibold text-sm">CARGO INFO</h3>
              <p className="text-gray-400 text-xs mt-1">
                {displayCargo.positionAreaLabel} · {displayCargo.cargoTypeLabel}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-white font-mono text-lg font-bold">{displayCargo.id}</div>
              <div className="text-sm mt-1 text-blue-400">{displayCargo.zone}</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">위치</span>
                <span className="text-white">
                  {displayCargo.position.row}행 {displayCargo.position.col}열 {displayCargo.position.floor}층
                </span>
              </div>
              {warehouseType === "bonded" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">신고번호</span>
                    <span className="text-white font-mono text-xs">{displayCargo.declarationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">통관고유부호</span>
                    <span className="text-white font-mono text-xs">{displayCargo.uniqueNumber}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">컨테이너</span>
                <span className="text-white font-mono text-xs">{displayCargo.containerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">화주 성명</span>
                <span className="text-white">{displayCargo.repName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">품명</span>
                <span className="text-white">{displayCargo.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">수량</span>
                <span className="text-white">{displayCargo.quantity}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">중량</span>
                <span className="text-white">{displayCargo.weight}</span>
              </div>
            </div>

            {/* 동적 프로세스 스텝 */}
            <div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{displayCargo.cargoTypeLabel} 통관 진행현황</p>
              <div className="space-y-2">
                {currentSteps.map((step, index) => {
                  const style = getStepStyle(index, currentStepIndex, step.id);
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`} />
                        {index < currentSteps.length - 1 && (
                          <div className={`w-px h-3 mt-0.5 ${isCompleted ? "bg-green-400/50" : "bg-gray-600/50"}`} />
                        )}
                      </div>
                      <span className={`text-xs leading-none ${style.text}`}>{step.label}</span>
                      {isCurrent && style.pulse && <span className={`text-xs animate-pulse ${style.text}`}>진행 중...</span>}
                      {isCompleted && <span className="text-xs text-green-500">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">입고일: {displayCargo.entryDate}</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400">TRACKING</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 구역 상태 표시 */
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-semibold text-sm">{currentData.icon} ZONES STATUS</h3>
                <p className="text-gray-400 text-xs mt-1">{currentData.label}</p>
              </div>
              <button
                onClick={() => setIsZoneStatusVisible(!isZoneStatusVisible)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: isZoneStatusVisible ? "#22c55e" : "#374151" }}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${isZoneStatusVisible ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            {isZoneStatusVisible && (
              <div className="space-y-1 mt-2">
                {zones.map((zone) => {
                  const status = getZoneStatus(zone.count);
                  const zoneCode = zone.zone.replace("구역", "").trim();
                  const isSelected = selectedZone === zoneCode;
                  return (
                    <div
                      key={zone.zone}
                      onClick={() => handleZoneClick(zone.zone)}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        isSelected ? "bg-green-500/20 border border-green-500/40" : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm font-semibold ${isSelected ? "text-green-400" : "text-white"}`}>{zone.zone}</span>
                        <span className="text-xs text-gray-400">
                          {status === "full" ? <span className="text-red-400 font-bold">FULL</span> : `${zone.count}/50`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === "full" || status === "danger" ? "bg-red-500" : status === "warning" ? "bg-orange-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min((zone.count / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SearchPanel;
