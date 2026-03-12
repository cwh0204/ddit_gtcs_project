import Badge from "../../../../style/components/Badge";
import Checkbox from "../../../../style/components/form/Checkbox";
import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import Input from "../../../../style/components/Input";

// src/pages/warehouse/cargo/components/CargoBasicInfoTab.jsx

/**
 * 화물 기본 정보 탭
 * - 위치 정보 / 품목 기본 정보 / 화주 정보 / 파손 정보
 * - isAwaitingInspection=true 일 때 각 항목에 체크박스 표시
 * - isEditMode=true 일 때 수정 가능한 항목을 Input으로 전환
 */
function CargoBasicInfoTab({
  cargo,
  isImport,
  isExport,
  importDeclaration,
  exportDeclaration,
  isAwaitingInspection,
  checklist,
  onCheckChange,
  onPhotoClick,
  // ✨ 편집 관련 Props 수신
  isEditMode,
  editFormData,
  onEditChange,
}) {
  const chk = (id) =>
    isAwaitingInspection ? <Checkbox id={`check-${id}`} checked={checklist?.[id] || false} onChange={() => onCheckChange(id)} /> : null;

  return (
    <div className="space-y-6">
      {/* 위치 정보 (읽기 전용 유지) */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">위치 정보</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("zone")}
                  <span>구역</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                {cargo.positionArea === "LOCAL" ? "국내창고" : cargo.positionArea === "BONDED" ? "보세창고" : cargo.zone || "-"}
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("position")}
                  <span>적재 위치</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">{cargo.warehouseId || cargo.position || "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("containerId")}
                  <span>컨테이너 ID</span>
                </div>
              </TableHead>
              <TableCell>
                <span className="font-mono">{cargo.containerId || "-"}</span>
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <span>위치 구분</span>
              </TableHead>
              <TableCell>{cargo.positionArea === "BONDED" ? "보세구역" : "국내창고"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 품목 기본 정보 (품명, 수량, 무게 수정 가능) */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">품목 기본 정보</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("itemName")}
                  <span>품목명</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                {/* ✨ 품목명 인라인 수정 로직 결합 */}
                {isEditMode ? (
                  <Input name="itemName" value={editFormData.itemName || ""} onChange={onEditChange} className="w-full h-8 px-2 py-1 text-sm" />
                ) : (
                  cargo.itemName || "-"
                )}
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]" />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("quantity")}
                  <span>수량</span>
                </div>
              </TableHead>
              <TableCell>
                {/* ✨ 수량(qty) 인라인 수정 로직 결합 */}
                {isEditMode ? (
                  <Input type="number" name="qty" value={editFormData.qty || ""} onChange={onEditChange} className="w-full h-8 px-2 py-1 text-sm" />
                ) : cargo.quantity ? (
                  `${cargo.quantity.toLocaleString()}개`
                ) : (
                  "-"
                )}
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("weight")}
                  <span>무게</span>
                </div>
              </TableHead>
              <TableCell>
                {/* ✨ 무게(grossWeight) 인라인 수정 로직 결합 */}
                {isEditMode ? (
                  <Input
                    type="number"
                    step="0.01"
                    name="grossWeight"
                    value={editFormData.grossWeight || ""}
                    onChange={onEditChange}
                    className="w-full h-8 px-2 py-1 text-sm"
                  />
                ) : cargo.weight ? (
                  `${cargo.weight.toLocaleString()} kg`
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 화주 정보 (화주명/반입자명, 관리번호 수정 가능) */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">화주 정보</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span>화주명 (반입자명)</span>
              </TableHead>
              <TableCell className="w-[35%]">
                {/* ✨ 반입자명(repName) 인라인 수정 로직 결합 */}
                {isEditMode ? (
                  <Input name="repName" value={editFormData.repName || ""} onChange={onEditChange} className="w-full h-8 px-2 py-1 text-sm" />
                ) : (
                  cargo.owner || "-"
                )}
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {chk("declNo")}
                  <span>신고서 번호</span>
                </div>
              </TableHead>
              <TableCell className="w-[35%]">
                <span className="font-mono">{cargo.declNo || "-"}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span>BL/AWB 번호 (화물관리번호)</span>
              </TableHead>
              <TableCell colSpan={3}>
                {/* ✨ 화물관리번호(uniqueNo) 인라인 수정 로직 결합 */}
                {isEditMode ? (
                  <Input
                    name="uniqueNo"
                    value={editFormData.uniqueNo || ""}
                    onChange={onEditChange}
                    className="w-full h-8 max-w-md px-2 py-1 text-sm"
                  />
                ) : (
                  <span className="font-mono">{cargo.uniqueNo || "-"}</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 파손 정보 (읽기 전용 유지) */}
      <section>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">파손 정보</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span>파손 여부</span>
              </TableHead>
              <TableCell className="w-[35%]">
                <Badge variant={cargo.damagedYn === "Y" ? "danger" : "success"}>{cargo.damagedYn === "Y" ? "손상" : "정상"}</Badge>
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span>입고 사진</span>
              </TableHead>
              <TableCell className="w-[35%]">
                {cargo.entryPhotoFile ? (
                  <button onClick={onPhotoClick} className="text-blue-600 hover:text-blue-800 underline text-sm font-medium">
                    사진 보기
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">사진 없음</span>
                )}
              </TableCell>
            </TableRow>
            {cargo.damagedYn === "Y" && cargo.damagedComment && (
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span>파손 내용</span>
                </TableHead>
                <TableCell colSpan={3}>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{cargo.damagedComment}</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* 하단 안내 영역 (기존 유지) */}
      {isImport && !importDeclaration?._hasImportMaster && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-900">수입 신고서 정보 없음</p>
            <p className="text-sm text-blue-700 mt-0.5">이 화물은 아직 수입 신고서가 제출되지 않았습니다.</p>
          </div>
        </div>
      )}
      {isExport && !exportDeclaration?._hasExportMaster && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-900">수출 신고서 정보 없음</p>
            <p className="text-sm text-blue-700 mt-0.5">이 화물은 아직 수출 신고서가 제출되지 않았습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CargoBasicInfoTab;
