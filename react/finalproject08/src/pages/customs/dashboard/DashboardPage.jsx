import { XCircle } from "lucide-react";
import Badge from "../../../style/components/Badge";
import { useDashboardController } from "../../../controller/custom/dashboard/useDashboardController";
import StatCard from "../../../style/components/dashboard/StatCard";
import Table from "../../../style/components/table/Table";
import TableHeader from "../../../style/components/table/TableHeader";
import TableBody from "../../../style/components/table/TableBody";
import TableCell from "../../../style/components/table/TableCell";
import TableHead from "../../../style/components/table/TableHead";
import TableRow from "../../../style/components/table/TableRow";
import { STATUS_BADGE_VARIANTS } from "../../../domain/customs/import/importConstants";
import { STAT_CARD_COLORS } from "../../../constants/dashboardConstants";

//src/pages/cutoms/dashboard/DashboardPage.jsx
function DashboardPage() {
  const { stats, urgentItems, recentItems, isLoading, error } = useDashboardController();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터 불러오는 중</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-900 font-semibold">데이터를 불러오지 못했습니다.</p>
          <p className="mt-2 text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-1">업무 현황 및 통계</p>
        </div>

        {/* 통계카드섹션 */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard title="대기 중" value={stats.pending} className={STAT_CARD_COLORS.pending} description="신규 접수 신고서" />
          <StatCard title="심사 중" value={stats.inReview} className={STAT_CARD_COLORS.inReview} description="현재 검토 중인 신고서" />
          <StatCard title="검사 중" value={stats.inspection} className={STAT_CARD_COLORS.inspection} description="현품 검사 진행 중" />
          <StatCard title="완료" value={stats.completed} className={STAT_CARD_COLORS.completed} description="수리 완료 건수" />
          <StatCard title="긴급처리 건" value={stats.urgent} className={STAT_CARD_COLORS.urgent} description="긴급 처리 필요" />
          <StatCard title="SLA 위반" value={stats.slaViolation} className={STAT_CARD_COLORS.violation} description="처리 기한 초과(7일)" />
        </div>

        {/* 긴급처리목록 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">긴급 처리 필요 목록</h2>
            <p className="text-sm text-gray-600 mt-1">긴급 처리가 필요한 신고서</p>
          </div>

          {urgentItems.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">긴급 처리 건이 없습니다.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>신고 번호</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead>현재 상태</TableHead>
                  <TableHead>처리 기한</TableHead>
                  <TableHead>남은 시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urgentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-blue-600">{item.declarationNo}</TableCell>
                    <TableCell>{item.company}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE_VARIANTS[item.statusCode] || "default"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.deadline}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${item.remainingHours < 24 ? "text-red-600" : "text-yellow-600"}`}>
                        {item.remainingHours}시간
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">최근 신고 목록</h2>
            <p className="text-sm text-gray-600 mt-1">최근 접수된 수입 신고서</p>
          </div>

          {recentItems.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">신고 내역이 없습니다.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>신고번호</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>접수 시간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-blue-600">{item.declarationNo}</TableCell>
                    <TableCell>{item.company}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE_VARIANTS[item.statusCode] || "default"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{item.submittedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;

/*
  space-y-6
  자식 요소들 사이에 수직간격을 일정하게 만들어 주는 유틸리티 클래스
 */
