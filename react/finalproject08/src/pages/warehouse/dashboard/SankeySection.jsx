// src/pages/warehouse/dashboard/SankeySection.jsx

import { MapPin, Eye, BarChart3 } from "lucide-react";

function SankeySection() {
  return (
    <div className="section flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center max-w-6xl w-full px-6">
        {/* 섹션 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={28} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">인천항 보세창고 수용 현황</h2>
          </div>
          <p className="text-gray-600">
            전체 수용률: <span className="font-semibold text-blue-600">75%</span>
            {" • "}
            가용 공간: <span className="font-semibold text-green-600">250칸</span>
          </p>
        </div>

        {/* Sankey 차트 영역 (임시 플레이스홀더) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-6">
          <div className="h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 size={64} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Sankey 차트 (구현 예정)</h3>
              <p className="text-gray-500 max-w-md">창고 섹션별 화물 흐름을 시각화하는 인터랙티브 Sankey 다이어그램이 여기에 표시됩니다.</p>

              {/* 임시 섹션 정보 */}
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">A동 구역</h4>
                  <p className="text-blue-600">수용률: 85%</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">B동 구역</h4>
                  <p className="text-green-600">수용률: 60%</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800">C동 구역</h4>
                  <p className="text-purple-600">수용률: 90%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Eye size={18} />
          <p>D3.js 기반 실제 Sankey 차트가 구현될 예정입니다</p>
        </div>
      </div>
    </div>
  );
}

export default SankeySection;
