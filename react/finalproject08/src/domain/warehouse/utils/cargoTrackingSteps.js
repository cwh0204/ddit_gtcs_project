// src/domain/warehouse/utils/cargoTrackingSteps.js
// SearchPanel의 통관 진행현황 스텝 관련 순수 함수 모음

// ========================================
// 수입 - 상태별 동적 스텝 생성
// ========================================
export const getImportSteps = (status) => {
  const base = [
    { id: "BONDED_IN", label: "입고등록" },
    { id: "WAITING", label: "심사대기" },
    { id: "REVIEWING", label: "심사중" },
  ];

  const afterApproval = [
    { id: "PAY_WAITING", label: "납부대기" },
    { id: "PAY_COMPLETED", label: "납부완료" },
    { id: "RELEASE_APPROVED", label: "반출승인" },
    { id: "APPROVED", label: "통관승인" },
    { id: "DELIVERED", label: "출고완료" },
  ];

  switch (status) {
    case "BONDED_IN":
    case "WAITING":
    case "REVIEWING":
      return base;
    case "SUPPLEMENT":
      return [...base, { id: "SUPPLEMENT", label: "보완/정정" }];
    case "REJECTED":
      return [...base, { id: "REJECTED", label: "반려" }];
    case "PHYSICAL":
    case "INSPECTION_COMPLETED":
      return [...base, { id: "PHYSICAL", label: "현품검사" }, { id: "INSPECTION_COMPLETED", label: "검사완료" }];
    case "ACCEPTED":
    case "PAY_WAITING":
    case "PAY_COMPLETED":
    case "RELEASE_APPROVED":
    case "APPROVED":
    case "DELIVERED":
      return [...base, { id: "ACCEPTED", label: "수리" }, ...afterApproval];
    default:
      return base;
  }
};

// ========================================
// 수출 - 상태별 동적 스텝 생성
// ========================================
export const getExportSteps = (status) => {
  const base = [
    { id: "WAITING", label: "심사대기" },
    { id: "REVIEWING", label: "심사중" },
  ];

  const afterApproval = [
    { id: "PAY_WAITING", label: "납부대기" },
    { id: "PAY_COMPLETED", label: "납부완료" },
    { id: "RELEASE_APPROVED", label: "반출승인" },
    { id: "APPROVED", label: "통관승인" },
    { id: "DELIVERED", label: "출고완료" },
  ];

  switch (status) {
    case "WAITING":
    case "REVIEWING":
      return base;
    case "SUPPLEMENT":
      return [...base, { id: "SUPPLEMENT", label: "보완/정정" }];
    case "REJECTED":
      return [...base, { id: "REJECTED", label: "반려" }];
    case "PHYSICAL":
    case "INSPECTION_COMPLETED":
      return [...base, { id: "PHYSICAL", label: "현품검사" }, { id: "INSPECTION_COMPLETED", label: "검사완료" }];
    case "ACCEPTED":
    case "PAY_WAITING":
    case "PAY_COMPLETED":
    case "RELEASE_APPROVED":
    case "APPROVED":
    case "DELIVERED":
      return [...base, { id: "ACCEPTED", label: "수리" }, ...afterApproval];
    default:
      return base;
  }
};

// ========================================
// 현재 상태의 스텝 인덱스 계산
// ========================================
export const getStepIndexByStatus = (status, steps) => {
  if (!status) return 0;
  const idx = steps.findIndex((step) => step.id === status);
  return idx >= 0 ? idx : steps.length - 1;
};

// ========================================
// foundCargo에서 실제 신고 상태 추출
// ========================================
export const getCargoStatus = (foundCargo) => {
  if (!foundCargo) return null;
  const importStatus = foundCargo.importMaster?.status;
  const exportStatus = foundCargo.exportMaster?.status;
  if (importStatus && importStatus !== "BONDED_IN") return importStatus;
  if (exportStatus && exportStatus !== "BONDED_IN") return exportStatus;
  return importStatus || exportStatus || foundCargo.status || "BONDED_IN";
};

// ========================================
// foundCargo에서 수입/수출 구분
// ========================================
export const getCargoType = (foundCargo) => {
  if (!foundCargo) return "import";
  if (foundCargo.exportMaster?.exportId) return "export";
  if (foundCargo.importMaster?.importId) return "import";
  return "import";
};

// ========================================
// 스텝 인덱스에 따른 스타일 계산
// ========================================
export const getStepStyle = (index, currentStepIndex, stepId) => {
  const isCompleted = index < currentStepIndex;
  const isCurrent = index === currentStepIndex;

  if (isCurrent && (stepId === "REJECTED" || stepId === "RELEASE_REJECTED")) {
    return { dot: "bg-red-400", text: "text-red-400", pulse: true };
  }
  if (isCurrent && stepId === "SUPPLEMENT") {
    return { dot: "bg-yellow-400", text: "text-yellow-400", pulse: true };
  }
  if (isCompleted) return { dot: "bg-green-400", text: "text-green-400", pulse: false };
  if (isCurrent) return { dot: "bg-blue-400", text: "text-blue-400", pulse: true };
  return { dot: "bg-gray-600", text: "text-gray-500", pulse: false };
};
