import { cva } from "class-variance-authority";

// src/style/layout/warehouselayout/warehouse.styles.js

/**
 * 창고관리자 전용 스타일 시스템
 * - 다크 테마 기반
 * - 네온 그린/오렌지 강조색
 * - 3D 시각화 친화적 디자인
 */

// ========================================
// 1. Stats Card Styles
// ========================================

/**
 * 통계 카드 컴포넌트 스타일
 *
 * @example
 * <div className={statsCardStyles({ variant: "primary", size: "md" })}>
 */
export const statsCardStyles = cva(/*tw*/ "rounded-xl border backdrop-blur-sm transition-all duration-200", {
  variants: {
    variant: {
      primary: /*tw*/ "bg-[#1e1e1e]/90 border-gray-800 hover:border-gray-700",
      highlight: /*tw*/ "bg-gradient-to-br from-[#1e1e1e]/90 to-[#0f4c81]/20 border-blue-700/50 hover:border-blue-600/50",
      success: /*tw*/ "bg-[#1e1e1e]/90 border-green-800/50 hover:border-green-700/50",
      warning: /*tw*/ "bg-[#1e1e1e]/90 border-orange-800/50 hover:border-orange-700/50",
      ghost: /*tw*/ "bg-transparent border-gray-800/30 hover:bg-[#1e1e1e]/50",
    },
    size: {
      sm: /*tw*/ "p-4",
      md: /*tw*/ "p-6",
      lg: /*tw*/ "p-8",
    },
    glow: {
      true: /*tw*/ "shadow-lg shadow-blue-500/10",
      false: /*tw*/ "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    glow: false,
  },
});

/**
 * 통계 카드 내부 타이틀
 */
export const statsCardTitleStyles = cva(/*tw*/ "font-semibold tracking-tight", {
  variants: {
    size: {
      sm: /*tw*/ "text-xs text-gray-400",
      md: /*tw*/ "text-sm text-gray-400",
      lg: /*tw*/ "text-base text-gray-300",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * 통계 카드 내부 값 (숫자 등)
 */
export const statsCardValueStyles = cva(/*tw*/ "font-bold tabular-nums", {
  variants: {
    size: {
      sm: /*tw*/ "text-xl text-white",
      md: /*tw*/ "text-2xl text-white",
      lg: /*tw*/ "text-4xl text-white",
      xl: /*tw*/ "text-5xl text-white",
    },
    color: {
      default: /*tw*/ "text-white",
      green: /*tw*/ "text-green-400",
      orange: /*tw*/ "text-orange-400",
      blue: /*tw*/ "text-blue-400",
      red: /*tw*/ "text-red-400",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

// ========================================
// 2. Slide Panel Styles
// ========================================

/**
 * 우측 슬라이드 패널 스타일
 */
export const slidePanelStyles = cva(
  /*tw*/ "fixed top-0 right-0 h-full bg-[#1a2132] border-l border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-50 overflow-y-auto",
  {
    variants: {
      width: {
        sm: /*tw*/ "w-80",
        md: /*tw*/ "w-96",
        lg: /*tw*/ "w-[32rem]",
        xl: /*tw*/ "w-[40rem]",
      },
      isOpen: {
        true: /*tw*/ "translate-x-0",
        false: /*tw*/ "translate-x-full",
      },
    },
    defaultVariants: {
      width: "lg",
      isOpen: false,
    },
  },
);

/**
 * 슬라이드 패널 헤더
 */
export const slidePanelHeaderStyles = cva(/*tw*/ "sticky top-0 z-10 bg-[#0f1419] border-b border-gray-800 backdrop-blur-sm");

/**
 * 슬라이드 패널 컨텐츠
 */
export const slidePanelContentStyles = cva(/*tw*/ "p-6 space-y-6");

// ========================================
// 3. Badge Styles
// ========================================

/**
 * 뱃지 스타일 (상태 표시 등)
 */
export const badgeStyles = cva(/*tw*/ "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors", {
  variants: {
    variant: {
      success: /*tw*/ "bg-green-500/10 text-green-400 border border-green-500/20",
      warning: /*tw*/ "bg-orange-500/10 text-orange-400 border border-orange-500/20",
      error: /*tw*/ "bg-red-500/10 text-red-400 border border-red-500/20",
      info: /*tw*/ "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      neutral: /*tw*/ "bg-gray-500/10 text-gray-400 border border-gray-500/20",
    },
    size: {
      sm: /*tw*/ "text-xs px-2 py-0.5",
      md: /*tw*/ "text-xs px-3 py-1",
      lg: /*tw*/ "text-sm px-4 py-1.5",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "md",
  },
});

// ========================================
// 4. Metric Display Styles
// ========================================

/**
 * 지표 표시 컨테이너 (Glass Effect)
 */
export const metricContainerStyles = cva(
  /*tw*/ "flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors",
);

/**
 * 지표 아이콘 래퍼
 */
export const metricIconStyles = cva(/*tw*/ "flex items-center justify-center rounded-lg shrink-0", {
  variants: {
    size: {
      sm: /*tw*/ "w-8 h-8",
      md: /*tw*/ "w-10 h-10",
      lg: /*tw*/ "w-12 h-12",
    },
    color: {
      green: /*tw*/ "bg-green-500/10 text-green-400",
      orange: /*tw*/ "bg-orange-500/10 text-orange-400",
      blue: /*tw*/ "bg-blue-500/10 text-blue-400",
      purple: /*tw*/ "bg-purple-500/10 text-purple-400",
      gray: /*tw*/ "bg-gray-500/10 text-gray-400",
    },
  },
  defaultVariants: {
    size: "md",
    color: "blue",
  },
});

/**
 * 지표 레이블
 */
export const metricLabelStyles = cva(/*tw*/ "text-gray-400 font-medium", {
  variants: {
    size: {
      sm: /*tw*/ "text-xs",
      md: /*tw*/ "text-sm",
      lg: /*tw*/ "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * 지표 값
 */
export const metricValueStyles = cva(/*tw*/ "font-bold tabular-nums", {
  variants: {
    size: {
      sm: /*tw*/ "text-lg",
      md: /*tw*/ "text-xl",
      lg: /*tw*/ "text-2xl",
    },
    color: {
      default: /*tw*/ "text-white",
      green: /*tw*/ "text-green-400",
      orange: /*tw*/ "text-orange-400",
      blue: /*tw*/ "text-blue-400",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

// ========================================
// 5. Section Styles
// ========================================

/**
 * 섹션 제목
 */
export const sectionTitleStyles = cva(/*tw*/ "font-bold tracking-tight", {
  variants: {
    size: {
      sm: /*tw*/ "text-lg text-gray-200",
      md: /*tw*/ "text-xl text-gray-100",
      lg: /*tw*/ "text-2xl text-white",
    },
    accent: {
      none: /*tw*/ "",
      green: /*tw*/ "text-green-400",
      orange: /*tw*/ "text-orange-400",
      blue: /*tw*/ "text-blue-400",
    },
  },
  defaultVariants: {
    size: "md",
    accent: "none",
  },
});

/**
 * 섹션 설명
 */
export const sectionDescriptionStyles = cva(/*tw*/ "text-gray-400 font-normal", {
  variants: {
    size: {
      sm: /*tw*/ "text-xs",
      md: /*tw*/ "text-sm",
      lg: /*tw*/ "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ========================================
// 6. List Styles
// ========================================

/**
 * 리스트 아이템 (Top 3 등)
 */
export const listItemStyles = cva(/*tw*/ "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200", {
  variants: {
    variant: {
      default: /*tw*/ "bg-[#1e1e1e]/50 border-gray-800/50 hover:bg-[#1e1e1e]/70 hover:border-gray-700/50",
      active: /*tw*/ "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20",
      highlight: /*tw*/ "bg-green-500/10 border-green-500/30",
    },
    interactive: {
      true: /*tw*/ "cursor-pointer",
      false: /*tw*/ "",
    },
  },
  defaultVariants: {
    variant: "default",
    interactive: true,
  },
});

/**
 * 리스트 순위 뱃지
 */
export const rankBadgeStyles = cva(/*tw*/ "flex items-center justify-center rounded-full font-bold text-xs shrink-0", {
  variants: {
    rank: {
      1: /*tw*/ "w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950",
      2: /*tw*/ "w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900",
      3: /*tw*/ "w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950",
      default: /*tw*/ "w-7 h-7 bg-gray-700 text-gray-300",
    },
  },
  defaultVariants: {
    rank: "default",
  },
});

// ========================================
// 7. 3D Placeholder Styles
// ========================================

/**
 * 3D 뷰 플레이스홀더 (Three.js 로딩 전)
 */
export const placeholder3DStyles = cva(
  /*tw*/ "relative w-full h-full rounded-xl border border-gray-800 bg-gradient-to-br from-[#1a2132] to-[#0f1419] flex items-center justify-center overflow-hidden",
);

/**
 * 3D 캔버스 래퍼
 */
export const canvas3DWrapperStyles = cva(/*tw*/ "relative w-full h-full rounded-xl overflow-hidden");

// ========================================
// 8. Input & Search Styles
// ========================================

/**
 * 검색 입력 필드 (다크 테마)
 */
export const searchInputStyles = cva(
  /*tw*/ "w-full px-4 py-2.5 rounded-lg border bg-[#1e1e1e]/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all",
  {
    variants: {
      variant: {
        default: /*tw*/ "border-gray-800 focus:border-blue-500 focus:ring-blue-500/20",
        success: /*tw*/ "border-green-800 focus:border-green-500 focus:ring-green-500/20",
        error: /*tw*/ "border-red-800 focus:border-red-500 focus:ring-red-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// ========================================
// 9. Trend Indicator Styles
// ========================================

/**
 * 트렌드 표시 (증가/감소 화살표)
 */
export const trendIndicatorStyles = cva(/*tw*/ "inline-flex items-center gap-1 text-xs font-semibold", {
  variants: {
    trend: {
      up: /*tw*/ "text-green-400",
      down: /*tw*/ "text-red-400",
      neutral: /*tw*/ "text-gray-400",
    },
  },
  defaultVariants: {
    trend: "neutral",
  },
});

// ========================================
// 10. Utility Styles
// ========================================

/**
 * 스크롤바 스타일 (다크 테마)
 */
export const scrollbarStyles = /*tw*/ "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600";

/**
 * 블러 오버레이
 */
export const blurOverlayStyles = cva(/*tw*/ "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40", {
  variants: {
    isOpen: {
      true: /*tw*/ "opacity-100 pointer-events-auto",
      false: /*tw*/ "opacity-0 pointer-events-none",
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});
