import { useRef, useEffect } from "react";
import createWarehouse from "../../domain/warehouse/warehouseScene";

// src/style/components/warehouse/Warehouse3D.jsx

/**
 * ex11.js 그대로 사용하는 React 래퍼
 * - Resize 감지 개선
 */
function Warehouse3D({ onSceneReady }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const warehouseRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Canvas 크기 설정
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const updateSize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    updateSize();

    // ex11.js 초기화
    warehouseRef.current = createWarehouse(canvas);

    // Scene 준비 완료 콜백
    if (onSceneReady) {
      onSceneReady(warehouseRef.current);
    }

    // ResizeObserver로 컨테이너 크기 변화 감지
    resizeObserverRef.current = new ResizeObserver(() => {
      if (warehouseRef.current) {
        warehouseRef.current.onResize();
      }
    });
    resizeObserverRef.current.observe(container);

    // Window resize 이벤트
    const handleResize = () => {
      if (warehouseRef.current) {
        warehouseRef.current.onResize();
      }
    };
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("resize", handleResize);

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      if (warehouseRef.current) {
        warehouseRef.current.dispose();
      }
    };
  }, [onSceneReady]);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#1a2132]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default Warehouse3D;
