import { Loader2, AlertTriangle, AlertCircle } from "lucide-react";
import Card from "../../../style/components/Card";
import Badge from "../../../style/components/Badge";
import Button from "../../../style/components/Button";
import Modal from "../../../style/components/Modal";
import { STATUS_BADGE_VARIANTS } from "../../../domain/warehouse/warehouseConstants";
import { cn } from "../../../style/utils";
import ImportCommonInfoSection from "../../customs/import/components/CommonInfoSection";
import ImportPricingInfoSection from "../../customs/import/components/PricingInfoSection";
import ImportItemsInfoSection from "../../customs/import/components/ItemInfoSection";
import ImportAttachmentsSection from "../../customs/import/components/AttachmentSection";
import ExportCommonSection1 from "../../customs/export/components/CommonSection1";
import ExportCommonSection2 from "../../customs/export/components/CommonSection2";
import ExportItemSection from "../../customs/export/components/ItemSection";
import ExportAttachmentSection from "../../customs/export/components/AttachmentSection";
import InspectionActionForm from "./components/InspectionActionForm";
import ReleaseApprovalModal from "./components/ReleaseApprovalModal";
import CargoBasicInfoTab from "./components/CargoBasicInfoTab";
import { useCargoDetailState } from "../../../controller/warehouse/useCargoDetailState";
import AlertModal from "../../../style/components/AlertModal";

/**
 * src/pages/warehouse/cargo/CargoDetailPage.jsx
 */
function CargoDetailPage() {
  const {
    cargo,
    isImport,
    isExport,
    importDeclaration,
    exportDeclaration,
    isLoading,
    error,
    isProcessing,
    isAwaitingInspection,
    isAwaitingRelease,
    isAwaitingDelivery,
    activeTab,
    setActiveTab,
    actionFormOpen,
    setActionFormOpen,
    actionType,
    setActionType,
    checklist,
    releaseModalOpen,
    setReleaseModalOpen,
    photoModalOpen,
    setPhotoModalOpen,
    tabs,
    handleCheckChange,
    handleActionSubmit,
    handleReleaseApprovalSubmit,
    handleBack,
    isEditMode,
    editFormData,
    startEdit,
    cancelEdit,
    handleEditChange,
    handleEditSubmit,
    alertModal,
    showConfirm,
  } = useCargoDetailState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">화물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !cargo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">화물 정보를 불러올 수 없습니다</h2>
            <p className="text-gray-600 text-sm mb-6">{error?.message || "화물을 찾을 수 없습니다"}</p>
            <Button onClick={handleBack}>목록으로 돌아가기</Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusVariant = STATUS_BADGE_VARIANTS[cargo.status] || "outline";

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="뒤로가기">
            <span className="text-xl text-gray-600">←</span>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">화물 상세 정보</h1>
              {isImport && <Badge variant="primary">수입</Badge>}
              {isExport && <Badge variant="success">수출</Badge>}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              컨테이너 ID: <span className="font-mono font-semibold">{cargo.containerId}</span>
              {cargo.declNo && (
                <>
                  {" "}
                  · 신고번호: <span className="font-mono font-semibold">{cargo.declNo}</span>
                </>
              )}
              {cargo.inboundDateFormatted && cargo.inboundDateFormatted !== "-" && (
                <>
                  {" "}
                  · 입고일시: <span className="font-mono font-semibold">{cargo.inboundDateFormatted}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-3">
          {/* ✨ 장인의 설계: 기존 틀을 깨지 않고 편집 모드 제어 버튼만 추가 */}
          {!isEditMode ? (
            // 1. 일반 모드일 때: '정보 수정' 버튼 노출
            !isAwaitingDelivery && (
              <Button variant="outline" onClick={startEdit} disabled={isProcessing}>
                정보 수정
              </Button>
            )
          ) : (
            // 2. 편집 모드일 때: '취소' 및 '수정 완료' 버튼 노출
            <>
              <Button variant="outline" onClick={cancelEdit} disabled={isProcessing}>
                취소
              </Button>
              <Button variant="primary" onClick={handleEditSubmit} disabled={isProcessing}>
                {isProcessing ? "저장 중..." : "수정 완료"}
              </Button>
            </>
          )}
          {isAwaitingInspection && (
            <>
              <Button
                variant="approval"
                onClick={() => showConfirm("검사 완료", "검사를 완료 처리 하시겠습니까?", () => handleActionSubmit("complete", {}))}
                disabled={isProcessing}
              >
                {isProcessing ? "처리 중..." : "검사 완료"}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setActionType("block");
                  setActionFormOpen(true);
                }}
                disabled={isProcessing}
              >
                반출 차단
              </Button>
            </>
          )}
          {isAwaitingRelease && (
            <>
              <Button variant="approval" onClick={() => setReleaseModalOpen(true)} disabled={isProcessing}>
                반출 승인
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setActionType("block");
                  setActionFormOpen(true);
                }}
                disabled={isProcessing}
              >
                반출 차단
              </Button>
            </>
          )}
          {isAwaitingDelivery && (
            <>
              <Button variant="approval" onClick={() => handleActionSubmit("complete", {})} disabled={isProcessing}>
                {isProcessing ? "처리 중..." : "출고 완료"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 상태 카드 */}
      <div className="p-6 flex justify-between items-center border border-gray-200 bg-white border-l-4 border-l-[#0f4c81]">
        <div>
          <div className="text-sm text-gray-600">컨테이너 ID</div>
          <div className="text-2xl font-bold text-[#0f4c81] mt-1">{cargo.containerId}</div>
        </div>
        <Badge variant={statusVariant} className="text-base px-4 py-2">
          {cargo.statusLabel}
        </Badge>
      </div>

      {/* 탭 + 컨텐츠 */}
      <Card padding="none">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={isEditMode && tab.id !== "cargo"}
                className={cn(
                  "px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id ? "text-[#0f4c81] border-[#0f4c81]" : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* 화물 기본 정보 탭 */}
          {activeTab === "cargo" && (
            <CargoBasicInfoTab
              cargo={cargo}
              isImport={isImport}
              isExport={isExport}
              importDeclaration={importDeclaration}
              exportDeclaration={exportDeclaration}
              isAwaitingInspection={isAwaitingInspection}
              checklist={checklist}
              onCheckChange={handleCheckChange}
              onPhotoClick={() => setPhotoModalOpen(true)}
              isEditMode={isEditMode}
              editFormData={editFormData}
              onEditChange={handleEditChange}
            />
          )}

          {/* 수입 신고서 탭들 */}
          {isImport && importDeclaration?._hasImportMaster && (
            <>
              {activeTab === "common" && (
                <ImportCommonInfoSection
                  common={importDeclaration.common}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
              {activeTab === "pricing" && (
                <ImportPricingInfoSection
                  price={importDeclaration.price}
                  paymentDetail={importDeclaration.paymentDetail}
                  tax={importDeclaration.tax}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
              {activeTab === "items" && (
                <ImportItemsInfoSection
                  items={importDeclaration.items}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
              {activeTab === "attachments" && (
                <ImportAttachmentsSection
                  essentialFiles={importDeclaration.essentialFiles}
                  fileList={importDeclaration.fileList}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
            </>
          )}

          {/* 수출 신고서 탭들 */}
          {isExport && exportDeclaration?._hasExportMaster && (
            <>
              {activeTab === "common1" && (
                <ExportCommonSection1
                  common={exportDeclaration.common}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
              {activeTab === "common2" && (
                <ExportCommonSection2
                  payment={exportDeclaration.payment}
                  common={exportDeclaration.common}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
              {activeTab === "items" && (
                <ExportItemSection
                  items={exportDeclaration.items}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
              {activeTab === "attachments" && (
                <ExportAttachmentSection
                  essentialFiles={exportDeclaration.essentialFiles}
                  fileList={exportDeclaration.fileList}
                  needsReview={isAwaitingInspection}
                  checklist={checklist}
                  onCheckChange={handleCheckChange}
                />
              )}
            </>
          )}
        </div>
      </Card>

      {/* 반출 차단 / 출고 완료 폼 */}
      <InspectionActionForm
        isOpen={actionFormOpen}
        onClose={() => setActionFormOpen(false)}
        onSubmit={handleActionSubmit}
        isSubmitting={isProcessing}
        checkedItems={checklist}
        actionType={actionType}
      />

      {/* 반출 승인 모달 */}
      <ReleaseApprovalModal
        isOpen={releaseModalOpen}
        onClose={() => setReleaseModalOpen(false)}
        onSubmit={handleReleaseApprovalSubmit}
        isSubmitting={isProcessing}
        cargoInfo={{ containerId: cargo?.containerId, itemName: cargo?.itemName }}
      />

      {/* 입고 사진 모달 */}
      <Modal isOpen={photoModalOpen} onClose={() => setPhotoModalOpen(false)} title="입고 사진" size="lg">
        <div className="flex items-center justify-center">
          {cargo?.entryPhotoFile ? (
            <img
              src={`/download/${cargo.entryPhotoFile.fileId || cargo.entryPhotoFile.id}`}
              alt="입고 사진"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                console.error("[입고 사진] 로드 실패:", cargo.entryPhotoFile);
                e.target.style.display = "none";
                e.target.parentNode.innerHTML = '<p class="text-gray-500 text-sm">사진을 불러올 수 없습니다.</p>';
              }}
            />
          ) : (
            <p className="text-gray-500 text-sm py-8">등록된 입고 사진이 없습니다.</p>
          )}
        </div>
      </Modal>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default CargoDetailPage;
