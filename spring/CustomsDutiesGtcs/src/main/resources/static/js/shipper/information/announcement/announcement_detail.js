let isEditMode = false;
let currentBoard = null;
let fileBuffer = [];
let deleteFileIds = [];

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
        `<div style="margin:4px 0;">
            📎 ${file.name}
            <button type="button" onclick="removeNewFile(${index})" 
                style="margin-left:8px; color:red; border:none; background:none; cursor:pointer;">x</button>
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
        const response = await axios.delete("/delete/"+fileId);
        currentBoard = response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            alert('삭제실패');
        } else {
            alert('삭제실패');
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bdId = urlParams.get('bdId');
    if (!bdId) {
        alert('게시글 번호가 없습니다.');
        location.href = '/client/information/announcement/announcement_list';
        return;
    }
    await loadBoardDetail(bdId);
});

async function loadBoardDetail(bdId) {
    try {
        const response = await axios.get(`/rest/board/detail?bdId=${bdId}`);
        currentBoard = response.data;
        displayBoardDetail(currentBoard);
    } catch (error) {
        console.error('상세 조회 실패:', error);
        if (error.response?.status === 404) {
            alert('게시글을 찾을 수 없습니다.');
            location.href = '/client/information/announcement/announcement_list';
        } else {
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }
}

function displayBoardDetail(board) {
	const token = localStorage.getItem('accessToken');
	const btnGroup = document.querySelector('#btnGroup');
	if(token) {
		const payload = parseJwt(token);
		const myName = payload?.realUser?.memName;
		if(myName && myName === board.bdWriter) {
			btnGroup.style.display = 'block';
		} else {
			btnGroup.style.display = 'none';
		}
	} else {
		btnGroup.style.display = 'none;'
	}
	
    if (isEditMode) {
        document.querySelector('#bdTitle').innerHTML =
            `<input type="text" class="input-text" id="editTitle" value="${board.bdTitle || ''}" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">`;

        document.querySelector('#bdWriter').textContent = board.bdWriter || '';
        document.querySelector('#bdRegdate').textContent = board.bdRegdate || '';
        document.querySelector('#bdViewcnt').textContent = board.bdViewcnt || '0';
        document.querySelector('#bdModdate').textContent = board.bdModdate || '-';

       let fileHtml = `
    <input type="file" id="fileInput" multiple style="display:none;" onchange="handleFileSelect(this)">
    <button type="button" onclick="document.querySelector('#fileInput').click()"
        style="margin-bottom:8px; padding:5px 10px; cursor:pointer;">+ 파일 추가</button>
    <div id="newFileList" style="margin-bottom:8px;"></div>
`;
if (board.fileList && board.fileList.length > 0) {
    fileHtml += board.fileList.map(file =>
        `<div id="file_${file.fileId}" style="margin:4px 0;">
            <a href="/download/${file.fileId}" class="file-link">${file.fileName}</a>
            <button type="button" onclick="removeExistingFile('${file.fileId}')"
                style="margin-left:8px; color:red; border:none; background:none; cursor:pointer;">x</button>
        </div>`
    ).join('');
}
document.querySelector('#fileList').innerHTML = fileHtml;

        document.querySelector('#bdCont').innerHTML =
            `<textarea id="editCont" style="width: 100%; min-height: 400px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; line-height: 1.8; font-size: 13px;">${board.bdCont || ''}</textarea>`;

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

        document.querySelector('#bdCont').textContent = board.bdCont || '';
    }
}

document.querySelector('.detail-btn.delete').addEventListener('click', async () => {
    if (isEditMode) {
        if (confirm('수정을 취소하시겠습니까?')) {
            isEditMode = false;
            fileBuffer = [];
            deleteFileIds = [];
            displayBoardDetail(currentBoard);
            document.querySelector('.detail-btn.edit').textContent = '수정';
            document.querySelector('.detail-btn.delete').textContent = '삭제';
        }
        return;
    }

    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const bdId = urlParams.get('bdId');
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            location.href = '/login';
            return;
        }
        const response = await axios.delete(`/rest/board/delete?bdId=${bdId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data === 'Y') {
            alert('삭제되었습니다.');
            location.href = '/client/information/announcement/announcement_list';
        } else {
            alert('삭제 권한이 없습니다.');
        }
    } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
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
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            location.href = '/login';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const bdId = urlParams.get('bdId');
        const updatedTitle = document.querySelector('#editTitle').value;
        const updatedContent = document.querySelector('#editCont').value;

        if (!updatedTitle.trim()) { alert('제목을 입력해주세요.'); return; }
        if (!updatedContent.trim()) { alert('내용을 입력해주세요.'); return; }

        const formData = new FormData();
        formData.append('bdId', bdId);
		formData.append('bdTitle', updatedTitle);
		formData.append('bdCont', updatedContent);

        fileBuffer.forEach((file, index) => {
	    formData.append('file_' + (Date.now() + index), file);
	});
        const response = await axios.put('/rest/board/modify', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data === 'Y') {
            alert('수정되었습니다.');
            isEditMode = false;
            fileBuffer = [];
            deleteFileIds = [];
            await loadBoardDetail(bdId);
            document.querySelector('.detail-btn.edit').textContent = '수정';
            document.querySelector('.detail-btn.delete').textContent = '삭제';
        } else {
            alert('수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('수정 실패:', error);
        alert('수정 중 서버 오류가 발생했습니다.');
    }
}