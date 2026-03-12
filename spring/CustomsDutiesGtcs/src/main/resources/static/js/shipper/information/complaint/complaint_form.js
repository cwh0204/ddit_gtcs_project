/**
 * 민원사항 등록/수정 - axios + async/await + JWT 방식
 */

let fileBuffer = [];

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
        console.error('JWT 파싱 실패:', e);
        return null;
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        const payload = parseJwt(token);
        if (payload && payload.realUser) {
            const bdWriterInput = document.querySelector('#bdWriter');
            if (bdWriterInput) {
                bdWriterInput.value = payload.realUser.memName;
            }
        }
    }
});

function toggleSecret(radio) {
    const pwInput = document.querySelector('#bdPwd');
    const bdSecyn = document.querySelector('#bdSecyn');

    if (radio.value === 'Y') {
        pwInput.disabled = false;
        pwInput.focus();
        bdSecyn.value = 'Y';
    } else {
        pwInput.disabled = true;
        pwInput.value = '';
        bdSecyn.value = 'N';
    }
}

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

function removeFile(targetIndex) {
    fileBuffer.splice(targetIndex, 1);
    updateFileInputAndRender();
}

function updateFileInputAndRender() {
    const dataTransfer = new DataTransfer();
    fileBuffer.forEach(file => dataTransfer.items.add(file));
    document.querySelector('#fileInput').files = dataTransfer.files;
    renderFileList();
}

function renderFileList() {
    const listContainer = document.querySelector('#newFileList');
    listContainer.innerHTML = "";
    if (fileBuffer.length === 0) return;

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

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

document.querySelector('#writeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const title    = document.querySelector('input[name="bdTitle"]').value;
    const content  = document.querySelector('textarea[name="bdCont"]').value;
    const bdType   = document.querySelector('input[name="bdType"]').value;
    const bdSecyn  = document.querySelector('#bdSecyn').value;
    const isSecret = bdSecyn === 'Y';
    const bdPwd    = document.querySelector('#bdPwd').value;

    if (!title.trim()) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '제목을 입력해주세요.'
        });
        return;
    }
    
    if (!content.trim()) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '내용을 입력해주세요.'
        });
        return;
    }

    if (isSecret && bdPwd.length !== 4) {
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '비밀번호 오류',
            text: '비밀번호 숫자 4자리를 입력해주세요.'
        }).then(() => {
            document.querySelector('#bdPwd').focus();
        });
        return;
    }

    const confirmResult = await Swal.fire({
        ...swalConfig,
        icon: 'question',
        title: '확인',
        text: '민원사항을 등록하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
    });

    if (!confirmResult.isConfirmed) return;

    try {
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
            return;
        }

        const packedCont = isSecret ? content + '||PWD:' + bdPwd : content;
        
        const formData = new FormData();
        formData.append('bdType', bdType);
        formData.append('bdTitle', title);
        formData.append('bdCont', packedCont);
        formData.append('bdSecyn', isSecret ? 'Y' : 'N');
        
        if(typeof fileBuffer != 'undefined' && fileBuffer.length > 0){
			fileBuffer.forEach((file, index) => {
				formData.append(`file${index}`, file);
			});
		}
		
		const response = await axios({
			method: 'post',
			url: '/rest/board/create',
			data: formData, 
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'multipart/form-data'
			}
		});

        if (response.data === 'success') {
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: '완료',
                text: '등록되었습니다.'
            }).then(() => {
                location.href = '/client/information/complaint/complaint_list';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '등록 실패',
                text: '등록에 실패했습니다.'
            });
        }
        } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 401) {
            Swal.fire({
                ...swalConfig,
                icon: 'warning',
                title: '로그인 만료',
                text: '로그인이 만료되었습니다. 다시 로그인해주세요.'
            }).then(() => {
                location.href = '/login';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '오류 발생',
                text: '오류가 발생했습니다: ' + (error.response?.data || error.message)
            });
        }
    }
});