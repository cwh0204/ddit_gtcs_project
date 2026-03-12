// src/pages/customs/import/ImportDetailPage.jsx

import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import Button from "../../../style/components/Button";
import { useAuth } from "../../../hooks/useAuth";
import TabSection from "./components/TabSection";
import CommonInfoSection from "./components/CommonInfoSection";
import PricingInfoSection from "./components/PricingInfoSection";
import ItemsInfoSection from "./components/ItemInfoSection";
import AttachmentsSection from "./components/AttachmentSection";
import ActionForm from "./components/ActionForm";
import EscalateForm from "./components/EscalateForm";
import { useImportMutations } from "../../../controller/custom/import/useImportMutations";
import { useImportDetailController } from "../../../controller/custom/import/useImportDetailController";
import { cn } from "../../../style/utils";
import toast from "react-hot-toast";
import AlertModal from "../../../style/components/AlertModal";
import { useAlertModal } from "../../../hooks/useAlertModal";

/**
 * 체크박스를 숨겨야 하는 상태
 * - 창고관리자 담당(PHYSICAL) 또는 이미 처리 완료된 상태에서는
 *   세관원의 항목 체크가 의미 없으므로 체크박스 비표시
 */
const HIDE_CHECKBOX_STATUSES = [
  "SUPPLEMENT",
  "PHYSICAL", // 현품검사중 - 창고관리자 담당
  "INSPECTION_COMPLETED", // 검사완료 - 이미 검사 끝남
  "RELEASE_APPROVED",
  "PAY_WAITING",
  "PAY_COMPLETED",
  "APPROVED",
  "REJECTED",
  "CLEARED",
  "ESCALATED",
  "DELIVERED",
];

/**
 * 액션 버튼(수리/결재요청 등)을 숨겨야 하는 상태
 * - PHYSICAL, INSPECTION_COMPLETED는 여기서 제외 → 수리/결재 버튼 표시됨
 *   (단, PHYSICAL 중에는 수리 버튼이 disabled 처리됨)
 */
const HIDE_ACTION_STATUSES = [
  "SUPPLEMENT",
  "RELEASE_APPROVED",
  "PAY_WAITING",
  "PAY_COMPLETED",
  "APPROVED",
  "REJECTED",
  "CLEARED",
  "ESCALATED",
  "DELIVERED",
];

function ImportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { declaration, isLoading, error } = useImportDetailController(id);
  const mutations = useImportMutations();
  const { alertModal, showConfirm } = useAlertModal();

  const [activeTab, setActiveTab] = useState("common");
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [actionType, setActionType] = useState("supplement");
  const [checklist, setChecklist] = useState({});
  const [escalateFormOpen, setEscalateFormOpen] = useState(false);

  const aiAnalysis = declaration?.aiAnalysis;

  // 체크박스 표시 여부: 세관원 액션이 필요한 점수 구간(85~94점)이고,
  // 체크박스를 숨겨야 하는 상태가 아닐 때만 표시
  const needsReview = aiAnalysis?.needsOfficerAction && !HIDE_CHECKBOX_STATUSES.includes(declaration?.statusCode ?? declaration?.status);

  const tabs = [
    { id: "common", label: "1. 공통사항" },
    { id: "pricing", label: "2. 결제 및 세액" },
    { id: "items", label: "3. 물품 정보" },
    { id: "attachments", label: "4. 첨부파일" },
  ];

  const handleBack = () => {
    navigate("/customs/import/list");
  };

  const handleCheckChange = (field) => {
    setChecklist((prev) => {
      const newChecklist = {
        ...prev,
        [field]: !prev[field],
      };

      if (!prev[field]) {
        const checkedCount = Object.values(newChecklist).filter(Boolean).length;

        if (checkedCount === 1 && !actionFormOpen) {
          setActionType("supplement");
          setActionFormOpen(true);
        }
      }

      return newChecklist;
    });
  };

  const handleActionTypeChange = (newType) => {
    setActionType(newType);
  };

  const handleFinalApproval = async () => {
    showConfirm("통관승인", "통관승인 하시겠습니까?\n\n승인 후 통관이 완료됩니다.", () => {
      mutations.finalApproval.mutate({
        id: declaration.declarationId,
        importNumber: declaration.declarationNumber,
        docComment: "통관승인",
        officerId: user.memberId,
        officerName: user.memberName,
        checkId: declaration.aiAnalysis?.checkId ?? "",
      });
    });
  };

  const handleApprove = async () => {
    showConfirm("수리 승인", "수리(승인) 처리 하시겠습니까?\n\n승인 후 세액 고지서가 발송됩니다.", () => {
      mutations.approveDeclaration.mutate({
        id: declaration.declarationId,
        importNumber: declaration.declarationNumber,
        docComment: "수리(승인)",
        officerId: user.memberId,
        officerName: user.memberName,
        checkId: declaration.aiAnalysis?.checkId ?? "",
      });
    });
  };

  const handleStartInspection = () => {
    showConfirm("검사 요청", "검사를 요청하시겠습니까?\n\n창고관리자에게 전달됩니다.", () => {
      mutations.startInspection.mutate({
        id: declaration.declarationId,
        importNumber: declaration.declarationNumber,
        checkId: declaration.aiAnalysis?.checkId ?? "",
        officerId: user.memberId,
        officerName: user.memberName,
      });
    });
  };

  const handleEscalate = () => {
    setEscalateFormOpen(true);
  };

  const handleEscalateSubmit = ({ reason }) => {
    mutations.escalateToSupervisor.mutate({
      id: declaration.declarationId,
      importNumber: declaration.declarationNumber,
      docComment: reason,
      checkId: declaration.aiAnalysis?.checkId ?? "",
      officerId: user.memberId,
    });
    setEscalateFormOpen(false);
  };

  const handleActionSubmit = (actionType, data) => {
    const baseData = {
      id: declaration.declarationId,
      importNumber: declaration.declarationNumber,
      officerId: user.memberId,
      officerName: user.memberName,
      checkId: declaration.aiAnalysis?.checkId ?? "",
    };

    if (actionType === "supplement") {
      mutations.requestSupplement.mutate({ ...baseData, docComment: data.reason }, { onSuccess: () => setActionFormOpen(false) });
    } else if (actionType === "correction") {
      mutations.requestCorrection.mutate({ ...baseData, docComment: data.reason }, { onSuccess: () => setActionFormOpen(false) });
    } else if (actionType === "inspection") {
      const docComment = data.failReasonCode
        ? `[${data.inspectType}] ${data.inspectComment} | 불합격: [${data.failReasonCode}] ${data.failReasonDetail}`
        : `[${data.inspectType}] ${data.inspectComment}`;

      mutations.completeInspection.mutate({ ...baseData, docComment, result: data.inspectResult }, { onSuccess: () => setActionFormOpen(false) });
    } else if (actionType === "reject") {
      mutations.rejectDeclaration.mutate(
        { ...baseData, docComment: `[${data.reasonCode}] ${data.reasonDetail}` },
        { onSuccess: () => setActionFormOpen(false) },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">데이터를 불러오지 못했습니다.</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button variant="outline" onClick={handleBack}>
              목록으로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!declaration) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">신고서를 찾을 수 없습니다.</p>
          <Button variant="outline" onClick={handleBack} className="mt-4">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">수입 신고서 상세조회</h1>
            </div>
          </div>
        </div>

        {/* 신고번호 및 상태 */}
        <div
          className={cn(
            "p-6 flex justify-between items-center border border-gray-200",
            declaration.isUrgent === true ? "bg-white border-l-4 border-l-red-500" : "bg-white border-l-4 border-l-[#0f4c81]",
          )}
        >
          <div>
            <div className="text-sm text-gray-600">신고번호</div>
            <div className="text-2xl font-bold text-[#0f4c81] mt-1">{declaration.declarationNumber ?? "-"}</div>
          </div>
          <div className="text-right">
            <Badge variant={declaration.statusBadgeVariant} className="text-bg-base px-4 py-2">
              {declaration.statusLabel ?? "-"}
            </Badge>
            <div className="text-xs text-gray-600 mt-2">최종 처리일: {declaration.updatedAtFormatted ?? "-"}</div>
          </div>
        </div>

        {/* AI 분석 리포트 카드 */}
        {aiAnalysis && (
          <Card className="overflow-hidden border-2 border-indigo-50 shadow-sm">
            <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0f4c81]">AI 신고서 분석 리포트</h2>
              </div>
              <span className="text-xs text-gray-500">분석일시: {aiAnalysis.checkDate ?? "-"}</span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-1 space-y-8 border-r border-gray-100 pr-0 lg:pr-8">
                <div className="text-center bg-gray-50 rounded-xl p-6">
                  <p className="text-sm font-medium text-gray-500 mb-3">종합 위험도 판정</p>
                  <div className="flex justify-center mb-2">
                    <Badge variant={aiAnalysis.riskLevelColor} className="text-lg px-8 py-2 rounded-full shadow-sm">
                      {aiAnalysis.riskLevelLabel} ({aiAnalysis.riskLevel})
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    {aiAnalysis.riskLevel === "RED" ? "※ 필수 검사 대상 (High Risk)" : "※ 자동 수리 대상 (Low Risk)"}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-gray-700">서류 적합성</span>
                      <span className="text-lg font-bold text-[#0f4c81]">{aiAnalysis.docScore}점</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-[#0f4c81] h-3 rounded-full transition-all duration-1000" style={{ width: `${aiAnalysis.docScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold text-gray-700">위험도 스코어</span>
                      <span className={`text-lg font-bold ${aiAnalysis.riskScore >= 60 ? "text-red-600" : "text-green-600"}`}>
                        {aiAnalysis.riskScore}점
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${aiAnalysis.riskScore >= 60 ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${aiAnalysis.riskScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">점수가 높을수록 고위험</p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">AI 서류 작성 피드백</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                      {aiAnalysis.docComment ?? "분석된 서류 피드백이 없습니다."}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">위험 요소 정밀 분석</h3>
                    <div
                      className={`p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        aiAnalysis.riskLevel === "RED" ? "bg-red-50 border-red-100 text-red-800" : "bg-green-50 border-green-100 text-green-800"
                      }`}
                    >
                      {aiAnalysis.riskComment ?? "특이 위험 요소가 발견되지 않았습니다."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "common" && (
            <CommonInfoSection common={declaration.common} needsReview={needsReview} checklist={checklist} onCheckChange={handleCheckChange} />
          )}

          {activeTab === "pricing" && (
            <PricingInfoSection
              price={declaration.price}
              paymentDetail={declaration.paymentDetail}
              tax={declaration.tax}
              needsReview={needsReview}
              checklist={checklist}
              onCheckChange={handleCheckChange}
            />
          )}

          {activeTab === "items" && (
            <ItemsInfoSection items={declaration.items} needsReview={needsReview} checklist={checklist} onCheckChange={handleCheckChange} />
          )}

          {activeTab === "attachments" && (
            <AttachmentsSection
              essentialFiles={declaration.essentialFiles}
              fileList={declaration.fileList}
              needsReview={needsReview}
              checklist={checklist}
              onCheckChange={handleCheckChange}
            />
          )}
        </TabSection>

        {/* 통합 액션 폼 */}
        <ActionForm
          isOpen={actionFormOpen}
          onClose={() => setActionFormOpen(false)}
          onSubmit={handleActionSubmit}
          isSubmitting={
            actionType === "supplement"
              ? mutations.requestSupplement.isPending
              : actionType === "correction"
                ? mutations.requestCorrection.isPending
                : actionType === "inspection"
                  ? mutations.completeInspection.isPending
                  : mutations.rejectDeclaration.isPending
          }
          checkedItems={checklist}
          actionType={actionType}
          onActionTypeChange={handleActionTypeChange}
        />

        {/* 액션 버튼 */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleBack}>
            목록으로 돌아가기
          </Button>

          <div className="text-sm text-gray-600">
            {needsReview && Object.values(checklist).filter(Boolean).length > 0 && (
              <span className="mr-4 text-blue-600 font-medium">✓ {Object.values(checklist).filter(Boolean).length}개 항목 선택됨</span>
            )}
          </div>

          <div className="flex gap-2">
            {/* RELEASE_APPROVED 상태: 통관승인 버튼만 표시 */}
            {declaration.status === "RELEASE_APPROVED" ? (
              <Button
                variant="approval"
                onClick={handleFinalApproval}
                disabled={mutations.finalApproval?.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {mutations.finalApproval?.isPending ? "처리 중..." : "통관승인"}
              </Button>
            ) : (
              <>
                {/* HIDE_ACTION_STATUSES에 없는 상태에서만 액션 버튼 표시
                    - PHYSICAL: 수리 버튼은 보이지만 disabled
                    - INSPECTION_COMPLETED: 수리 버튼 활성화 */}
                {!HIDE_ACTION_STATUSES.includes(declaration.statusCode ?? declaration.status) && (
                  <>
                    {/* 검사 버튼: 85~94점이고 아직 검사 요청 전 상태일 때만 표시 */}
                    {aiAnalysis &&
                      aiAnalysis.docScore >= 85 &&
                      aiAnalysis.docScore <= 94 &&
                      declaration.status !== "PHYSICAL" &&
                      declaration.status !== "INSPECTION" &&
                      declaration.status !== "INSPECTION_COMPLETED" && (
                        <Button
                          variant="secondary"
                          onClick={handleStartInspection}
                          disabled={mutations.startInspection.isPending}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {mutations.startInspection.isPending ? "요청 중..." : "검사"}
                        </Button>
                      )}

                    {/* 수리 버튼: PHYSICAL/INSPECTION 중에는 비활성화, INSPECTION_COMPLETED 이후 활성화 */}
                    <Button
                      variant="approval"
                      onClick={handleApprove}
                      disabled={mutations.approveDeclaration.isPending || declaration.status === "PHYSICAL" || declaration.status === "INSPECTION"}
                    >
                      {mutations.approveDeclaration.isPending ? "처리 중..." : "수리 (승인)"}
                    </Button>

                    {/* 결재 요청 버튼 */}
                    <Button
                      variant="outline"
                      onClick={handleEscalate}
                      disabled={mutations.escalateToSupervisor.isPending}
                      className="border-amber-500 text-amber-700 hover:bg-amber-50"
                    >
                      {mutations.escalateToSupervisor.isPending ? "요청 중..." : "결재 요청"}
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <EscalateForm
        isOpen={escalateFormOpen}
        onClose={() => setEscalateFormOpen(false)}
        onSubmit={handleEscalateSubmit}
        isSubmitting={mutations.escalateToSupervisor.isPending}
      />
      <AlertModal {...alertModal} />
    </>
  );
}

export default ImportDetailPage;
