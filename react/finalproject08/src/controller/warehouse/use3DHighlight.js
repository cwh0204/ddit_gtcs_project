import { useCallback } from "react";
// src/controller/warehouse/use3DHighlight.js
// 3D 창고 뷰 하이라이트 커스텀 훅
// 3D Scene 하이라이트 제어
// 인덱스 조회
export const use3DHighlight = (warehouseRef) => {
  //warehouse_id로 3D 하이라이트
  const highlightByWarehouseId = useCallback(
    (warehouseId) => {
      if (!warehouseRef.current) {
        console.warn("[use3DHighlight] warehouseRef가 없습니다");
        return false;
      }

      if (!warehouseId) {
        console.warn("[use3DHighlight] warehouseId가 없습니다");
        return false;
      }

      const idx = warehouseRef.current.idToIndex.get(warehouseId);
      console.log(`[use3DHighlight] 하이라이트 시도: ${warehouseId}, 인덱스: ${idx}`);

      if (idx == null) {
        console.warn(`[use3DHighlight] 인덱스를 찾을 수 없음: ${warehouseId}`);
        return false;
      }

      const success = warehouseRef.current.highlightIndex(idx);
      console.log(`[use3DHighlight] 하이라이트 결과: ${success}`);

      return success;
    },
    [warehouseRef],
  );

  //하이라이트 초기화
  const resetHighlight = useCallback(() => {
    if (warehouseRef.current) {
      warehouseRef.current.resetHighlight();
      console.log("[use3DHighlight] 하이라이트 초기화");
    }
  }, [warehouseRef]);

  //구역 클릭 하이라이트
  const highlightZone = useCallback(
    (zoneName) => {
      if (!warehouseRef.current) return false;

      const zoneCode = zoneName.charAt(0);
      const containerId = `${zoneCode}-01-01-01`;

      const idx = warehouseRef.current.idToIndex?.get(containerId);
      if (idx != null) {
        warehouseRef.current.highlightIndex(idx);
        console.log(`[use3DHighlight] 구역 하이라이트: ${zoneName} → ${containerId}`);
        return containerId;
      }

      return null;
    },
    [warehouseRef],
  );

  return {
    highlightByWarehouseId,
    resetHighlight,
    highlightZone,
  };
};

export default use3DHighlight;
