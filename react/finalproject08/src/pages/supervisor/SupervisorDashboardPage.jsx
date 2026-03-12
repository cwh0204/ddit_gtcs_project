// src/pages/supervisor/dashboard/SupervisorDashboardPage.jsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, ClipboardList, ShieldAlert, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Card from "../../style/components/Card";
import Badge from "../../style/components/Badge";
import Button from "../../style/components/Button";
import StatCard from "../../style/components/dashboard/StatCard";
import Table from "../../style/components/table/Table";
import TableBody from "../../style/components/table/TableBody";
import TableRow from "../../style/components/table/TableRow";
import TableHead from "../../style/components/table/TableHead";
import TableCell from "../../style/components/table/TableCell";
import TableHeader from "../../style/components/table/TableHeader";
import { useSupervisorDashboard } from "../../controller/supervisor/useSupervisorController";
import {
  APPROVAL_STATUS_BADGE_VARIANTS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_TYPE_LABELS,
  CHANNEL_COLORS,
  DASHBOARD_KPI_CONFIG,
  RISK_CHANNEL_LABELS,
  RISK_CHANNEL_BADGE_VARIANTS,
} from "../../domain/supervisor/supervisorConstants";

function SupervisorDashboardPage() {
  const navigate = useNavigate();
  const { data: kpi, isLoading, error } = useSupervisorDashboard();

  const channelTotal = useMemo(() => {
    if (!kpi?.channelDistribution) return 0;
    return Object.values(kpi.channelDistribution).reduce((a, b) => a + b, 0);
  }, [kpi]);

  const channelPercent = useMemo(() => {
    if (!kpi?.channelDistribution || channelTotal === 0) return {};
    return Object.fromEntries(Object.entries(kpi.channelDistribution).map(([k, v]) => [k, ((v / channelTotal) * 100).toFixed(1)]));
  }, [kpi, channelTotal]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0f4c81]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">대시보드 데이터를 불러올 수 없습니다.</p>
          <p className="text-sm text-gray-400 mt-1">{error?.message}</p>
        </div>
      </div>
    );
  }

  // GREEN/RED 라벨 매핑
  const CHANNEL_LABEL_MAP = { GREEN: "정상 (GREEN)", RED: "고위험 (RED)" };
  const CHANNEL_COLOR_MAP = { GREEN: "#22c55e", RED: "#ef4444" };

  return (
    <div className="space-y-6">
      {/* ========== 헤더 ========== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">세관원 업무 현황 및 결재 모니터링</p>
        </div>
        <Button onClick={() => navigate("/supervisor/approval")}>
          <ClipboardList className="w-4 h-4 mr-2" />
          결재 목록 보기
        </Button>
      </div>

      {/* ========== KPI 카드 ========== */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="전체 신고건수"
          value={kpi?.totalDeclCount ?? "-"}
          description="수입 + 수출 전체"
          className="bg-blue-50 border-blue-200 text-blue-800"
        />
        <StatCard
          title="SLA 초과"
          value={kpi?.slaDelayedCount ?? "-"}
          description="처리 기한 초과 건수"
          className="bg-red-50 border-red-200 text-red-800"
          trend={kpi?.slaDelayedCount > 0 ? `+${kpi.slaDelayedCount}` : null}
        />
        <StatCard
          title="결재 대기"
          value={kpi?.pendingApprovalCount ?? "-"}
          description="세관원 결재 요청 건수"
          className="bg-amber-50 border-amber-200 text-amber-800"
          trend={kpi?.pendingApprovalCount > 0 ? `+${kpi.pendingApprovalCount}` : null}
        />
        <StatCard
          title="오늘 승인"
          value={kpi?.todayApprovedCount ?? "-"}
          description={`반려 ${kpi?.todayRejectedCount ?? 0}건 포함`}
          className="bg-green-50 border-green-200 text-green-800"
        />
      </div>

      {/* ========== 채널 분포 + 수입/수출 현황 ========== */}
      <div className="grid grid-cols-3 gap-4">
        {/* 채널 분포 - GREEN/RED만 표시 */}
        <Card padding="md" className="col-span-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0f4c81]" />
            위험도 분포 현황
          </h3>
          {kpi?.channelDistribution ? (
            <div className="space-y-3">
              {Object.entries(kpi.channelDistribution).map(([channel, count]) => (
                <div key={channel} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHANNEL_COLOR_MAP[channel] || "#94a3b8" }} />
                  <span className="text-sm text-gray-600 w-28">{CHANNEL_LABEL_MAP[channel] || channel}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${channelPercent[channel] || 0}%`,
                        backgroundColor: CHANNEL_COLOR_MAP[channel] || "#94a3b8",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">
                    {count}건 ({channelPercent[channel] || 0}%)
                  </span>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2 pt-2 border-t">총 {channelTotal}건</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">데이터 없음</p>
          )}
        </Card>

        {/* 수입/수출 현황 */}
        <Card padding="md" className="col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#0f4c81]" />
            수입 / 수출 통관 현황
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* 수입 통관 */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-800">수입 통관</span>
                <Badge variant="primary">수입</Badge>
              </div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="bg-blue-50/50 text-xs w-1/2">전체</TableHead>
                    <TableCell className="text-xs font-semibold">{kpi?.importStats?.total ?? "-"}건</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-blue-50/50 text-xs">처리 중</TableHead>
                    <TableCell className="text-xs text-amber-600 font-semibold">{kpi?.importStats?.pending ?? "-"}건</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-blue-50/50 text-xs">처리 완료</TableHead>
                    <TableCell className="text-xs text-green-600 font-semibold">{kpi?.importStats?.approved ?? "-"}건</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button variant="outline" className="w-full mt-3 text-xs" onClick={() => navigate("/supervisor/approval/import")}>
                수입 결재 보기
              </Button>
            </div>

            {/* 수출 통관 */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-green-800">수출 통관</span>
                <Badge variant="success">수출</Badge>
              </div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="bg-green-50/50 text-xs w-1/2">전체</TableHead>
                    <TableCell className="text-xs font-semibold">{kpi?.exportStats?.total ?? "-"}건</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-green-50/50 text-xs">처리 중</TableHead>
                    <TableCell className="text-xs text-amber-600 font-semibold">{kpi?.exportStats?.pending ?? "-"}건</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="bg-green-50/50 text-xs">처리 완료</TableHead>
                    <TableCell className="text-xs text-green-600 font-semibold">{kpi?.exportStats?.approved ?? "-"}건</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button variant="outline" className="w-full mt-3 text-xs" onClick={() => navigate("/supervisor/approval/export")}>
                수출 결재 보기
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* ========== 최근 결재 요청 목록 ========== */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0f4c81]" />
            최근 결재 요청
          </h3>
          <Button variant="outline" className="text-xs" onClick={() => navigate("/supervisor/approval")}>
            전체 보기
          </Button>
        </div>

        {kpi?.recentApprovals?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-[#f9fbff]">신고번호</TableHead>
                <TableHead className="bg-[#f9fbff]">구분</TableHead>
                <TableHead className="bg-[#f9fbff]">결재 유형</TableHead>
                <TableHead className="bg-[#f9fbff]">요청 세관원</TableHead>
                <TableHead className="bg-[#f9fbff]">요청 일시</TableHead>
                <TableHead className="bg-[#f9fbff]">위험도</TableHead>
                <TableHead className="bg-[#f9fbff]">상태</TableHead>
                <TableHead className="bg-[#f9fbff]">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpi.recentApprovals.map((item) => (
                <TableRow key={item.approvalId} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="font-mono text-sm">{item.declNo}</TableCell>
                  <TableCell>
                    <Badge variant={item.declType === "IMPORT" ? "primary" : "success"}>{item.declTypeLabel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.approvalTypeBadge}>{item.approvalTypeLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.requestedByName}</TableCell>
                  <TableCell className="text-sm text-gray-500">{item.requestedAt}</TableCell>
                  <TableCell>
                    {item.riskScore !== "-" ? (
                      <span className={`text-sm font-semibold ${Number(item.riskScore) >= 50 ? "text-red-600" : "text-green-600"}`}>
                        {item.riskScore}점
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.statusBadge}>{item.statusLabel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" className="text-xs" onClick={() => navigate(`/supervisor/approval/${item.approvalId}`)}>
                      검토
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <p className="text-sm">결재 대기 중인 건이 없습니다.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default SupervisorDashboardPage;
