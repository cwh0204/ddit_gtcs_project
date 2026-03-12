// src/domain/warehouse/mapper/inspectionConverter.js

/**
 * 검사 변환
 */

import { formatDate } from "../../../../utils/formatters";
import { INSPECTION_STATUSES, INSPECTION_STATUS_LABELS, INSPECTION_STATUS_COLORS } from "../../warehouseConstants";
import { calculateWaitingTime, getWaitingTimeText, calculateProgressTime, getProgressTimeText, isInspectionDelayed } from "../utils";

export const mapInspection = (data) => {
  if (!data) return null;

  return {
    id: data.id,
    cargoId: data.cargoId,
    containerId: data.containerId,
    zone: data.zone,
    status: data.status || INSPECTION_STATUSES.WAITING,
    priority: data.priority,
    requestedAt: data.requestedAt,
    assignedInspector: data.assignedInspector,
    startedAt: data.startedAt,
    estimatedDuration: data.estimatedDuration,
    notes: data.notes,
    statusColor: INSPECTION_STATUS_COLORS[data.status] || "default",
    statusLabel: INSPECTION_STATUS_LABELS[data.status] || "대기중",
    requestedAtFormatted: formatDate(data.requestedAt),
    startedAtFormatted: formatDate(data.startedAt),
    waitingTime: calculateWaitingTime(data.requestedAt),
    waitingTimeText: getWaitingTimeText(data.requestedAt),
    progressTime: calculateProgressTime(data.startedAt),
    progressTimeText: getProgressTimeText(data.startedAt, data.estimatedDuration),
    isDelayed: isInspectionDelayed(data.startedAt, data.estimatedDuration),
    _raw: data,
  };
};

export const mapInspectionList = (dataList) => {
  if (!Array.isArray(dataList)) return [];
  return dataList.map(mapInspection).filter(Boolean);
};
