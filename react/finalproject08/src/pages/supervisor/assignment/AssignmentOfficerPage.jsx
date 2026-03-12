// src/pages/supervisor/assignment/AssignmentOfficerPage.jsx

import { useState, useMemo, useCallback } from "react";
import {
  UserCheck,
  Loader2,
  Users,
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ArrowDown,
  ArrowUp,
  Search,
} from "lucide-react";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import Button from "../../../style/components/Button";
import Drawer from "../../../style/components/Drawer";
import Input from "../../../style/components/Input";
import DataGrid from "../../../style/components/DataGrid";
import { cn } from "../../../style/utils";
import { useAssignmentQueue, useAvailableOfficers, calcOfficerLoadFromList } from "../../../controller/supervisor/useSupervisorController";
import { useSupervisorMutations } from "../../../controller/supervisor/useSupervisorMutations";
import AlertModal from "../../../style/components/AlertModal";
import { useAlertModal } from "../../../hooks/useAlertModal";
import {
  ASSIGNMENT_WORK_TYPE_LABELS,
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_BADGE_VARIANTS,
  getOfficerLoadPercent,
} from "../../../domain/supervisor/supervisorConstants";

const PAGE_SIZE = 10;

// ── 페이지네이션 ──
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

const STATUS_TABS = [
  { id: "ALL", label: "전체" },
  { id: "WAITING", label: "심사대기" },
  { id: "REVIEWING", label: "심사중" },
  { id: "ACCEPTED", label: "수리" },
  { id: "PHYSICAL", label: "검사중" },
  { id: "SUPPLEMENT", label: "보완/정정" },
  { id: "PAY_WAITING", label: "납부대기" },
  { id: "PAY_COMPLETED", label: "납부완료" },
  { id: "APPROVED", label: "통관승인" },
  { id: "REJECTED", label: "반려" },
];

// ──────────────────────────────────────────────
// AG-Grid 셀 렌더러
// ──────────────────────────────────────────────
const CENTER = { display: "flex", alignItems: "center", justifyContent: "center" };

function WorkTypeCellRenderer({ data }) {
  if (!data) return null;
  return (
    <Badge variant={data.workType === "EXPORT" ? "success" : "primary"}>{ASSIGNMENT_WORK_TYPE_LABELS[data.workType] || data.workType || "-"}</Badge>
  );
}

function StatusCellRenderer({ data }) {
  if (!data) return null;
  return (
    <Badge variant={APPROVAL_STATUS_BADGE_VARIANTS[data.status] || "outline"}>{APPROVAL_STATUS_LABELS[data.status] || data.status || "-"}</Badge>
  );
}

function OfficerCellRenderer({ value }) {
  if (!value) return <span className="text-amber-500 font-semibold text-sm">미배정</span>;
  return <span className="text-gray-700 text-sm">{value}</span>;
}

// ──────────────────────────────────────────────
// 수입/수출 토글
// ──────────────────────────────────────────────
function WorkTypeToggle({ value, onChange }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-200">
      {["IMPORT", "EXPORT"].map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "px-5 py-2 text-sm font-semibold transition-colors",
            value === type ? "bg-[#0f4c81] text-white" : "bg-white text-gray-600 hover:bg-gray-50",
          )}
        >
          {type === "IMPORT" ? "수입 통관" : "수출 통관"}
        </button>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Drawer 내부 - 배정 확인
// ──────────────────────────────────────────────
function AssignmentDrawerContent({ item, officer, onAssigned, onClose }) {
  const { assignOfficer } = useSupervisorMutations();
  const { alertModal, showSuccess, showError } = useAlertModal();
  const [assignReason, setAssignReason] = useState("");
  const isExport = item?.workType === "EXPORT";
  const loadPct = getOfficerLoadPercent(officer?.taskLoad);
  const isHeavy = loadPct >= 80;

  const handleSubmit = async () => {
    try {
      await assignOfficer.mutateAsync({
        declarationId: item.declarationId,
        officerId: officer.officerId,
        workType: item.workType,
        reason: assignReason,
      });
      showSuccess("배정 완료", "배정이 완료되었습니다.", () => onAssigned?.());
    } catch (err) {
      showError("배정 실패", err.message);
    }
  };

  if (!item || !officer) return null;

  return (
    <div className="space-y-5">
      <div
        className={cn(
          "p-4 flex justify-between items-center border border-gray-200 rounded-lg border-l-4",
          isExport ? "border-l-green-600" : "border-l-[#0f4c81]",
        )}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isExport ? "success" : "primary"}>{isExport ? "수출 통관" : "수입 통관"}</Badge>
            <Badge variant={APPROVAL_STATUS_BADGE_VARIANTS[item.status] || "outline"}>
              {APPROVAL_STATUS_LABELS[item.status] || item.status || "-"}
            </Badge>
          </div>
          <div className="text-lg font-bold font-mono text-gray-900">{item.declNo}</div>
        </div>
        <div className="text-right">
          {item.currentOfficerName ? (
            <div>
              <div className="text-xs text-gray-500">현재 담당자</div>
              <div className="text-sm font-semibold text-gray-800">{item.currentOfficerName}</div>
            </div>
          ) : (
            <Badge variant="warning">미배정</Badge>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">배정 대상 세관원</label>
        <div className="p-3 border border-[#0f4c81] bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">{officer.officerName}</span>
            <Badge variant={isHeavy ? "danger" : "outline"}>{loadPct}%</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={cn("h-1.5 rounded-full", isHeavy ? "bg-red-500" : "bg-blue-500")} style={{ width: `${loadPct}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {officer.taskLoad}/{officer.totalCapacity}건 처리 중
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          배정 사유 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <textarea
          value={assignReason}
          onChange={(e) => setAssignReason(e.target.value)}
          placeholder="재배정 사유를 입력하세요."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button disabled={assignOfficer.isPending} onClick={handleSubmit}>
          <UserCheck className="w-4 h-4 mr-2" />
          {assignOfficer.isPending ? "처리 중..." : "배정 확정"}
        </Button>
      </div>
      <AlertModal {...alertModal} />
    </div>
  );
}

// ──────────────────────────────────────────────
// 세관원 현황 패널
// ──────────────────────────────────────────────
function OfficerPanel({ officers, officersLoading, selectedOfficerId, selectedItem, onOfficerClick, onAssignClick, officerSort, onSortToggle }) {
  const OFFICER_PAGE_SIZE = 6;
  const [officerPage, setOfficerPage] = useState(1);
  const canSelect = !!selectedItem;

  const sortedOfficers = useMemo(
    () => [...officers].sort((a, b) => (officerSort === "desc" ? b.taskLoad - a.taskLoad : a.taskLoad - b.taskLoad)),
    [officers, officerSort],
  );
  const officerTotalPages = Math.max(1, Math.ceil(sortedOfficers.length / OFFICER_PAGE_SIZE));
  const pagedOfficers = sortedOfficers.slice((officerPage - 1) * OFFICER_PAGE_SIZE, officerPage * OFFICER_PAGE_SIZE);

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0f4c81]" />
          세관원 현황
        </h3>
        <button
          onClick={onSortToggle}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {officerSort === "desc" ? (
            <>
              <ArrowDown className="h-3 w-3 text-[#0f4c81]" />
              <span className="text-[#0f4c81]">많은순</span>
            </>
          ) : (
            <>
              <ArrowUp className="h-3 w-3 text-[#0f4c81]" />
              <span className="text-[#0f4c81]">적은순</span>
            </>
          )}
        </button>
      </div>

      {officersLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : sortedOfficers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">데이터 없음</p>
      ) : (
        <div className="space-y-2">
          {pagedOfficers.map((officer) => {
            const loadPct = getOfficerLoadPercent(officer.taskLoad);
            const isHeavy = loadPct >= 80;
            const isSelected = selectedOfficerId === String(officer.officerId);
            return (
              <div
                key={officer.officerId}
                onClick={() => onOfficerClick(officer.officerId)}
                className={cn(
                  "p-3 border rounded-lg transition-all",
                  canSelect ? "cursor-pointer" : "cursor-default opacity-60",
                  isSelected
                    ? "border-[#0f4c81] bg-blue-50 ring-1 ring-[#0f4c81]"
                    : canSelect
                      ? "border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white"
                      : "border-gray-100 bg-gray-50",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {canSelect && (
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          isSelected ? "border-[#0f4c81] bg-[#0f4c81]" : "border-gray-300",
                        )}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-800">{officer.officerName}</span>
                  </div>
                  <span className={cn("text-xs font-semibold", isHeavy ? "text-red-600" : "text-gray-500")}>
                    {officer.taskLoad}/{officer.totalCapacity}건
                  </span>
                </div>
                <div className={cn("w-full bg-gray-200 rounded-full h-1.5", canSelect && "ml-6 w-[calc(100%-1.5rem)]")}>
                  <div className={`h-1.5 rounded-full ${isHeavy ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${loadPct}%` }} />
                </div>
              </div>
            );
          })}

          {officerTotalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              <button
                onClick={() => setOfficerPage((p) => Math.max(1, p - 1))}
                disabled={officerPage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: officerTotalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setOfficerPage(p)}
                  className={cn(
                    "px-2 py-0.5 rounded text-xs min-w-[24px]",
                    officerPage === p ? "bg-[#0f4c81] text-white font-semibold" : "hover:bg-gray-100 text-gray-600",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setOfficerPage((p) => Math.min(officerTotalPages, p + 1))}
                disabled={officerPage === officerTotalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100">
        <Button className="w-full" disabled={!selectedItem || !selectedOfficerId} onClick={onAssignClick}>
          <UserCheck className="w-4 h-4 mr-2" />
          배정하기
        </Button>
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────
// 메인 페이지
// ──────────────────────────────────────────────
function AssignmentOfficerPage() {
  const [workType, setWorkType] = useState("EXPORT");
  const [statusTab, setStatusTab] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [officerSort, setOfficerSort] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("declNo");

  const {
    data: queueRaw,
    allData: allQueueData,
    totalCount: queueTotalCount,
    statusCounts,
    isLoading: queueLoading,
    refetch: refetchQueue,
  } = useAssignmentQueue({ workType });
  const { data: officerList, isLoading: officersLoading } = useAvailableOfficers({ workType });

  const allList = useMemo(() => (Array.isArray(queueRaw) ? queueRaw : []), [queueRaw]);

  // useAvailableOfficers가 workType에 따라 수입/수출 API를 분기하므로
  // 반환값을 그대로 사용
  const officers = useMemo(() => {
    const base = Array.isArray(officerList) ? officerList : [];
    // EXCLUDED 필터 전 전체 목록 기준으로 집계 (allQueueData)
    const fullList = Array.isArray(allQueueData) ? allQueueData : allList;
    return calcOfficerLoadFromList(base, fullList);
  }, [officerList, allQueueData, allList]);
  const selectedOfficer = useMemo(() => officers.find((o) => String(o.officerId) === selectedOfficerId) || null, [officers, selectedOfficerId]);

  const filteredList = useMemo(() => {
    let list = allList;
    if (statusTab !== "ALL") list = list.filter((item) => item.status === statusTab);
    if (appliedSearch) {
      const kw = appliedSearch.toLowerCase();
      if (searchType === "officer") {
        list = list.filter((item) => (item.currentOfficerName || "").toLowerCase().includes(kw));
      } else {
        list = list.filter((item) => (item.declNo || "").toLowerCase().includes(kw));
      }
    }
    return list;
  }, [allList, statusTab, appliedSearch, searchType]);

  const tabCounts = useMemo(() => {
    const counts = { ALL: queueTotalCount ?? allList.length };
    STATUS_TABS.forEach((tab) => {
      if (tab.id !== "ALL") counts[tab.id] = statusCounts?.[tab.id] ?? 0;
    });
    return counts;
  }, [queueTotalCount, statusCounts, allList]);

  const totalCount = statusTab === "ALL" ? (queueTotalCount ?? filteredList.length) : (statusCounts?.[statusTab] ?? filteredList.length);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const pagedList = filteredList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const unassignedCount = useMemo(() => filteredList.filter((i) => !i.currentOfficerName).length, [filteredList]);

  // AG-Grid 컬럼
  const colDefs = useMemo(
    () => [
      { headerName: "신고번호", field: "declNo", flex: 2, minWidth: 180, cellClass: "font-mono text-sm", cellStyle: CENTER },
      { headerName: "업무 유형", field: "workType", flex: 1, minWidth: 110, cellRenderer: WorkTypeCellRenderer, cellStyle: CENTER },
      { headerName: "상태", field: "status", flex: 1, minWidth: 110, cellRenderer: StatusCellRenderer, cellStyle: CENTER },
      { headerName: "품명", field: "itemName", flex: 1.5, minWidth: 140, cellClass: "text-sm text-gray-700", cellStyle: CENTER },
      { headerName: "현재 담당자", field: "currentOfficerName", flex: 1, minWidth: 120, cellRenderer: OfficerCellRenderer, cellStyle: CENTER },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      headerClass: "ag-center-header",
    }),
    [],
  );

  const getRowId = useCallback((params) => String(params.data.declarationId), []);

  const getRowClass = useCallback(
    (params) => (params.data?.declarationId === selectedItem?.declarationId ? "bg-blue-50 border-l-2 border-l-[#0f4c81]" : ""),
    [selectedItem],
  );

  const onRowClicked = useCallback((e) => {
    setSelectedItem(e.data);
    setSelectedOfficerId("");
  }, []);

  const handleWorkTypeChange = (type) => {
    setWorkType(type);
    setStatusTab("ALL");
    setSearchKeyword("");
    setAppliedSearch("");
    setCurrentPage(1);
    setSelectedItem(null);
    setSelectedOfficerId("");
  };
  const handleStatusTabChange = (tabId) => {
    setStatusTab(tabId);
    setCurrentPage(1);
    setSelectedItem(null);
    setSelectedOfficerId("");
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-900">담당자 배정</span>
        <ChevronRight className="h-4 w-4" />
        <span>{statusTab === "ALL" ? "전체" : STATUS_TABS.find((t) => t.id === statusTab)?.label}</span>
      </div>

      {/* 필터 Card */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">담당자 재배정</h1>
          <WorkTypeToggle value={workType} onChange={handleWorkTypeChange} />
        </div>

        {/* 상태 탭 + 검색 1줄 */}
        <div className="border-b border-gray-200 flex items-center justify-between pr-4">
          <div className="flex overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStatusTabChange(tab.id)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                  statusTab === tab.id ? "text-[#0f4c81] border-[#0f4c81]" : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                {tab.label}
                {tabCounts[tab.id] > 0 && (
                  <span className={cn("ml-1.5 text-xs", statusTab === tab.id ? "text-[#0f4c81]" : "text-gray-400")}>{tabCounts[tab.id]}</span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pl-4">
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchKeyword("");
                setAppliedSearch("");
              }}
              className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="declNo">신고번호</option>
              <option value="officer">담당자</option>
            </select>
            <Input
              type="text"
              placeholder={searchType === "officer" ? "담당자명" : "신고번호"}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && setAppliedSearch(searchKeyword)}
              className="w-44"
            />
            <Button size="sm" onClick={() => setAppliedSearch(searchKeyword)}>
              <Search className="h-4 w-4 mr-1" />
              검색
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchKeyword("");
                setAppliedSearch("");
              }}
            >
              초기화
            </Button>
          </div>
        </div>
      </Card>

      {/* 요약 */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <FileText className="h-4 w-4" />총 <span className="font-semibold text-gray-900">{totalCount}</span>건
        {unassignedCount > 0 && (
          <>
            <span className="text-gray-400">·</span>
            <span className="text-amber-600 font-semibold">미배정 {unassignedCount}건</span>
          </>
        )}
        <span className="text-gray-400">·</span>
        <span className="text-gray-500">{workType === "EXPORT" ? "수출 통관" : "수입 통관"}</span>
      </div>

      {/* 좌 2/3 + 우 1/3 */}
      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2">
          <Card padding="none">
            <DataGrid
              rowData={pagedList}
              colDefs={colDefs}
              defaultColDef={defaultColDef}
              height={`${48 + PAGE_SIZE * 48}px`}
              loading={queueLoading}
              onRowClicked={onRowClicked}
              getRowId={getRowId}
              getRowClass={getRowClass}
              rowClass="cursor-pointer"
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </Card>
        </div>

        <div className="col-span-1">
          <OfficerPanel
            officers={officers}
            officersLoading={officersLoading}
            selectedOfficerId={selectedOfficerId}
            selectedItem={selectedItem}
            onOfficerClick={(id) => {
              if (selectedItem) setSelectedOfficerId(String(id));
            }}
            onAssignClick={() => {
              if (selectedItem && selectedOfficerId) setDrawerOpen(true);
            }}
            officerSort={officerSort}
            onSortToggle={() => setOfficerSort((p) => (p === "desc" ? "asc" : "desc"))}
          />
        </div>
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} size="lg" title="담당자 배정 확인">
        {selectedItem && selectedOfficer && (
          <AssignmentDrawerContent
            item={selectedItem}
            officer={selectedOfficer}
            onAssigned={() => {
              refetchQueue();
              setDrawerOpen(false);
              setSelectedItem(null);
              setSelectedOfficerId("");
            }}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </Drawer>
    </div>
  );
}

export default AssignmentOfficerPage;
