// src/domain/warehouse/mapper/statsConverter.js

/**
 * 창고 통계 변환
 */

export const mapWarehouseStats = (data) => {
  if (!data) return null;

  const occupancyRate = data.totalCapacity > 0 ? (data.totalOccupied / data.totalCapacity) * 100 : 0;

  return {
    totalCapacity: data.totalCapacity || 0,
    totalOccupied: data.totalOccupied || 0,
    occupancyRate: occupancyRate,
    availableSpaces: data.totalCapacity - data.totalOccupied,
    updatedAt: data.updatedAt || new Date().toISOString(),
    occupancyPercentText: `${occupancyRate.toFixed(1)}%`,
    occupancyFraction: `${data.totalOccupied}/${data.totalCapacity}`,
    isNearFull: occupancyRate >= 80,
    isWarning: occupancyRate >= 90,
    _raw: data,
  };
};
