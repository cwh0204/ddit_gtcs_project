import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import { useAuth } from "../../../hooks/useAuth";
import TabSection from "../import/components/TabSection";
import CommonInfoSection from "../import/components/CommonInfoSection";
import PricingInfoSection from "../import/components/PricingInfoSection";
import ItemsInfoSection from "../import/components/ItemInfoSection";
import AttachmentsSection from "../import/components/AttachmentSection";
import { useImportMutations } from "../../../controller/custom/import/useImportMutations";
import { useImportDetailController } from "../../../controller/custom/import/useImportDetailController";
import { cn } from "../../../style/utils";
import Button from "../../../style/components/Button";

// src/pages/customs/tax/TaxDetailPage.jsx

function TaxDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { declaration, isLoading, error } = useImportDetailController();
  const mutations = useImportMutations();

  const [activeTab, setActiveTab] = useState("common");

  const tabs = [
    { id: "common", label: "1. 공통사항" },
    { id: "pricing", label: "2. 가격정보" },
    { id: "items", label: "3. 물품정보" },
    { id: "attachments", label: "4. 첨부파일" },
  ];

  const handleBack = () => {
    navigate("/customs/tax");
  };

  // 세액/납부 전용 함수
  const handleConfirmPayment = () => {
    if (window.confirm("납부를 확인하시겠습니까?")) {
      mutations.confirmPayment.mutate({
        id: declaration.declarationId,
        comment: "납부 확인 완료",
        officerId: user.memberId,
        officerName: user.memberName,
      });
    }
  };

  const handleRequestRefund = () => {
    if (window.confirm("환급 처리를 시작하시겠습니까?")) {
      mutations.processRefund.mutate({
        id: declaration.declarationId,
        comment: "환급 처리 시작",
        officerId: user.memberId,
        officerName: user.memberName,
      });
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">세액 및 납부 상세조회</h1>
              <p className="text-sm text-gray-600 mt-1">수입 신고번호: {declaration.declarationNumber}</p>
            </div>
          </div>
        </div>

        {/* 신고번호 및 상태 표시 */}
        <div
          className={cn(
            "p-6 flex justify-between items-center border border-gray-200",
            declaration.isUrgent ? "bg-white border-l-4 border-l-red-500" : "bg-white border-l-4 border-l-[#0f4c81]",
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

        {/* 세액 정보 카드 - 관세, 부가세, 총 세액만 */}
        {declaration.tax && (
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">세액 정보</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* 관세 */}
              <div>
                <div className="text-sm text-gray-600 mb-1">관세</div>
                <div className="text-xl font-bold text-gray-900">{declaration.tax.totalDutyFormatted || "-"}</div>
              </div>

              {/* 부가가치세 */}
              <div>
                <div className="text-sm text-gray-600 mb-1">부가가치세</div>
                <div className="text-xl font-bold text-gray-900">{declaration.tax.totalVatFormatted || "-"}</div>
              </div>

              {/* 총 납부세액 */}
              <div className="col-span-2 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-1">총 납부세액</div>
                <div className="text-3xl font-bold text-[#0f4c81]">{declaration.tax.totalTaxSumFormatted || "-"}</div>
              </div>
            </div>
          </Card>
        )}

        {/* 탭 섹션 */}
        <TabSection tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "common" && <CommonInfoSection common={declaration.common} />}

          {activeTab === "pricing" && (
            <PricingInfoSection price={declaration.price} paymentDetail={declaration.paymentDetail} tax={declaration.tax} />
          )}

          {activeTab === "items" && <ItemsInfoSection items={declaration.items} />}

          {activeTab === "attachments" && <AttachmentsSection essentialFiles={declaration.essentialFiles} fileList={declaration.fileList} />}
        </TabSection>

        {/* 세액/납부 버튼 (APPROVED 상태 제거) */}
        <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleBack}>
            목록
          </Button>

          {/* 
            ⭐ APPROVED 상태는 이 페이지에 도달하지 않음
            ImportDetailPage에서 수리 버튼 클릭 시 자동으로 NOTICE_ISSUED로 변경됨
          */}

          {/* 고지서 발송 완료 상태 */}
          {declaration.status === "NOTICE_ISSUED" && (
            <Button variant="primary" onClick={handleConfirmPayment}>
              납부 확인
            </Button>
          )}

          {/* 납부 대기 상태 */}
          {declaration.status === "PAYMENT_PENDING" && (
            <Button variant="approval" onClick={handleConfirmPayment}>
              납부 확인
            </Button>
          )}

          {/* 납부 완료 상태 */}
          {declaration.status === "PAYMENT_COMPLETED" && (
            <Button variant="outline" onClick={handleRequestRefund}>
              환급 처리
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default TaxDetailPage;
