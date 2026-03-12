// 📌 통계 카드 컴포넌트
//src/style/components/dashboard/StatCard.jsx

import { cn } from "../../utils";

/**
 * StatCard - 통계 카드 컴포넌트
 *
 * @param {string} title - 카드 제목
 * @param {number} value - 통계 값
 * @param {React.ReactNode} icon - 아이콘 (Lucide React)
 * @param {string} color - 색상 테마 (blue, green, yellow, red, purple, gray)
 * @param {string} trend - 트렌드 (예: "+2", "-1")
 * @param {string} description - 설명 (옵션)
 */
function StatCard({ title, value, trend, description, className }) {
  // 색상 매핑

  return (
    <>
      <div className={cn("rounded-lg border p-6 shadow-sm transition-all hover:shadow-md", className)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>

          {trend && (
            <div
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold",
                trend.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
              )}
            >
              {trend}
            </div>
          )}
        </div>
        {description && <p className="mt-2 text-xs opacity-60">{description}</p>}
      </div>
    </>
  );
}

export default StatCard;
