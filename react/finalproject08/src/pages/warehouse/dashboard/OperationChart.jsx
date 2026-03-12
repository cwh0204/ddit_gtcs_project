// src/pages/warehouse/dashboard/OperationChart.jsx

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { useWarehouseStats } from "../../../controller/warehouse/useWarehouseStats";

/**
 * 입출고 운영 현황 차트
 *
 * 업무: WAREHOUSE-DASH-00-01, 00-04
 * 목적: 수입/수출 단계별 진행 건수 실시간 모니터링
 *
 * 데이터 구조:
 * - 수입: 입고예정 → 게이트인 → 검수 → 적치 → 출고준비 → 출고
 * - 수출: 집하예정 → 게이트인 → 검수 → 적치 → 출고준비 → 반출
 */
function OperationChart() {
  // TanStack Query로 실시간 데이터 가져오기
  const { data: statsData, isLoading, error } = useWarehouseStats();

  // Mock 데이터 (실제 API 연동 전까지 사용)
  const mockData = useMemo(() => {
    return [
      // 수입 단계
      { stage: "입고예정", type: "import", count: 45, capacity: 100, color: "#3b82f6" },
      { stage: "게이트인", type: "import", count: 32, capacity: 50, color: "#3b82f6" },
      { stage: "검수", type: "import", count: 28, capacity: 50, color: "#3b82f6" },
      { stage: "적치", type: "import", count: 150, capacity: 300, color: "#3b82f6" },
      { stage: "출고준비", type: "import", count: 18, capacity: 50, color: "#3b82f6" },
      { stage: "출고", type: "import", count: 12, capacity: 50, color: "#3b82f6" },

      // 수출 단계
      { stage: "집하예정", type: "export", count: 38, capacity: 80, color: "#10b981" },
      { stage: "게이트인", type: "export", count: 25, capacity: 50, color: "#10b981" },
      { stage: "검수", type: "export", count: 22, capacity: 50, color: "#10b981" },
      { stage: "적치", type: "export", count: 120, capacity: 250, color: "#10b981" },
      { stage: "출고준비", type: "export", count: 15, capacity: 50, color: "#10b981" },
      { stage: "반출", type: "export", count: 10, capacity: 50, color: "#10b981" },
    ];
  }, []);

  // 실제 데이터가 있으면 사용, 없으면 Mock 데이터
  const chartData = statsData?.operationData || mockData;

  // 수입/수출 데이터 분리
  const importData = useMemo(() => {
    return chartData.filter((item) => item.type === "import");
  }, [chartData]);

  const exportData = useMemo(() => {
    return chartData.filter((item) => item.type === "export");
  }, [chartData]);

  // 수용률 계산 및 색상 결정
  const getBarColor = (count, capacity) => {
    const rate = (count / capacity) * 100;
    if (rate >= 90) return "#ef4444"; // 빨강 (위험)
    if (rate >= 70) return "#f97316"; // 주황 (경고)
    return "#10b981"; // 초록 (정상)
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const rate = ((data.count / data.capacity) * 100).toFixed(1);

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 mb-2">{data.stage}</p>
          <p className="text-sm text-gray-600">
            현재: <span className="font-semibold text-blue-600">{data.count}건</span>
          </p>
          <p className="text-sm text-gray-600">
            수용력: <span className="font-semibold">{data.capacity}건</span>
          </p>
          <p className="text-sm text-gray-600">
            수용률:{" "}
            <span className={`font-semibold ${rate >= 90 ? "text-red-600" : rate >= 70 ? "text-orange-600" : "text-green-600"}`}>{rate}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">데이터 로드 실패</p>
          <p className="text-gray-500 text-sm">Mock 데이터를 표시합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">입출고 운영 현황</h2>
        <p className="text-gray-600 text-lg">단계별 진행 건수 및 수용률 모니터링</p>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">수입</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">수출</span>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* 수입 차트 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">수입 단계별 현황</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={importData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} tick={{ fill: "#374151", fontSize: 12 }} />
              <YAxis label={{ value: "건수", angle: -90, position: "insideLeft", style: { fill: "#374151" } }} tick={{ fill: "#374151" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {importData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.count, entry.capacity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 수출 차트 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">수출 단계별 현황</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exportData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} tick={{ fill: "#374151", fontSize: 12 }} />
              <YAxis label={{ value: "건수", angle: -90, position: "insideLeft", style: { fill: "#374151" } }} tick={{ fill: "#374151" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {exportData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.count, entry.capacity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 하단 통계 요약 */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">수입 총 건수</p>
          <p className="text-2xl font-bold text-blue-600">{importData.reduce((sum, item) => sum + item.count, 0)}건</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">수출 총 건수</p>
          <p className="text-2xl font-bold text-green-600">{exportData.reduce((sum, item) => sum + item.count, 0)}건</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">출고 대기</p>
          <p className="text-2xl font-bold text-orange-600">{importData.find((item) => item.stage === "출고준비")?.count || 0}건</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">반출 대기</p>
          <p className="text-2xl font-bold text-orange-600">{exportData.find((item) => item.stage === "출고준비")?.count || 0}건</p>
        </div>
      </div>
    </div>
  );
}

export default OperationChart;
