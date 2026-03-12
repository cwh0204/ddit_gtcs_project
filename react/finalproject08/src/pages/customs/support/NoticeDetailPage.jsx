import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit, Trash2, Loader2, AlertTriangle, Send, MessageSquare } from "lucide-react";
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
import { attachmentsApi } from "../../../api/attachments/attachmentsApi";
import { useComments } from "../../../controller/custom/board/useCommentHooks";
import { useAuth } from "../../../hooks/useAuth";
import AlertModal from "../../../style/components/AlertModal";
import { useAlertModal } from "../../../hooks/useAlertModal";

// src/pages/customs/support/NoticeDetailPage.jsx

function NoticeDetailPage({ basePath = "/customs/support/notice" }) {
  const { noticeId } = useParams();
  const navigate = useNavigate();

  const { data: notice, isLoading, error } = useBoardDetail(noticeId);
  const { deleteBoard } = useBoardMutations();
  const { user } = useAuth();
  const { alertModal, showSuccess, showError, showConfirm } = useAlertModal();

  const { comments, isLoading: commentsLoading, createComment, updateComment, deleteComment } = useComments(noticeId);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleBack = () => navigate(basePath);
  const handleEdit = () => navigate(`${basePath}/edit/${noticeId}`);

  const handleDelete = async () => {
    showConfirm("삭제 확인", "정말 삭제하시겠습니까?", async () => {
      try {
        await deleteBoard.mutateAsync(Number(noticeId));
        showSuccess("삭제 완료", "삭제되었습니다.", () => navigate(basePath));
      } catch (error) {
        showError("삭제 실패", error.message || "삭제에 실패했습니다.");
      }
    });
  };

  const handleFileDownload = (file) => {
    attachmentsApi.download(file.fileId, file.fileName);
  };

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

  if (!notice) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">공지사항을 찾을 수 없습니다.</div>
          <Button onClick={handleBack}>목록으로</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="뒤로가기">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{notice.bdType}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleteBoard.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteBoard.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">제목</span>
              </TableHead>
              <TableCell colSpan={3}>
                <span className="font-semibold text-lg">{notice.bdTitle}</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">등록자</span>
              </TableHead>
              <TableCell className="w-[35%]">{notice.bdWriter}</TableCell>
              <TableHead className="w-[15%] bg-[#f9fbff]">
                <span className="text-gray-700">등록일</span>
              </TableHead>
              <TableCell className="w-[35%]">{notice.bdRegdate}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">조회수</span>
              </TableHead>
              <TableCell>{notice.bdViewcnt}</TableCell>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">수정일</span>
              </TableHead>
              <TableCell>{notice.bdModdate || "-"}</TableCell>
            </TableRow>
            {notice.fileList && notice.fileList.length > 0 && (
              <TableRow>
                <TableHead className="bg-[#f9fbff]">
                  <span className="text-gray-700">첨부파일</span>
                </TableHead>
                <TableCell colSpan={3}>
                  <div className="space-y-2">
                    {notice.fileList.map((file) => (
                      <div key={file.fileId} className="flex items-center gap-2">
                        <button
                          onClick={() => handleFileDownload(file)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <Download className="h-4 w-4" />
                          <span>{file.fileName}</span>
                          {file.fileSize && <span className="text-gray-500 text-sm">({file.fileSize})</span>}
                        </button>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableHead className="bg-[#f9fbff]">
                <span className="text-gray-700">내용</span>
              </TableHead>
              <TableCell colSpan={3}>
                <div className="whitespace-pre-wrap min-h-[300px] p-4 bg-gray-50 rounded">{notice.bdCont}</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0f4c81]" />
            댓글 {comments?.length > 0 && <span className="text-sm font-normal text-gray-500">({comments.length})</span>}
          </h3>

          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newComment.trim()) {
                  // [수정 1] reCont → reContent
                  createComment.mutate({ bdId: Number(noticeId), reContent: newComment }, { onSuccess: () => setNewComment("") });
                }
              }}
              className="flex-1"
            />
            <Button
              size="sm"
              disabled={!newComment.trim() || createComment.isPending}
              onClick={() => {
                if (newComment.trim()) {
                  // [수정 2] reCont → reContent
                  createComment.mutate({ bdId: Number(noticeId), reContent: newComment }, { onSuccess: () => setNewComment("") });
                }
              }}
            >
              <Send className="w-4 h-4 mr-1" />
              {createComment.isPending ? "등록 중..." : "등록"}
            </Button>
          </div>

          {commentsLoading ? (
            <div className="text-center py-4 text-gray-400 text-sm">댓글 로딩 중...</div>
          ) : !comments || comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">등록된 댓글이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.reId} className="p-3 bg-gray-50 rounded-lg">
                  {editingCommentId === comment.reId ? (
                    <div className="flex gap-2">
                      <Input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)} className="flex-1" />
                      <Button
                        size="sm"
                        onClick={() => {
                          updateComment.mutate(
                            // [수정 3] reCont → reContent
                            { reId: comment.reId, reContent: editingText, reWriter: comment.reWriter },
                            {
                              onSuccess: () => {
                                setEditingCommentId(null);
                                setEditingText("");
                              },
                            },
                          );
                        }}
                        disabled={!editingText.trim()}
                      >
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingText("");
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">{comment.reWriter}</span>
                          <span className="text-xs text-gray-400">{comment.reRegdate || ""}</span>
                        </div>
                        {user?.name === comment.reWriter && (
                          <div className="flex gap-1">
                            <button
                              className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1"
                              onClick={() => {
                                setEditingCommentId(comment.reId);
                                // [수정 4] reCont → reContent
                                setEditingText(comment.reContent);
                              }}
                            >
                              수정
                            </button>
                            <button
                              className="text-xs text-gray-500 hover:text-red-600 px-2 py-1"
                              onClick={() => {
                                showConfirm("댓글 삭제", "댓글을 삭제하시겠습니까?", () => {
                                  deleteComment.mutate(comment.reId);
                                });
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                      {/* [수정 5] reCont → reContent */}
                      <p className="text-sm text-gray-700">{comment.reContent}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleBack}>
          목록으로
        </Button>
      </div>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default NoticeDetailPage;
