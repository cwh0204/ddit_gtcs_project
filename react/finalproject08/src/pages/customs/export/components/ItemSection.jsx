import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import Checkbox from "../../../../style/components/form/Checkbox";

// src/pages/customs/export/components/ItemSection.jsx

/**
 * ItemSection - 수출 물품정보
 * ✅ 수입페이지와 동일한 패턴으로 needsReview 지원
 */
function ItemSection({ items, needsReview, checklist = {}, onCheckChange }) {
  // items가 배열이면 첫 번째 항목 사용
  const item = Array.isArray(items) && items.length > 0 ? items[0] : items;

  if (!item) {
    return <div className="text-center py-8 text-gray-500">물품정보가 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* ✅ 전체 섹션 체크박스 (심사 모드일 때만 표시) */}
      {needsReview && (
        <div className="flex items-center gap-2 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <Checkbox id="check-items-all" checked={checklist?.itemsAll || false} onChange={() => onCheckChange?.("itemsAll")} />
          <label htmlFor="check-items-all" className="text-sm font-semibold text-gray-900 cursor-pointer">
            물품정보 전체 확인
          </label>
        </div>
      )}

      {/* ========== 품목 기본정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">품목 기본정보</h3>
        <Table>
          <TableBody>
            {/* HS부호 / 수출물품명 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.hsCode || false} onChange={() => onCheckChange?.("hsCode")} />}
                  <span>HS부호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.hsCode || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.productName || false} onChange={() => onCheckChange?.("productName")} />}
                  <span>수출물품명</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.productName || "-"}</TableCell>
            </TableRow>

            {/* 거래품명 / 상표명 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.tradeItemName || false} onChange={() => onCheckChange?.("tradeItemName")} />}
                  <span>거래품명</span>
                </div>
              </TableHead>
              <TableCell>{item.tradeItemName || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.brandName || false} onChange={() => onCheckChange?.("brandName")} />}
                  <span>상표명</span>
                </div>
              </TableHead>
              <TableCell>{item.brandName || "-"}</TableCell>
            </TableRow>

            {/* 모델 (규격) */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.modelName || false} onChange={() => onCheckChange?.("modelName")} />}
                  <span>모델 (규격)</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{item.modelName || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 수량 및 중량 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">수량 및 중량</h3>
        <Table>
          <TableBody>
            {/* 수량/단위 / 단가 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.quantity || false} onChange={() => onCheckChange?.("quantity")} />}
                  <span>수량/단위</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                {item.quantityFormatted || item.quantity || 0} {item.unit || ""}
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.unitPrice || false} onChange={() => onCheckChange?.("unitPrice")} />}
                  <span>단가</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.unitPriceFormatted || "-"}</TableCell>
            </TableRow>

            {/* 총중량 / 전체 포장 개수 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.totalWeight || false} onChange={() => onCheckChange?.("totalWeight")} />}
                  <span>총중량</span>
                </div>
              </TableHead>
              <TableCell>{item.totalWeightFormatted || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.totalPackCnt || false} onChange={() => onCheckChange?.("totalPackCnt")} />}
                  <span>전체 포장 개수</span>
                </div>
              </TableHead>
              <TableCell>{item.totalPackCnt || 0}개</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 금액 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">금액 정보</h3>
        <Table>
          <TableBody>
            {/* 통화 / 총 금액 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.currency || false} onChange={() => onCheckChange?.("currency")} />}
                  <span>통화</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.currency || "USD"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.totalPrice || false} onChange={() => onCheckChange?.("totalPrice")} />}
                  <span>총 금액</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                <span className="font-semibold text-blue-700">{item.totalPriceFormatted || "-"}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 송장 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">송장 정보</h3>
        <Table>
          <TableBody>
            {/* 송장부호 / Attach여부 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.invoiceSign || false} onChange={() => onCheckChange?.("invoiceSign")} />}
                  <span>송장부호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.invoiceSign || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.attachYn || false} onChange={() => onCheckChange?.("attachYn")} />}
                  <span>Attach여부</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.attachYn === "Y" ? "Y (첨부)" : "N (미첨부)"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 원산지 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">원산지 정보</h3>
        <Table>
          <TableBody>
            {/* 원산지국가 / 원산지결정기준 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.originCountry || false} onChange={() => onCheckChange?.("originCountry")} />}
                  <span>원산지국가</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{item.originCountry || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.originCriteria || false} onChange={() => onCheckChange?.("originCriteria")} />}
                  <span>원산지결정기준</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                {item.originCriteria === "WO" && "WO (완전생산)"}
                {item.originCriteria === "PE" && "PE (실질변형)"}
                {item.originCriteria === "X" && "X (비대상)"}
                {!item.originCriteria && "-"}
              </TableCell>
            </TableRow>

            {/* 원산지표시여부 / 원산지증명서 발급구분 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.originMarkYn || false} onChange={() => onCheckChange?.("originMarkYn")} />}
                  <span>원산지표시여부</span>
                </div>
              </TableHead>
              <TableCell>
                {item.originMarkYn === "Y" && "Y (표시)"}
                {item.originMarkYn === "N" && "N (미표시)"}
                {item.originMarkYn === "E" && "E (비대상)"}
                {!item.originMarkYn && "-"}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.originCertType || false} onChange={() => onCheckChange?.("originCertType")} />}
                  <span>원산지증명서 발급구분</span>
                </div>
              </TableHead>
              <TableCell>
                {item.originCertType === "Y" && "Y (발급)"}
                {item.originCertType === "N" && "N (미발급)"}
                {!item.originCertType && "-"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ItemSection;
