// src/pages/warehouse/dashboard/components/InspectionChart.jsx

import { useMemo } from "react";
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useInspectionQueue } from "../../../controller/warehouse/useInspectionAndException";

/**
 * 현품검사 진행 현황 차트
 *
 * 업무: WAREHOUSE-DASH-00-03
 * 정책룰: 창고관리자 상태표 - 검사 단계
 *
 * 목적: 검사 병목 지점 실시간 파악
 *
 * 단계:
 * 1. 검사지시 수신 (검사대기)
 * 2. 검사중 (현품)
 * 3. 검사완료
 * 4. 검사 반려
 */
function InspectionChart() {
  // TanStack Query로 실시간 검사 대기열 가져오기
  const { data: inspectionData, isLoading, error } = useInspectionQueue();

  // Mock 데이터 (실제 API 연동 전까지 사용)
  const mockData = useMemo(() => {
    return [
      {
        stage: "검사지시 수신",
        value: 85,
        fill: "#fbbf24",
        status: "waiting",
        avgWaitTime: "2.5시간",
      },
      {
        stage: "검사중",
        value: 42,
        fill: "#f97316",
        status: "in_progress",
        avgDuration: "45분",
      },
      {
        stage: "검사완료",
        value: 28,
        fill: "#10b981",
        status: "completed",
        passRate: "95%",
      },
      {
        stage: "검사 반려",
        value: 5,
        fill: "#ef4444",
        status: "rejected",
        rejectReason: "서류 미비",
      },
    ];
  }, []);

  // 실제 데이터가 있으면 사용, 없으면 Mock 데이터
  const chartData = inspectionData?.funnelData || mockData;

  // 총 건수 계산
  const totalCount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // 단계별 비율 계산
  const getPercentage = (value) => {
    return ((value / totalCount) * 100).toFixed(1);
  };

  // 병목 지점 식별 (대기 시간이 긴 단계)
  const bottleneck = useMemo(() => {
    const waitingStage = chartData.find((item) => item.status === "waiting");
    if (waitingStage && waitingStage.value > 50) {
      return {
        stage: waitingStage.stage,
        count: waitingStage.value,
        severity: "high",
      };
    }
    return null;
  }, [chartData]);

  // 커스텀 라벨
  const CustomLabel = (props) => {
    const { x, y, width, height, value, stage } = props;
    const percentage = getPercentage(value);

    return (
      <g>
        <text x={x + width / 2} y={y + height / 2 - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold">
          {value}건
        </text>
        <text x={x + width / 2} y={y + height / 2 + 12} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize="14">
          ({percentage}%)
        </text>
      </g>
    );
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
          <p className="font-semibold text-gray-900 mb-3 text-lg">{data.stage}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              진행 건수: <span className="font-semibold text-blue-600">{data.value}건</span>
            </p>
            <p className="text-sm text-gray-600">
              비율: <span className="font-semibold">{getPercentage(data.value)}%</span>
            </p>
            {data.avgWaitTime && (
              <p className="text-sm text-gray-600">
                평균 대기: <span className="font-semibold text-orange-600">{data.avgWaitTime}</span>
              </p>
            )}
            {data.avgDuration && (
              <p className="text-sm text-gray-600">
                평균 소요: <span className="font-semibold text-green-600">{data.avgDuration}</span>
              </p>
            )}
            {data.passRate && (
              <p className="text-sm text-gray-600">
                통과율: <span className="font-semibold text-green-600">{data.passRate}</span>
              </p>
            )}
            {data.rejectReason && (
              <p className="text-sm text-gray-600">
                주요 사유: <span className="font-semibold text-red-600">{data.rejectReason}</span>
              </p>
            )}
          </div>
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
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">검사 데이터 로딩 중...</p>
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
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-slate-100 p-12">
      {/* 헤더 */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">현품검사 진행 현황</h2>
        <p className="text-gray-600 text-lg">검사 단계별 병목 지점 및 처리 속도 모니터링</p>

        {/* 병목 경고 */}
        {bottleneck && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-red-800">병목 지점 감지</p>
                <p className="text-sm text-red-700 mt-1">
                  <span className="font-semibold">{bottleneck.stage}</span>에 {bottleneck.count}건 대기 중 - 즉시 조치 필요
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 차트 영역 */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
        <div className="h-full flex items-center justify-center">
          <ResponsiveContainer width="80%" height="90%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel dataKey="value" data={chartData} isAnimationActive animationDuration={800}>
                <LabelList position="center" content={<CustomLabel />} />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* 단계별 상세 정보 */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          {chartData.map((item, index) => (
            <div key={index} className="border-l-4 pl-4 py-2" style={{ borderColor: item.fill }}>
              <p className="text-sm font-semibold text-gray-900">{item.stage}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: item.fill }}>
                {item.value}건
              </p>
              <p className="text-xs text-gray-500 mt-1">전체의 {getPercentage(item.value)}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 통계 요약 */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">총 검사 건수</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount}건</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">검사 대기</p>
          <p className="text-2xl font-bold text-yellow-600">{chartData.find((item) => item.status === "waiting")?.value || 0}건</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">검사 완료</p>
          <p className="text-2xl font-bold text-green-600">{chartData.find((item) => item.status === "completed")?.value || 0}건</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">검사 반려</p>
          <p className="text-2xl font-bold text-red-600">{chartData.find((item) => item.status === "rejected")?.value || 0}건</p>
        </div>
      </div>
    </div>
  );
}

export default InspectionChart;
