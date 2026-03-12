import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../../utils";
import { statsCardStyles, statsCardTitleStyles, statsCardValueStyles, trendIndicatorStyles } from "../warehouse.styles";

// src/style/layout/warehouselayout/components/StatsCard.jsx

/**
 * 통계 카드 컴포넌트
 * <StatsCard
 *   title="총 화물 수"
 *   value="1,234"
 *   icon={<Package className="h-5 w-5" />}
 *   trend="up"
 *   trendValue="+12%"
 *   variant="highlight"
 *   glow
 * />
 */
function StatsCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  variant = "primary",
  size = "md",
  glow = false,
  valueColor = "default",
  className,
  onClick,
}) {
  // 트렌드 아이콘 선택
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  // 값 포맷팅 (숫자인 경우 천단위 쉼표)
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className={cn(statsCardStyles({ variant, size, glow }), onClick && "cursor-pointer hover:scale-[1.02]", className)} onClick={onClick}>
      {/* 상단: 제목 + 아이콘 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={statsCardTitleStyles({ size })}>{title}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>

      {/* 중앙: 값 */}
      <div className="flex items-baseline gap-3">
        <p className={statsCardValueStyles({ size, color: valueColor })}>{formattedValue}</p>

        {/* 트렌드 표시 */}
        {trend && (
          <div className={trendIndicatorStyles({ trend })}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
