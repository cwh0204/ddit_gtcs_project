/**
 * G-TCS 파일 미리보기 통합 매니저 (최종 통합본 - 메모리 해제 포함)
 */
const FilePreviewer = {
    currentBlobUrl: null, // 현재 사용 중인 메모리 주소를 저장하는 변수

    // 사용이 끝난 메모리(Blob) 주소를 파기하는 함수
    revokeOldUrl: function() {
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
            this.currentBlobUrl = null;
            console.log("이전 미리보기 메모리가 해제되었습니다.");
        }
    },

    // 모달을 닫을 때 호출할 함수
    close: function() {
        const modal = document.getElementById('preview-modal');
        if (modal) modal.style.display = 'none';
        this.revokeOldUrl(); // 닫을 때 메모리도 같이 날림
    },

    // preview.js 내 open 함수
	open: function(input) {
	    this.revokeOldUrl();
	    if (!input || !input.files || !input.files[0]) return;
	    
	    const file = input.files[0];
	    this.initModal();
	    const modal = document.getElementById('preview-modal');
	    const previewBody = document.getElementById('preview-body');
	    const previewTitle = document.getElementById('preview-title');
	    
	    previewTitle.textContent = "미리보기: " + file.name;
	    modal.style.display = 'block';
	
	    // 작성 페이지(로컬)에서도 PDF는 Blob URL 방식을 써야 iframe에 뜹니다.
	    if (file.type === 'application/pdf') {
	        this.currentBlobUrl = URL.createObjectURL(file);
	        previewBody.innerHTML = '<iframe src="' + this.currentBlobUrl + '" style="width:100%; height:100%; border:none;"></iframe>';
	    } else if (file.type.startsWith('image/')) {
	        const reader = new FileReader();
	        reader.onload = e => previewBody.innerHTML = '<img src="' + e.target.result + '" style="max-width:100%; max-height:100%; object-fit:contain;">';
	        reader.readAsDataURL(file);
	    } else {
	        previewBody.innerHTML = '<div style="padding:40px; text-align:center;">미리보기를 지원하지 않는 형식입니다.</div>';
	    }
	},

    // 2. [상세 페이지용] 서버에 이미 저장된 파일 미리보기
    openById: async function(fileId, fileName) {
        if (!fileId) return;
        this.revokeOldUrl(); // 실행 시 이전 메모리부터 정리
        
        this.initModal();
        const modal = document.getElementById('preview-modal');
        const previewBody = document.getElementById('preview-body');
        const previewTitle = document.getElementById('preview-title');
        
        previewTitle.textContent = "조회 중: " + fileName;
        modal.style.display = 'block';
        previewBody.innerHTML = '<div style="padding:20px; text-align:center;"><i class="fas fa-spinner fa-spin"></i> 파일을 불러오는 중입니다...</div>';

        try {
            const response = await fetch("/download/" + fileId);
            if (!response.ok) throw new Error("파일을 불러오지 못했습니다.");
            
            const blob = await response.blob();
            const ext = fileName.split('.').pop().toLowerCase();
            let mimeType = blob.type;
            if (ext === 'pdf') mimeType = 'application/pdf';
            else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) mimeType = 'image/' + (ext === 'jpg' ? 'jpeg' : ext);

            const safeBlob = new Blob([blob], { type: mimeType });
            this.currentBlobUrl = URL.createObjectURL(safeBlob); // 주소 저장

            previewTitle.textContent = "미리보기: " + fileName;
            if (mimeType.startsWith('image/')) {
                previewBody.innerHTML = '<img src="' + this.currentBlobUrl + '" style="max-width:100%; max-height:100%; object-fit:contain;">';
            } else if (mimeType === 'application/pdf') {
                previewBody.innerHTML = '<iframe src="' + this.currentBlobUrl + '" style="width:100%; height:100%; border:none;"></iframe>';
            } else {
                previewBody.innerHTML = '<div style="padding:40px; text-align:center;"><p>미리보기를 지원하지 않는 형식입니다.</p><br><a href="' + this.currentBlobUrl + '" download="' + fileName + '" class="btn-lookup">파일 직접 다운로드</a></div>';
            }
        } catch (error) {
            console.error("Preview Error:", error);
            previewBody.innerHTML = '<div style="padding:20px; color:red;">파일을 미리보기 할 수 없습니다.</div>';
        }
    },

    initModal: function() {
        if (document.getElementById('preview-modal')) return;
        const modalHtml = 
            '<div id="preview-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:20000;">' +
                '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:85%; height:85%; background:#fff; border-radius:8px; display:flex; flex-direction:column; overflow:hidden;">' +
                    '<div style="padding:15px 20px; background:#0f4c81; color:#fff; display:flex; justify-content:space-between; align-items:center;">' +
                        '<span id="preview-title" style="font-weight:600; font-size:16px;"></span>' +
                        // 닫기 버튼을 FilePreviewer.close() 호출로 설정
                        '<button type="button" onclick="FilePreviewer.close()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>' +
                    '</div>' +
                    '<div id="preview-body" style="flex:1; background:#f4f4f4; overflow:hidden; display:flex; justify-content:center; align-items:center;"></div>' +
                '</div>' +
            '</div>';
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};

// 작성 페이지 전용 자동 연결 로직 추가
// FileManager가 있으면(작성 페이지) updateEssentialFile 함수가 실행될 때 미리보기 버튼을 활성화
if (typeof FileManager !== 'undefined') {
    const originalUpdate = FileManager.updateEssentialFile;
    FileManager.updateEssentialFile = function(input, displayId) {
        if (typeof originalUpdate === 'function') originalUpdate(input, displayId);
        
        const previewBtn = document.getElementById('preview-' + input.id);
        if (previewBtn) {
            if (input.files && input.files[0]) {
                previewBtn.style.display = 'inline-block';
                previewBtn.onclick = function() { FilePreviewer.open(input); };
            } else {
                previewBtn.style.display = 'none';
            }
        }
    };
}
