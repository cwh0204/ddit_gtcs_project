// src/pages/warehouse/dashboard/AlertsActivitiesSection.jsx

import { AlertCircle, Clock, Thermometer, Bell, Activity, User } from "lucide-react";

function AlertsActivitiesSection() {
  return (
    <div className="section flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="grid grid-cols-[800px_1000px] gap-8 max-w-7xl w-full px-6">
        {/* 좌측: 긴급 알림 */}
        <div className="h-[800px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle size={24} className="text-red-500" />
            <h3 className="text-2xl font-bold text-gray-900">긴급 처리 필요</h3>
          </div>

          <div className="space-y-4">
            {/* 알림 카드 1 */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Thermometer size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">온도 이상 감지</h4>
                  <p className="text-gray-600 text-sm mt-1">B동 1구역 냉동고 온도가 기준치를 초과했습니다 (-15°C)</p>
                  <p className="text-xs text-gray-400 mt-2">2024-02-07 12:30</p>
                </div>
              </div>
            </div>

            {/* 알림 카드 2 */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-orange-500 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Clock size={16} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-800">보관기한 임박</h4>
                  <p className="text-gray-600 text-sm mt-1">TELU-1234567 컨테이너의 보관기한이 3일 남았습니다</p>
                  <p className="text-xs text-gray-400 mt-2">2024-02-07 06:00</p>
                </div>
              </div>
            </div>

            {/* 알림 카드 3 */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Bell size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">검사 일정 지연</h4>
                  <p className="text-gray-600 text-sm mt-1">MSKU-9876543 컨테이너 검사가 예정 시간을 4시간 초과했습니다</p>
                  <p className="text-xs text-gray-400 mt-2">2024-02-07 14:00</p>
                </div>
              </div>
            </div>

            {/* 알림 카드 4 */}
            <div className="bg-white rounded-lg shadow-md border-l-4 border-yellow-500 p-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Activity size={16} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">구역 수용률 초과</h4>
                  <p className="text-gray-600 text-sm mt-1">C동 1구역 수용률이 90%를 초과했습니다</p>
                  <p className="text-xs text-gray-400 mt-2">2024-02-07 08:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 최근 활동 */}
        <div className="h-[800px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={24} className="text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-900">최근 활동</h3>
          </div>

          <div className="space-y-4">
            {/* 활동 타임라인 */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* 활동 1 */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="bg-green-500 p-2 rounded-full relative z-10">
                  <User size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">화물 입고</p>
                  <p className="text-gray-600 text-sm">COSCO-5555555 컨테이너가 A동 2구역에 입고되었습니다</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">11:00</span>
                    <span className="text-xs text-blue-600">이창고</span>
                  </div>
                </div>
              </div>

              {/* 활동 2 */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="bg-blue-500 p-2 rounded-full relative z-10">
                  <Clock size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">검사 일정 등록</p>
                  <p className="text-gray-600 text-sm">MSKU-9876543 컨테이너 검사가 2월 8일 10:00에 예약되었습니다</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">10:30</span>
                    <span className="text-xs text-blue-600">박관세</span>
                  </div>
                </div>
              </div>

              {/* 활동 3 */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="bg-purple-500 p-2 rounded-full relative z-10">
                  <Activity size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">통관 승인</p>
                  <p className="text-gray-600 text-sm">COSCO-5555555 컨테이너가 통관 승인되었습니다</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">15:30</span>
                    <span className="text-xs text-blue-600">정수출</span>
                  </div>
                </div>
              </div>

              {/* 활동 4 */}
              <div className="relative flex items-start gap-4 pb-6">
                <div className="bg-indigo-500 p-2 rounded-full relative z-10">
                  <Thermometer size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">온도 조정</p>
                  <p className="text-gray-600 text-sm">B동 1구역 냉동고 온도를 -18°C로 조정했습니다</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">12:45</span>
                    <span className="text-xs text-blue-600">냉동고관리자</span>
                  </div>
                </div>
              </div>

              {/* 활동 5 */}
              <div className="relative flex items-start gap-4">
                <div className="bg-orange-500 p-2 rounded-full relative z-10">
                  <Activity size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">화물 이동</p>
                  <p className="text-gray-600 text-sm">TELU-1234567 컨테이너를 A동 1구역 내에서 재배치했습니다</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">09:15</span>
                    <span className="text-xs text-blue-600">최보관</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertsActivitiesSection;
