import { Loader2 } from "lucide-react";

// src/style/components/Loader.jsx

function Loader({ text = "로딩 중...", size = "default", className = "", fullScreen = false, height = "auto" }) {
  // 크기별 아이콘 클래스
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-12 w-12",
    lg: "h-16 w-16",
  };

  // 전체 화면 모드
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mx-auto`} />
          <p className="mt-4 text-gray-600">{text}</p>
        </div>
      </div>
    );
  }

  // 일반 모드
  const containerClass = height === "auto" ? "flex items-center justify-center p-12" : `${height} flex items-center justify-center`;

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mx-auto`} />
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export default Loader;
