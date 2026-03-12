import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import TableHeader from "../../../../style/components/table/TableHeader";
import Checkbox from "../../../../style/components/form/Checkbox";

// src/pages/customs/import/components/ItemsInfoSection.jsx

function ItemsInfoSection({ items, needsReview, checklist, onCheckChange }) {
  return (
    <div className="space-y-4">
      {needsReview && (
        <div className="flex items-center gap-2 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <Checkbox id="check-itemsInfo" checked={checklist?.itemsInfo || false} onChange={() => onCheckChange("itemsInfo")} />
          <label htmlFor="check-itemsInfo" className="text-sm font-semibold text-gray-900 cursor-pointer">
            물품 정보 전체 확인
          </label>
        </div>
      )}

      {/* 물품 정보 테이블 */}
      {items && items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">No</TableHead>
              <TableHead className="w-[120px]">HS 부호</TableHead>
              <TableHead>품명</TableHead>
              <TableHead className="w-[150px]">규격/모델</TableHead>
              <TableHead className="w-[100px] text-right">수량</TableHead>
              <TableHead className="w-[100px] text-right">단가</TableHead>
              <TableHead className="w-[120px] text-right">총금액</TableHead>
              <TableHead className="w-[100px]">원산지</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{item.no || index + 1}</TableCell>
                <TableCell className="font-mono text-sm">{item.hsCode || "-"}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.productName || "-"}</div>
                    {item.productNameEn && <div className="text-xs text-gray-500">{item.productNameEn}</div>}
                  </div>
                </TableCell>
                <TableCell>{item.modelName || "-"}</TableCell>
                <TableCell className="text-right">
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell className="text-right">{item.unitPriceFormatted || "-"}</TableCell>
                <TableCell className="text-right font-semibold">{item.totalAmountFormatted || "-"}</TableCell>
                <TableCell>{item.originCountry || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded bg-gray-50">
          <p className="text-gray-500">등록된 물품 정보가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default ItemsInfoSection;
