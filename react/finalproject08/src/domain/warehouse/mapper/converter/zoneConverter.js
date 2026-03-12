// src/domain/warehouse/mapper/zoneConverter.js

/**
 * 구역 변환
 */

import { ZONE_STATUSES, ZONE_STATUS_LABELS, ZONE_STATUS_COLORS } from "../../warehouseConstants";

export const mapZone = (data) => {
  if (!data) return null;

  const occupancyRate = data.capacity > 0 ? (data.occupied / data.capacity) * 100 : 0;

  let status = ZONE_STATUSES.NORMAL;
  if (occupancyRate >= 100) status = ZONE_STATUSES.FULL;
  else if (occupancyRate >= 80) status = ZONE_STATUSES.WARNING;

  return {
    id: data.id,
    name: data.name,
    capacity: data.capacity,
    occupied: data.occupied,
    occupancyRate: occupancyRate,
    available: data.capacity - data.occupied,
    status: status,
    location: data.location,
    statusColor: ZONE_STATUS_COLORS[status],
    statusLabel: ZONE_STATUS_LABELS[status],
    occupancyText: `${data.occupied}/${data.capacity}`,
    availableText: `${data.capacity - data.occupied}`,
    isFull: status === ZONE_STATUSES.FULL,
    isWarning: status === ZONE_STATUSES.WARNING,
    _raw: data,
  };
};

export const mapZoneList = (dataList) => {
  if (!Array.isArray(dataList)) return [];
  return dataList.map(mapZone).filter(Boolean);
};
