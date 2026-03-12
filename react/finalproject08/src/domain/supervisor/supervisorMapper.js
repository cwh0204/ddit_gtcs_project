// src/features/supervisor/utils/supervisorMapper.js

/**
 * 수입 신고서 데이터 → 배정 목록 형식 변환
 * @param {Object} data - 백엔드 ImportMasterDTO
 * @returns {Object} 배정 목록 행 데이터
 */
export const mapImportToAssignmentRow = (data) => {
  if (!data) return null;

  return {
    id: data.importId || data.importNumber,
    importNumber: data.importNumber || "-",
    type: "import",
    typeLabel: "수입 통관",
    status: data.status || "PENDING",
    assignedOfficerId: data.officerId || null,
    assignedOfficer: data.member?.memName || "-",
    companyName: data.member?.companyName || data.companyName || "-",
    hsCode: data.hsCode || "-",
    importDate: data.importDate || data.regDate || "-",
    goodsName: data.goodsNm || "-",
    totalAmount: data.totalAmount || 0,
  };
};

/**
 * 수출 신고서 데이터 → 배정 목록 형식 변환
 * @param {Object} data - 백엔드 ExportMasterDTO
 * @returns {Object} 배정 목록 행 데이터
 */
export const mapExportToAssignmentRow = (data) => {
  if (!data) return null;

  return {
    id: data.exportId || data.exportNumber,
    exportNumber: data.exportNumber || "-",
    type: "export",
    typeLabel: "수출 통관",
    status: data.status || "PENDING",
    assignedOfficerId: data.officerId || null,
    assignedOfficer: data.member?.memName || "-",
    companyName: data.member?.companyName || data.companyName || "-",
    hsCode: data.hsCode || "-",
    exportDate: data.exportDate || data.regDate || "-",
    goodsName: data.goodsNm || "-",
    totalAmount: data.totalAmount || 0,
  };
};

/**
 * 세관원 DTO → 부하 현황 패널 형식 변환
 * @param {Object} officer - useOfficerList의 select 결과
 * @returns {Object} 부하 현황 표시 데이터
 */
export const mapOfficerToLoadRow = (officer) => {
  if (!officer) return null;

  return {
    officerId: officer.officerId,
    officerName: officer.officerName,
    taskLoad: officer.taskLoad,
    companyName: officer.companyName,
    email: officer.email,
    hpNo: officer.hpNo,
  };
};

/**
 * 수입/수출 목록 일괄 변환
 * @param {Array} list - 백엔드 응답 배열
 * @param {'import'|'export'} type
 * @returns {Array}
 */
export const mapListToAssignmentRows = (list = [], type = "export") => {
  const mapper = type === "import" ? mapImportToAssignmentRow : mapExportToAssignmentRow;

  return list.filter(Boolean).map(mapper).filter(Boolean);
};
