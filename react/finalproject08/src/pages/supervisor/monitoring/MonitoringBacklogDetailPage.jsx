// src/pages/supervisor/monitoring/MonitoringBacklogDetailPage.jsx

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Clock, User, FileText, Loader2 } from "lucide-react";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import Button from "../../../style/components/Button";
import { useBacklogStats, useSlaViolations } from "../../../controller/supervisor/useSupervisorController";
import { BACKLOG_STAGE_LABELS, BACKLOG_STAGE_COLORS } from "../../../domain/supervisor/supervisorConstants";

// ── 목 데이터 (개발/테스트용) ────────────────────────
const MOCK_URGENT = [
  {
    declNo: "IMP-20260301-000001",
    declType: "IMPORT",
    stage: "DOC_REVIEW",
    officerName: "정세관",
    receivedAt: "2026-03-01",
    elapsedDays: 5.2,
    remainDays: 1.8,
    isSlaViolation: true,
    isDelayed: true,
  },
];

// ── 상수 ──────────────────────────────────────────
const MAX_DAYS = 7;
const SLA_DAYS = 3;

const getRemainColor = (remainDays) => {
  if (remainDays <= 0) return { bar: "#dc2626", badge: "danger", text: "text-red-600", bg: "bg-red-50 border-red-200" };
  if (remainDays <= 1) return { bar: "#ef4444", badge: "danger", text: "text-red-600", bg: "bg-red-50 border-red-200" };
  if (remainDays <= 2) return { bar: "#f97316", badge: "warning", text: "text-orange-600", bg: "bg-orange-50 border-orange-200" };
  return { bar: "#f59e0b", badge: "warning", text: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
};

// 정보 행 컴포넌트
function InfoRow({ label, value, children }) {
  return (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-0">
      <span className="w-36 text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800">{children ?? value ?? "-"}</span>
    </div>
  );
}

// 게이지 바
function DeadlineGauge({ elapsedDays, remainDays }) {
  const percent = Math.min(Math.round((elapsedDays / MAX_DAYS) * 100), 100);
  const color = getRemainColor(remainDays);

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>접수일 (0일)</span>
        <span className="font-semibold">현재 {elapsedDays}일 경과</span>
        <span>만료 ({MAX_DAYS}일)</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
          style={{ width: `${percent}%`, backgroundColor: color.bar }}
        >
          {percent > 15 && <span className="text-xs font-bold text-white">{percent}%</span>}
        </div>
      </div>
      <div className="flex justify-between mt-2">
        {/* SLA 기준선 표시 */}
        <div className="text-xs text-gray-400" style={{ marginLeft: `${(SLA_DAYS / MAX_DAYS) * 100}%` }}>
          ▲ SLA ({SLA_DAYS}일)
        </div>
        <span className={`text-sm font-bold ${color.text}`}>{remainDays <= 0 ? "기한 초과" : `D-${Math.ceil(remainDays)} 남음`}</span>
      </div>
    </div>
  );
}

function MonitoringBacklogDetailPage() {
  const navigate = useNavigate();
  const { declType, declNo } = useParams();

  // 전체 지연 목록에서 해당 건 찾기
  const { data: violations, isLoading } = useSlaViolations({ declType: "ALL" });

  const item = useMemo(() => {
    // 실데이터에서 먼저 검색
    if (violations) {
      const list = Array.isArray(violations) ? violations : (violations?.content ?? []);
      const found = list.find((v) => v.declNo === declNo);
      if (found) return found;
    }
    // 없으면 목 데이터에서 검색
    return MOCK_URGENT.find((v) => v.declNo === declNo) ?? null;
  }, [violations, declNo]);

  const color = item ? getRemainColor(item.remainDays ?? 0) : null;

  const handleBack = () => navigate("/supervisor/monitoring/backlog");

  // 원본 신고서 상세로 이동
  const handleGoDetail = () => {
    if (!item) return;
    if (item.declType === "IMPORT") {
      navigate(`/supervisor/import/${item.declNo}`);
    } else {
      navigate(`/supervisor/export/${item.declNo}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#0f4c81]" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-4">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> 목록으로
        </button>
        <Card padding="md">
          <p className="text-center text-gray-400 py-12">해당 신고 건을 찾을 수 없습니다. ({declNo})</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========== 헤더 ========== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            지연 모니터링
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800">{item.declNo}</span>
        </div>
      </div>

      {/* ========== 상태 배너 ========== */}
      <div className={`rounded-lg border p-4 flex items-center gap-3 ${color.bg}`}>
        <AlertTriangle className={`w-5 h-5 ${color.text}`} />
        <div>
          <p className={`text-sm font-bold ${color.text}`}>
            {item.remainDays <= 0
              ? "기한이 초과된 신고 건입니다. 즉시 처리가 필요합니다."
              : `처리 기한까지 D-${Math.ceil(item.remainDays)}일 남았습니다.`}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            SLA 기준 {SLA_DAYS}일 · 최대 여유 {MAX_DAYS}일 · 접수일 기준
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant={color.badge}>{item.remainDays <= 0 ? "기한 초과" : `D-${Math.ceil(item.remainDays)}`}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ========== 신고 정보 ========== */}
        <div className="col-span-2 space-y-6">
          <Card padding="md">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#0f4c81]" />
              신고 정보
            </h3>
            <InfoRow label="신고번호">
              <span className="font-mono">{item.declNo}</span>
            </InfoRow>
            <InfoRow label="구분">
              <Badge variant={item.declType === "IMPORT" ? "primary" : "success"}>{item.declType === "IMPORT" ? "수입" : "수출"}</Badge>
            </InfoRow>
            <InfoRow label="현재 단계">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: BACKLOG_STAGE_COLORS[item.stage] || "#94a3b8" }}
              >
                {BACKLOG_STAGE_LABELS[item.stage] || item.stage}
              </span>
            </InfoRow>
            <InfoRow label="접수일" value={item.receivedAt} />
            <InfoRow label="SLA 초과 여부">
              {item.isSlaViolation ? <Badge variant="danger">SLA 초과 ({SLA_DAYS}일 기준)</Badge> : <Badge variant="outline">정상</Badge>}
            </InfoRow>
            <InfoRow label="DELAY_YN">
              {item.isDelayed ? <Badge variant="danger">지연 (Y)</Badge> : <Badge variant="outline">정상 (N)</Badge>}
            </InfoRow>
          </Card>

          {/* ========== 처리 기한 게이지 ========== */}
          <Card padding="md">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-[#0f4c81]" />
              처리 기한 현황
            </h3>
            <DeadlineGauge elapsedDays={item.elapsedDays ?? 0} remainDays={item.remainDays ?? 0} />

            {/* 일수 요약 */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">경과 일수</p>
                <p className="text-2xl font-bold text-gray-700">{item.elapsedDays ?? 0}일</p>
              </div>
              <div className={`text-center p-3 rounded-lg ${color.bg}`}>
                <p className="text-xs text-gray-400 mb-1">남은 일수</p>
                <p className={`text-2xl font-bold ${color.text}`}>{item.remainDays <= 0 ? "초과" : `${Math.ceil(item.remainDays)}일`}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">최대 여유</p>
                <p className="text-2xl font-bold text-gray-500">{MAX_DAYS}일</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ========== 담당자 정보 ========== */}
        <div className="space-y-6">
          <Card padding="md">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-[#0f4c81]" />
              담당자 정보
            </h3>
            <InfoRow label="담당자" value={item.officerName} />
          </Card>

          {/* 조치 안내 */}
          <Card padding="md">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">조치 안내</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              {item.remainDays <= 0 && (
                <li className="flex items-start gap-2 text-red-600 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  기한이 초과되었습니다. 즉시 처리하거나 상급자에게 보고하세요.
                </li>
              )}
              {item.isSlaViolation && item.remainDays > 0 && (
                <li className="flex items-start gap-2 text-orange-600">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  SLA({SLA_DAYS}일)를 초과했습니다. 신속한 처리가 필요합니다.
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="w-3.5 h-3.5 mt-0.5 shrink-0 text-center">•</span>
                신고서 원문 보기 버튼으로 상세 내용을 확인하세요.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-3.5 h-3.5 mt-0.5 shrink-0 text-center">•</span>
                담당자에게 직접 연락하여 처리 현황을 확인하세요.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MonitoringBacklogDetailPage;
