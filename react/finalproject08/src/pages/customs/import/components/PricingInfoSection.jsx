import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import Checkbox from "../../../../style/components/form/Checkbox";

// src/pages/customs/import/components/PricingInfoSection.jsx

/**
 * PricingInfoSection - 가격신고 및 세액 섹션
 * ⭐ needsReview=true일 때 각 항목 옆에 체크박스 표시
 */
function PricingInfoSection({ price, paymentDetail, tax, needsReview, checklist, onCheckChange }) {
  return (
    <div className="space-y-6">
      {/* ========== 가격신고 기본정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">가격신고 기본정보</h3>
        <Table>
          <TableBody>
            {/* 작성일자 / 결제금액 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-writeDate" checked={checklist?.writeDate || false} onChange={() => onCheckChange("writeDate")} />
                  )}
                  <span>작성일자</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{price?.writeDate || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-payAmount" checked={checklist?.payAmount || false} onChange={() => onCheckChange("payAmount")} />
                  )}
                  <span>결제금액</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{price?.payAmountFormatted || "-"}</TableCell>
            </TableRow>

            {/* 인보이스 번호 / 인보이스 발행일 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-invoiceNo" checked={checklist?.invoiceNo || false} onChange={() => onCheckChange("invoiceNo")} />
                  )}
                  <span>인보이스 번호</span>
                </div>
              </TableHead>
              <TableCell>{price?.invoiceNo || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-invoiceDate" checked={checklist?.invoiceDate || false} onChange={() => onCheckChange("invoiceDate")} />
                  )}
                  <span>인보이스 발행일</span>
                </div>
              </TableHead>
              <TableCell>{price?.invoiceDate || "-"}</TableCell>
            </TableRow>

            {/* 계약번호 / 계약일자 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-contractNo" checked={checklist?.contractNo || false} onChange={() => onCheckChange("contractNo")} />
                  )}
                  <span>계약번호</span>
                </div>
              </TableHead>
              <TableCell>{price?.contractNo || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-contractDate" checked={checklist?.contractDate || false} onChange={() => onCheckChange("contractDate")} />
                  )}
                  <span>계약일자</span>
                </div>
              </TableHead>
              <TableCell>{price?.contractDate || "-"}</TableCell>
            </TableRow>

            {/* 구매주문서번호 / 구매주문일 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-poNo" checked={checklist?.poNo || false} onChange={() => onCheckChange("poNo")} />}
                  <span>구매주문서번호</span>
                </div>
              </TableHead>
              <TableCell>{price?.poNo || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-poDate" checked={checklist?.poDate || false} onChange={() => onCheckChange("poDate")} />}
                  <span>구매주문일</span>
                </div>
              </TableHead>
              <TableCell>{price?.poDate || "-"}</TableCell>
            </TableRow>

            {/* 인도조건 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-incoterms" checked={checklist?.incoterms || false} onChange={() => onCheckChange("incoterms")} />
                  )}
                  <span>인도조건</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{price?.incoterms || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 운임/보험/가산금액 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">운임 및 부대비용</h3>
        <Table>
          <TableBody>
            {/* 운임료 / 보험료 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-freightAmt" checked={checklist?.freightAmt || false} onChange={() => onCheckChange("freightAmt")} />
                  )}
                  <span>운임료</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{price?.freightAmtFormatted || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-insuranceAmt" checked={checklist?.insuranceAmt || false} onChange={() => onCheckChange("insuranceAmt")} />
                  )}
                  <span>보험료</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{price?.insuranceAmtFormatted || "-"}</TableCell>
            </TableRow>

            {/* 가산금액 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-addAmt" checked={checklist?.addAmt || false} onChange={() => onCheckChange("addAmt")} />}
                  <span>가산금액</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{price?.addAmtFormatted || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 중량 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">중량 정보</h3>
        <Table>
          <TableBody>
            {/* 총중량 / 순중량 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-totalWeight" checked={checklist?.totalWeight || false} onChange={() => onCheckChange("totalWeight")} />
                  )}
                  <span>총중량</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{paymentDetail?.totalWeightFormatted || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-netWeight" checked={checklist?.netWeight || false} onChange={() => onCheckChange("netWeight")} />
                  )}
                  <span>순중량</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{paymentDetail?.netWeightFormatted || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 세액 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">세액 정보</h3>
        <Table>
          <TableBody>
            {/* 총과세가격 / 총관세 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-totalTaxBase" checked={checklist?.totalTaxBase || false} onChange={() => onCheckChange("totalTaxBase")} />
                  )}
                  <span>총과세가격</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                <span className="font-semibold text-blue-700">{tax?.totalTaxBaseFormatted || "-"}</span>
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-totalDuty" checked={checklist?.totalDuty || false} onChange={() => onCheckChange("totalDuty")} />
                  )}
                  <span>총관세</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                <span className="font-semibold text-blue-700">{tax?.totalDutyFormatted || "-"}</span>
              </TableCell>
            </TableRow>

            {/* 총부가세 / 총세액합계 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-totalVat" checked={checklist?.totalVat || false} onChange={() => onCheckChange("totalVat")} />}
                  <span>총부가세</span>
                </div>
              </TableHead>
              <TableCell>
                <span className="font-semibold text-blue-700">{tax?.totalVatFormatted || "-"}</span>
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-totalTaxSum" checked={checklist?.totalTaxSum || false} onChange={() => onCheckChange("totalTaxSum")} />
                  )}
                  <span>총세액합계</span>
                </div>
              </TableHead>
              <TableCell>
                <span className="font-bold text-red-600 text-lg">{tax?.totalTaxSumFormatted || "-"}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 컨테이너 정보 ========== */}
      {paymentDetail?.contNo && paymentDetail.contNo !== "-" && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">컨테이너 정보</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[15%] bg-[#f9fbff]">
                  <div className="flex items-center gap-2">
                    {needsReview && <Checkbox id="check-contNo" checked={checklist?.contNo || false} onChange={() => onCheckChange("contNo")} />}
                    <span>컨테이너 번호</span>
                  </div>
                </TableHead>
                <TableCell className="w-[85%]">{paymentDetail.contNo}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default PricingInfoSection;
