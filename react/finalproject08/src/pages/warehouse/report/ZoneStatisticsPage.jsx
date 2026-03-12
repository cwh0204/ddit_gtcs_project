// src/pages/warehouse/report/ZoneStatisticsPage.jsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { statisticsApi } from "../../../api/supervisor/supervisorApi";
import { useZoneAreaStats } from "../../../controller/warehouse/useZoneAreaStats";
import StatisticsFilterPanel from "./components/StatisticsFilterPanel";

// 구역별 수용률 색상
const getOccupancyColor = (rate) => {
  if (rate >= 90) return "#dc2626";
  if (rate >= 70) return "#f97316";
  return "#3b82f6";
};

// 빈 차트 placeholder
function EmptyChart({ message = "데이터 없음" }) {
  return <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">{message}</div>;
}

// 수입/수출/전체 토글
function DeclarationToggle({ value, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
      {[
        { key: "import", label: "수입" },
        { key: "export", label: "수출" },
        { key: "total", label: "전체" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-5 py-1.5 rounded-md text-sm font-semibold transition-all border ${
            value === key ? "bg-white text-blue-700 shadow border-gray-200" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ZoneStatisticsPage() {
  const [declType, setDeclType] = useState("import");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  // declType 매핑 (API 파라미터)
  const apiDeclType = declType === "import" ? "IMPORT" : declType === "export" ? "EXPORT" : "ALL";

  // ── 구역별 수용률 + 창고 유형별 점유율 (프론트 집계, declType 반영) ──
  const { zoneOccupancy, warehouseTypeRatio, isLoading: zoneAreaLoading } = useZoneAreaStats(apiDeclType);

  // 창고 유형별 총합
  const warehouseTotal = warehouseTypeRatio.reduce((sum, i) => sum + i.value, 0);

  // ── API: 구역별 검사 현황 ──
  const { data: zoneInspectionRaw, isLoading: zoneLoading } = useQuery({
    queryKey: ["statistics", "zone-inspection", apiDeclType, filters],
    queryFn: () =>
      statisticsApi.getZoneInspectionStats({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        declType: apiDeclType,
      }),
  });

  // 구역별 검사 현황 데이터 변환
  const inspectionData = Array.isArray(zoneInspectionRaw)
    ? zoneInspectionRaw.map((d) => ({
        zone: `${d.zone}구역`,
        inProgress: d.physicalCount ?? 0,
        completed: d.completedCount ?? 0,
      }))
    : [];

  const handleSearch = (newFilters) => setFilters(newFilters);
  const handleReset = (resetFilters) => setFilters(resetFilters);

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">구역별 현황 통계</h2>
        <DeclarationToggle value={declType} onChange={setDeclType} />
      </div>

      {/* 필터 */}
      <div className="mb-6">
        <StatisticsFilterPanel filters={filters} onSearch={handleSearch} onReset={handleReset} />
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-6">
        {/* ── 구역별 수용률 — useZoneAreaStats 연동 ── */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col" style={{ minHeight: 320 }}>
          <h3 className="text-base font-semibold text-gray-800 mb-4">구역별 수용률</h3>
          {zoneAreaLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>
          ) : zoneOccupancy.length === 0 ? (
            <EmptyChart message="데이터 없음" />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-center">
                <BarChart width={580} height={230} data={zoneOccupancy} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="zone" tick={{ fill: "#374151", fontSize: 13 }} />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    label={{
                      value: "수용률(%)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#6b7280",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]} name="수용률">
                    {zoneOccupancy.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getOccupancyColor(entry.rate)} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                  <span className="text-xs text-gray-600">여유 (70% 미만)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                  <span className="text-xs text-gray-600">주의 (70~89%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#dc2626]" />
                  <span className="text-xs text-gray-600">위험 (90% 이상)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 창고 유형별 점유율 — useZoneAreaStats 연동 (declType 반영) ── */}
        <div className="row-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-semibold text-gray-800 mb-4">창고 유형별 점유율</h3>
          {zoneAreaLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>
          ) : warehouseTotal === 0 ? (
            <EmptyChart message="데이터 없음" />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <PieChart width={280} height={280}>
                <Pie data={warehouseTypeRatio} cx={140} cy={140} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  {warehouseTypeRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="w-full space-y-3">
                {warehouseTypeRatio.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{item.value.toLocaleString()}건</p>
                      <p className="text-xs text-gray-500">{warehouseTotal > 0 ? ((item.value / warehouseTotal) * 100).toFixed(1) : 0}%</p>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">총 화물</span>
                  <span className="text-2xl font-bold text-gray-900">{warehouseTotal.toLocaleString()}건</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 구역별 검사 현황 — API 연동 ── */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-semibold text-gray-800 mb-4">구역별 검사 현황</h3>
          {zoneLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">로딩 중...</div>
          ) : inspectionData.length === 0 ? (
            <EmptyChart message="데이터 없음" />
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-center">
                <BarChart width={780} height={230} data={inspectionData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="zone" tick={{ fill: "#374151", fontSize: 13 }} />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    label={{
                      value: "검사 건수",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#6b7280",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="검사중" />
                  <Bar dataKey="completed" stackId="a" fill="#16a34a" name="완료" radius={[6, 6, 0, 0]} />
                </BarChart>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                  <span className="text-xs text-gray-600">검사중</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#16a34a]" />
                  <span className="text-xs text-gray-600">완료</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZoneStatisticsPage;
