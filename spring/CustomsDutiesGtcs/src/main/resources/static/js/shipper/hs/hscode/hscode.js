/**
 * [공통] HS코드 DB 연동 조회 팝업 모듈
 */

// 값을 전달받을 input의 ID를 저장하는 변수
let targetInputId = '';

// 1. 페이지 로드 시 모달 HTML을 body에 동적으로 추가
document.addEventListener('DOMContentLoaded', function() {
    createHsCodeModal();
});

function createHsCodeModal() {
    // 이미 모달이 있으면 생성하지 않음
    if (document.getElementById('hsCodeModal')) return;

    // [수정] 레이아웃 붕괴 방지용 CSS 추가 (box-sizing, flex 속성 조정)
    const modalHtml = `
    <div id="hsCodeModal" class="hscode-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div class="hscode-modal-content" style="background:#fff; width:650px; border-radius:8px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif;">
            
            <div class="hscode-modal-header" style="padding:15px 20px; background:#f8f9fa; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center;">
                <span class="hscode-modal-title" style="font-weight:bold; font-size:16px; color:#333;">HS부호 상세 조회</span>
                <button type="button" class="hscode-btn-close" onclick="closeHsCodePopup()" style="border:none; background:none; font-size:24px; cursor:pointer; color:#666; line-height:1; padding:0;">&times;</button>
            </div>
            
            <div class="hscode-search-box" style="padding:15px 20px; background:#fdfdfd; border-bottom:1px solid #eee; display: flex; gap: 10px;">
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; flex: 1;">
                    <select id="hsSearchType" class="hscode-input" style="width:100%; height:38px; padding:0 10px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-size:13px; color:#333;">
                        <option value="">전체 (부분/완제품)</option>
                        <option value="부분품">부분품</option>
                        <option value="완제품">완제품</option>
                    </select>
                    <input type="text" id="hsSearchName" class="hscode-input" placeholder="품명 (예: 티셔츠)" style="width:100%; height:38px; padding:0 10px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-size:13px; color:#333;" onkeyup="if(window.event.keyCode==13){fetchHsCodeData()}">
                    <input type="text" id="hsSearchMaterial" class="hscode-input" placeholder="재질 (예: 면, 폴리)" style="width:100%; height:38px; padding:0 10px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-size:13px; color:#333;" onkeyup="if(window.event.keyCode==13){fetchHsCodeData()}">
                    <input type="text" id="hsSearchUsage" class="hscode-input" placeholder="용도 (예: 남성용)" style="width:100%; height:38px; padding:0 10px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-size:13px; color:#333;" onkeyup="if(window.event.keyCode==13){fetchHsCodeData()}">
                </div>

                <button type="button" class="btn-blue" onclick="fetchHsCodeData()" style="width:120px; background:#0056b3; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:14px; box-sizing:border-box;">DB 검색</button>
            </div>

            <div class="hscode-list-container" style="max-height:300px; overflow-y:auto; padding:0 20px 20px 20px;">
                <table class="hscode-table" style="width:100%; border-collapse:collapse; font-size:13px;">
                    <colgroup>
                        <col style="width: 140px;">
                        <col style="width: auto;">
                    </colgroup>
                    <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                        <tr>
                            <th style="padding:12px 10px; text-align:left; border-bottom:2px solid #ddd; color:#333; font-weight:bold;">HS코드</th>
                            <th style="padding:12px 10px; text-align:left; border-bottom:2px solid #ddd; color:#333; font-weight:bold;">상세 품명</th>
                        </tr>
                    </thead>
                    <tbody id="hsCodeListBody">
                        <tr>
                            <td colspan="2" style="text-align:center; padding:30px; color:#666;">검색 조건을 입력하고 검색 버튼을 눌러주세요.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 2. 팝업 열기
function openHsCodePopup(inputId) {
    targetInputId = inputId; // 대상 input ID 저장

    // 검색어 및 결과 초기화
    document.getElementById('hsSearchType').value = '';
    document.getElementById('hsSearchName').value = '';
    document.getElementById('hsSearchMaterial').value = '';
    document.getElementById('hsSearchUsage').value = '';
    
    document.getElementById('hsCodeListBody').innerHTML = '<tr><td colspan="2" style="text-align:center; padding:20px; color:#666;">검색 조건을 입력하고 검색 버튼을 눌러주세요.</td></tr>';

    // 모달 보이기
    const modal = document.getElementById('hsCodeModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('hsSearchName').focus(); // 팝업 열릴 때 품명에 포커스
    }
}

// 3. 팝업 닫기
function closeHsCodePopup() {
    const modal = document.getElementById('hsCodeModal');
    if (modal) modal.style.display = 'none';
}

// 4. DB에서 데이터 가져오기 (Axios)
async function fetchHsCodeData() {
    // 1) 검색 파라미터 수집
    const searchType = document.getElementById('hsSearchType').value;
    const searchName = document.getElementById('hsSearchName').value.trim();
    const searchMaterial = document.getElementById('hsSearchMaterial').value.trim();
    const searchUsage = document.getElementById('hsSearchUsage').value.trim();

    // 2) 로딩 상태 표시
    const tbody = document.getElementById('hsCodeListBody');
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:20px;"><span style="color:#0056b3;">데이터를 조회 중입니다...</span></td></tr>';

    try {
        // 3) 백엔드 API URL
        const apiUrl = '/rest/ai/hscode';

        // 4) Axios를 이용한 서버 통신 (GET 요청)
        const response = await axios.get(apiUrl, {
            params: {
                partOrFinished: searchType, // '', 'PART', 'FINISHED'
                itemName: searchName,
                material: searchMaterial,
                usage: searchUsage
            }
        });

        // 5) 데이터 수신 및 렌더링
        // Axios는 자동으로 JSON을 파싱하여 response.data에 담아줍니다.
        const data = response.data; 
        console.log(data);
        renderHsCodeList(data);

    } catch (error) {
        console.error('HS Code 데이터 조회 실패:', error);
        
        // 에러 메세지 세분화 (선택 사항)
        let errorMsg = '서버와 통신하는 중 오류가 발생했습니다.';
        if (error.response) {
            // 서버가 4xx, 5xx 상태 코드를 응답한 경우
            errorMsg = `서버 오류 발생: ${error.response.status}`;
        } else if (error.request) {
            // 요청이 이루어 졌으나 응답을 받지 못한 경우
            errorMsg = '서버에서 응답이 없습니다.';
        }

        tbody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 20px; color: red;">${errorMsg}</td></tr>`;
    }
}

// 5. 리스트 렌더링
function renderHsCodeList(data) {
    const tbody = document.getElementById('hsCodeListBody');
    tbody.innerHTML = '';

    // 1) 데이터가 없는 경우
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding: 20px;">조건에 맞는 검색 결과가 없습니다.</td></tr>';
        return;
    }

    // 2) 데이터가 단순 문자열(String)로 온 경우 (AI 단일 응답)
    if (typeof data === 'string') {
        const tr = document.createElement('tr');
        
        tr.style.cursor = 'pointer'; 
        tr.onmouseover = () => tr.style.backgroundColor = '#f4f8ff';
        tr.onmouseout = () => tr.style.backgroundColor = '';

        tr.innerHTML = `
            <td colspan="2" style="padding:15px; text-align: left; line-height: 1.5; font-weight:bold; color:#0056b3;">
                ${data}
            </td>
        `;
        
        // ⭐ 이 부분이 있어야 클릭 시 값이 들어갑니다.
        tr.onclick = function() {
            selectHsCode(data); 
        };
        
        tbody.appendChild(tr);
        return; 
    }

    // 3) 정상적으로 배열 데이터가 온 경우
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.style.borderBottom = '1px solid #eee';
        
        tr.onmouseover = () => tr.style.backgroundColor = '#f4f8ff';
        tr.onmouseout = () => tr.style.backgroundColor = '';

        tr.innerHTML = `
            <td style="padding:10px; font-weight:bold; color:#0056b3;">${item.code || '-'}</td>
            <td style="padding:10px; text-align: left;">${item.desc || '-'}</td>
        `;
        
        tr.onclick = function() {
            if(item.code) selectHsCode(item.code);
        };
        tbody.appendChild(tr);
    });
}

// 6. 항목 선택 시 동작
function selectHsCode(code) {
    console.log("👉 클릭됨! 선택된 코드:", code, " / 타겟ID:", targetInputId);

    if (targetInputId) {
        const targetInput = document.getElementById(targetInputId);
        
        if (targetInput) {
            // 정규식을 사용해 숫자와 점(.)만 추출 (혹시 AI가 "코드: 6109.10" 처럼 글자를 섞어 보낼 때 방어)
            const cleanCode = code.replace(/[^0-9.]/g, ''); 
            
            targetInput.value = cleanCode; // 값 입력
            
            console.log("👉 입력 완료! 현재 Input 값:", targetInput.value);

            // 이벤트 강제 발생 (화면 갱신용)
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            targetInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.error("오류: 타겟 input 요소를 찾을 수 없습니다.");
        }
    }
    
    // 모달 닫기
    closeHsCodePopup();
}