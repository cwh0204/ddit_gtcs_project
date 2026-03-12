import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Loader2, ShieldCheck, X } from "lucide-react";
import Card from "../../style/components/Card";
import Badge from "../../style/components/Badge";
import Button from "../../style/components/Button";
import Label from "../../style/components/form/Label";
import { useExportDetailController } from "../../controller/custom/export/useExportDetailController";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../style/utils";
import AlertModal from "../../style/components/AlertModal";
import { useAlertModal } from "../../hooks/useAlertModal";

// src/pages/supervisor/approval/ApprovalExportDetailPage.jsx

/**
 * ApprovalExportDetailPage - 상급자 수출 결재 상세 페이지
 *
 * 수출 신고서 섹션 컴포넌트 재사용
 * 액션 버튼: [반려] [결재 승인] 2개만
 */
function ApprovalExportDetailPage() {
  const navigate = useNavigate();
  const { approvalId } = useParams();
  const { user } = useAuth();
  const { alertModal, showConfirm } = useAlertModal();

  // 수출 상세 컨트롤러 재사용
  const { declaration, isLoading, error } = useExportDetailController(approvalId);

  const [activeTab, setActiveTab] = useState("common");

  // 결재 의견 폼 상태
  const [approvalFormOpen, setApprovalFormOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null); // "approve" | "reject"
  const [approvalComment, setApprovalComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aiAnalysis = declaration?.aiAnalysis;

  const tabs = [
    { id: "common", label: "1. 공통사항" },
    { id: "items", label: "2. 물품 정보" },
    { id: "attachments", label: "3. 첨부파일" },
  ];

  const handleBack = () => navigate(-1);

  const handleOpenApprovalForm = (action) => {
    setApprovalAction(action);
    setApprovalComment("");
    setCommentError("");
    setApprovalFormOpen(true);
  };

  const handleCloseApprovalForm = () => {
    setApprovalFormOpen(false);
    setApprovalAction(null);
    setApprovalComment("");
    setCommentError("");
  };

  const handleApprovalSubmit = async () => {
    if (approvalAction === "reject" && approvalComment.trim().length < 10) {
      setCommentError("반려 사유를 10자 이상 입력하세요.");
      return;
    }

    const confirmTitle = approvalAction === "approve" ? "결재 승인" : "결재 반려";
    const confirmMsg =
      approvalAction === "approve"
        ? "결재 승인 하시겠습니까?\n\n승인 후 세관원에게 결과가 통보됩니다."
        : "결재 반려 하시겠습니까?\n\n반려 후 세관원에게 결과가 통보됩니다.";

    showConfirm(confirmTitle, confirmMsg, async () => {
      setIsSubmitting(true);
      try {
        console.log("수출 결재 처리:", { approvalAction, approvalComment, approvalId });
        handleCloseApprovalForm();
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // ==================== 로딩/에러 처리 ====================

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
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

  // ==================== 결재 폼 설정 ====================

  const formConfig =
    approvalAction === "approve"
      ? {
          title: "결재 승인",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          textColor: "text-green-900",
          borderTopColor: "border-green-200",
          buttonVariant: "approval",
          buttonText: "승인 확정",
          placeholder: "결재 의견을 입력하세요. (선택사항)",
          required: false,
        }
      : {
          title: "결재 반려",
          bgColor: "bg-red-50",
          borderColor: "border-red-300",
          textColor: "text-red-900",
          borderTopColor: "border-red-200",
          buttonVariant: "danger",
          buttonText: "반려 확정",
          placeholder: "반려 사유를 입력하세요. (필수, 10자 이상)",
          required: true,
        };

  // ==================== 렌더링 ====================

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#0a2742]" />
              <h1 className="text-2xl font-bold text-gray-900">결재 상세</h1>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">수출 신고서 결재 검토</p>
          </div>
        </div>
      </div>

      {/* 신고번호 및 상태 */}
      <div
        className={cn(
          "p-6 flex justify-between items-center border border-gray-200",
          declaration.isUrgent ? "bg-white border-l-4 border-l-red-500" : "bg-white border-l-4 border-l-[#0a2742]",
        )}
      >
        <div>
          <div className="text-sm text-gray-600">신고번호</div>
          <div className="text-2xl font-bold text-[#0a2742] mt-1">{declaration.declarationNumber || "-"}</div>
          {declaration.isUrgent && <span className="inline-block mt-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">긴급</span>}
        </div>
        <div className="text-right">
          <Badge variant={declaration.statusBadgeVariant} className="text-bg-base px-4 py-2">
            {declaration.statusLabel || "-"}
          </Badge>
          <div className="text-xs text-gray-600 mt-2">최종 처리일: {declaration.updatedAtFormatted || "-"}</div>
        </div>
      </div>

      {/* AI 분석 리포트 */}
      {aiAnalysis && (
        <Card className="overflow-hidden border-2 border-indigo-50 shadow-sm">
          <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0f4c81]">AI 신고서 분석 리포트</h2>
            <span className="text-xs text-gray-500">분석일시: {aiAnalysis.checkDate || "-"}</span>
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
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">AI 서류 작성 피드백</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                  {aiAnalysis.docComment || "분석된 서류 피드백이 없습니다."}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">위험 요소 정밀 분석</h3>
                <div
                  className={`p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    aiAnalysis.riskLevel === "RED" ? "bg-red-50 border-red-100 text-red-800" : "bg-green-50 border-green-100 text-green-800"
                  }`}
                >
                  {aiAnalysis.riskComment || "특이 위험 요소가 발견되지 않았습니다."}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 탭 섹션 - 수출 섹션 컴포넌트 재사용, needsReview=false로 체크박스 숨김 */}
      {/* TODO: ExportTabSection, ExportCommonSection 등 수출 전용 섹션 컴포넌트 import 후 교체 */}
      <Card>
        <div className="flex gap-2 border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id ? "border-[#0a2742] text-[#0a2742]" : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {/* TODO: 수출 섹션 컴포넌트 연결 */}
          {/* activeTab === "common" && <ExportCommonSection common={declaration.common} needsReview={false} /> */}
          {/* activeTab === "items" && <ExportItemSection items={declaration.items} needsReview={false} /> */}
          {/* activeTab === "attachments" && <ExportAttachmentsSection fileList={declaration.fileList} needsReview={false} /> */}
          <p className="text-sm text-gray-500">수출 신고서 섹션 컴포넌트 연결 필요 ({activeTab})</p>
        </div>
      </Card>

      {/* 결재 의견 입력 폼 */}
      {approvalFormOpen && formConfig && (
        <div className={`mt-6 p-6 ${formConfig.bgColor} border-2 ${formConfig.borderColor} rounded-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${formConfig.textColor}`}>{formConfig.title}</h3>
            <button onClick={handleCloseApprovalForm} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <Label required={formConfig.required}>결재 의견{formConfig.required ? " (필수, 10자 이상)" : " (선택사항)"}</Label>
            <textarea
              className={cn(
                "w-full h-32 p-3 border rounded-md resize-none text-sm",
                commentError ? "border-red-500" : "border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-gray-400",
              )}
              value={approvalComment}
              onChange={(e) => {
                setApprovalComment(e.target.value);
                setCommentError("");
              }}
              placeholder={formConfig.placeholder}
            />
            <div className="flex items-center justify-between mt-1">
              {commentError ? (
                <p className="text-xs text-red-600">{commentError}</p>
              ) : (
                <p className="text-xs text-gray-500">결재 의견은 처리 이력에 기록됩니다.</p>
              )}
              <p className="text-xs text-gray-500">{approvalComment.length}자</p>
            </div>
          </div>

          <div className={`flex justify-end gap-2 pt-4 border-t ${formConfig.borderTopColor}`}>
            <Button variant="outline" onClick={handleCloseApprovalForm} disabled={isSubmitting}>
              취소
            </Button>
            <Button variant={formConfig.buttonVariant} onClick={handleApprovalSubmit} disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : formConfig.buttonText}
            </Button>
          </div>
        </div>
      )}

      {/* 하단 액션 버튼 */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={handleBack}>
          목록으로 돌아가기
        </Button>
        {!approvalFormOpen && (
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => handleOpenApprovalForm("reject")}>
              반려
            </Button>
            <Button variant="approval" onClick={() => handleOpenApprovalForm("approve")}>
              결재 승인
            </Button>
          </div>
        )}
      </div>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default ApprovalExportDetailPage;
