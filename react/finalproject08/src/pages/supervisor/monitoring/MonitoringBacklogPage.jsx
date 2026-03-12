// src/pages/supervisor/monitoring/MonitoringBacklogPage.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, Loader2, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import DataGrid from "../../../style/components/DataGrid";
import { cn } from "../../../style/utils";
import { useBacklogStats, useSlaViolations } from "../../../controller/supervisor/useSupervisorController";
import MonitoringFilterPanel from "../../components/MonitoringFilterPanel";
import { BACKLOG_STAGE_LABELS, BACKLOG_STAGE_COLORS } from "../../../domain/supervisor/supervisorConstants";

// ── 상수 ──────────────────────────────────────────────
const PAGE_SIZE = 15;

// ── 페이지네이션 ────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "px-3 py-1 rounded min-w-[32px] text-sm font-medium",
            currentPage === p ? "bg-[#0f4c81] text-white font-semibold" : "hover:bg-gray-100 text-gray-700",
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── 수입/수출 토글 ──
function WorkTypeToggle({ value, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {[
        { type: "ALL", label: "전체" },
        { type: "IMPORT", label: "수입 통관" },
        { type: "EXPORT", label: "수출 통관" },
      ].map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "px-6 py-2 rounded-md text-sm font-semibold transition-all",
            value === type ? "bg-[#0f4c81] text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── 상수 ──────────────────────────────────────────
const MAX_DAYS = 7;
const SLA_DAYS = 3;

// ── 메인 페이지 ───────────────────────────────────
function MonitoringBacklogPage() {
  const navigate = useNavigate();
  const [workType, setWorkType] = useState("ALL");
  const [params, setParams] = useState({ declType: "ALL", period: "today" });
  const [filters, setFilters] = useState({
    period: "today",
    remainDays: "",
    isSlaViolation: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleWorkTypeChange = (type) => {
    setWorkType(type);
    setParams((p) => ({ ...p, declType: type }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "period") setParams((p) => ({ ...p, period: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    const reset = { period: "today", remainDays: "", isSlaViolation: "", search: "", startDate: "", endDate: "" };
    setFilters(reset);
    setAppliedFilters({});
    setParams((p) => ({ ...p, period: "today" }));
    setCurrentPage(1);
  };

  const { data: backlog, isLoading: backlogLoading, refetch: refetchBacklog } = useBacklogStats(params);
  const { data: violations, isLoading: violationsLoading, refetch: refetchViolations } = useSlaViolations(params);

  const isLoading = backlogLoading || violationsLoading;

  const baseList = useMemo(() => {
    if (!violations) return [];
    const list = Array.isArray(violations) ? violations : (violations?.content ?? []);
    return [...list].sort((a, b) => (a.remainDays ?? 0) - (b.remainDays ?? 0));
  }, [violations]);

  const displayList = useMemo(() => {
    let list = baseList;
    const { remainDays, isSlaViolation, search } = appliedFilters;

    if (remainDays !== undefined && remainDays !== "") {
      const max = Number(remainDays);
      list = list.filter((item) => (item.remainDays ?? 0) <= max);
    }

    if (isSlaViolation !== undefined && isSlaViolation !== "") {
      const isOver = isSlaViolation === "true";
      list = list.filter((item) => item.isSlaViolation === isOver);
    }

    if (search) {
      const kw = search.toLowerCase();
      list = list.filter(
        (item) =>
          (item.declNo ?? "").toLowerCase().includes(kw) ||
          (item.officerName ?? "").toLowerCase().includes(kw) ||
          (item.itemName ?? "").toLowerCase().includes(kw),
      );
    }

    return list;
  }, [baseList, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(displayList.length / PAGE_SIZE));
  const pagedList = displayList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleRowClicked = (e) => {
    const { declType, declNo } = e.data;
    navigate(`/supervisor/monitoring/backlog/${declType}/${declNo}`);
  };

  // ── AG-Grid 컬럼 정의 (수입/수출 목록과 동일 구조) ──
  const colDefs = useMemo(
    () => [
      {
        field: "declNo",
        headerName: "신고번호",
        width: 200,
        headerClass: "ag-center-header",
        cellStyle: { fontFamily: "monospace", fontSize: "13px", textAlign: "center", fontWeight: "600", color: "#374151" },
      },
      {
        field: "declType",
        headerName: "구분",
        width: 80,
        headerClass: "ag-center-header",
        cellRenderer: (params) => (
          <div className="flex items-center justify-center h-full">
            <Badge variant={params.value === "IMPORT" ? "primary" : "success"}>{params.value === "IMPORT" ? "수입" : "수출"}</Badge>
          </div>
        ),
      },
      {
        field: "itemName",
        headerName: "신고품명",
        flex: 1,
        minWidth: 150,
        headerClass: "ag-center-header",
        cellStyle: { textAlign: "center", color: "#374151", fontWeight: "600" },
        valueFormatter: (params) => params.value || "-",
      },
      {
        field: "stage",
        headerName: "현재 단계",
        width: 120,
        headerClass: "ag-center-header",
        cellRenderer: (params) => (
          <div className="flex items-center justify-center h-full">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: BACKLOG_STAGE_COLORS[params.value] || "#94a3b8" }}
            >
              {BACKLOG_STAGE_LABELS[params.value] || params.value || "-"}
            </span>
          </div>
        ),
      },
      {
        field: "officerName",
        headerName: "담당자",
        width: 100,
        headerClass: "ag-center-header",
        cellStyle: { textAlign: "center", color: "#374151", fontWeight: "600" },
        valueFormatter: (params) => params.value || "미배정",
      },
      {
        field: "receivedAt",
        headerName: "접수일",
        width: 130,
        headerClass: "ag-center-header",
        cellStyle: { textAlign: "center", color: "#6b7280" },
        valueFormatter: (params) => {
          if (!params.value || params.value === "-") return "-";
          try {
            const date = new Date(params.value);
            if (isNaN(date.getTime())) return params.value;
            return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\.$/, "");
          } catch {
            return params.value;
          }
        },
      },
      {
        field: "aiScore",
        headerName: "서류 점수",
        width: 105,
        headerClass: "ag-center-header",
        valueFormatter: (params) => (params.value != null ? `${params.value}점` : "-"),
        cellStyle: (params) => {
          const score = params.value;
          let color = "#374151";
          if (score >= 80) color = "#059669";
          else if (score != null && score < 80 && score > 0) color = "#b91c1c";
          return { textAlign: "center", fontWeight: "700", color };
        },
      },
      {
        field: "riskLevel",
        headerName: "위험도",
        width: 95,
        headerClass: "ag-center-header",
        cellRenderer: (params) => {
          const level = params.value;
          const label = params.data?.riskLevelLabel || level || "-";
          const variant = level === "RED" ? "danger" : level === "GREEN" ? "success" : "outline";
          return (
            <div className="flex items-center justify-center h-full">
              <Badge variant={variant} className="w-14 justify-center">
                {label}
              </Badge>
            </div>
          );
        },
        cellStyle: { textAlign: "center" },
      },
    ],
    [],
  );

  const urgencyCounts = useMemo(
    () => ({
      expired: displayList.filter((i) => (i.remainDays ?? 0) <= 0).length,
      day1: displayList.filter((i) => i.remainDays > 0 && i.remainDays <= 1).length,
      day2: displayList.filter((i) => i.remainDays > 1 && i.remainDays <= 2).length,
      day3: displayList.filter((i) => i.remainDays > 2 && i.remainDays <= 3).length,
    }),
    [displayList],
  );

  const handleRefresh = () => {
    refetchBacklog();
    refetchViolations();
  };

  return (
    <div className="space-y-6">
      {/* ========== 헤더 + 토글 ========== */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">지연 모니터링</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                신고 접수일 기준 · SLA {SLA_DAYS}일 · 최대 여유 {MAX_DAYS}일
              </p>
            </div>
            <WorkTypeToggle value={workType} onChange={handleWorkTypeChange} />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>

        <div className="p-4">
          <MonitoringFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleFilterReset}
            hideCard={true}
          />
        </div>
      </Card>

      {/* ========== 지연 모니터링 게이지 ========== */}
      <Card padding="md">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-[#0f4c81]" />
          지연 모니터링
        </h3>

        {backlogLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin text-[#0f4c81]" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">총 처리 대기</p>
              <p className="text-3xl font-bold text-blue-800">{backlog?.totalBacklog ?? "-"}</p>
              <p className="text-xs text-blue-500 mt-1">전체 미완료 건</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-blue-400 mb-1">
                  <span>지연률</span>
                  <span>{backlog?.delayRate ?? 0}%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${backlog?.delayRate ?? 0}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-xs text-red-600 font-medium mb-1">기한 초과</p>
              <p className="text-3xl font-bold text-red-700">{urgencyCounts.expired}</p>
              <p className="text-xs text-red-400 mt-1">7일 초과 · 즉시 처리 필요</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-red-400 mb-1">
                  <span>비율</span>
                  <span>{backlog?.totalBacklog ? Math.round((urgencyCounts.expired / backlog.totalBacklog) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-red-500 transition-all duration-500"
                    style={{ width: `${backlog?.totalBacklog ? Math.round((urgencyCounts.expired / backlog.totalBacklog) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-xs text-orange-600 font-medium mb-1">SLA 초과</p>
              <p className="text-3xl font-bold text-orange-700">{backlog?.slaViolationCount ?? "-"}</p>
              <p className="text-xs text-orange-400 mt-1">3일 초과 · 주의 필요</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-orange-400 mb-1">
                  <span>비율</span>
                  <span>{backlog?.totalBacklog ? Math.round((backlog.slaViolationCount / backlog.totalBacklog) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-orange-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                    style={{ width: `${backlog?.totalBacklog ? Math.round((backlog.slaViolationCount / backlog.totalBacklog) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-xs text-purple-600 font-medium mb-1">평균 처리 일수</p>
              <p className="text-3xl font-bold text-purple-800">{backlog?.avgProcessingDays != null ? `${backlog.avgProcessingDays}일` : "-"}</p>
              <p className="text-xs text-purple-400 mt-1">7일 내 처리 {backlog?.within7Rate ?? 0}%</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-purple-400 mb-1">
                  <span>7일 내 처리율</span>
                  <span>{backlog?.within7Rate ?? 0}%</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${backlog?.within7Rate ?? 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ========== 지연 임박 목록 ========== */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            지연 임박 목록
            <span className="text-xs text-gray-400 font-normal">남은 일수 3일 이하</span>
          </h3>
          <div className="flex items-center gap-2">
            {urgencyCounts.expired > 0 && <Badge variant="danger">기한초과 {urgencyCounts.expired}건</Badge>}
            {urgencyCounts.day1 > 0 && <Badge variant="danger">D-1 {urgencyCounts.day1}건</Badge>}
            {urgencyCounts.day2 > 0 && <Badge variant="warning">D-2 {urgencyCounts.day2}건</Badge>}
            {urgencyCounts.day3 > 0 && <Badge variant="warning">D-3 {urgencyCounts.day3}건</Badge>}
          </div>
        </div>

        {violationsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#0f4c81]" />
          </div>
        ) : displayList.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm">지연 임박 건이 없습니다.</p>
          </div>
        ) : (
          <div>
            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                총 <span className="font-semibold text-gray-800">{displayList.length}</span>건 · {currentPage}/{totalPages} 페이지
              </span>
              <span className="text-xs text-gray-400">행을 클릭하면 상세 페이지로 이동합니다.</span>
            </div>
            <div className="px-4 pb-2">
              <DataGrid
                rowData={pagedList}
                colDefs={colDefs}
                height={`${48 + pagedList.length * 48}px`}
                minHeight="0"
                getRowId={(p) => p.data.declNo}
                onRowClicked={handleRowClicked}
              />
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Card>
    </div>
  );
}

export default MonitoringBacklogPage;
