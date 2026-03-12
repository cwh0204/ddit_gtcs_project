/**
 * G-TCS 파일 미리보기 통합 매니저
 */
const FilePreviewer = {
    // 미리보기 실행
    open: function(input) {
        if (!input.files || !input.files[0]) return;
        
        const file = input.files[0];
        const reader = new FileReader();
        
        // 모달 생성 및 초기화 로직 (없으면 생성)
        this.initModal();
        const modal = document.getElementById('preview-modal');
        const previewBody = document.getElementById('preview-body');
        const previewTitle = document.getElementById('preview-title');
        
        previewTitle.textContent = `미리보기: ${file.name}`;
        modal.style.display = 'block';
        previewBody.innerHTML = '<p style="padding:20px;">로딩 중...</p>';

        // 파일 형식별 처리
        if (file.type.startsWith('image/')) {
            reader.onload = e => previewBody.innerHTML = `<img src="${e.target.result}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            const blobUrl = URL.createObjectURL(file);
            previewBody.innerHTML = `<iframe src="${blobUrl}" style="width:100%; height:100%; border:none;"></iframe>`;
        } else if (file.type.startsWith('text/') || file.name.endsWith('.csv')) {
            reader.onload = e => previewBody.innerHTML = `<pre style="padding:20px; white-space:pre-wrap; font-size:13px; background:#fff; width:100%; height:100%; overflow:auto;">${e.target.result}</pre>`;
            reader.readAsText(file, 'UTF-8');
        } else {
            previewBody.innerHTML = `<div style="padding:40px; text-align:center;"><i class="fas fa-file-download" style="font-size:40px; color:#ccc;"></i><p style="margin-top:15px; color:#666;">이 파일 형식은 미리보기를 지원하지 않습니다.<br>(${file.name})</p></div>`;
        }
    },

    initModal: function() {
        if (document.getElementById('preview-modal')) return;
        const modalHtml = `
            <div id="preview-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:10000;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:85%; height:85%; background:#fff; border-radius:8px; display:flex; flex-direction:column; overflow:hidden;">
                    <div style="padding:15px 20px; background:#0f4c81; color:#fff; display:flex; justify-content:space-between; align-items:center;">
                        <span id="preview-title" style="font-weight:600; font-size:16px;"></span>
                        <button type="button" onclick="document.getElementById('preview-modal').style.display='none'" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
                    </div>
                    <div id="preview-body" style="flex:1; background:#f4f4f4; overflow:hidden; display:flex; justify-content:center; align-items:center;"></div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
};

// 기존 FileManager 객체에 버튼 제어 로직 연결
if (typeof FileManager !== 'undefined') {
    const originalUpdateEssentialFile = FileManager.updateEssentialFile;
    FileManager.updateEssentialFile = function(input, displayId) {
        // 기존 로직 수행 (파일명 표시 등)
        originalUpdateEssentialFile(input, displayId);
        
        // 미리보기 버튼 제어
        const previewBtn = document.getElementById('preview-' + input.id);
        if (previewBtn) {
            if (input.files && input.files[0]) {
                previewBtn.style.display = 'inline-block';
                previewBtn.onclick = () => FilePreviewer.open(input);
            } else {
                previewBtn.style.display = 'none';
            }
        }
    };
}