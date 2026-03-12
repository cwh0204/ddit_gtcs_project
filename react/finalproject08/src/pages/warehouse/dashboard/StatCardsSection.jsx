// src/pages/warehouse/dashboard/StatCardsSection.jsx

import { useState } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  Thermometer,
  Truck,
  DollarSign,
  Target,
  Percent,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

function StatCardsSection() {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Mock 데이터
  const warehouseData = [
    { name: "A동1", value: 85, color: "#3b82f6", efficiency: 94 },
    { name: "A동2", value: 72, color: "#10b981", efficiency: 88 },
    { name: "B동1", value: 90, color: "#f59e0b", efficiency: 96 },
    { name: "B동2", value: 45, color: "#ef4444", efficiency: 85 },
    { name: "C동1", value: 95, color: "#8b5cf6", efficiency: 98 },
    { name: "C동2", value: 67, color: "#06b6d4", efficiency: 91 },
  ];

  const monthlyData = [
    { month: "1월", revenue: 450, profit: 89 },
    { month: "2월", revenue: 520, profit: 102 },
    { month: "3월", revenue: 480, profit: 94 },
    { month: "4월", revenue: 610, profit: 125 },
    { month: "5월", revenue: 580, profit: 118 },
    { month: "6월", revenue: 650, profit: 134 },
  ];

  const segmentData = [
    { name: "수입화물", value: 45, color: "#3b82f6" },
    { name: "수출화물", value: 35, color: "#10b981" },
    { name: "냉동보관", value: 15, color: "#f59e0b" },
    { name: "특수화물", value: 5, color: "#ef4444" },
  ];

  // CSS 차트 컴포넌트들
  const BarChart = ({ data, height = 300 }) => (
    <div className="flex items-end justify-between h-full p-4 bg-gray-50 rounded-lg" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 mx-1">
          <div className="flex flex-col items-center justify-end h-full">
            <div className="text-xs font-medium text-gray-700 mb-2">{item.value}%</div>
            <div
              className="w-full max-w-16 rounded-t-md transition-all duration-1000 hover:opacity-80"
              style={{
                height: `${(item.value / 100) * 80}%`,
                backgroundColor: item.color,
                minHeight: "20px",
              }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-2 text-center">{item.name}</div>
        </div>
      ))}
    </div>
  );

  const LineChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map((d) => d.revenue));

    return (
      <div className="p-4 bg-gray-50 rounded-lg" style={{ height }}>
        <div className="relative h-full">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-200" />
            ))}
          </div>

          <div className="relative h-full flex items-end justify-between">
            {data.map((item, index) => {
              const height = (item.revenue / maxValue) * 80;
              const profitHeight = (item.profit / maxValue) * 80;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative flex flex-col items-center justify-end h-full">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mb-2 relative z-10" style={{ marginBottom: `${height}%` }} />
                    <div className="w-3 h-3 bg-green-500 rounded-full absolute" style={{ bottom: `${profitHeight}%` }} />
                  </div>
                  <div className="text-xs text-gray-600 mt-2">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const PieChart = ({ data, size = 160 }) => {
    let cumulativePercentage = 0;

    return (
      <div className="flex items-center justify-between p-4">
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(${data
                .map((item) => {
                  const startPercentage = cumulativePercentage;
                  cumulativePercentage += item.value;
                  return `${item.color} ${startPercentage}% ${cumulativePercentage}%`;
                })
                .join(", ")})`,
            }}
          />
          <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">100%</div>
              <div className="text-xs text-gray-600">총합</div>
            </div>
          </div>
        </div>
        <div className="flex-1 ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="section min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* 메인 콘텐츠 - 기존 사이드바는 WarehouseLayout에서 토글 처리 */}
      <div className="flex h-screen">
        {/* 🏗️ 중앙 메인 영역 */}
        <div className={`flex-1 bg-white transition-all duration-300 ${rightPanelOpen ? "mr-80" : "mr-0"}`}>
          {/* 상단 헤더 */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <Truck size={48} className="text-blue-400 mx-auto mb-2" />
                  <div className="text-sm">OTIF 달성률</div>
                  <div className="text-xl font-bold">94%</div>
                </div>

                <div className="text-center">
                  <Truck size={48} className="text-green-400 mx-auto mb-2 scale-x-[-1]" />
                  <div className="text-sm">OTD 달성률</div>
                  <div className="text-xl font-bold">96%</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-600 rounded-full px-4 py-2">
                <div className="bg-yellow-500 p-2 rounded-full">
                  <DollarSign size={20} />
                </div>
                <span>창고별 매출 및 수익</span>
              </div>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="p-8 overflow-y-auto" style={{ height: "calc(100vh - 120px)" }}>
            <div className="space-y-6">
              {/* 메인 바 차트 */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">창고 구역별 수용률 현황</h3>
                <BarChart data={warehouseData} height={300} />
              </div>

              {/* 하단 차트들 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">월별 매출 추이</h4>
                  <LineChart data={monthlyData} />
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-600">매출</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-600">수익</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">세그먼트별 분포</h4>
                  <PieChart data={segmentData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📈 우측 분석 패널 - 기존 사이드바와는 별도 */}
        <div
          className={`fixed right-0 top-0 h-full bg-slate-800 text-white transition-all duration-300 ease-in-out overflow-hidden z-40 ${
            rightPanelOpen ? "w-80" : "w-0"
          }`}
        >
          <div className="p-6 w-80 h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PieChartIcon size={24} />
              상세 분석
            </h3>

            <div className="space-y-4">
              {segmentData.map((segment, index) => (
                <div key={index} className="bg-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{segment.name}</span>
                    <span className="font-bold" style={{ color: segment.color }}>
                      {segment.value}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${segment.value}%`,
                        backgroundColor: segment.color,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">₩{Math.round((650 * segment.value) / 100)}M 매출</div>
                </div>
              ))}
            </div>

            {/* 추가 분석 정보 */}
            <div className="mt-8 space-y-3">
              <h4 className="text-lg font-semibold">주요 지표</h4>
              <div className="bg-slate-700 rounded-xl p-3">
                <div className="flex justify-between">
                  <span className="text-sm">평균 처리시간</span>
                  <span className="text-green-400 font-medium">2.3시간</span>
                </div>
              </div>
              <div className="bg-slate-700 rounded-xl p-3">
                <div className="flex justify-between">
                  <span className="text-sm">고객 만족도</span>
                  <span className="text-blue-400 font-medium">94%</span>
                </div>
              </div>
              <div className="bg-slate-700 rounded-xl p-3">
                <div className="flex justify-between">
                  <span className="text-sm">재고 회전율</span>
                  <span className="text-purple-400 font-medium">8.2회</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 우측 패널 토글 버튼 - 기존 사이드바와는 독립적 */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white p-3 rounded-l-lg shadow-lg z-50 transition-all duration-300 hover:bg-slate-700"
      >
        <ChevronLeft size={20} className={`transform transition-transform duration-300 ${rightPanelOpen ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}

export default StatCardsSection;
