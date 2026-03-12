// src/domain/warehouse/warehouseTypeData.js

/**
 * 창고 타입별 구역 데이터
 * ✅ zones는 백엔드 API(/rest/warehouse/area/count/{positionArea})에서 조회
 */

export const WAREHOUSE_TYPE_DATA = {
  bonded: {
    label: "보세구역",
    description: "수입·수출 화물 보관 및 통관 처리",
    customsSteps: [
      { id: "pending", label: "심사대기" },
      { id: "review", label: "심사중" },
      { id: "inspection", label: "검사중" },
      { id: "repair", label: "수리" },
      { id: "payment", label: "납부" },
      { id: "approval", label: "반출승인" },
      { id: "blocked", label: "반출차단" },
      { id: "rejection", label: "반려" },
    ],
    statusMap: {
      A: "review",
      B: "inspection",
      C: "repair",
      D: "payment",
      E: "blocked",
      F: "pending",
      G: "approval",
      H: "review",
      I: "inspection",
    },
  },
  local: {
    label: "국내창고",
    description: "국내 유통 화물 보관 및 물류 처리",
    customsSteps: [
      { id: "pending", label: "입고대기" },
      { id: "received", label: "입고완료" },
      { id: "storing", label: "보관중" },
      { id: "preparing", label: "출고준비" },
      { id: "shipping", label: "출고완료" },
      { id: "blocked", label: "보관차단" },
    ],
    statusMap: {
      A: "received",
      B: "storing",
      C: "preparing",
      D: "shipping",
      E: "blocked",
      F: "storing",
      G: "received",
      H: "preparing",
      I: "shipping",
    },
  },
};

export const getZoneStatus = (count) => {
  if (count === 50) return "full";
  if (count >= 41) return "danger";
  if (count >= 30) return "warning";
  return "normal";
};

export const getZoneStyle = (status) => {
  switch (status) {
    case "full":
    case "danger":
      return { bgColor: "bg-red-500 text-white", dotColor: "bg-red-400" };
    case "warning":
      return { bgColor: "bg-orange-500 text-white", dotColor: "bg-orange-400" };
    case "normal":
    default:
      return { bgColor: "bg-green-500 text-white", dotColor: "bg-green-400" };
  }
};
