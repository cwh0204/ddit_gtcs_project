import { Download, FileText } from "lucide-react";
import Badge from "../../../../style/components/Badge";
import Table from "../../../../style/components/table/Table";
import TableBody from "../../../../style/components/table/TableBody";
import TableRow from "../../../../style/components/table/TableRow";
import TableHead from "../../../../style/components/table/TableHead";
import TableCell from "../../../../style/components/table/TableCell";
import TableHeader from "../../../../style/components/table/TableHeader";
import Checkbox from "../../../../style/components/form/Checkbox";
import { attachmentsApi } from "../../../../api/attachments/attachmentsApi";

// src/pages/customs/export/components/AttachmentSection.jsx

/**
 * AttachmentSection - 첨부파일 섹션 (수출용)
 * ⭐ needsReview=true일 때 인보이스, 패킹리스트, B/L, 기타첨부 각각 체크박스
 * ✅ 수입 페이지와 동일한 패턴
 */
function AttachmentSection({ essentialFiles, fileList, needsReview, checklist, onCheckChange }) {
  const getStatusBadge = (status) => {
    const variants = {
      등록: "default",
      검토중: "warning",
      승인: "success",
      반려: "danger",
    };
    return variants[status] || "default";
  };

  // ⭐ 실제 백엔드 API 호출
  const handleDownload = async (file) => {
    if (!file || !file.fileId) {
      alert("다운로드할 수 있는 파일이 없습니다.");
      return;
    }

    try {
      await attachmentsApi.download(file.fileId, file.name || file.fileName);
    } catch (error) {
      // 에러는 attachmentsApi에서 처리됨
      console.error("Download error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========== 필수 증빙 서류 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">필수 증빙 서류</h3>

        <Table>
          <TableBody>
            {/* ⭐ 인보이스 */}
            <TableRow>
              <TableHead className="w-[20%] bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-invoice" checked={checklist?.invoice || false} onChange={() => onCheckChange("invoice")} />}
                  <span>인보이스(Invoice)</span>
                </div>
              </TableHead>
              <TableCell>
                {essentialFiles?.invoice ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{essentialFiles.invoice.name || essentialFiles.invoice.fileName}</div>
                      <div className="text-xs text-gray-500">
                        {essentialFiles.invoice.fileSize && `${essentialFiles.invoice.fileSize} · `}
                        {essentialFiles.invoice.uploadDate}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(essentialFiles.invoice)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Download className="h-4 w-4" />
                      다운로드
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">파일 없음</span>
                )}
              </TableCell>
            </TableRow>

            {/* ⭐ 패킹리스트 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && (
                    <Checkbox id="check-packingList" checked={checklist?.packingList || false} onChange={() => onCheckChange("packingList")} />
                  )}
                  <span>패킹리스트(Packing List)</span>
                </div>
              </TableHead>
              <TableCell>
                {essentialFiles?.packingList ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {essentialFiles.packingList.name || essentialFiles.packingList.fileName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {essentialFiles.packingList.fileSize && `${essentialFiles.packingList.fileSize} · `}
                        {essentialFiles.packingList.uploadDate}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(essentialFiles.packingList)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Download className="h-4 w-4" />
                      다운로드
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">파일 없음</span>
                )}
              </TableCell>
            </TableRow>

            {/* ⭐ 선하증권 */}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <div className="flex items-center gap-2">
                  {needsReview && <Checkbox id="check-bl" checked={checklist?.bl || false} onChange={() => onCheckChange("bl")} />}
                  <span>선하증권(B/L)</span>
                </div>
              </TableHead>
              <TableCell>
                {essentialFiles?.bl ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{essentialFiles.bl.name || essentialFiles.bl.fileName}</div>
                      <div className="text-xs text-gray-500">
                        {essentialFiles.bl.fileSize && `${essentialFiles.bl.fileSize} · `}
                        {essentialFiles.bl.uploadDate}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(essentialFiles.bl)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Download className="h-4 w-4" />
                      다운로드
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">파일 없음</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ========== 기타 첨부파일 ========== */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2">
          <div className="flex items-center gap-3">
            <span>기타 첨부파일 (다중 업로드 가능)</span>
            {/* ⭐ 기타 첨부파일 전체 체크박스 */}
            {needsReview && (
              <Checkbox
                id="check-otherFiles"
                label="기타 첨부파일 확인"
                checked={checklist?.otherFiles || false}
                onChange={() => onCheckChange("otherFiles")}
              />
            )}
          </div>
        </h3>

        {fileList && fileList.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">No</TableHead>
                <TableHead className="w-[100px] text-center">란번호</TableHead>
                <TableHead className="w-[120px]">파일형식</TableHead>
                <TableHead>첨부파일</TableHead>
                <TableHead className="w-[100px] text-center">상태</TableHead>
                <TableHead className="w-[120px] text-center">다운로드</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileList.map((file, index) => (
                <TableRow key={file.fileId || file.no || index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{file.lanNo || "-"}</TableCell>
                  <TableCell>{file.type || file.fileType || "-"}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{file.name || file.fileName}</div>
                      <div className="text-xs text-gray-500">
                        {file.fileSize && `${file.fileSize} · `}
                        {file.uploadDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {file.status ? <Badge variant={getStatusBadge(file.status)}>{file.status}</Badge> : <Badge variant="default">등록</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleDownload(file)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      다운로드
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded bg-gray-50">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">등록된 기타 첨부파일이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttachmentSection;
