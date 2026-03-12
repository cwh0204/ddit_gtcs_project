// src/pages/customs/export/ExportDetailPage.jsx

import { AlertTriangle, ArrowLeft, BrainCircuit, CheckCircle, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import { useAuth } from "../../../hooks/useAuth";
import TabSection from "../import/components/TabSection";
import ItemSection from "./components/ItemSection";
import AttachmentsSection from "./components/AttachmentSection";
import ExportActionForm from "./components/ExportActionForm";
import { useExportMutations } from "../../../controller/custom/export/useExportMutations";
import { useExportDetailController } from "../../../controller/custom/export/useExportDetailController";
import { cn } from "../../../style/utils";
import AlertModal from "../../../style/components/AlertModal";
import { useAlertModal } from "../../../hooks/useAlertModal";
import Button from "../../../style/components/Button";
import CommonSection1 from "./components/CommonSection1";
import CommonSection2 from "./components/CommonSection2";

const HIDE_REVIEW_STATUSES = [
  "ACCEPTED", // 수리 완료
  "PHYSICAL", // 검사 요청됨
  "INSPECTION", // 검사 진행 중
  "RELEASE_APPROVED", // 반출 승인
  "PAY_WAITING", // 납부 대기
  "PAY_COMPLETED", // 납부 완료
  "APPROVED", // 통관 승인
  "CLEARED", // 통관 완료
  "DELIVERED", // 출고 완료
  "REJECTED", // 반려
];

function ExportDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const { declaration, rawData, isLoading, error, refetch } = useExportDetailController(id);
  const mutations = useExportMutations();
  const { alertModal, showConfirm } = useAlertModal();

  const [activeTab, setActiveTab] = useState("common1");
  const [actionFormOpen, setActionFormOpen] = useState(false);
  const [actionType, setActionType] = useState("supplement");
  const [checklist, setChecklist] = useState({});

  const aiAnalysis = declaration?.aiAnalysis;

  const needsReview = aiAnalysis?.needsOfficerAction && !HIDE_REVIEW_STATUSES.includes(declaration?.statusCode);

  const tabs = [
    { id: "common1", label: "1. 공통사항" },
    { id: "common2", label: "2. 공통사항" },
    { id: "items", label: "3. 물품정보" },
    { id: "attachments", label: "4. 첨부파일" },
  ];

  const getBaseData = () => ({
    id: declaration.declarationId,
    exportNumber: declaration.declarationNumber,
    checkId: declaration.aiAnalysis?.checkId ?? "",
    officerId: user?.memberId,
    officerName: user?.memberName,
  });

  const handleCheckChange = (field) => {
    setChecklist((prev) => {
      const newChecklist = { ...prev, [field]: !prev[field] };
      const checkedCount = Object.values(newChecklist).filter(Boolean).length;
      if (checkedCount === 1 && !actionFormOpen) {
        setActionType("supplement");
        setActionFormOpen(true);
      }
      return newChecklist;
    });
  };

  const handleActionTypeChange = (newType) => {
    setActionType(newType);
  };

  const handleBack = () => {
    navigate("/customs/export/review");
  };

  const handleActionSubmit = (actionType, data) => {
    const baseData = getBaseData();

    if (actionType === "supplement") {
      mutations.requestSupplement?.mutate(
        {
          ...baseData,
          docComment: data.reason,
        },
        {
          onSuccess: () => {
            setActionFormOpen(false);
            setChecklist({});
          },
        },
      );
    } else if (actionType === "correction") {
      mutations.requestCorrection?.mutate(
        {
          ...baseData,
          docComment: data.reason,
        },
        {
          onSuccess: () => {
            setActionFormOpen(false);
            setChecklist({});
          },
        },
      );
    } else if (actionType === "inspection") {
      const docComment = data.failReasonCode
        ? `[${data.inspectType}] ${data.inspectComment} | 불합격: [${data.failReasonCode}] ${data.failReasonDetail}`
        : `[${data.inspectType}] ${data.inspectComment}`;

      mutations.completeInspection.mutate(
        {
          ...baseData,
          docComment,
        },
        {
          onSuccess: () => {
            setActionFormOpen(false);
            setChecklist({});
          },
        },
      );
    } else if (actionType === "reject") {
      mutations.rejectDeclaration.mutate(
        {
          ...baseData,
          docComment: `[${data.reasonCode}] ${data.reasonDetail}`,
        },
        {
          onSuccess: () => {
            setActionFormOpen(false);
            setChecklist({});
          },
        },
      );
    }
  };

  const handleApprove = () => {
    showConfirm("수리 처리", "수리 처리 하시겠습니까?", () => {
      const baseData = getBaseData();
      mutations.approveDeclaration.mutate({ ...baseData, docComment: "수리 처리" });
    });
  };

  const handleFinalApproval = () => {
    showConfirm("통관승인", "통관승인 하시겠습니까?\n\n승인 후 통관이 완료됩니다.", () => {
      const baseData = getBaseData();
      mutations.finalApproval.mutate({ ...baseData, docComment: "통관승인" });
    });
  };

  const handleStartInspection = () => {
    showConfirm("검사 요청", "검사를 요청하시겠습니까?\n\n창고관리자에게 전달됩니다.", () => {
      const baseData = getBaseData();
      mutations.startInspection.mutate({ ...baseData });
    });
  };

  // 로딩
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
          <p className="mt-2 text-xs text-gray-500">ID: {id}</p>
        </div>
      </div>
    );
  }

  // 에러
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
            <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
              <div>ID: {id}</div>
              <div>Status: {error.response?.status}</div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleBack}>
                목록으로 돌아가기
              </Button>
              <Button variant="outline" onClick={refetch}>
                다시 시도
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 데이터 없음
  if (!declaration) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-4">신고서를 찾을 수 없습니다.</p>
            <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
              <div>ID: {id}</div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleBack}>
                목록으로 돌아가기
              </Button>
              <Button variant="outline" onClick={refetch}>
                다시 시도
              </Button>
            </div>
          </div>
        </Card>
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
              <h1 className="text-2xl font-bold text-gray-900">수출 신고서 상세조회</h1>
            </div>
          </div>
        </div>

        {/* 신고번호 + 상태 */}
        <div
          className={cn(
            "p-6 flex justify-between items-center border border-gray-200",
            declaration.isUrgent === true ? "bg-white border-l-4 border-l-red-500" : "bg-white border-l-4 border-l-primary",
          )}
        >
          <div>
            <div className="text-sm text-gray-600">신고번호</div>
            <div className="text-2xl font-bold text-primary mt-1">{declaration.declarationNumber}</div>
          </div>
          <div className="text-right">
            <Badge variant={declaration.statusBadgeVariant} className="text-bg-base px-4 py-2">
              {declaration.statusLabel}
            </Badge>
            <div className="text-xs text-gray-600 mt-2">최종 처리일: {declaration.updatedAtFormatted}</div>
          </div>
        </div>

        {/* AI 분석 리포트 */}
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
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-gray-100 p-2 rounded-lg h-fit">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">AI 서류 작성 피드백</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                      {aiAnalysis.docComment ?? "분석된 서류 피드백이 없습니다."}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-lg h-fit ${aiAnalysis.riskLevel === "RED" ? "bg-red-100" : "bg-green-100"}`}>
                    {aiAnalysis.riskLevel === "RED" ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
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
          {activeTab === "common1" && (
            <CommonSection1 common={declaration.common} needsReview={needsReview} checklist={checklist} onCheckChange={handleCheckChange} />
          )}
          {activeTab === "common2" && (
            <CommonSection2
              payment={declaration.payment}
              common={declaration.common}
              needsReview={needsReview}
              checklist={checklist}
              onCheckChange={handleCheckChange}
            />
          )}
          {activeTab === "items" && (
            <ItemSection items={declaration.items} needsReview={needsReview} checklist={checklist} onCheckChange={handleCheckChange} />
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

        <ExportActionForm
          isOpen={actionFormOpen}
          onClose={() => setActionFormOpen(false)}
          onSubmit={handleActionSubmit}
          isSubmitting={
            actionType === "supplement"
              ? mutations.requestSupplement?.isPending
              : actionType === "correction"
                ? mutations.requestCorrection?.isPending
                : actionType === "inspection"
                  ? mutations.completeInspection.isPending
                  : mutations.rejectDeclaration.isPending
          }
          checkedItems={checklist}
          actionType={actionType}
          onActionTypeChange={handleActionTypeChange}
        />

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
            {declaration.statusCode === "RELEASE_APPROVED" ? (
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
                {!HIDE_REVIEW_STATUSES.includes(declaration.statusCode) && (
                  <>
                    {/* 검사 버튼 */}
                    {needsReview && (
                      <Button
                        variant="secondary"
                        onClick={handleStartInspection}
                        disabled={mutations.startInspection?.isPending}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {mutations.startInspection?.isPending ? "요청 중..." : "검사"}
                      </Button>
                    )}

                    {/* 수리 버튼 */}
                    <Button variant="approval" onClick={handleApprove} disabled={mutations.approveDeclaration.isPending}>
                      {mutations.approveDeclaration.isPending ? "처리 중..." : "수리 (승인)"}
                    </Button>
                  </>
                )}

                {(declaration.statusCode === "PHYSICAL" || declaration.statusCode === "INSPECTION") && (
                  <Button variant="outline" disabled className="border-blue-500 text-blue-600">
                    검사 진행 중
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AlertModal {...alertModal} />
    </>
  );
}

export default ExportDetailPage;
