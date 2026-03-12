import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import { useAuth } from "../../../hooks/useAuth";
import TabSection from "../import/components/TabSection";
import CommonInfoSection from "../import/components/CommonInfoSection";
import PricingInfoSection from "../import/components/PricingInfoSection";
import PaymentInfoSection from "../import/components/PaymentInfoSection";
import ItemsInfoSection from "../import/components/ItemInfoSection";
import AttachmentsSection from "../import/components/AttachmentSection";
import RejectForm from "../import/components/RejectForm";
import HoldForm from "../import/components/HoldForm";
import InspectionForm from "../import/components/InspectionForm";
import { useImportMutations } from "../../../controller/custom/import/useImportMutations";
import { useImportDetailController } from "../../../controller/custom/import/useImportDetailController";
import { cn } from "../../../style/utils";
import Button from "../../../style/components/Button";

// src/pages/customs/supplement/SupplementDetailPage.jsx

function SupplementDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { declaration, isLoading, error } = useImportDetailController();
  const mutations = useImportMutations();

  const [activeTab, setActiveTab] = useState("common");

  const [rejectFormOpen, setRejectFormOpen] = useState(false);
  const [holdFormOpen, setHoldFormOpen] = useState(false);
  const [inspectionFormOpen, setInspectionFormOpen] = useState(false);

  // 탭 목록 정의 (5개)
  const tabs = [
    { id: "common", label: "1. 공통사항" },
    { id: "pricing", label: "2. 가격정보" },
    { id: "payment", label: "3. 결제/세액" },
    { id: "items", label: "4. 란사항" },
    { id: "attachments", label: "5. 첨부파일" },
  ];

  const handleBack = () => {
    navigate("/customs/supplement/review"); //보완/정정 목록으로 돌아가기
  };

  //보완/정정 전용 액션들
  const handleRequestSupplement = () => {
    if (window.confirm("보완을 요구하시겠습니까?")) {
      mutations.requestSupplement.mutate({
        id: declaration.declarationId,
        reason: "추가 서류 제출 필요",
        officerId: user.memberId,
        officerName: user.memberName,
      });
    }
  };

  const handleRequestCorrection = () => {
    if (window.confirm("정정을 요구하시겠습니까?")) {
      mutations.requestCorrection.mutate({
        id: declaration.declarationId,
        reason: "신고 내용 오류 수정 필요",
        officerId: user.memberId,
        officerName: user.memberName,
      });
    }
  };

  const handleStartSupplementReview = () => {
    if (window.confirm("보완 심사를 시작하시겠습니까?")) {
      mutations.startSupplementReview.mutate({
        id: declaration.declarationId,
        officerId: user.memberId,
        officerName: user.memberName,
      });
    }
  };

  const handleStartCorrectionReview = () => {
    if (window.confirm("정정 심사를 시작하시겠습니까?")) {
      mutations.startCorrectionReview.mutate({
        id: declaration.declarationId,
        officerId: user.memberId,
        officerName: user.memberName,
      });
    }
  };

  const handleApprove = () => {
    if (window.confirm("승인 처리하시겠습니까?")) {
      mutations.approve.mutate({
        id: declaration.declarationId,
        comment: "보완/정정 승인",
        officerId: user.memberId,
        officerName: user.memberName,
      });
    }
  };

  const handleRejectClick = () => {
    setHoldFormOpen(false);
    setInspectionFormOpen(false);
    setRejectFormOpen(true);
  };

  const handleRejectSubmit = (data) => {
    mutations.rejectDeclaration.mutate(
      {
        id: declaration.declarationId,
        reason: `[${data.reasonCode}] ${data.reasonDetail}`,
        officerId: user.memberId,
        officerName: user.memberName,
      },
      {
        onSuccess: () => {
          setRejectFormOpen(false);
        },
      },
    );
  };

  const handleHoldClick = () => {
    setRejectFormOpen(false);
    setInspectionFormOpen(false);
    setHoldFormOpen(true);
  };

  const handleHoldSubmit = (data) => {
    mutations.holdForInvestigation.mutate(
      {
        id: declaration.declarationId,
        reason: `[${data.reasonCode}] ${data.reasonDetail}`,
        officerId: user.memberId,
        officerName: user.memberName,
      },
      {
        onSuccess: () => {
          setHoldFormOpen(false);
        },
      },
    );
  };

  const handleInspectionClick = () => {
    setRejectFormOpen(false);
    setHoldFormOpen(false);
    setInspectionFormOpen(true);
  };

  const handleInspectionSubmit = (data) => {
    mutations.startInspection.mutate(
      {
        id: declaration.declarationId,
        inspectionType: data.inspectType,
        result: data.inspectResult,
        notes: data.failReasonCode
          ? `[${data.inspectType}] ${data.inspectComment} | 불합격: [${data.failReasonCode}] ${data.failReasonDetail}`
          : `[${data.inspectType}] ${data.inspectComment}`,
        officerId: user.memberId,
        officerName: user.memberName,
      },
      {
        onSuccess: () => {
          setInspectionFormOpen(false);
        },
      },
    );
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">보완/정정 상세조회</h1>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "p-6 flex justify-between items-center border border-gray-200",
            declaration.audit?.isUrgent ? "bg-white border-l-4 border-l-red-500" : "bg-white border-l-4 border-l-[#0f4c81]",
          )}
        >
          <div>
            <div className="text-sm text-gray-600">신고번호</div>
            <div className="text-2xl font-bold text-[#0f4c81] mt-1">{declaration.declarationNumber}</div>
          </div>
          <div className="text-right">
            <Badge variant={declaration.statusBadgeVariant} className="text-bg-base px-4 py-2">
              {declaration.statusLabel}
            </Badge>
            <div className="text-xs text-gray-600 mt-2">최종 처리일: {declaration.updatedAtFormatted}</div>
          </div>
        </div>

        {/* 탭 방식으로 변경 */}
        <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "common" && <CommonInfoSection common={declaration.common} />}
          {activeTab === "pricing" && <PricingInfoSection price={declaration.price} />}
          {activeTab === "payment" && <PaymentInfoSection paymentDetail={declaration.paymentDetail} containerList={declaration.containerList} />}
          {activeTab === "items" && <ItemsInfoSection lanList={declaration.lanList} />}
          {activeTab === "attachments" && <AttachmentsSection fileList={declaration.fileList} />}
        </TabSection>

        {/* 반려폼(토글) */}
        <RejectForm
          isOpen={rejectFormOpen}
          onClose={() => setRejectFormOpen(false)}
          onSubmit={handleRejectSubmit}
          isSubmitting={mutations.rejectDeclaration.isPending}
        />

        {/* 보류폼(토글) */}
        <HoldForm
          isOpen={holdFormOpen}
          onClose={() => setHoldFormOpen(false)}
          onSubmit={handleHoldSubmit}
          isSubmitting={mutations.holdForInvestigation.isPending}
        />

        {/* 검사폼(토글) */}
        <InspectionForm
          isOpen={inspectionFormOpen}
          onClose={() => setInspectionFormOpen(false)}
          onSubmit={handleInspectionSubmit}
          isSubmitting={mutations.startInspection.isPending}
        />

        {/* ✅ 보완/정정 전용 액션 버튼 */}
        <div className="flex justify-end gap-1 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleBack}>
            목록
          </Button>

          {/* 상태에 따라 버튼 표시 */}
          {declaration.status === "SUPPLEMENT_REQUESTED" && (
            <Button variant="outline" onClick={handleRequestSupplement}>
              보완 재요구
            </Button>
          )}

          {declaration.status === "CORRECTION_REQUESTED" && (
            <Button variant="outline" onClick={handleRequestCorrection}>
              정정 재요구
            </Button>
          )}

          {declaration.status === "SUPPLEMENT_SUBMITTED" && (
            <Button variant="primary" onClick={handleStartSupplementReview}>
              보완 심사 시작
            </Button>
          )}

          {declaration.status === "CORRECTION_SUBMITTED" && (
            <Button variant="primary" onClick={handleStartCorrectionReview}>
              정정 심사 시작
            </Button>
          )}

          {(declaration.status === "SUPPLEMENT_REVIEW" || declaration.status === "CORRECTION_REVIEW") && (
            <>
              <Button variant="outline" onClick={handleRequestSupplement}>
                재보완 요구
              </Button>
              <Button variant="inspection" onClick={handleInspectionClick}>
                현품검사
              </Button>
              <Button variant="waiting" onClick={handleHoldClick}>
                보류
              </Button>
              <Button variant="danger" onClick={handleRejectClick}>
                반려
              </Button>
              <Button variant="approval" onClick={handleApprove}>
                승인
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SupplementDetailPage;
