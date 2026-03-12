// src/domain/warehouse/mapper/labels.js

/**
 * Warehouse 데이터 필드 라벨 정의
 * Import/Export와 동일한 패턴
 */

export const FIELD_LABELS = {
  // ========== 창고 통계 ==========
  warehouseStats: {
    totalCapacity: "총 수용량",
    totalOccupied: "현재 적치량",
    occupancyRate: "가동률",
    availableSpaces: "가용 공간",
    updatedAt: "갱신 시각",
    occupancyPercentText: "가동률 (퍼센트)",
    occupancyFraction: "적치 현황",
    isNearFull: "만석 임박 여부",
    isWarning: "주의 필요 여부",
  },

  // ========== 구역 정보 ==========
  zone: {
    id: "구역 ID",
    name: "구역명",
    capacity: "수용량",
    occupied: "적치량",
    occupancyRate: "가동률",
    available: "가용 공간",
    status: "상태",
    location: "위치",
    statusColor: "상태 색상",
    statusLabel: "상태 라벨",
    occupancyText: "적치 현황",
    availableText: "가용 공간 (표시용)",
    isFull: "만석 여부",
    isWarning: "주의 여부",
  },

  // ========== 화물 정보 ==========
  cargo: {
    id: "화물 ID",
    containerId: "컨테이너 ID",
    zone: "구역",
    position: "위치",
    status: "상태",
    itemType: "품목 유형",
    itemName: "품명",
    quantity: "수량",
    weight: "중량",
    volume: "부피",
    inboundDate: "입고일시",
    expectedOutboundDate: "예상 출고일시",
    owner: "화주",
    declarationId: "신고서 ID",
    inspectionStatus: "검사 상태",
    inspectionDate: "검사일시",
    inspector: "검사자",
    notes: "비고",
    statusColor: "상태 색상",
    statusLabel: "상태 라벨",
    inspectionStatusColor: "검사 상태 색상",
    inspectionStatusLabel: "검사 상태 라벨",
    inboundDateFormatted: "입고일시 (표시용)",
    expectedOutboundDateFormatted: "예상 출고일시 (표시용)",
    inspectionDateFormatted: "검사일시 (표시용)",
    dwellTime: "체류 시간",
    dwellTimeText: "체류 시간 (표시용)",
    isOverdue: "기한 초과 여부",
    daysUntilOutbound: "출고까지 남은 일수",
  },

  // ========== 검사 정보 ==========
  inspection: {
    id: "검사 ID",
    cargoId: "화물 ID",
    containerId: "컨테이너 ID",
    zone: "구역",
    status: "상태",
    priority: "우선순위",
    requestedAt: "요청일시",
    assignedInspector: "배정 검사자",
    startedAt: "시작일시",
    estimatedDuration: "예상 소요시간",
    notes: "비고",
    statusColor: "상태 색상",
    statusLabel: "상태 라벨",
    priorityColor: "우선순위 색상",
    priorityLabel: "우선순위 라벨",
    requestedAtFormatted: "요청일시 (표시용)",
    startedAtFormatted: "시작일시 (표시용)",
    waitingTime: "대기 시간",
    waitingTimeText: "대기 시간 (표시용)",
    progressTime: "진행 시간",
    progressTimeText: "진행 시간 (표시용)",
    isDelayed: "지연 여부",
  },

  // ========== 예외 정보 ==========
  exception: {
    id: "예외 ID",
    type: "예외 유형",
    severity: "심각도",
    title: "제목",
    description: "설명",
    zone: "구역",
    cargoId: "화물 ID",
    containerId: "컨테이너 ID",
    status: "상태",
    createdAt: "생성일시",
    assignedTo: "담당자",
    resolvedAt: "해결일시",
    severityColor: "심각도 색상",
    severityLabel: "심각도 라벨",
    statusColor: "상태 색상",
    statusLabel: "상태 라벨",
    createdAtFormatted: "생성일시 (표시용)",
    resolvedAtFormatted: "해결일시 (표시용)",
    elapsedTime: "경과 시간",
    elapsedTimeText: "경과 시간 (표시용)",
    isUrgent: "긴급 여부",
  },
};

// ========== 화물 검사 체크박스 라벨 ==========
// InspectionActionForm에서 체크된 항목을 텍스트로 변환할 때 사용
// CargoBasicInfoTab의 체크박스 id와 1:1 대응
export const CARGO_CHECKLIST_LABELS = {
  containerId: "컨테이너 번호",
  itemName: "품목명",
  quantity: "수량",
  weight: "총중량",
  zone: "구역",
  position: "적재 위치",
  inboundDate: "입고일자",
  declNo: "신고서 번호",
  uniqueNo: "B/L 번호",
};

export default FIELD_LABELS;
