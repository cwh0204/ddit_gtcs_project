/**
 * 공지사항 등록/수정 - axios + async/await + JWT 방식
 */

// 파일들을 관리할 배열
let fileBuffer = []; 

// JWT 토큰 디코딩 함수
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
        console.error('JWT 파싱 실패:', e);
        return null;
    }
}

// 페이지 로드 시 JWT에서 작성자 정보 가져오기
window.addEventListener('DOMContentLoaded', function() {
    // localStorage에서 accessToken으로 토큰 가져오기
    const token = localStorage.getItem('accessToken');
    
    if (token) {
        const payload = parseJwt(token);
        if (payload && payload.realUser) {
            // 작성자 입력칸에 로그인 ID 자동 표시
            const bdWriterInput = document.querySelector('#bdWriter');
            if (bdWriterInput) {
                bdWriterInput.value = payload.realUser.memName; 
            }
        }
    } else {
        console.warn('토큰이 없습니다.');
    }
});

// 1. 파일 선택 시 호출 (파일 추가)
function handleFileSelect(inputElement) {
    const files = inputElement.files;

    if (files != null && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            fileBuffer.push(files[i]);
        }
        updateFileInputAndRender();
    }
    
    inputElement.value = ""; 
}

// 2. 개별 파일 삭제
function removeFile(targetIndex) {
    fileBuffer.splice(targetIndex, 1);
    updateFileInputAndRender();
}

// 3. 배열 내용을 실제 input 태그와 동기화
function updateFileInputAndRender() {
    const dataTransfer = new DataTransfer();

    fileBuffer.forEach(file => {
        dataTransfer.items.add(file);
    });

    document.querySelector('#fileInput').files = dataTransfer.files;
    renderFileList();
}

// 4. 화면 그리기
function renderFileList() {
    const listContainer = document.querySelector('#newFileList');
    listContainer.innerHTML = "";

    if (fileBuffer.length === 0) {
        return; 
    }

    fileBuffer.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'selected-file-item';
        
        div.innerHTML = 
            '<span>' +
                '<i class="fas fa-paperclip" style="color:#aaa; margin-right:5px;"></i> ' +
                file.name + ' ' +
                '<span style="color:#999; font-size:11px;">(' + formatBytes(file.size) + ')</span>' +
            '</span>' +
            '<button type="button" class="btn-file-remove" onclick="removeFile(' + index + ')">' +
                '<i class="fas fa-times"></i>' +
            '</button>';
            
        listContainer.appendChild(div);
    });
}

// 용량 포맷팅 헬퍼
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 5. axios + async/await 방식으로 폼 전송
document.querySelector('#writeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.querySelector('input[name="bdTitle"]').value;
    const content = document.querySelector('textarea[name="bdCont"]').value;
    const bdType = document.querySelector('input[name="bdType"]').value;
    const bdSecyn = document.querySelector('input[name="bdSecyn"]').value;
    
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!content.trim()) { alert('내용을 입력해주세요.'); return; }
    if (!confirm('공지사항을 등록하시겠습니까?')) return;
    
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            location.href = '/login';
            return;
        }
        
        const formData = new FormData();
        formData.append('bdType', bdType);
        formData.append('bdTitle', title);
        formData.append('bdCont', content);
        formData.append('bdSecyn', bdSecyn);
        
        fileBuffer.forEach((file, index) => {
            formData.append('file_' + index, file);
        });
        
        const response = await axios.post('/rest/board/create', formData, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.data === 'success') {
            alert('등록되었습니다.');
            location.href = '/client/information/notice/noticelist';
        } else {
            alert('등록에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 401) {
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            location.href = '/login';
        } else {
            alert('오류가 발생했습니다.');
        }
    }
});