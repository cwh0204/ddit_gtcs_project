import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import Checkbox from "../../../../style/components/form/Checkbox";

// src/pages/customs/export/components/CommonSection2.jsx

/**
 * CommonSection2 - 공통사항2 (환율 및 금액 + 보세운송)
 * ✅ 수입페이지와 동일한 패턴으로 needsReview 지원
 */
function CommonSection2({ payment, common, needsReview, checklist = {}, onCheckChange }) {
  return (
    <div className="space-y-6">
      {/* ========== 환율 및 금액 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">환율 및 금액</h3>
        <Table>
          <TableBody>
            {/* 적용환율 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.exchangeRate || false} onChange={() => onCheckChange?.("exchangeRate")} />}
                  <span>적용환율</span>
                </div>
              </TableHead>
              <TableCell className="w-[85%]">{payment?.exchangeRateFormatted || "-"}</TableCell>
            </TableRow>

            {/* 통화코드 (단독 행) */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.currencyCode || false} onChange={() => onCheckChange?.("currencyCode")} />}
                  <span>통화코드</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{payment?.currencyCode || "USD"}</TableCell>
            </TableRow>

            {/* 결제금액 (단독 행) */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.paymentAmt || false} onChange={() => onCheckChange?.("paymentAmt")} />}
                  <span>결제금액</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>
                <span className="whitespace-nowrap">{payment?.paymentAmt || "-"}</span>
              </TableCell>
            </TableRow>

            {/* 운임 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.freight || false} onChange={() => onCheckChange?.("freight")} />}
                  <span>운임</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>
                {payment?.freightUSD || "-"} / {payment?.freightKRW || "-"}
              </TableCell>
            </TableRow>

            {/* 운송보험료 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.insurance || false} onChange={() => onCheckChange?.("insurance")} />}
                  <span>운송보험료</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>
                {payment?.insuranceUSD || "-"} / {payment?.insuranceKRW || "-"}
              </TableCell>
            </TableRow>

            {/* 총 신고금액(KRW) */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.totalDeclAmt || false} onChange={() => onCheckChange?.("totalDeclAmt")} />}
                  <span>총 신고금액(KRW)</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>
                <span className="font-semibold text-blue-700">{payment?.totalDeclAmtFormatted || "-"}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 운송 및 보세 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">운송 및 보세 정보</h3>
        <Table>
          <TableBody>
            {/* 컨테이너적입여부 / 화물관리번호 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.containerInd || false} onChange={() => onCheckChange?.("containerInd")} />}
                  <span>컨테이너적입여부</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common?.containerInd || "N"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.cargoMgmtNo || false} onChange={() => onCheckChange?.("cargoMgmtNo")} />}
                  <span>화물관리번호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common?.cargoMgmtNo || "-"}</TableCell>
            </TableRow>

            {/* 보세운송신고인 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.bondedRepName || false} onChange={() => onCheckChange?.("bondedRepName")} />}
                  <span>보세운송신고인</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{common?.bondedRepName || "-"}</TableCell>
            </TableRow>

            {/* 보세운송신고기간 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.bondedPeriod || false} onChange={() => onCheckChange?.("bondedPeriod")} />}
                  <span>보세운송신고기간</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>
                {common?.bondedStartDate && common?.bondedEndDate ? `${common.bondedStartDate} ~ ${common.bondedEndDate}` : "-"}
              </TableCell>
            </TableRow>

            {/* 선박회사 코드 / 명 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.carrierCode || false} onChange={() => onCheckChange?.("carrierCode")} />}
                  <span>선박회사(항공사) 코드</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common?.carrierCode || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.carrierName || false} onChange={() => onCheckChange?.("carrierName")} />}
                  <span>선박회사(항공사) 명</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common?.carrierName || "-"}</TableCell>
            </TableRow>

            {/* 선박명 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.vesselName || false} onChange={() => onCheckChange?.("vesselName")} />}
                  <span>선박명(편명)</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{common?.vesselName || "-"}</TableCell>
            </TableRow>

            {/* 출항예정일자 / 적재예정보세구역 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.departDate || false} onChange={() => onCheckChange?.("departDate")} />}
                  <span>출항예정일자</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common?.departDate || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.loadBondedArea || false} onChange={() => onCheckChange?.("loadBondedArea")} />}
                  <span>적재예정보세구역</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common?.loadBondedArea || "-"}</TableCell>
            </TableRow>

            {/* 컨테이너번호 */}
            {common?.containerNo && common.containerNo !== "-" && (
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <div className="flex items-center gap-2">
                    {needsReview && <Checkbox checked={checklist?.containerNo || false} onChange={() => onCheckChange?.("containerNo")} />}
                    <span>컨테이너번호</span>
                  </div>
                </TableHead>
                <TableCell colSpan={3}>{common.containerNo}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CommonSection2;
