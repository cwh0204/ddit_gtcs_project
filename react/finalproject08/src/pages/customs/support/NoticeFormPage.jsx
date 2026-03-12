import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, File, Loader2 } from "lucide-react";
import Card from "../../../style/components/Card";
import Button from "../../../style/components/Button";
import Input from "../../../style/components/Input";
import Table from "../../../style/components/table/Table";
import TableBody from "../../../style/components/table/TableBody";
import TableRow from "../../../style/components/table/TableRow";
import TableHead from "../../../style/components/table/TableHead";
import TableCell from "../../../style/components/table/TableCell";
import { useBoardDetail } from "../../../controller/custom/board/useBoardQueries";
import { useBoardMutations } from "../../../controller/custom/board/useBoardMutations";
import { useAuth } from "../../../hooks/useAuth";
import AlertModal from "../../../style/components/AlertModal";
import { useAlertModal } from "../../../hooks/useAlertModal";

// src/pages/customs/support/NoticeFormPage.jsx

/**
 * 공지사항 등록/수정 페이지
 * ✅ API 연결 완료
 * ✅ 목 데이터 제거
 */

// bdType 매핑
const BD_TYPE_MAP = {
  notice: "공지사항",
  admin: "행정예고",
  inquiry: "민원사항",
};

function NoticeFormPage({ type = "notice", basePath = "/customs/support/notice" }) {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const isEditMode = !!noticeId;
  const { alertModal, showWarning, showSuccess, showError, showConfirm } = useAlertModal();

  const [formData, setFormData] = useState({
    bdTitle: "",
    bdCont: "",
    bdSecyn: "N",
  });

  const [newFiles, setNewFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [deleteFileIds, setDeleteFileIds] = useState([]);

  // ========== API Hooks ==========
  const { data: notice, isLoading } = useBoardDetail(noticeId);
  const { createBoard, updateBoard } = useBoardMutations();

  // ========== 수정 모드 데이터 로드 ==========
  useEffect(() => {
    if (isEditMode && notice) {
      setFormData({
        bdTitle: notice.bdTitle || "",
        bdCont: notice.bdCont || "",
        bdSecyn: notice.bdSecyn || "N",
      });
      setExistingFiles(notice.fileList || []);
    }
  }, [isEditMode, notice]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleDeleteFile = (fileId) => {
    setDeleteFileIds((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bdTitle.trim()) {
      showWarning("입력 확인", "제목을 입력해주세요.");
      return;
    }

    if (!formData.bdCont.trim()) {
      showWarning("입력 확인", "내용을 입력해주세요.");
      return;
    }

    try {
      const bdType = BD_TYPE_MAP[type];
      const submitData = {
        bdType,
        bdTitle: formData.bdTitle,
        bdCont: formData.bdCont,
        bdSecyn: formData.bdSecyn,
        files: newFiles,
      };

      if (isEditMode) {
        submitData.bdId = Number(noticeId);
        await updateBoard.mutateAsync(submitData);
        showSuccess("수정 완료", "수정되었습니다.", () => navigate(basePath));
      } else {
        await createBoard.mutateAsync(submitData);
        showSuccess("등록 완료", "등록되었습니다.", () => navigate(basePath));
      }
    } catch (error) {
      showError("처리 실패", error.message || (isEditMode ? "수정에 실패했습니다." : "등록에 실패했습니다."));
    }
  };

  const handleCancel = () => {
    showConfirm("작성 취소", "작성을 취소하시겠습니까?", () => navigate(-1));
  };

  // ========== 로딩 상태 ==========
  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0f4c81] mx-auto" />
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-screen">
      {/* ⭐ 헤더 */}
      <div className="flex items-center gap-3">
        <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="뒤로가기">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {BD_TYPE_MAP[type]} {isEditMode ? "수정" : "등록"}
        </h1>
      </div>

      {/* ⭐ 폼 */}
      <form onSubmit={handleSubmit}>
        <Card>
          <Table>
            <TableBody>
              {/* 제목 */}
              <TableRow>
                <TableHead className="w-[15%] bg-[#f9fbff]">
                  <span className="text-gray-700">
                    제목 <span className="text-red-600">*</span>
                  </span>
                </TableHead>
                <TableCell colSpan={3}>
                  <Input
                    type="text"
                    value={formData.bdTitle}
                    onChange={(e) => handleChange("bdTitle", e.target.value)}
                    placeholder="제목을 입력해주세요"
                    className="w-full"
                    required
                  />
                </TableCell>
              </TableRow>

              {/* 작성자 */}
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span className="text-gray-700">작성자</span>
                </TableHead>
                <TableCell colSpan={3}>
                  <Input type="text" value={user?.name || "관리자"} readOnly className="w-64 bg-gray-100" />
                </TableCell>
              </TableRow>

              {/* 비밀글 여부 */}
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span className="text-gray-700">비밀글 여부</span>
                </TableHead>
                <TableCell colSpan={3}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bdSecyn === "Y"}
                      onChange={(e) => handleChange("bdSecyn", e.target.checked ? "Y" : "N")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">비밀글로 설정</span>
                  </label>
                </TableCell>
              </TableRow>

              {/* 내용 */}
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span className="text-gray-700">
                    내용 <span className="text-red-600">*</span>
                  </span>
                </TableHead>
                <TableCell colSpan={3}>
                  <textarea
                    value={formData.bdCont}
                    onChange={(e) => handleChange("bdCont", e.target.value)}
                    placeholder="내용을 입력해주세요"
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </TableCell>
              </TableRow>

              {/* 첨부파일 */}
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span className="text-gray-700">첨부파일</span>
                </TableHead>
                <TableCell colSpan={3}>
                  <div className="space-y-4">
                    {/* 파일 추가 버튼 */}
                    <div>
                      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        파일 추가
                      </Button>
                      <span className="ml-2 text-sm text-gray-500">최대 10MB</span>
                    </div>

                    {/* 새로 추가된 파일 */}
                    {newFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">[추가된 파일]</p>
                        {newFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveNewFile(index)} className="p-1 hover:bg-blue-100 rounded">
                              <X className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 기존 파일 (수정 모드) */}
                    {isEditMode && existingFiles.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700">[저장된 파일]</p>
                        {existingFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4 text-gray-600" />
                              <span className="text-sm">{file.fileName}</span>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={deleteFileIds.includes(file.id)}
                                onChange={() => handleToggleDeleteFile(file.id)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-red-600">삭제</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* ⭐ 버튼 */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" disabled={createBoard.isPending || updateBoard.isPending}>
            {createBoard.isPending || updateBoard.isPending ? "처리 중..." : isEditMode ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </form>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default NoticeFormPage;
