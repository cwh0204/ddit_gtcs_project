import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import Checkbox from "../../../../style/components/form/Checkbox";

// src/pages/customs/import/components/CommonInfoSection.jsx

/**
 * CommonInfoSection - 공통사항 항목 옆에 체크박스 표시
 */
function CommonInfoSection({ common, needsReview, checklist, onCheckChange }) {
  return (
    <div className="space-y-6">
      {/* ========== 거래당사자 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">거래당사자 정보</h3>
        <Table>
          <TableBody>
            {/* 수입자 상호 / 통관고유부호 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox
                      id="check-importerTradeName"
                      checked={checklist?.importerTradeName || false}
                      onChange={() => onCheckChange("importerTradeName")}
                    />
                  )}
                  <span>기업명</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.importerTradeName || "-"}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-importerCode" checked={checklist?.importerCode || false} onChange={() => onCheckChange("importerCode")} />
                  )}
                  <span>통관고유부호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.importerCode || "-"}</TableCell>
            </TableRow>

            {/* 사업자등록번호 / 성명 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-importerBizNo" checked={checklist?.importerBizNo || false} onChange={() => onCheckChange("importerBizNo")} />
                  )}
                  <span>사업자등록번호</span>
                </div>
              </TableHead>
              <TableCell>{common.importerCode || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-repName" checked={checklist?.repName || false} onChange={() => onCheckChange("repName")} />}
                  <span>성명</span>
                </div>
              </TableHead>
              <TableCell>{common.repName || "-"}</TableCell>
            </TableRow>

            {/* 전화번호(내선) / 이메일 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-repTel" checked={checklist?.repTel || false} onChange={() => onCheckChange("repTel")} />}
                  <span>전화번호(내선)</span>
                </div>
              </TableHead>
              <TableCell>
                {common.repTel || "-"}
                {common.repTelExt && ` (내선: ${common.repTelExt})`}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-repEmail" checked={checklist?.repEmail || false} onChange={() => onCheckChange("repEmail")} />}
                  <span>이메일</span>
                </div>
              </TableHead>
              <TableCell>{common.repEmail || "-"}</TableCell>
            </TableRow>

            {/* 주소 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox
                      id="check-importerAddress"
                      checked={checklist?.importerAddress || false}
                      onChange={() => onCheckChange("importerAddress")}
                    />
                  )}
                  <span>주소</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{common.importerAddress || "-"}</TableCell>
            </TableRow>

            {/* 해외거래처 / 국적 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox
                      id="check-overseasBizName"
                      checked={checklist?.overseasBizName || false}
                      onChange={() => onCheckChange("overseasBizName")}
                    />
                  )}
                  <span>해외거래처명</span>
                </div>
              </TableHead>
              <TableCell>{common.overseasBizName || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox
                      id="check-overseasCountry"
                      checked={checklist?.overseasCountry || false}
                      onChange={() => onCheckChange("overseasCountry")}
                    />
                  )}
                  <span>국적</span>
                </div>
              </TableHead>
              <TableCell>{common.overseasCountry || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 기본신고사항 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">기본신고사항</h3>
        <Table>
          <TableBody>
            {/* 수입종류 / 화물관리번호 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-importType" checked={checklist?.importType || false} onChange={() => onCheckChange("importType")} />
                  )}
                  <span>수입종류</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.importType || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-cargoMgmtNo" checked={checklist?.cargoMgmtNo || false} onChange={() => onCheckChange("cargoMgmtNo")} />
                  )}
                  <span>화물관리번호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{common.cargoMgmtNo || "-"}</TableCell>
            </TableRow>

            {/* 선기명 / 선기국적 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-vesselName" checked={checklist?.vesselName || false} onChange={() => onCheckChange("vesselName")} />
                  )}
                  <span>선기명</span>
                </div>
              </TableHead>
              <TableCell>{common.vesselName || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-vesselNation" checked={checklist?.vesselNation || false} onChange={() => onCheckChange("vesselNation")} />
                  )}
                  <span>선기국적</span>
                </div>
              </TableHead>
              <TableCell>{common.vesselNation || "-"}</TableCell>
            </TableRow>

            {/* 입항(예정)일 / 반입일자 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox
                      id="check-arrivalEstDate"
                      checked={checklist?.arrivalEstDate || false}
                      onChange={() => onCheckChange("arrivalEstDate")}
                    />
                  )}
                  <span>입항(예정)일</span>
                </div>
              </TableHead>
              <TableCell>{common.arrivalEstDate || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-bondedInDate" checked={checklist?.bondedInDate || false} onChange={() => onCheckChange("bondedInDate")} />
                  )}
                  <span>보세구역 반입일자</span>
                </div>
              </TableHead>
              <TableCell>{common.bondedInDate || "-"}</TableCell>
            </TableRow>

            {/* 수입국 / 도착항 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-originCountry" checked={checklist?.originCountry || false} onChange={() => onCheckChange("originCountry")} />
                  )}
                  <span>수입국</span>
                </div>
              </TableHead>
              <TableCell>{common.originCountry || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-arrivalPort" checked={checklist?.arrivalPort || false} onChange={() => onCheckChange("arrivalPort")} />
                  )}
                  <span>도착항</span>
                </div>
              </TableHead>
              <TableCell>{common.arrivalPort || "-"}</TableCell>
            </TableRow>

            {/* B/L(AWB) */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-blNo" checked={checklist?.blNo || false} onChange={() => onCheckChange("blNo")} />}
                  <span>B/L(AWB)</span>
                </div>
              </TableHead>
              <TableCell colSpan={3}>{common.blNo || "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CommonInfoSection;
