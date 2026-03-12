import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Badge from "../../../style/components/Badge";
import Table from "../../../style/components/table/Table";
import TableBody from "../../../style/components/table/TableBody";
import TableRow from "../../../style/components/table/TableRow";
import TableHead from "../../../style/components/table/TableHead";
import TableCell from "../../../style/components/table/TableCell";
import DetailSection from "../../customs/import/components/DetailSection";
import { useCargoDetail } from "../../../controller/custom/cargo/useCargoQueries";
import { mapCargo } from "../../../domain/warehouse/warehouseMapper";

// src/pages/customs/cargo/CargoTrackingDetailPage.jsx

/**
 * 화물 진행 상세 페이지 (세관원)
 * ✅ API 연결 완료
 * ✅ 목 데이터 제거
 */

// 상태별 Badge 색상
const STATUS_VARIANTS = {
  심사대기: "outline",
  심사중: "warning",
  검사중: "info",
  검사완료: "success",
  수리: "success",
  납부: "primary",
  반출승인: "success",
  반출차단: "danger",
  반려: "danger",
  통관완료: "success",
  // 영문 상태도 추가
  PHYSICAL: "info",
  INSPECTION_COMPLETED: "success",
  APPROVED: "success",
  RELEASE_REJECTED: "danger",
  REJECTED: "danger",
  CLEARED: "success",
};

function CargoTrackingDetailPage() {
  const { cargoId } = useParams();
  const navigate = useNavigate();

  // ========== API 호출 ==========
  const { data: rawData, isLoading, error } = useCargoDetail(cargoId);

  // ========== 데이터 매핑 ==========
  const cargo = rawData ? mapCargo(rawData) : null;

  // ========== UI 상태 ==========
  const [openSections, setOpenSections] = useState({
    basic: true,
    location: true,
    status: true,
    declaration: false,
    history: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ========== 로딩 상태 ==========
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0f4c81] mx-auto" />
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  // ========== 에러 상태 ==========
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full">
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

  // ========== 데이터 없음 ==========
  if (!cargo) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">화물을 찾을 수 없습니다.</div>
          <p className="text-gray-600 mb-4">존재하지 않는 화물 ID입니다.</p>
          <Button onClick={handleBack}>목록으로</Button>
        </Card>
      </div>
    );
  }

  // ========== 수입/수출 신고서 정보 ==========
  const declarationMaster = cargo.isImport ? cargo.importMaster : cargo.exportMaster;
  const declarationType = cargo.isImport ? "수입" : "수출";

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-screen">
      {/* ⭐ 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="뒤로가기">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">화물 진행 상세</h1>
            <p className="text-sm text-gray-600 mt-1">컨테이너 ID: {cargo.containerId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={cargo.isUrgent ? "danger" : "default"}>{cargo.isUrgent ? "긴급" : "일반"}</Badge>
          <Badge variant={declarationMaster?.statusBadgeVariant || "outline"}>{declarationMaster?.statusLabel || "미등록"}</Badge>
          <Badge variant={cargo.isImport ? "primary" : "success"}>{declarationType}</Badge>
        </div>
      </div>

      {/* ⭐ 기본 정보 */}
      <DetailSection title="기본 정보" isOpen={openSections.basic} onToggle={() => toggleSection("basic")}>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">컨테이너 ID</span>
              </TableHead>
              <TableCell className="w-[35%]">{cargo.containerId}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">신고번호</span>
              </TableHead>
              <TableCell className="w-[35%]">{cargo.declNo || "-"}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">B/L 번호</span>
              </TableHead>
              <TableCell>{cargo.blNo || "-"}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">화주 성명</span>
              </TableHead>
              <TableCell>{cargo.owner || "-"}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">품명</span>
              </TableHead>
              <TableCell>{cargo.itemName}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">수량</span>
              </TableHead>
              <TableCell>{cargo.qtyFormatted}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">중량</span>
              </TableHead>
              <TableCell>{cargo.weightFormatted}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">입고일시</span>
              </TableHead>
              <TableCell>{cargo.inboundDateFormatted}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DetailSection>

      {/* ⭐ 위치 정보 */}
      <DetailSection title="위치 정보" isOpen={openSections.location} onToggle={() => toggleSection("location")}>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">창고 위치</span>
              </TableHead>
              <TableCell className="w-[35%]">
                <span className="font-mono font-semibold">{cargo.warehouseId}</span>
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">구역</span>
              </TableHead>
              <TableCell className="w-[35%]">{cargo.zone}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">보세/국내 구분</span>
              </TableHead>
              <TableCell colSpan={3}>
                <Badge variant={cargo.positionArea === "BONDED" ? "primary" : "success"}>
                  {cargo.positionArea === "BONDED" ? "보세구역" : "국내창고"}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DetailSection>

      {/* ⭐ 신고서 정보 (있으면 표시) */}
      {declarationMaster && (
        <DetailSection title={`${declarationType} 신고서 정보`} isOpen={openSections.declaration} onToggle={() => toggleSection("declaration")}>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[15%] bg-[#f9fbff]">
                  <span className="text-gray-700">신고번호</span>
                </TableHead>
                <TableCell className="w-[35%]">{declarationMaster.declarationNumber || "-"}</TableCell>
                <TableHead className="w-[15%] bg-[#f9fbff]">
                  <span className="text-gray-700">현재 상태</span>
                </TableHead>
                <TableCell className="w-[35%]">
                  <Badge variant={declarationMaster.statusBadgeVariant}>{declarationMaster.statusLabel}</Badge>
                </TableCell>
              </TableRow>

              {cargo.isImport && (
                <>
                  <TableRow>
                    <TableHead className="bg-[#f9fbff]">
                      <span className="text-gray-700">수입자</span>
                    </TableHead>
                    <TableCell>{declarationMaster.importer || "-"}</TableCell>
                    <TableHead className="bg-[#f9fbff]">
                      <span className="text-gray-700">수출자</span>
                    </TableHead>
                    <TableCell>{declarationMaster.exporter || "-"}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHead className="bg-[#f9fbff]">
                      <span className="text-gray-700">총 과세가격</span>
                    </TableHead>
                    <TableCell>{declarationMaster.dutiableValueFormatted || "-"}</TableCell>
                    <TableHead className="bg-[#f9fbff]">
                      <span className="text-gray-700">총 세액</span>
                    </TableHead>
                    <TableCell className="font-semibold text-blue-600">{declarationMaster.totalTaxAmountFormatted || "-"}</TableCell>
                  </TableRow>
                </>
              )}

              {cargo.isExport && (
                <TableRow>
                  <TableHead className="bg-[#f9fbff]">
                    <span className="text-gray-700">수출자</span>
                  </TableHead>
                  <TableCell>{declarationMaster.exporter || "-"}</TableCell>
                  <TableHead className="bg-[#f9fbff]">
                    <span className="text-gray-700">FOB 가격</span>
                  </TableHead>
                  <TableCell>{declarationMaster.fobPriceFormatted || "-"}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DetailSection>
      )}

      {/* ⭐ 진행 상태 */}
      <DetailSection title="진행 상태" isOpen={openSections.status} onToggle={() => toggleSection("status")}>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">현재 상태</span>
              </TableHead>
              <TableCell className="w-[35%]">
                <Badge variant={declarationMaster?.statusBadgeVariant || "outline"}>{declarationMaster?.statusLabel || "미등록"}</Badge>
              </TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">최종 업데이트</span>
              </TableHead>
              <TableCell className="w-[35%]">{cargo.updatedAtFormatted || "-"}</TableCell>
            </TableRow>

            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">파손 여부</span>
              </TableHead>
              <TableCell>
                <Badge variant={cargo.damagedYn === "Y" ? "danger" : "success"}>{cargo.damagedYn === "Y" ? "손상" : "정상"}</Badge>
              </TableCell>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">위험도</span>
              </TableHead>
              <TableCell>
                <Badge variant={cargo.isUrgent ? "danger" : "success"}>{cargo.isUrgent ? "RED" : "GREEN"}</Badge>
              </TableCell>
            </TableRow>

            {cargo.damagedComment && (
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span className="text-gray-700">손상 코멘트</span>
                </TableHead>
                <TableCell colSpan={3}>{cargo.damagedComment}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DetailSection>

      {/* ⭐ 하단 버튼 */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack}>
          목록으로
        </Button>
      </div>
    </div>
  );
}

export default CargoTrackingDetailPage;
