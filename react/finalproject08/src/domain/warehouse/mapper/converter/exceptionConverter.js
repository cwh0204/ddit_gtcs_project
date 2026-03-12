// src/domain/warehouse/mapper/exceptionConverter.js

/**
 * 예외 변환
 */

import { formatDate } from "../../../../utils/formatters";
import { EXCEPTION_SEVERITY, SEVERITY_LABELS, SEVERITY_COLORS, EXCEPTION_STATUS_LABELS, EXCEPTION_STATUS_COLORS } from "../../warehouseConstants";
import { calculateElapsedTime, getElapsedTimeText } from "../utils";

export const mapException = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    type: data.type,
    severity: data.severity || EXCEPTION_SEVERITY.NORMAL,
    title: data.title,
    description: data.description,
    zone: data.zone,
    cargoId: data.cargoId,
    containerId: data.containerId,
    status: data.status,
    createdAt: data.createdAt,
    assignedTo: data.assignedTo,
    resolvedAt: data.resolvedAt,
    severityColor: SEVERITY_COLORS[data.severity] || "default",
    severityLabel: SEVERITY_LABELS[data.severity] || "일반",
    statusColor: EXCEPTION_STATUS_COLORS[data.status] || "default",
    statusLabel: EXCEPTION_STATUS_LABELS[data.status] || "미해결",
    createdAtFormatted: formatDate(data.createdAt),
    resolvedAtFormatted: formatDate(data.resolvedAt),
    elapsedTime: calculateElapsedTime(data.createdAt),
    elapsedTimeText: getElapsedTimeText(data.createdAt),
    isUrgent: data.severity === EXCEPTION_SEVERITY.URGENT,
    _raw: data,
  };
};

export const mapExceptionList = (dataList) => {
  if (!Array.isArray(dataList)) return [];
  return dataList.map(mapException).filter(Boolean);
};
