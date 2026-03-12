// src/domain/warehouse/mapper/cargoConverter.js

import { formatDate } from "../../../../utils/formatters";
import { STATUS_LABELS } from "../../warehouseConstants";
import { calculateDwellTime, getDwellTimeText, isOverdue } from "../utils";

export const mapCargo = (data) => {
  if (!data) return null;

  const contNo = data.contNo || data.contNumber;
  const containerId = data.importMaster?.contNo || data.exportMaster?.contNo || contNo || "-";
  const declNo = data.declNo || data.importMaster?.importNumber || data.exportMaster?.exportNumber || "-";
  const itemName = data.itemName || data.importMaster?.itemNameDeclared || data.exportMaster?.itemNameDeclared || "-";
  const owner =
    data.repName ||
    data.rep_name ||
    data.importMaster?.repName ||
    data.importMaster?.importerName ||
    data.exportMaster?.exporterName ||
    data.ownerName ||
    "-";

  const status = data.importMaster?.status || data.exportMaster?.status || data.status || "STORED";
  const statusLabel = STATUS_LABELS[status] || "보관중";
  const inboundDate = data.entryDate || data.regDate || data.reg_date;
  const inboundDateFormatted = formatDate(data.entryDate || data.regDate || data.reg_date);

  // ✅ 출고완료 또는 positionArea null이면 "출고", 아니면 구역코드
  const declarationStatus = data.importMaster?.status || data.exportMaster?.status || data.status;
  const zone = declarationStatus === "DELIVERED" || data.positionArea === null ? "출고" : data.warehouseId?.charAt(0) || "-";

  const aiDocCheck = data.importMaster?.aiDocCheck || data.exportMaster?.aiDocCheck;
  const riskLevel = aiDocCheck?.riskResult === "RED" ? "RED" : "GREEN";
  const riskScore = aiDocCheck?.riskScore || 0;
  const docScore = aiDocCheck?.docScore || 0;

  const dwellTime = calculateDwellTime(data.entryDate || data.regDate || data.reg_date);
  const isUrgent = dwellTime > 168 || (docScore >= 85 && docScore <= 94);

  const damagedYn = data.damagedYn || "N";
  const damagedComment = data.damagedComment || null;

  const entryPhotoFile =
    data.fileList?.find((f) => f.refId === contNo && (f.fileType === "WAREHOUSE_ENTRY" || f.fileType === "warehouse_entry")) ||
    data.fileList?.find((f) => f.fileType === "WAREHOUSE_ENTRY" || f.fileType === "warehouse_entry") ||
    data.fileList?.[0] ||
    null;

  // ✅ 수입/수출 구분 추론
  const hasImportMaster = !!(
    data.importMaster?.importId &&
    String(data.importMaster.importId).trim() !== "" &&
    String(data.importMaster.importId).toLowerCase() !== "null"
  );
  const hasExportMaster = !!(
    data.exportMaster?.exportId &&
    String(data.exportMaster.exportId).trim() !== "" &&
    String(data.exportMaster.exportId).toLowerCase() !== "null"
  );

  const hasDeclNoImport = data.declNo?.startsWith("IMP");
  const hasDeclNoExport = data.declNo?.startsWith("EXP");

  const cargoType =
    hasImportMaster || hasDeclNoImport
      ? "import"
      : hasExportMaster || hasDeclNoExport
        ? "export"
        : data.positionArea === "BONDED"
          ? "import"
          : data.positionArea === "LOCAL"
            ? "export"
            : "unknown";

  return {
    stockId: data.stockId,
    containerId,
    contNo,
    declNo,
    itemName,
    owner,
    status,
    statusLabel,
    declarationStatus: data.importMaster?.status || data.exportMaster?.status || null,
    declarationStatusLabel: data.importMaster?.status
      ? STATUS_LABELS[data.importMaster.status]
      : data.exportMaster?.status
        ? STATUS_LABELS[data.exportMaster.status]
        : "-",
    inboundDate,
    inboundDateFormatted,
    zone,
    riskLevel,
    riskScore,
    docScore,
    isUrgent,
    damagedYn,
    damagedComment,
    entryPhotoFile,
    quantity: data.qty,
    weight: data.grossWeight,
    warehouseId: data.warehouseId,
    position: data.warehouseId,
    positionArea: data.positionArea,
    uniqueNo: data.uniqueNo,
    expectedOutboundDate: data.outDate,
    expectedOutboundDateFormatted: formatDate(data.outDate),
    dwellTime,
    dwellTimeText: getDwellTimeText(data.entryDate || data.regDate || data.reg_date),
    isOverdue: isOverdue(data.outDate),
    // ✅ 수입/수출 구분
    cargoType,
    isImport: cargoType === "import",
    isExport: cargoType === "export",
    importMaster: data.importMaster
      ? {
          ...data.importMaster,
          status: data.importMaster.status,
          importId: data.importMaster.importId,
          importNumber: data.importMaster.importNumber,
        }
      : null,
    exportMaster: data.exportMaster
      ? {
          ...data.exportMaster,
          status: data.exportMaster.status,
          exportId: data.exportMaster.exportId,
          exportNumber: data.exportMaster.exportNumber,
        }
      : null,
    fileList: data.fileList || [],
    _raw: data,
  };
};

export const mapCargoList = (dataList) => {
  if (!Array.isArray(dataList)) return [];
  return dataList.map(mapCargo).filter(Boolean);
};
