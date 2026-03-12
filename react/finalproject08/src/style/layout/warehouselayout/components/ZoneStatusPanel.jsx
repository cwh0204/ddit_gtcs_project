import React, { memo } from "react";

// src/style/layout/warehouselayout/components/ZoneStatusPanel.jsx

/**
 * 검색바 하단 Zone Status 패널
 * - 검색바와 함께 우측 상단에 위치
 * - Top 3 구역 현황 표시
 * - 클릭 시 3D 창고에서 해당 구역 하이라이트
 */
const ZoneStatusPanel = memo(({ topZones, onZoneClick, className }) => {
  const defaultZones = [
    { zone: "A구역", flag: "🇰🇷", count: 145, status: "active" },
    { zone: "B구역", flag: "🇺🇸", count: 132, status: "active" },
    { zone: "C구역", flag: "🇯🇵", count: 118, status: "warning" },
  ];

  const zones = topZones || defaultZones;

  return (
    <div className={`bg-black/40 backdrop-blur-md rounded-lg border border-white/10 p-4 w-64 ${className || ""}`}>
      {/* 헤더 */}
      <div className="mb-3">
        <h3 className="text-white font-semibold text-sm">ZONES STATUS</h3>
        <p className="text-gray-400 text-xs mt-1">Top 3 구역</p>
      </div>

      {/* Zone 목록 */}
      <div className="space-y-2">
        {zones.slice(0, 3).map((zone, index) => (
          <div
            key={zone.zone}
            onClick={() => onZoneClick?.(zone.zone)}
            className="flex items-center gap-3 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            {/* 순위 뱃지 */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                index === 0 ? "bg-yellow-500 text-black" : index === 1 ? "bg-gray-400 text-black" : "bg-orange-500 text-black"
              }`}
            >
              {index + 1}
            </div>

            {/* 구역 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm truncate">{zone.zone}</span>
                <span className="text-sm">{zone.flag}</span>
              </div>
              <div className="text-xs text-gray-400">{zone.count} containers</div>
            </div>

            {/* 상태 점 */}
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                zone.status === "active" ? "bg-green-400" : zone.status === "warning" ? "bg-orange-400" : "bg-red-400"
              }`}
            />
          </div>
        ))}
      </div>

      {/* 하단 작은 표시 */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">실시간 업데이트</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ZoneStatusPanel.displayName = "ZoneStatusPanel";

export default ZoneStatusPanel;
