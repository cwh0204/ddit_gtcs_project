// src/pages/warehouse/report/AiRiskStatisticsPage.jsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer } from "recharts";
import { statisticsApi } from "../../../api/supervisor/supervisorApi";
import StatisticsFilterPanel from "./components/StatisticsFilterPanel";

// ── 점수 구간 정의 ────────────────────────────────────────
const SCORE_BANDS = [
  { label: "0~10점", key: "score0to10", color: "#22c55e" },
  { label: "11~20점", key: "score11to20", color: "#4ade80" },
  { label: "21~30점", key: "score21to30", color: "#a3e635" },
  { label: "31~40점", key: "score31to40", color: "#facc15" },
  { label: "41~50점", key: "score41to50", color: "#fb923c" },
  { label: "51~60점", key: "score51to60", color: "#f97316" },
  { label: "61~70점", key: "score61to70", color: "#ef4444" },
  { label: "71~80점", key: "score71to80", color: "#dc2626" },
  { label: "81~90점", key: "score81to90", color: "#b91c1c" },
  { label: "91~100점", key: "score91to100", color: "#7f1d1d" },
];

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
    <div className="flex items-center justify-center h-52">
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#0f4c81]" />
    </div>
  );
}

function EmptyChart({ message = "데이터가 없습니다." }) {
  return <div className="flex items-center justify-center h-52 text-gray-400 text-sm">{message}</div>;
}

function PieLabel({ cx, cy, midAngle, outerRadius, percent }) {
  if (percent < 0.03) return null;
  const RADIAN = Math.PI / 180;
  const x = cx + (outerRadius + 22) * Math.cos(-midAngle * RADIAN);
  const y = cy + (outerRadius + 22) * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#111827" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
}

function DonutCard({ title, data, total, totalLabel = "합계" }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-400">실시간</span>
      </div>
      {total === 0 ? (
        <EmptyChart />
      ) : (
        <div className="flex flex-row items-center gap-4">
          <div className="w-[48%]">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  isAnimationActive={false}
                  label={PieLabel}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-[52%] space-y-3">
            {data.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-900">{item.value.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-0.5">건</span>
                  {item.rate != null && <span className="text-xs text-gray-400 ml-1">{Number(item.rate).toFixed(1)}%</span>}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-400">{totalLabel}</span>
              <span className="text-lg font-bold text-gray-800">{total.toLocaleString()}건</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────
function AiRiskStatisticsPage() {
  const [declType, setDeclType] = useState("IMPORT");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [appliedFilters, setAppliedFilters] = useState({ startDate: "", endDate: "" });

  const baseParams = {
    startDate: appliedFilters.startDate || undefined,
    endDate: appliedFilters.endDate || undefined,
  };
  const apiParams = { ...baseParams, declType };

  const { data: raw, isLoading } = useQuery({
    queryKey: ["statistics", "sla-stats", apiParams],
    queryFn: () => statisticsApi.getSlaStats(apiParams),
  });

  // 수입 고정 조회 (납부세액·심사건수 차트는 수입만 표시)
  const { data: rawImport, isLoading: loadingImport } = useQuery({
    queryKey: ["statistics", "sla-stats", { ...baseParams, declType: "IMPORT" }],
    queryFn: () => statisticsApi.getSlaStats({ ...baseParams, declType: "IMPORT" }),
  });

  const handleSearch = (f) => setAppliedFilters(f);
  const handleReset = (f) => {
    setAppliedFilters(f);
    setFilters(f);
  };

  const parse = (r) => (Array.isArray(r) ? (r[0] ?? {}) : (r ?? {}));
  const d = parse(raw);
  const dI = parse(rawImport);

  // ── 점수 구간 ─────────────────────────────────────────
  const scoreBandData = SCORE_BANDS.map(({ label, key, color }) => ({
    label,
    count: Number(d[key] ?? 0),
    color,
  }));

  // ── 위험도 도넛 ───────────────────────────────────────
  const redCount = Number(d.redCount ?? 0);
  const greenCount = Number(d.greenCount ?? 0);
  const riskTotal = redCount + greenCount;
  const riskData = [
    { name: "고위험(RED)", value: redCount, color: "#ef4444" },
    { name: "정상(GREEN)", value: greenCount, color: "#22c55e" },
  ];

  // ── 지연 도넛 ─────────────────────────────────────────
  const delayY = Number(d.delayY ?? 0);
  const delayN = Number(d.delayN ?? 0);
  const delayTotal = delayY + delayN;
  const delayData = [
    { name: "지연 발생", value: delayY, rate: d.delayYRate, color: "#ef4444" },
    { name: "정상 처리", value: delayN, rate: d.delayNRate, color: "#3b82f6" },
  ];

  // ── 심사건수 + 납부세액 그룹 막대 (수입만) ────────────
  const taxRaw = Number(dI.totalTaxAmount ?? 0);
  const taxUnit = taxRaw >= 100_000_000 ? "억원" : taxRaw >= 10_000 ? "만원" : "원";
  const taxDiv = taxRaw >= 100_000_000 ? 100_000_000 : taxRaw >= 10_000 ? 10_000 : 1;

  const groupBarData = [
    {
      name: "수입",
      심사건수: Number(dI.redCount ?? 0) + Number(dI.greenCount ?? 0),
      납부세액: taxRaw / taxDiv,
    },
  ];

  return (
    <div className="w-full bg-gray-50 p-6 space-y-6 overflow-auto">
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">리스크 및 세액 통계</h2>
        </div>
        <DeclarationToggle value={declType} onChange={setDeclType} />
      </div>

      {/* ── 필터 ── */}
      <StatisticsFilterPanel filters={filters} onSearch={handleSearch} onReset={handleReset} />

      {/* ── AI 점수 구간별 분포 (전체 폭) ── */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">AI 심사 점수 구간별 분포</h3>
          <span className="text-xs text-gray-400">낮을수록 안전 → 높을수록 위험</span>
        </div>
        {isLoading ? (
          <ChartLoading />
        ) : scoreBandData.every((d) => d.count === 0) ? (
          <EmptyChart />
        ) : (
          <div className="flex items-center justify-center overflow-x-auto">
            <BarChart
              width={Math.max(900, scoreBandData.length * 90)}
              height={280}
              data={scoreBandData}
              margin={{ top: 28, right: 20, bottom: 10, left: 20 }}
              barCategoryGap="16%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fill: "#374151", fontSize: 12 }} height={36} interval={0} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                barSize={52}
                label={{
                  position: "top",
                  fill: "#111827",
                  fontSize: 11,
                  fontWeight: 600,
                  formatter: (v) => (v > 0 ? `${v}건` : ""),
                }}
              >
                {scoreBandData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </div>
        )}
      </div>

      {/* ── 3칸: 심사건수+납부세액 | 위험도 도넛 | 지연 도넛 ── */}
      <div className="grid grid-cols-3 gap-6">
        {/* 심사건수 + 납부세액 그룹 막대 (수입) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">심사건수 · 납부세액</h3>
            <span className="text-xs text-gray-400">수입 기준</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#3b82f6]" /> 심사건수 (건)
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#f97316]" /> 납부세액 ({taxUnit})
            </span>
          </div>
          {loadingImport ? (
            <ChartLoading />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={groupBarData} margin={{ top: 24, right: 20, bottom: 10, left: 10 }} barCategoryGap="40%" barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 12 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Bar
                  dataKey="심사건수"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={36}
                  label={{
                    position: "top",
                    fill: "#111827",
                    fontSize: 11,
                    fontWeight: 600,
                    formatter: (v) => (v > 0 ? `${v}건` : ""),
                  }}
                />
                <Bar
                  dataKey="납부세액"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  barSize={36}
                  label={{
                    position: "top",
                    fill: "#f97316",
                    fontSize: 11,
                    fontWeight: 600,
                    formatter: (v) => (v > 0 ? `${v.toFixed(1)}${taxUnit}` : ""),
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 위험도 판정 도넛 */}
        <DonutCard title="위험도 판정 비율" data={riskData} total={riskTotal} totalLabel="총 심사" />

        {/* 처리 지연 도넛 */}
        <DonutCard title="처리 지연 현황" data={delayData} total={delayTotal} totalLabel="총 처리" />
      </div>
    </div>
  );
}

export default AiRiskStatisticsPage;
