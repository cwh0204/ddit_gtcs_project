import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import Checkbox from "../../../../style/components/form/Checkbox";

// src/pages/customs/export/components/CommonSection1.jsx

/**
 * CommonSection1 - 수출 공통사항1 (수출화주, 구매자, 기본신고사항)
 * ✅ 수입페이지와 동일한 패턴으로 needsReview 지원
 */
function CommonSection1({ common, needsReview, checklist = {}, onCheckChange }) {
  if (!common) {
    return <div className="text-center py-8 text-gray-500">공통사항 정보가 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* ✅ 전체 섹션 체크박스 (심사 모드일 때만 표시) */}

      {/* ========== 수출화주 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">수출화주 정보</h3>
        <Table>
          <TableBody>
            {/* 기업명 / 대표자명 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.exporterName || false} onChange={() => onCheckChange?.("exporterName")} />}
                  <span>기업명</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.exporterName || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.declarantName || false} onChange={() => onCheckChange?.("declarantName")} />}
                  <span>대표자명</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.declarantName || "-"}</TableCell>
            </TableRow>

            {/* 사업자등록번호 / 거래 상대방 식별번호 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox checked={checklist?.exporterBusinessNumber || false} onChange={() => onCheckChange?.("exporterBusinessNumber")} />
                  )}
                  <span>사업자등록번호</span>
                </div>
              </TableHead>
              <TableCell>{common.exporterBusinessNumber || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.buyerIdNo || false} onChange={() => onCheckChange?.("buyerIdNo")} />}
                  <span>거래 상대방 식별번호</span>
                </div>
              </TableHead>
              <TableCell>{common.buyerIdNo || "-"}</TableCell>
            </TableRow>

            {/* 통관고유부호 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.exporterCode || false} onChange={() => onCheckChange?.("exporterCode")} />}
                  <span>통관고유부호</span>
                </div>
              </TableHead>
              <TableCell>{common.exporterCode || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]"></TableHead>
              <TableCell></TableCell>
            </TableRow>

            {/* 기업 주소 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.exporterAddress || false} onChange={() => onCheckChange?.("exporterAddress")} />}
                  <span>기업 주소</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{common.exporterAddress || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 구매자 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">구매자</h3>
        <Table>
          <TableBody>
            {/* 상호 / 구매업체 주소 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.buyerName || false} onChange={() => onCheckChange?.("buyerName")} />}
                  <span>상호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.buyerName || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.buyerAddress || false} onChange={() => onCheckChange?.("buyerAddress")} />}
                  <span>구매업체 주소</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.buyerAddress || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 기본신고사항 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">기본신고사항</h3>
        <Table>
          <TableBody>
            {/* 신고구분 / 거래구분 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.dclType || false} onChange={() => onCheckChange?.("dclType")} />}
                  <span>신고구분</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                {common.dclType === "H" && "서류제출"}
                {common.dclType === "P" && "P/L"}
                {!common.dclType && "-"}
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.transMode || false} onChange={() => onCheckChange?.("transMode")} />}
                  <span>거래구분</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                {common.transMode === "11" && "일반수출"}
                {common.transMode === "15" && "위탁가공"}
                {!common.transMode && "-"}
              </TableCell>
            </TableRow>

            {/* 수출종류 / 결제방법 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.exportKind || false} onChange={() => onCheckChange?.("exportKind")} />}
                  <span>수출종류</span>
                </div>
              </TableHead>
              <TableCell>
                {common.exportKind === "A" && "일반"}
                {common.exportKind === "B" && "보세공장"}
                {!common.exportKind && "-"}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.paymentMethod || false} onChange={() => onCheckChange?.("paymentMethod")} />}
                  <span>결제방법</span>
                </div>
              </TableHead>
              <TableCell>
                {common.paymentMethod === "TT" && "송금"}
                {common.paymentMethod === "LC" && "신용장"}
                {!common.paymentMethod && "-"}
              </TableCell>
            </TableRow>

            {/* 인도조건 / 목적국 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.incoterms || false} onChange={() => onCheckChange?.("incoterms")} />}
                  <span>인도조건</span>
                </div>
              </TableHead>
              <TableCell>{common.incoterms || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.destCountry || false} onChange={() => onCheckChange?.("destCountry")} />}
                  <span>목적국</span>
                </div>
              </TableHead>
              <TableCell>{common.destCountry || "-"}</TableCell>
            </TableRow>

            {/* 적재항 / 운송수단 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.loadingPort || false} onChange={() => onCheckChange?.("loadingPort")} />}
                  <span>적재항</span>
                </div>
              </TableHead>
              <TableCell>{common.loadingPort || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.transportMode || false} onChange={() => onCheckChange?.("transportMode")} />}
                  <span>운송수단</span>
                </div>
              </TableHead>
              <TableCell>
                {common.transportMode === "10" && "선박"}
                {common.transportMode === "40" && "항공"}
                {!common.transportMode && "-"}
              </TableCell>
            </TableRow>

            {/* 운송용기 / 물품소재지 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.containerMode || false} onChange={() => onCheckChange?.("containerMode")} />}
                  <span>운송용기</span>
                </div>
              </TableHead>
              <TableCell>
                {common.containerMode === "FCL" && "컨테이너"}
                {common.containerMode === "LCL" && "소량화물"}
                {common.containerMode === "BULK" && "산적화물"}
                {!common.containerMode && "-"}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.goodsLoc || false} onChange={() => onCheckChange?.("goodsLoc")} />}
                  <span>물품소재지</span>
                </div>
              </TableHead>
              <TableCell>{common.goodsLoc || "-"}</TableCell>
            </TableRow>

            {/* 물품상태 / 환급신청인 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.goodsType || false} onChange={() => onCheckChange?.("goodsType")} />}
                  <span>물품상태</span>
                </div>
              </TableHead>
              <TableCell>
                {common.goodsType === "N" && "신품"}
                {common.goodsType === "O" && "중고품"}
                {common.goodsType === "D" && "손상물품"}
                {!common.goodsType && "-"}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox checked={checklist?.refundApplicant || false} onChange={() => onCheckChange?.("refundApplicant")} />}
                  <span>환급신청인</span>
                </div>
              </TableHead>
              <TableCell>
                {common.refundApplicant === "1" && "수출자"}
                {common.refundApplicant === "2" && "제조자"}
                {common.refundApplicant === "3" && "수출위탁자"}
                {!common.refundApplicant && "-"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CommonSection1;
