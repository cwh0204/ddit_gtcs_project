import { Inbox, PackageOpen, Search, AlertCircle, FileQuestion } from "lucide-react";
import Button from "../../style/components/Button";

// src/style/layout/warehouselayout/EmptyState.jsx

function EmptyState({
  icon = "inbox",
  title = "데이터가 없습니다",
  message = null,
  action = null,
  actionText = "추가하기",
  className = "",
  compact = false,
}) {
  // 아이콘 매핑
  const icons = {
    inbox: Inbox,
    package: PackageOpen,
    search: Search,
    alert: AlertCircle,
    question: FileQuestion,
  };

  const IconComponent = icons[icon] || Inbox;

  // 컴팩트 모드 (간단한 표시)
  if (compact) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-center ${className}`}>
        <IconComponent className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {message && <p className="text-xs text-gray-500 mt-1">{message}</p>}
      </div>
    );
  }

  // 일반 모드
  return (
    <div className={`flex items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-center max-w-md">
        {/* 아이콘 */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
            <IconComponent className="h-8 w-8 text-gray-500" />
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* 설명 */}
        {message && <p className="text-sm text-gray-600 mb-6">{message}</p>}

        {/* 액션 버튼 */}
        {action && (
          <Button onClick={action} variant="primary">
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * EmptyState 프리셋 (창고 관리 전용)
 */
EmptyState.NoData = (props) => <EmptyState icon="inbox" title="데이터가 없습니다" message="표시할 항목이 없습니다." {...props} />;

EmptyState.NoCargos = (props) => <EmptyState icon="package" title="화물이 없습니다" message="등록된 화물이 없습니다." {...props} />;

EmptyState.NoSearchResults = (props) => (
  <EmptyState icon="search" title="검색 결과가 없습니다" message="검색 조건을 변경하거나 다른 검색어를 입력해보세요." {...props} />
);

EmptyState.NoInspections = (props) => <EmptyState icon="alert" title="대기 중인 검사가 없습니다" message="모든 검사가 완료되었습니다." {...props} />;

EmptyState.NoExceptions = (props) => (
  <EmptyState icon="alert" title="예외 사항이 없습니다" message="모든 작업이 정상적으로 처리되고 있습니다." {...props} />
);

export default EmptyState;
