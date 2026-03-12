// src/controller/warehouse/useZoneAreaStats.js
// /rest/warehouse/area/count/{positionArea} API 연동
// declType(ALL | IMPORT | EXPORT)에 따라 프론트에서 필터링 집계

import { useQuery } from "@tanstack/react-query";
import warehouseApi from "../../api/warehouse/warehouseApi";

const ZONE_CAPACITY = 50;

const useAreaCount = (positionArea) => {
  return useQuery({
    queryKey: ["warehouse", "area", "count", positionArea],
    queryFn: () => warehouseApi.getAreaCount(positionArea),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    select: (data) => (Array.isArray(data) ? data : []),
  });
};

// ─────────────────────────────────────────────────────────────
// 화물 목록 전체 조회 (수입 + 수출 각각)
// getAreaCount는 { area, count } 배열이라 cargoType 정보가 없음
// → getCargoList(import) + getCargoList(export) 를 직접 조회해서
//   zone 별로 집계
// ─────────────────────────────────────────────────────────────
const useCargoListByType = (cargoType) => {
  return useQuery({
    queryKey: ["warehouse", "cargoList", cargoType],
    queryFn: () => warehouseApi.getCargoList({ cargoType }),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    select: (data) => (Array.isArray(data) ? data : []),
  });
};

/**
 * 구역별 수용률 + 창고 유형별 점유율
 *
 * @param {"ALL" | "IMPORT" | "EXPORT"} declType - 수입/수출/전체 필터
 *
 * declType === "ALL"    → 수입 + 수출 합산 (기존 동작)
 * declType === "IMPORT" → 수입 화물만 집계
 * declType === "EXPORT" → 수출 화물만 집계
 */
export const useZoneAreaStats = (declType = "ALL") => {
  // ── 기존 area/count API (BONDED / LOCAL) ──
  const bondedQuery = useAreaCount("BONDED");
  const localQuery = useAreaCount("LOCAL");

  // ── 수입/수출 화물 목록 ──
  const importCargoQuery = useCargoListByType("import");
  const exportCargoQuery = useCargoListByType("export");

  const isLoading = bondedQuery.isLoading || localQuery.isLoading || importCargoQuery.isLoading || exportCargoQuery.isLoading;

  const isError = bondedQuery.isError || localQuery.isError || importCargoQuery.isError || exportCargoQuery.isError;

  // ── declType에 따라 사용할 화물 목록 결정 ──
  const importList = importCargoQuery.data ?? [];
  const exportList = exportCargoQuery.data ?? [];

  const targetList = (() => {
    if (declType === "IMPORT") return importList;
    if (declType === "EXPORT") return exportList;
    return [...importList, ...exportList]; // ALL
  })();

  // ── 구역별 수용률 집계 ──
  // warehouseId의 첫 글자 = 구역 코드 (예: "A-01" → "A")
  const zoneMap = {};

  targetList.forEach((item) => {
    // positionArea가 null이면 출고된 화물 → 집계 제외
    if (!item.positionArea || !item.warehouseId) return;

    const zoneKey = String(item.warehouseId).charAt(0).toUpperCase();
    if (!zoneKey || zoneKey === "-") return;

    const zoneName = `${zoneKey}구역`;
    if (!zoneMap[zoneName]) {
      zoneMap[zoneName] = { zone: zoneName, occupancy: 0, capacity: ZONE_CAPACITY };
    }
    zoneMap[zoneName].occupancy += 1;
  });

  const zoneOccupancy = Object.values(zoneMap)
    .map((z) => ({
      ...z,
      rate: Math.min(Math.round((z.occupancy / z.capacity) * 100), 100),
    }))
    .sort((a, b) => a.zone.localeCompare(b.zone));

  // ── 창고 유형별 점유율 (BONDED vs LOCAL) ──
  // declType 필터 적용: targetList에서 positionArea 기준 집계
  const bondedTotal = targetList.filter((i) => i.positionArea === "BONDED").length;
  const localTotal = targetList.filter((i) => i.positionArea === "LOCAL").length;

  const warehouseTypeRatio = [
    { name: "보세창고", value: bondedTotal, color: "#0f4c81" },
    { name: "국내창고", value: localTotal, color: "#f97316" },
  ];

  return {
    zoneOccupancy,
    warehouseTypeRatio,
    bondedList: bondedQuery.data ?? [],
    localList: localQuery.data ?? [],
    isLoading,
    isError,
  };
};

export default useZoneAreaStats;
