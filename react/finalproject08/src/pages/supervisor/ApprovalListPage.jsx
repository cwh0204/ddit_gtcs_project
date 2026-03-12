// src/pages/supervisor/approval/ApprovalListPage.jsx

import { useState, useMemo } from "react";
import { FileText, ClipboardList, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Card from "../../style/components/Card";
import Badge from "../../style/components/Badge";
import Button from "../../style/components/Button";
import Drawer from "../../style/components/Drawer";
import Modal from "../../style/components/Modal";
import Table from "../../style/components/table/Table";
import TableHeader from "../../style/components/table/TableHeader";
import TableBody from "../../style/components/table/TableBody";
import TableRow from "../../style/components/table/TableRow";
import TableHead from "../../style/components/table/TableHead";
import TableCell from "../../style/components/table/TableCell";
import Loader from "../../style/components/Loader";
import { cn } from "../../style/utils";
import { useApprovalList, useApprovalDetail } from "../../controller/supervisor/useSupervisorController";
import { useSupervisorMutations } from "../../controller/supervisor/useSupervisorMutations";
import AlertModal from "../../style/components/AlertModal";
import { useAlertModal } from "../../hooks/useAlertModal";
import {
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUS_BADGE_VARIANTS,
  APPROVAL_STATUS_OPTIONS,
  APPROVAL_DECISION_LABELS,
  APPROVAL_DECISION_BADGE_VARIANTS,
  APPROVAL_TYPE_LABELS,
  SUPERVISOR_REJECT_REASONS,
} from "../../domain/supervisor/supervisorConstants";

// ── 수입 섹션 컴포넌트
import ImportCommonInfoSection from "../customs/import/components/CommonInfoSection";
import ImportPricingInfoSection from "../customs/import/components/PricingInfoSection";
import ImportItemsInfoSection from "../customs/import/components/ItemInfoSection";
import ImportAttachmentsSection from "../customs/import/components/AttachmentSection";

// ── 수출 섹션 컴포넌트
import ExportCommonSection1 from "../customs/export/components/CommonSection1";
import ExportCommonSection2 from "../customs/export/components/CommonSection2";
import ExportItemSection from "../customs/export/components/ItemSection";
import ExportAttachmentSection from "../customs/export/components/AttachmentSection";

// ──────────────────────────────────────────────
// AI 리포트 섹션 (수입/수출 공용)
// ──────────────────────────────────────────────
function AiReportSection({ aiAnalysis }) {
  if (!aiAnalysis) return null;

  return (
    <div className="rounded-lg border-2 border-indigo-100 overflow-hidden mb-4">
      <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0f4c81]">AI 신고서 분석 리포트</h3>
        <span className="text-xs text-gray-500">분석일시: {aiAnalysis.checkDate || "-"}</span>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 위험도 + 점수 */}
        <div className="space-y-4 lg:border-r lg:border-gray-100 lg:pr-6">
          <div className="text-center bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">종합 위험도 판정</p>
            <Badge variant={aiAnalysis.riskLevelColor} className="text-sm px-6 py-1.5 rounded-full">
              {aiAnalysis.riskLevelLabel} ({aiAnalysis.riskLevel})
            </Badge>
            <p className="text-xs text-gray-400 mt-2">
              {aiAnalysis.riskLevel === "RED" ? "※ 필수 검사 대상 (High Risk)" : "※ 자동 수리 대상 (Low Risk)"}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-semibold text-gray-700">서류 적합성</span>
                <span className="text-sm font-bold text-[#0f4c81]">{aiAnalysis.docScore}점</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#0f4c81] h-2 rounded-full" style={{ width: `${aiAnalysis.docScore}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-semibold text-gray-700">위험도 스코어</span>
                <span className={`text-sm font-bold ${aiAnalysis.riskScore >= 60 ? "text-red-600" : "text-green-600"}`}>
                  {aiAnalysis.riskScore}점
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${aiAnalysis.riskScore >= 60 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${aiAnalysis.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">점수가 높을수록 고위험</p>
            </div>
          </div>
        </div>

        {/* 분석 코멘트 */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-1.5">AI 서류 작성 피드백</h4>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
              {aiAnalysis.docComment || "분석된 서류 피드백이 없습니다."}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-1.5">위험 요소 정밀 분석</h4>
            <div
              className={`p-3 rounded-lg border text-xs leading-relaxed whitespace-pre-wrap ${
                aiAnalysis.riskLevel === "RED" ? "bg-red-50 border-red-100 text-red-800" : "bg-green-50 border-green-100 text-green-800"
              }`}
            >
              {aiAnalysis.riskComment || "특이 위험 요소가 발견되지 않았습니다."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Drawer 내부 - 결재 상세 내용
// ──────────────────────────────────────────────
function ApprovalDrawerContent({ approvalId, onApproved, onRejected }) {
  const { data: approval, isLoading, error } = useApprovalDetail(approvalId);
  const { approveDeclaration, rejectDeclaration } = useSupervisorMutations();

  const [activeTab, setActiveTab] = useState("summary");
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [rejectReasonOther, setRejectReasonOther] = useState("");

  const { alertModal, showError, showWarning } = useAlertModal();

  // ⭐ _declType 또는 declType으로 수입/수출 판별
  const isImport = approval?.declType === "IMPORT" || approval?._declType === "IMPORT";
  const isExport = approval?.declType === "EXPORT" || approval?._declType === "EXPORT";

  // ESCALATED만 결재 가능, ACCEPTED/REJECTED는 처리 완료
  const isAlreadyDecided = useMemo(() => {
    if (!approval) return false;
    return ["ACCEPTED", "REJECTED", "APPROVED"].includes(approval.status);
  }, [approval]);

  const statusVariant = APPROVAL_DECISION_BADGE_VARIANTS?.[approval?.status] || APPROVAL_STATUS_BADGE_VARIANTS?.[approval?.status] || "outline";
  const statusLabel = APPROVAL_DECISION_LABELS?.[approval?.status] || APPROVAL_STATUS_LABELS?.[approval?.status] || approval?.status;

  // ⭐ 탭 구성 - mapper가 변환한 데이터 존재 여부로 탭 활성화
  const tabs = useMemo(() => {
    const base = [{ id: "summary", label: "결재 요약" }];

    if (isImport && approval?.common) {
      return [
        ...base,
        { id: "ai", label: "AI 리포트" },
        { id: "common", label: "1. 공통사항" },
        { id: "pricing", label: "2. 결제 및 세액" },
        { id: "items", label: "3. 물품 정보" },
        { id: "attachments", label: "4. 첨부파일" },
      ];
    }
    if (isExport && approval?.common) {
      return [
        ...base,
        { id: "ai", label: "AI 리포트" },
        { id: "common1", label: "1. 공통사항" },
        { id: "common2", label: "2. 환율 및 결제" },
        { id: "items", label: "3. 물품 정보" },
        { id: "attachments", label: "4. 첨부파일" },
      ];
    }
    // common이 없으면 AI 리포트만 추가 (데이터가 일부만 있는 경우)
    if (approval?.aiAnalysis) {
      return [...base, { id: "ai", label: "AI 리포트" }];
    }
    return base;
  }, [approval, isImport, isExport]);

  const handleApproveSubmit = async () => {
    try {
      await approveDeclaration.mutateAsync({
        declarationId: approval.importNumber || approval.exportNumber || approval.declNo,
        declType: isImport ? "IMPORT" : "EXPORT",
        comment: approveComment,
        officerId: approval.officerId || "",
      });
      setApproveModalOpen(false);
      onApproved?.();
    } catch (err) {
      showError("승인 실패", err.message);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      showWarning("입력 확인", "반려 사유를 선택해주세요.");
      return;
    }
    if (!rejectComment.trim()) {
      showWarning("입력 확인", "반려 코멘트를 입력해주세요.");
      return;
    }
    try {
      const finalReason = rejectReason === "OTHER" ? rejectReasonOther || "OTHER" : rejectReason;
      await rejectDeclaration.mutateAsync({
        declarationId: approval.importNumber || approval.exportNumber || approval.declNo,
        declType: isImport ? "IMPORT" : "EXPORT",
        comment: rejectComment,
        reason: finalReason,
        officerId: approval.officerId || "",
      });
      setRejectModalOpen(false);
      onRejected?.();
    } catch (err) {
      showError("반려 실패", err.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader text="결재 정보 로딩 중..." />
      </div>
    );

  if (error || !approval) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div>
          <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">{error?.message || "결재 정보를 불러올 수 없습니다."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertModal {...alertModal} />

      {/* ── 신고번호 + 상태 배너 ── */}
      <div
        className={cn(
          "p-4 flex justify-between items-center border border-gray-200 rounded-lg mb-4 border-l-4",
          isImport ? "border-l-[#0f4c81]" : "border-l-green-600",
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={isImport ? "primary" : "success"}>{approval.declTypeLabel || (isImport ? "수입" : "수출")}</Badge>
            <Badge variant={approval.approvalTypeBadge || "outline"}>{approval.approvalTypeLabel || "일반 결재"}</Badge>
          </div>
          <div className="text-lg font-bold font-mono mt-1 text-gray-900">{approval.declNo}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            요청자: {approval.requestedByName} · {approval.requestedAt}
          </div>
        </div>
        <div className="text-right">
          <Badge variant={statusVariant} className="px-3 py-1">
            {statusLabel}
          </Badge>
          <div className="text-xs text-gray-500 mt-1">{approval.amountFormatted}</div>
          {approval.riskScore !== "-" && (
            <div
              className={`text-sm font-bold mt-1 ${
                approval.riskScore >= 80 ? "text-red-600" : approval.riskScore >= 60 ? "text-amber-600" : "text-green-600"
              }`}
            >
              위험도 {approval.riskScore}점
            </div>
          )}
        </div>
      </div>

      {/* ── 결재 액션 버튼 ── */}
      {!isAlreadyDecided && (
        <div className="flex gap-2 mb-4">
          <Button
            variant="danger"
            className="flex-1"
            onClick={() => {
              setRejectReason("");
              setRejectComment("");
              setRejectModalOpen(true);
            }}
            disabled={rejectDeclaration.isPending || approveDeclaration.isPending}
          >
            <XCircle className="w-4 h-4 mr-2" /> 반려
          </Button>
          <Button
            variant="approval"
            className="flex-1"
            onClick={() => {
              setApproveComment("");
              setApproveModalOpen(true);
            }}
            disabled={approveDeclaration.isPending || rejectDeclaration.isPending}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> 결재 승인
          </Button>
        </div>
      )}

      {/* 처리 완료 안내 */}
      {isAlreadyDecided && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm font-semibold",
            approval.status === "ACCEPTED" || approval.status === "APPROVED"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200",
          )}
        >
          {approval.status === "ACCEPTED" || approval.status === "APPROVED" ? (
            <>
              <CheckCircle className="w-4 h-4" /> 결재 승인 완료된 건입니다.
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" /> 결재 반려 처리된 건입니다.
            </>
          )}
        </div>
      )}

      {/* ── 탭 ── */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors",
                activeTab === tab.id ? "text-[#0f4c81] border-[#0f4c81]" : "text-gray-500 border-transparent hover:text-gray-800",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 탭 콘텐츠 ── */}
      <div className="space-y-4">
        {/* 결재 요약 */}
        {activeTab === "summary" && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["결재 유형", <Badge variant={approval.approvalTypeBadge || "outline"}>{approval.approvalTypeLabel || "일반 결재"}</Badge>],
                ["결재 상태", <Badge variant={statusVariant}>{statusLabel}</Badge>],
                ["요청 세관원", approval.requestedByName],
                ["요청 일시", approval.requestedAt],
                ["과세가격", <span className="font-mono">{approval.amountFormatted}</span>],
                ["채널", <span className="font-mono text-xs">{approval.channelLabel}</span>],
              ].map(([label, value], i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            {approval.requestComment && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="text-xs text-blue-600 font-semibold mb-1">요청 코멘트</div>
                <div className="text-sm text-blue-900">{approval.requestComment}</div>
              </div>
            )}
            {approval.status === "REJECTED" && approval.rejectComment && (
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-xs text-red-600 font-semibold mb-1">반려 사유</div>
                <div className="text-sm text-red-900">{approval.rejectComment}</div>
              </div>
            )}
            {(approval.status === "ACCEPTED" || approval.status === "APPROVED") && approval.approvalComment && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-xs text-green-600 font-semibold mb-1">승인 코멘트</div>
                <div className="text-sm text-green-900">{approval.approvalComment}</div>
              </div>
            )}

            {/* 타임라인 */}
            {approval.timeline?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2">결재 진행 이력</div>
                <div className="relative pl-5 space-y-3">
                  {approval.timeline.map((t, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-[#0f4c81] border-2 border-white shadow" />
                      {i < approval.timeline.length - 1 && <div className="absolute -left-[14px] top-4 bottom-0 w-px bg-gray-200" />}
                      <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-semibold text-gray-800">{t.status}</span>
                          <span className="text-xs text-gray-400">{t.timestamp}</span>
                        </div>
                        <div className="text-xs text-gray-500">처리자: {t.actor}</div>
                        {t.comment && <div className="text-xs text-gray-400 mt-0.5">{t.comment}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI 리포트 탭 ── */}
        {activeTab === "ai" && <AiReportSection aiAnalysis={approval.aiAnalysis} />}

        {/* ── 수입 신고서 섹션 ── */}
        {/* ⭐ 핵심 수정: approval.importMaster → approval.common (mapper 변환 결과) */}
        {isImport && approval.common && (
          <>
            {activeTab === "common" && (
              <ImportCommonInfoSection common={approval.common} needsReview={false} checklist={{}} onCheckChange={() => {}} />
            )}
            {activeTab === "pricing" && (
              <ImportPricingInfoSection
                price={approval.price}
                paymentDetail={approval.paymentDetail}
                tax={approval.tax}
                needsReview={false}
                checklist={{}}
                onCheckChange={() => {}}
              />
            )}
            {activeTab === "items" && <ImportItemsInfoSection items={approval.items} needsReview={false} checklist={{}} onCheckChange={() => {}} />}
            {activeTab === "attachments" && (
              <ImportAttachmentsSection
                essentialFiles={approval.essentialFiles}
                fileList={approval.fileList}
                needsReview={false}
                checklist={{}}
                onCheckChange={() => {}}
              />
            )}
          </>
        )}

        {/* ── 수출 신고서 섹션 ── */}
        {/* ⭐ 핵심 수정: approval.exportMaster → approval.common (mapper 변환 결과) */}
        {isExport && approval.common && (
          <>
            {activeTab === "common1" && <ExportCommonSection1 common={approval.common} needsReview={false} checklist={{}} onCheckChange={() => {}} />}
            {activeTab === "common2" && (
              <ExportCommonSection2 payment={approval.payment} common={approval.common} needsReview={false} checklist={{}} onCheckChange={() => {}} />
            )}
            {activeTab === "items" && <ExportItemSection items={approval.items} needsReview={false} checklist={{}} onCheckChange={() => {}} />}
            {activeTab === "attachments" && (
              <ExportAttachmentSection
                essentialFiles={approval.essentialFiles}
                fileList={approval.fileList}
                needsReview={false}
                checklist={{}}
                onCheckChange={() => {}}
              />
            )}
          </>
        )}
      </div>

      {/* ── 승인 Modal ── */}
      <Modal isOpen={approveModalOpen} onClose={() => setApproveModalOpen(false)} title="결재 승인" size="sm">
        <div className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>{approval.declNo}</strong> 신고서를 승인합니다.
              <br />
              승인 시 세관원의 수리가 최종 확정됩니다.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              승인 코멘트 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <textarea
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
              placeholder="승인 사유나 메모를 입력하세요."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
              취소
            </Button>
            <Button variant="approval" disabled={approveDeclaration.isPending} onClick={handleApproveSubmit}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {approveDeclaration.isPending ? "처리 중..." : "승인 확정"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── 반려 Modal ── */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="결재 반려" size="sm">
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              반려 시 세관원에게 재검토 요청이 전달됩니다.
              <br />
              반려 사유를 명확히 입력해주세요.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              반려 사유 <span className="text-red-500">*</span>
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">사유를 선택하세요</option>
              {SUPERVISOR_REJECT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          {rejectReason === "OTHER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기타 사유 직접 입력</label>
              <input
                type="text"
                value={rejectReasonOther}
                onChange={(e) => setRejectReasonOther(e.target.value)}
                placeholder="반려 사유를 직접 입력하세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              반려 코멘트 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="세관원에게 전달할 재검토 지시를 입력하세요."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              취소
            </Button>
            <Button variant="danger" disabled={!rejectReason || !rejectComment.trim() || rejectDeclaration.isPending} onClick={handleRejectSubmit}>
              <XCircle className="w-4 h-4 mr-2" />
              {rejectDeclaration.isPending ? "처리 중..." : "반려 확정"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ──────────────────────────────────────────────
// 메인 - 목록 페이지
// ──────────────────────────────────────────────
function ApprovalListPage({
  declType = "ALL",
  defaultStatus = "ALL",
  defaultApprovalType = "ALL",
  urgentOnly = false,
  pageTitle: pageTitleProp = null,
}) {
  const [filters, setFilters] = useState({
    status: defaultStatus,
    approvalType: defaultApprovalType,
    declType,
    urgentOnly,
    startDate: "",
    endDate: "",
  });

  const appliedFilters = useMemo(() => ({ ...filters, declType, urgentOnly }), [filters, declType, urgentOnly]);

  const { data, isLoading, error, refetch } = useApprovalList(appliedFilters);
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState(null);

  const pageTitle = useMemo(() => {
    if (pageTitleProp) return pageTitleProp;
    if (declType === "IMPORT") return "수입 결재 목록";
    if (declType === "EXPORT") return "수출 결재 목록";
    return "전체 결재 현황";
  }, [pageTitleProp, declType]);

  const pendingCount = useMemo(() => items.filter((i) => i.status === "ESCALATED").length, [items]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleReset = () =>
    setFilters({ status: defaultStatus, approvalType: defaultApprovalType, declType, urgentOnly, startDate: "", endDate: "" });

  const handleRowClick = (approvalId) => {
    setSelectedApprovalId(approvalId);
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedApprovalId(null);
  };
  const handleDecisionComplete = () => {
    refetch();
    handleDrawerClose();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">세관원이 요청한 결재 건을 검토하고 승인 또는 반려합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          {urgentOnly && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">긴급 결재 모드</span>
            </div>
          )}
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">대기 {pendingCount}건</span>
            </div>
          )}
        </div>
      </div>

      {/* 필터 패널 */}
      <Card padding="md">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">결재 상태</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {APPROVAL_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">결재 유형</label>
            <select
              value={filters.approvalType}
              onChange={(e) => handleFilterChange("approvalType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">전체</option>
              {Object.entries(APPROVAL_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">시작일</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">종료일</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleReset}>
            초기화
          </Button>
          <Button onClick={() => refetch()}>검색</Button>
        </div>
      </Card>

      {/* 건수 요약 */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FileText className="h-4 w-4" />총 <span className="font-semibold text-gray-900">{totalCount}</span>건
        {pendingCount > 0 && (
          <>
            <span className="mx-1">·</span>
            <span className="text-amber-600 font-semibold">대기 {pendingCount}건</span>
          </>
        )}
      </div>

      {/* 목록 테이블 */}
      <Card padding="none">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">결재 요청이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">신고번호</TableHead>
                  {declType === "ALL" && <TableHead className="bg-[#f9fbff] whitespace-nowrap">구분</TableHead>}
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">결재 유형</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">요청 세관원</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">요청 일시</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">과세가격</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">위험도</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">채널</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">상태</TableHead>
                  <TableHead className="bg-[#f9fbff] whitespace-nowrap">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.approvalId}
                    className={cn(
                      "hover:bg-blue-50/30 cursor-pointer transition-colors",
                      selectedApprovalId === item.approvalId && "bg-blue-50 border-l-2 border-l-[#0f4c81]",
                    )}
                    onClick={() => handleRowClick(item.approvalId)}
                  >
                    <TableCell className="font-mono text-sm whitespace-nowrap">{item.declNo}</TableCell>
                    {declType === "ALL" && (
                      <TableCell>
                        <Badge variant={item.declType === "IMPORT" ? "primary" : "success"}>{item.declTypeLabel}</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={item.approvalTypeBadge || "outline"}>{item.approvalTypeLabel || "일반 결재"}</Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{item.requestedByName}</TableCell>
                    <TableCell className="text-sm text-gray-500 whitespace-nowrap">{item.requestedAt}</TableCell>
                    <TableCell className="text-sm font-mono whitespace-nowrap">{item.amountFormatted}</TableCell>
                    <TableCell>
                      {item.riskScore !== "-" ? (
                        <span
                          className={`text-sm font-bold ${
                            item.riskScore >= 80 ? "text-red-600" : item.riskScore >= 60 ? "text-amber-600" : "text-green-600"
                          }`}
                        >
                          {item.riskScore}점
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-gray-600">{item.channelLabel}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={APPROVAL_DECISION_BADGE_VARIANTS?.[item.status] || item.statusBadge || "outline"}>
                        {APPROVAL_DECISION_LABELS?.[item.status] || item.statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => handleRowClick(item.approvalId)}>
                        검토
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Drawer */}
      <Drawer isOpen={drawerOpen} onClose={handleDrawerClose} size="xl" title="결재 상세 검토">
        {selectedApprovalId && (
          <ApprovalDrawerContent approvalId={selectedApprovalId} onApproved={handleDecisionComplete} onRejected={handleDecisionComplete} />
        )}
      </Drawer>
    </div>
  );
}

export default ApprovalListPage;
