// src/pages/warehouse/report/TimeStatisticsPage.jsx
// ※ DeclarationStatisticsPage 통합 완료

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer } from "recharts";
import { statisticsApi } from "../../../api/supervisor/supervisorApi";
import StatisticsFilterPanel from "./components/StatisticsFilterPanel";

// ── 상태별 색상 ──────────────────────────────────────────
const STAGE_COLORS = {
  WAITING: "#f59e0b",
  PHYSICAL: "#f97316",
  SUPPLEMENT: "#fb7185",
  REVIEWING: "#3b82f6",
  ACCEPTED: "#06b6d4",
  REJECTED: "#dc2626",
  PAY_WAITING: "#a78bfa",
  PAY_COMPLETED: "#818cf8",
  RELEASE_APPROVED: "#16a34a",
  RELEASE_REJECTED: "#ef4444",
  INSPECTION_COMPLETED: "#10b981",
  APPROVED: "#0ea5e9",
  DELIVERED: "#64748b",
  ESCALATED: "#8b5cf6",
  CLEARED: "#22c55e",
};

const STAGE_LABELS = {
  WAITING: "심사대기",
  PHYSICAL: "검사중",
  SUPPLEMENT: "보완/정정",
  REVIEWING: "심사중",
  ACCEPTED: "수리",
  REJECTED: "반려",
  PAY_WAITING: "납부대기",
  PAY_COMPLETED: "납부완료",
  RELEASE_APPROVED: "반출승인",
  RELEASE_REJECTED: "반출차단",
  INSPECTION_COMPLETED: "검사완료",
  APPROVED: "통관승인",
  DELIVERED: "출고완료",
  ESCALATED: "결재요청",
  CLEARED: "통관완료",
};

// ── 수입/수출/전체 토글 ──────────────────────────────────
function DeclarationToggle({ value, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
      {[
        { key: "IMPORT", label: "수입" },
        { key: "EXPORT", label: "수출" },
        { key: "ALL", label: "전체" },
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

function ChartLoading() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#0f4c81]" />
    </div>
  );
}

function EmptyChart({ message = "데이터가 없습니다." }) {
  return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">{message}</div>;
}

// ── log-stats flat 객체 → 차트 배열 변환 ─────────────────
// SQL selectLogDashboardStats 응답:
// { waitingCount, supplementCount, acceptedCount, payWaitingCount,
//   releaseApprovedCount, releaseRejectedCount, inspectionCompletedCount, deliveredCount }
function logStatsToChartArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => ({
        stage: item.stage || STAGE_LABELS[item.status] || item.status || "-",
        status: item.status || "",
        count: Number(item.count ?? 0),
      }))
      .filter((d) => d.count > 0);
  }
  return [
    { status: "WAITING", label: "심사대기", key: "waitingCount" },
    { status: "SUPPLEMENT", label: "보완/정정", key: "supplementCount" },
    { status: "ACCEPTED", label: "수리", key: "acceptedCount" },
    { status: "PAY_WAITING", label: "납부대기", key: "payWaitingCount" },
    { status: "RELEASE_APPROVED", label: "반출승인", key: "releaseApprovedCount" },
    { status: "RELEASE_REJECTED", label: "반출차단", key: "releaseRejectedCount" },
    { status: "INSPECTION_COMPLETED", label: "검사완료", key: "inspectionCompletedCount" },
    { status: "DELIVERED", label: "출고완료", key: "deliveredCount" },
  ]
    .map(({ status, label, key }) => ({ stage: label, status, count: Number(raw[key] ?? 0) }))
    .filter((d) => d.count > 0);
}

// ── master-stats flat 객체 → 차트 배열 변환 ──────────────
// SQL selectMasterDashboardStats 응답:
// { waiting, reviewing, physical, supplement, escalated, accepted, rejected,
//   payWaiting, payCompleted, releaseApproved, releaseRejected, approved, delivered }
function masterStatsToChartArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) => ({
        stage: item.stage || STAGE_LABELS[item.status] || item.status || "-",
        status: item.status || "",
        count: Number(item.count ?? 0),
      }))
      .filter((d) => d.count > 0);
  }
  return [
    { status: "WAITING", label: "심사대기", key: "waiting" },
    { status: "REVIEWING", label: "심사중", key: "reviewing" },
    { status: "PHYSICAL", label: "검사중", key: "physical" },
    { status: "SUPPLEMENT", label: "보완/정정", key: "supplement" },
    { status: "ESCALATED", label: "결재요청", key: "escalated" },
    { status: "ACCEPTED", label: "수리", key: "accepted" },
    { status: "REJECTED", label: "반려", key: "rejected" },
    { status: "PAY_WAITING", label: "납부대기", key: "payWaiting" },
    { status: "PAY_COMPLETED", label: "납부완료", key: "payCompleted" },
    { status: "RELEASE_APPROVED", label: "반출승인", key: "releaseApproved" },
    { status: "RELEASE_REJECTED", label: "반출차단", key: "releaseRejected" },
    { status: "APPROVED", label: "통관승인", key: "approved" },
    { status: "DELIVERED", label: "출고완료", key: "delivered" },
  ]
    .map(({ status, label, key }) => ({ stage: label, status, count: Number(raw[key] ?? 0) }))
    .filter((d) => d.count > 0);
}

// ── 메인 페이지 ──────────────────────────────────────────
function TimeStatisticsPage() {
  const [declType, setDeclType] = useState("IMPORT");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [appliedFilters, setAppliedFilters] = useState({ startDate: "", endDate: "" });

  const apiParams = {
    startDate: appliedFilters.startDate || undefined,
    endDate: appliedFilters.endDate || undefined,
    declType,
  };

  const { data: logRaw, isLoading: logLoading } = useQuery({
    queryKey: ["statistics", "log-stats", apiParams],
    queryFn: () => statisticsApi.getLogDashboardStats(apiParams),
  });

  const { data: masterRaw, isLoading: masterLoading } = useQuery({
    queryKey: ["statistics", "master-stats", apiParams],
    queryFn: () => statisticsApi.getMasterDashboardStats(apiParams),
  });

  const handleSearch = (f) => setAppliedFilters(f);
  const handleReset = (f) => {
    setAppliedFilters(f);
    setFilters(f);
  };

  // ── 데이터 변환 ──────────────────────────────────────
  const stageProgressData = logStatsToChartArray(logRaw);
  const statusData = masterStatsToChartArray(masterRaw);

  // 반출 승인/차단 (TimeStatisticsPage 원본 차트용)
  const releaseApproved = statusData.find((d) => d.status === "RELEASE_APPROVED")?.count ?? 0;
  const releaseRejected = statusData.find((d) => d.status === "RELEASE_REJECTED")?.count ?? 0;
  const approvalRatio = [
    { name: "반출 승인", value: releaseApproved, color: "#16a34a" },
    { name: "반출 차단", value: releaseRejected, color: "#dc2626" },
  ];
  const approvalTotal = releaseApproved + releaseRejected;

  return (
    <div className="w-full bg-gray-50 p-6 space-y-6 overflow-auto">
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">반출 현황 통계</h2>
          <p className="text-sm text-gray-500 mt-0.5">신고서 처리 현황 및 누적 통계</p>
        </div>
        <DeclarationToggle value={declType} onChange={setDeclType} />
      </div>

      {/* ── 필터 ── */}
      <StatisticsFilterPanel filters={filters} onSearch={handleSearch} onReset={handleReset} />

      {/* ── 1행: 단계별 + 반출승인/차단 + 처리현황 도넛 (3칸 균등) ── */}
      <div className="grid grid-cols-3 gap-6">
        {/* 단계별 진행 현황 (log-stats 누적) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">단계별 진행 현황</h3>
            <span className="text-xs text-gray-400">누적 통계</span>
          </div>
          {logLoading ? (
            <ChartLoading />
          ) : stageProgressData.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <BarChart
                width={300}
                height={Math.max(280, stageProgressData.length * 36)}
                data={stageProgressData}
                layout="vertical"
                margin={{ top: 4, right: 48, bottom: 4, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fill: "#374151", fontSize: 11 }} width={72} />

                <Bar
                  dataKey="count"
                  name="건수"
                  radius={[0, 4, 4, 0]}
                  label={{ position: "right", fill: "#111827", fontSize: 11, fontWeight: 600, formatter: (v) => `${v}건` }}
                >
                  {stageProgressData.map((entry, i) => (
                    <Cell key={i} fill={STAGE_COLORS[entry.status] ?? "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          )}
        </div>

        {/* 반출 승인/차단 비율 (master-stats) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">반출 승인/차단 비율</h3>
            <span className="text-xs text-gray-400">실시간</span>
          </div>
          {masterLoading ? (
            <ChartLoading />
          ) : approvalTotal === 0 ? (
            <EmptyChart message="반출 데이터가 없습니다." />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={approvalRatio}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    isAnimationActive={false}
                    label={({ cx, cy, midAngle, outerRadius, percent }) => {
                      if (percent === 0) return null;
                      const RADIAN = Math.PI / 180;
                      const x = cx + (outerRadius + 18) * Math.cos(-midAngle * RADIAN);
                      const y = cy + (outerRadius + 18) * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="#111827" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
                          {`${(percent * 100).toFixed(1)}%`}
                        </text>
                      );
                    }}
                  >
                    {approvalRatio.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2">
                {approvalRatio.map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600 text-sm">{item.name}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{item.value}건</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-400">총 반출 요청</span>
                  <span className="text-lg font-bold text-gray-800">{approvalTotal}건</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 처리 현황 비율 도넛 (master-stats) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">처리 현황 비율</h3>
            <span className="text-xs text-gray-400">실시간</span>
          </div>
          {masterLoading ? (
            <ChartLoading />
          ) : statusData.length === 0 ? (
            <EmptyChart />
          ) : (
            (() => {
              const total = statusData.reduce((s, d) => s + d.count, 0);
              return (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="stage"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                        labelLine={false}
                        isAnimationActive={false}
                        label={({ cx, cy, midAngle, outerRadius, percent }) => {
                          if (percent < 0.04) return null;
                          const RADIAN = Math.PI / 180;
                          const x = cx + (outerRadius + 18) * Math.cos(-midAngle * RADIAN);
                          const y = cy + (outerRadius + 18) * Math.sin(-midAngle * RADIAN);
                          return (
                            <text x={x} y={y} fill="#111827" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          );
                        }}
                      >
                        {statusData.map((entry, i) => (
                          <Cell key={i} fill={STAGE_COLORS[entry.status] ?? "#94a3b8"} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full space-y-1 text-xs">
                    {statusData.map((entry, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: STAGE_COLORS[entry.status] ?? "#94a3b8" }}
                        />
                        <span className="text-gray-600 w-16 flex-shrink-0">{entry.stage}</span>
                        <span className="font-semibold text-gray-800 w-10 text-right flex-shrink-0">{entry.count}건</span>
                        <span className="text-gray-400 w-12 text-right flex-shrink-0">
                          {total > 0 ? ((entry.count / total) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* ── 3행: 신고서 상태별 전체 현황 와이드 (master-stats) ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">신고서 상태별 전체 현황</h3>
          <span className="text-xs text-gray-400">실시간 기준</span>
        </div>
        {masterLoading ? (
          <ChartLoading />
        ) : statusData.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="flex items-center justify-center overflow-x-auto">
            <BarChart
              width={Math.max(900, statusData.length * 80)}
              height={280}
              data={statusData}
              margin={{ top: 28, right: 20, bottom: 10, left: 20 }}
              barCategoryGap="12%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" tick={{ fill: "#374151", fontSize: 12 }} height={40} interval={0} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />

              <Bar
                dataKey="count"
                name="건수"
                radius={[4, 4, 0, 0]}
                barSize={48}
                label={{ position: "top", fill: "#111827", fontSize: 11, fontWeight: 600, formatter: (v) => `${v}건` }}
              >
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={STAGE_COLORS[entry.status] ?? "#94a3b8"} />
                ))}
              </Bar>
            </BarChart>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeStatisticsPage;
