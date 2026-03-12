import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";

// src/pages/customs/import/components/PaymentInfoSection.jsx

/**
 * PaymentInfoSection - 결제 및 세액 섹션
 * JSP 필드 기반으로 완전히 재구성
 */
function PaymentInfoSection({ paymentDetail, containerList }) {
  return (
    <div className="space-y-6">
      {/* ========== 결제 및 세액 정보 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">결제 및 세액</h3>
        <Table>
          <TableBody>
            {/* 총포장개수/단위 / 총중량 */}
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">총중량</TableHead>
              <TableCell className="w-[35%]">{paymentDetail.totalWeight} KG</TableCell>
              <TableHead className="bg-[#f9fbff]">원산지증명서유무</TableHead>
              <TableCell>
                {paymentDetail.originCertYn === "Y" && "Y (유)"}
                {paymentDetail.originCertYn === "N" && "N (무)"}
                {paymentDetail.originCertYn !== "Y" && paymentDetail.originCertYn !== "N" && paymentDetail.originCertYn}
              </TableCell>
            </TableRow>

            {/* 결제금액/인도조건 / 운임 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">인도조건</TableHead>
              <TableCell>
                {paymentDetail.payCurrency} {paymentDetail.payAmt} ({paymentDetail.incoterms})
              </TableCell>
              <TableHead className="bg-[#f9fbff]">운임료</TableHead>
              <TableCell>
                {paymentDetail.freightCurrency} {paymentDetail.freightAmt}
              </TableCell>
            </TableRow>

            {/* 보험료 / 가산금액 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">보험료</TableHead>
              <TableCell>
                {paymentDetail.insurCurrency} {paymentDetail.insurAmt}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">가산금액</TableHead>
              <TableCell>
                {paymentDetail.addCurrency} {paymentDetail.addAmt}
              </TableCell>
            </TableRow>

            {/* 총과세가격 / 총관세 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">총과세가격</TableHead>
              <TableCell>
                <span className="font-semibold">{paymentDetail.totalTaxable}</span>
              </TableCell>
              <TableHead className="bg-[#f9fbff]">총관세</TableHead>
              <TableCell>
                <span className="font-semibold">{paymentDetail.totalDuty}</span>
              </TableCell>
            </TableRow>

            {/* 총부가세 / 총세액합계 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">총부가세</TableHead>
              <TableCell>
                <span className="font-semibold">{paymentDetail.totalVat}</span>
              </TableCell>
              <TableHead className="bg-[#f9fbff]">총세액합계</TableHead>
              <TableCell>
                <span className="font-bold text-blue-600 text-base">{paymentDetail.totalTaxSum}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 컨테이너 번호 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">컨테이너 번호</h3>

        {containerList && containerList.length > 0 ? (
          <div className="border border-gray-200 rounded">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">일련번호</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">컨테이너 번호</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {containerList.map((container) => (
                  <tr key={container.index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">{container.index}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{container.no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-gray-200 rounded bg-gray-50">컨테이너 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default PaymentInfoSection;
