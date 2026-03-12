// src/pages/warehouse/cargo/components/form/ZoneStatusPanel.jsx

import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { WAREHOUSE_TYPE_DATA, getZoneStatus } from "../../../../../domain/warehouse/warehouseTypeData";
import warehouseApi from "../../../../../api/warehouse/warehouseApi";

const WAREHOUSE_TYPE_KEY = { BONDED: "bonded", LOCAL: "local" };

function ZoneStatusPanel({ warehouseType, selectedZone }) {
  const typeKey = WAREHOUSE_TYPE_KEY[warehouseType] || "bonded";
  const { label } = WAREHOUSE_TYPE_DATA[typeKey];
  const positionArea = warehouseType === "LOCAL" ? "LOCAL" : "BONDED";

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

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* 헤더 */}
      <div className="px-5 py-3 bg-[#f9fbff] border-b border-gray-200 border-l-4 border-l-[#0f4c81]">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">구역 현황</p>
        <p className="text-sm font-bold text-[#0f4c81] mt-0.5">{label}</p>
      </div>

      {/* 구역 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {zones.map((zone) => {
          const status = getZoneStatus(zone.count);
          const zoneCode = zone.zone.charAt(0);
          const isSelected = selectedZone === zoneCode;
          const pct = Math.min((zone.count / 50) * 100, 100);

          const barColor = status === "full" || status === "danger" ? "bg-red-400" : status === "warning" ? "bg-orange-400" : "bg-[#0f4c81]/60";

          const countColor = status === "full" || status === "danger" ? "text-red-500" : status === "warning" ? "text-orange-500" : "text-gray-500";

          return (
            <div
              key={zone.zone}
              className={`p-3 rounded-lg border transition-all ${
                isSelected ? "border-[#0f4c81] bg-blue-50 shadow-sm" : "border-gray-100 bg-gray-50 hover:bg-[#f9fbff]"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  {isSelected ? (
                    <MapPin className="w-3.5 h-3.5 text-[#0f4c81]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">{zoneCode}</span>
                    </div>
                  )}
                  <span className={`text-sm font-semibold ${isSelected ? "text-[#0f4c81]" : "text-gray-700"}`}>{zone.zone}</span>
                </div>
                <span className={`text-xs font-bold ${countColor}`}>{status === "full" ? "FULL" : `${zone.count} / 50`}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-[#f9fbff]">
        <div className="flex justify-around">
          {[
            { color: "bg-[#0f4c81]/60", label: "여유" },
            { color: "bg-orange-400", label: "주의" },
            { color: "bg-red-400", label: "위험/만석" },
          ].map(({ color, label: l }) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-gray-500">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ZoneStatusPanel;
