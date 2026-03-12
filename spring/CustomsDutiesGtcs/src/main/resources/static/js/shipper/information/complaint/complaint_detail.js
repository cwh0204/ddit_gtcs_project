/**
 * 민원사항 상세 조회
 */

let isEditMode = false;
let currentBoard = null;
let fileBuffer = [];
let deleteFileIds = [];

const swalConfig = {
	scrollbarPadding: false, 
	heightAuto: false,
    width: '400px',
    padding: '1.5rem',
    confirmButtonColor: '#0f4c81'
};

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// 공통 함수
function getToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '로그인 필요',
            text: '로그인이 필요합니다.'
        }).then(() => {
            location.href = '/login';
        });
        return null;
    }
    return token;
}

function getBdId() {
    return new URLSearchParams(window.location.search).get('bdId');
}

function handleFileSelect(input) {
	const files = input.files;
	for (let i = 0; i < files.length; i++) {
		fileBuffer.push(files[i]);
	}
	input.value = '';
	renderNewFileList();
}

function renderNewFileList() {
    const container = document.querySelector('#newFileList');
    if (!container) return;
    container.innerHTML = fileBuffer.map((file, index) =>
        `<div style="display: flex; align-items: center;">
            <a class="file-link" style="margin-right: 10px;">${file.name}</a>
            <button type="button" onclick="removeNewFile(${index})"
                style="color:red; border:none; background:none; cursor:pointer;">x</button>
        </div>`
    ).join('');
}

function removeNewFile(index) {
	fileBuffer.splice(index, 1);
	renderNewFileList();
}

async function removeExistingFile(fileId) {
	deleteFileIds.push(fileId);
	document.querySelector('#file_' + fileId).remove();
	try {
        const response = await axios.delete("/delete/" + fileId);
        currentBoard = response.data;
    } catch (error) {
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '삭제 실패',
            text: '파일 삭제에 실패했습니다.'
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const bdId = getBdId();

    if (!bdId) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '잘못된 접근',
            text: '게시글 번호가 없습니다.'
        }).then(() => {
            location.href = '/client/information/complaint/complaint_list';
        });
        return;
    }

    await loadBoardDetail(bdId);
    await loadCommentList(bdId);
});

async function loadBoardDetail(bdId) {
    try {
        const response = await axios.get(`/rest/board/detail?bdId=${bdId}`);
        currentBoard = response.data;
        displayBoardDetail(currentBoard);
    } catch (error) {
        console.error('상세 조회 실패:', error);
        if (error.response?.status === 404) {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '게시글 없음',
                text: '게시글을 찾을 수 없습니다.'
            }).then(() => {
                location.href = '/client/information/complaint/complaint_list';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '오류 발생',
                text: '게시글을 불러오는 중 오류가 발생했습니다.'
            });
        }
    }
}

function cleanCont(cont) {
    return (cont || '').replace(/\|\|PWD:\d{4}$/, '');
}

function displayBoardDetail(board) {
	const token = localStorage.getItem('accessToken');
    const btnGroup = document.querySelector('#btn-edit-group');
    if (token) {
        const payload = parseJwt(token);
        const myName = payload?.realUser?.memName;
        if (myName && myName === board.bdWriter) {
            btnGroup.style.display = 'block';
        } else {
            btnGroup.style.display = 'none';
        }
    } else {
        btnGroup.style.display = 'none';
    }
    
    if (board.fileList && board.fileList.length > 0) {
        const fileListHtml = board.fileList.map(file =>
            `<a href="/download/${file.id}" class="file-link">${file.fileName}</a>`
        ).join('');
        document.querySelector('#fileList').innerHTML = fileListHtml;
    } else {
        document.querySelector('#fileList').innerHTML = '<span style="color: #999;">첨부파일 없음</span>';
    }

    if (isEditMode) {
        document.querySelector('#bdTitle').innerHTML =
            `<input type="text" class="input-text" id="editTitle" value="${board.bdTitle || ''}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">`;
        document.querySelector('#bdWriter').textContent = board.bdWriter || '';
        document.querySelector('#bdRegdate').textContent = board.bdRegdate || '';
        document.querySelector('#bdViewcnt').textContent = board.bdViewcnt || '0';
        document.querySelector('#bdModdate').textContent = board.bdModdate || '-';
        
let fileHtml = `
    <div style="display: flex; flex-direction: column; gap: 8px;">
        <div>
            <input type="file" id="fileInput" multiple style="display:none;" onchange="handleFileSelect(this)">
            <button type="button" class="btn-file-add" onclick="document.querySelector('#fileInput').click()">+ 파일 추가</button>
        </div>
        <div id="newFileList" style="display: flex; flex-direction: column; gap: 5px;"></div>`;

// 기존 파일
if (board.fileList && board.fileList.length > 0) {
    fileHtml += board.fileList.map(file =>
        `<div id="file_${file.fileId}" style="display: flex; align-items: center;">
            <a href="/download/${file.fileId}" class="file-link" style="margin-right: 10px;">${file.fileName}</a>
            <button type="button" onclick="removeExistingFile('${file.fileId}')"
                style="color:red; border:none; background:none; cursor:pointer;">x</button>
        </div>`
    ).join('');
}

fileHtml += `</div>`;

document.querySelector('#fileList').innerHTML = fileHtml;
        
        
        
        
        const cont = cleanCont(board.bdCont);
        document.querySelector('#bdCont').innerHTML =
            `<textarea id="editCont" style="width: 100%; min-height: 400px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; line-height: 1.8; font-size: 13px;">${cont}</textarea>`;
    } else {
        document.querySelector('#bdTitle').textContent = board.bdTitle || '';
        document.querySelector('#bdWriter').textContent = board.bdWriter || '';
        document.querySelector('#bdRegdate').textContent = board.bdRegdate || '';
        document.querySelector('#bdViewcnt').textContent = board.bdViewcnt || '0';
        document.querySelector('#bdModdate').textContent = board.bdModdate || '-';
       if (board.fileList && board.fileList.length > 0) {
            const fileListHtml = board.fileList.map(file =>
                `<a href="/download/${file.fileId}" class="file-link">${file.fileName}</a>`
            ).join('');
            document.querySelector('#fileList').innerHTML = fileListHtml;
        } else {
            document.querySelector('#fileList').innerHTML = '<span style="color: #999;">첨부파일 없음</span>';
        }

        document.querySelector('#bdCont').textContent = cleanCont(board.bdCont);
    }
}







document.querySelector('.detail-btn.delete').addEventListener('click', async () => {
    if (isEditMode) {
     
            isEditMode = false;
            fileBuffer = [];
            deleteFileIds = [];
            displayBoardDetail(currentBoard);
            document.querySelector('.detail-btn.edit').textContent = '수정';
            document.querySelector('.detail-btn.delete').textContent = '삭제';     
        return;
    }

const confirmResult = await Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: '확인',
        text: '정말 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
    });
    
if (!confirmResult.isConfirmed) return;
    const token = getToken();
    if (!token) return;

    try {
        const response = await axios.delete(`/rest/board/delete?bdId=${getBdId()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('삭제 응답:', response.data);

        if (response.data === 'Y') {
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: '완료',
                text: '삭제되었습니다.'
            }).then(() => {
                location.href = '/client/information/complaint/complaint_list';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '권한 없음',
                text: '삭제 권한이 없습니다.'
            });
        }
    } catch (error) {
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '삭제 오류',
            text: '삭제 중 오류가 발생했습니다.'
        });
    }
});

document.querySelector('.detail-btn.edit').addEventListener('click', () => {
    if (!isEditMode) {
        isEditMode = true;
        displayBoardDetail(currentBoard);
        document.querySelector('.detail-btn.edit').textContent = '저장';
        document.querySelector('.detail-btn.delete').textContent = '취소';
    } else {
        saveBoard();
    }
});

async function saveBoard() {
    const token = getToken();
    if (!token) return;

    const bdId = getBdId();
    const updatedTitle = document.querySelector('#editTitle').value;
    const updatedContent = document.querySelector('#editCont').value;

    if (!updatedTitle.trim()) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '제목을 입력해주세요.'
        });
        return;
    }
    
    if (!updatedContent.trim()) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '내용을 입력해주세요.'
        });
        return;
    }

    const match = (currentBoard.bdCont || '').match(/\|\|PWD:(\d{4})$/);
    const packedCont = match ? updatedContent + '||PWD:' + match[1] : updatedContent;

    try {
        const formData = new FormData();
        formData.append('bdId', bdId);
        formData.append('bdTitle', updatedTitle);
        formData.append('bdCont', packedCont);

        fileBuffer.forEach((file, index) => {
	    formData.append('file_' + (Date.now() + index), file);
	});

        const response = await axios.put('/rest/board/modify', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data === 'Y') {
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: '완료',
                text: '수정되었습니다.'
            }).then(async () => {
                isEditMode = false;
                fileBuffer = [];
                deleteFileIds = [];
                await loadBoardDetail(bdId);
                document.querySelector('.detail-btn.edit').textContent = '수정';
                document.querySelector('.detail-btn.delete').textContent = '삭제';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '수정 실패',
                text: '수정에 실패했습니다.'
            });
        }
    } catch (error) {
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '서버 오류',
            text: '수정 중 서버 오류가 발생했습니다.'
        });
    }
}

/* =============================================
   댓글 관련
   ============================================= */

async function loadCommentList(bdId) {
    try {
        const response = await axios.get(`/rest/comment/cmtList?bdId=${bdId}`);
        renderCommentList(response.data);
    } catch (error) {
        console.error('댓글 조회 실패:', error);
    }
}

function renderCommentList(comments) {
    const commentList = document.querySelector('#commentList');
    if (!comments || comments.length === 0) {
        commentList.innerHTML = '<div style="padding:20px 0; color:#999; font-size:13px; text-align:center;">등록된 댓글이 없습니다.</div>';
        return;
    }
    
    const token = localStorage.getItem('accessToken');
    const payload = token ? parseJwt(token) : null;
    const myName = payload?.realUser?.memName;

    let html = '';
    comments.forEach(comment => {
		const isMyComment = myName && myName === comment.reWriter;
        html += `
            <div class="comment-item" data-cmt-id="${comment.reId}">
                <div class="comment-header">
                    <div>
                        <span class="comment-writer">${comment.reWriter}</span>
                        <span class="comment-date">${comment.reRegdate || ''}</span>
                    </div>
                    <div class="comment-actions" id="cmtActions-${comment.reId}">
                        <a id="cmtSaveLink-${comment.reId}"   onclick="saveEditComment(${comment.reId})"   style="display:none;">저장</a>
                        <a id="cmtCancelLink-${comment.reId}" onclick="cancelEditComment(${comment.reId})" style="display:none;">취소</a>
                        ${isMyComment ? `<a id="cmtEditLink-${comment.reId}" onclick="startEditComment(${comment.reId})">수정</a>` : ''}
                        ${isMyComment ? `<a onclick="deleteComment(${comment.reId})">삭제</a>` : ''}
                    </div>
                </div>
                
                
                <div class="comment-body" id="cmtBody-${comment.reId}">${comment.reContent}</div>
                <div class="comment-edit-wrap" id="cmtEditWrap-${comment.reId}" style="display:none;">
                    <div class="comment-input-wrap" style="margin-top:8px; margin-bottom:0;">
                        <textarea id="cmtEditInput-${comment.reId}" rows="3">${comment.reContent}</textarea>
                    </div>
                </div>
            </div>
        `;
    });
    commentList.innerHTML = html;
}

function startEditComment(reId) {
    document.querySelector(`#cmtBody-${reId}`).style.display     = 'none';
    document.querySelector(`#cmtEditWrap-${reId}`).style.display = 'block';
    document.querySelector(`#cmtEditLink-${reId}`).style.display = 'none';
    document.querySelector(`#cmtSaveLink-${reId}`).style.display = 'inline';
    document.querySelector(`#cmtCancelLink-${reId}`).style.display = 'inline';
    document.querySelector(`#cmtEditInput-${reId}`).focus();
}

function cancelEditComment(reId) {
    document.querySelector(`#cmtBody-${reId}`).style.display     = 'block';
    document.querySelector(`#cmtEditWrap-${reId}`).style.display = 'none';
    document.querySelector(`#cmtEditLink-${reId}`).style.display = 'inline';
    document.querySelector(`#cmtSaveLink-${reId}`).style.display = 'none';
    document.querySelector(`#cmtCancelLink-${reId}`).style.display = 'none';
}

async function saveEditComment(reId) {
    const token   = getToken();
    if (!token) return;

    const content = document.querySelector(`#cmtEditInput-${reId}`).value.trim();
    if (!content) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '내용을 입력해주세요.'
        });
        return;
    }

    try {
		const reWriter = document.querySelector(`#cmtActions-${reId}`)
		                 .closest('.comment-item')
						 .querySelector('.comment-writer').textContent;
						 
        const response = await axios.put('/rest/comment/cmtModify', {
            reId      : reId,
            reContent : content,
			reWriter : reWriter
        }, {
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type'  : 'application/json'
            }
        });

        if (response.data === 'Y') {
            await loadCommentList(getBdId());
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '수정 실패',
                text: '댓글 수정에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('댓글 수정 실패:', error);
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '오류 발생',
            text: '댓글 수정 중 오류가 발생했습니다.'
        });
    }
}

async function deleteComment(reId) {
    const confirmResult = await Swal.fire({
        ...swalConfig,
        icon: 'question',
        title: '확인',
        text: '댓글을 삭제하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
    });

    if (!confirmResult.isConfirmed) return;

    const token = getToken();
    if (!token) return;

    try {
        const response = await axios.delete(`/rest/comment/cmtDelete?reId=${reId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data === 'Y') {
            await loadCommentList(getBdId());
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '권한 없음',
                text: '댓글 삭제 권한이 없습니다.'
            });
        }
    } catch (error) {
        console.error('댓글 삭제 실패:', error);
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '오류 발생',
            text: '댓글 삭제 중 오류가 발생했습니다.'
        });
    }
}

document.querySelector('#commentSubmitBtn').addEventListener('click', async () => {
    const bdId    = getBdId();
    const content = document.querySelector('#commentInput').value.trim();
    const token   = getToken();
    if (!token) return;

    if (!content) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '댓글을 작성해주세요.'
        });
        return;
    }

    try {
        const response = await axios.post('/rest/comment/createCmt', {
            bdId      : parseInt(bdId),
            reContent : content,
            parentId  : null
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data === 'Y') {
            document.querySelector('#commentInput').value = '';
            await loadCommentList(bdId);
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '등록 실패',
                text: '댓글 등록에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('댓글 등록 실패:', error);
        Swal.fire({
            ...swalConfig,
            icon: 'error',
            title: '오류 발생',
            text: '댓글 등록 중 오류가 발생했습니다.'
        });
    }
});