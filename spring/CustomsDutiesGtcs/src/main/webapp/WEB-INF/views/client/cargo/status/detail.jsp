<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt"%>
<%@ taglib prefix="fn" uri="jakarta.tags.functions"%>

<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<style>
/* 전역이 아닌 .cargo-detail-container 내부에만 적용 */
.cargo-detail-container table td, 
.cargo-detail-container table th {
    padding-top: 0.85rem !important;
    padding-bottom: 0.85rem !important;
    font-size: 0.95rem;
}

/* 내부 스크롤바 디자인 */
.custom-scroll::-webkit-scrollbar {
	width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
	background: #f1f1f1;
}
.custom-scroll::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 10px;
}

/* 탭 전환 시 부드러운 효과 */
.tab-panel {
    animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(3px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>

<div class="cargo-detail-container w-full bg-gray-50 p-6 min-h-[calc(100vh-80px)]">
    <div class="max-w-[1200px] w-full mx-auto flex flex-col space-y-4">

        <div class="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-200">
			<div class="flex items-center gap-4">
				<button onclick="history.back()"
					class="p-2 hover:bg-gray-100 rounded-full transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600">
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
                    </svg>
				</button>
				<div>
					<h1 class="text-xl font-extrabold text-gray-900 tracking-tight">화물 진행 상세 정보</h1>
					<p class="text-sm text-gray-500 mt-1">
						컨테이너 번호: <span id="hdr-contNo" class="font-mono font-bold text-gray-800">-</span>
					</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<span id="badge-urgent" class="hidden inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">긴급 화물</span> 
                <span id="badge-status" class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-blue-800">-</span>
				<span id="badge-type" class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">-</span>
                <button id="btnDeclaration" onclick="goToDeclarationForm()" style="display: none;"
                        class="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
                    신고서 작성
                </button>
			</div>
		</div>

        <div class="flex border-b border-gray-200 bg-white rounded-t-xl px-2 pt-2 shadow-sm">
            <button class="tab-btn px-6 py-3 text-[15px] font-bold text-blue-600 border-b-2 border-blue-600 transition-colors" onclick="switchTab(0)">기본/위치 정보</button>
            <button class="tab-btn px-6 py-3 text-[15px] font-bold text-gray-500 hover:text-gray-800 transition-colors border-b-2 border-transparent" onclick="switchTab(1)">통관 마스터 정보</button>
            <button class="tab-btn px-6 py-3 text-[15px] font-bold text-gray-500 hover:text-gray-800 transition-colors border-b-2 border-transparent" onclick="switchTab(2)">첨부파일</button>
            <button class="tab-btn px-6 py-3 text-[15px] font-bold text-gray-500 hover:text-gray-800 transition-colors border-b-2 border-transparent" onclick="switchTab(3)">업무 처리 이력</button>
        </div>

        <div class="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200">
            
            <div id="panel-0" class="tab-panel p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <div class="bg-gray-50/80 px-4 py-3 border-b border-gray-200 font-bold text-gray-700">기본 정보</div>
                    <div>
                        <table class="w-full border-collapse">
                            <tbody class="divide-y divide-gray-100">
                                <tr>
                                    <th class="w-1/3 bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">신고번호</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-declNo">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">기업대표자명</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-repName">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">BL번호</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-uniqueNo">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">품명</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-itemName">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">수량 / 총중량</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-qtyWeight">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">출고 여부</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-delYn">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="border border-gray-200 rounded-lg overflow-hidden self-start">
                    <div class="bg-gray-50/80 px-4 py-3 border-b border-gray-200 font-bold text-gray-700">위치 및 시간 정보</div>
                    <div>
                        <table class="w-full border-collapse">
                            <tbody class="divide-y divide-gray-100">
                                <tr>
                                    <th class="w-1/3 bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">창고위치</th>
                                    <td class="px-5 text-gray-900 font-bold" id="d-location"><span class="text-blue-600">-</span></td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">구역</th>
                                    <td class="px-5 text-gray-900 font-medium" id="d-positionArea">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">출고일</th>
                                    <td class="px-5 text-gray-700" id="d-outDate">-</td>
                                </tr>
                                <tr>
                                    <th class="bg-gray-50/30 px-5 font-semibold text-gray-600 text-left">최초 등록일시</th>
                                    <td class="px-5 text-gray-700" id="d-regDate">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="panel-1" class="tab-panel hidden p-6">
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <div class="bg-gray-50/80 px-4 py-3 border-b border-gray-200 font-bold text-gray-700">연결된 마스터 정보</div>
                    <div>
                        <table class="w-full border-collapse">
                            <tbody class="divide-y divide-gray-100" id="masterInfoBody">
                                <tr><td class="px-6 py-8 text-gray-400 text-center" colspan="2">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="panel-2" class="tab-panel hidden p-6">
                <div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/30 p-4">
                    <ul id="fileList" class="space-y-3">
                        <li class="text-gray-400 text-sm text-center py-8">첨부된 파일이 없습니다.</li>
                    </ul>
                </div>
            </div>

            <div id="panel-3" class="tab-panel hidden p-6">
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                    <div class="max-h-[500px] overflow-y-auto custom-scroll relative">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-4 text-left text-gray-600 font-bold uppercase">처리일시</th>
                                    <th class="px-6 py-4 text-center text-gray-600 font-bold uppercase">처리유형</th>
                                    <th class="px-6 py-4 text-right text-gray-600 font-bold uppercase">담당자</th>
                                </tr>
                            </thead>
                            <tbody id="historyBody" class="divide-y divide-gray-100 bg-white">
                                <tr><td colspan="3" class="px-6 py-8 text-gray-400 text-center">데이터를 불러오는 중...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
	</div>
</div>

<script>
//=========================================================
//탭 전환 로직
//=========================================================
function switchTab(idx) {
 const btns = document.querySelectorAll('.tab-btn');
 const panels = document.querySelectorAll('.tab-panel');

 btns.forEach((btn, i) => {
     if (i === idx) {
         btn.classList.add('text-blue-600', 'border-blue-600');
         btn.classList.remove('text-gray-500', 'border-transparent');
     } else {
         btn.classList.remove('text-blue-600', 'border-blue-600');
         btn.classList.add('text-gray-500', 'border-transparent');
     }
 });

 panels.forEach((panel, i) => {
     if (i === idx) {
         panel.classList.remove('hidden');
     } else {
         panel.classList.add('hidden');
     }
 });
}

//=========================================================
//이하 기존 JS 로직
//=========================================================
const getStockNo = () => {
 const params = new URLSearchParams(window.location.search);
 return params.get('stockNo');
};

const ACTION_LABELS = {
 'IMP_RPT' : '수입 입고',
 'LOC_MOD' : '위치 변경',
 'OUTBOUND': '출고 처리',
 'EXP_RPT' : '수출 입고'
};
const actionLabel = (type) => ACTION_LABELS[type] || type || '-';

const STATUS_MAP = {
 'BONDED_IN'            : { label: '(보세)입고완료', bg: '#6c757d' },
 'WAITING'              : { label: '심사대기',       bg: '#adb5bd', color: '#333' },
 'PHYSICAL'             : { label: '현품검사중',     bg: '#17a2b8' },
 'SUPPLEMENT'           : { label: '보완/정정',      bg: '#fd7e14' },
 'REVIEWING'            : { label: '심사중',         bg: '#ffc107', color: '#333' },
 'ACCEPTED'             : { label: '수리',           bg: '#28a745' },
 'INSPECTION_COMPLETED' : { label: '현품검사완료',   bg: '#20c997' },
 'REJECTED'             : { label: '반려',           bg: '#dc3545' },
 'PAY_WAITING'          : { label: '납부 대기',      bg: '#e83e8c' },
 'PAY_COMPLETED'        : { label: '납부 완료',      bg: '#6f42c1' },
 'WH_IN_APPROVED'       : { label: '반입승인',       bg: '#5a3d9c' },
 'WH_IN_REJECTED'       : { label: '반입차단',       bg: '#b02a37' },
 'RELEASE_APPROVED'     : { label: '반출승인',       bg: '#0d6efd' },
 'RELEASE_REJECTED'     : { label: '반출차단',       bg: '#dc3545' },
 'APPROVED'             : { label: '통관승인',       bg: '#198754' },
 'BONDED'               : { label: '보세창고',       bg: '#198754' },
 'LOCAL'                : { label: '국내창고',       bg: '#0d6efd' },
 'DELIVERED'            : { label: '출고 완료',      bg: '#6c757d' }
};

const statusBadgeHtml = (val) => {
 const m = STATUS_MAP[val];
 if (!m) return '<span style="background:#6c757d;color:#fff;padding:3px 10px;border-radius:12px;font-size:11px;display:inline-block;min-width:76px;text-align:center;">' + (val || '-') + '</span>';
 const colorStyle = m.color ? 'color:' + m.color + ';' : 'color:#fff;';
 return '<span style="background:' + m.bg + ';' + colorStyle + 'padding:3px 10px;border-radius:12px;font-size:11px;font-weight:500;display:inline-block;min-width:76px;text-align:center;">' + m.label + '</span>';
};

const setText = (id, val) => {
 const el = document.getElementById(id);
 if (el) el.textContent = (val !== null && val !== undefined && val !== '') ? val : '-';
};

const getDamageInfoHtml = (damagedYn, damagedComment) => {
 if (damagedYn === 'Y') {
     return '<span class="text-red-600 font-bold">파손 (사유: ' + (damagedComment || '없음') + ')</span>';
 }
 return '<span class="text-gray-600">정상</span>';
};

const renderDetail = (data) => {
 setText('hdr-contNo', data.contNo);

 let status = '';
 if (data.importMaster && data.importMaster.status) {
     status = data.importMaster.status;
 } else if (data.exportMaster && data.exportMaster.status) {
     status = data.exportMaster.status;
 } else {
     status = data.positionArea;
 }
 document.getElementById('badge-status').innerHTML = statusBadgeHtml(status);

 const isImport = !!(data.importMaster && data.importMaster.importNumber);
 const isExport = !!(data.exportMaster && data.exportMaster.exportNumber);

 const btnDecl = document.getElementById('btnDeclaration');
 if (btnDecl) {
     if (!isImport && !isExport) {
         btnDecl.style.display = 'flex'; 
     } else {
         btnDecl.style.display = 'none'; 
     }
 }

 const badgeType = document.getElementById('badge-type');

 if (isImport) {
     badgeType.textContent = '수입';
     badgeType.className = badgeType.className.replace(/bg-(green|indigo)-100 text-(green|indigo)-800/g, '');
     badgeType.classList.remove('hidden'); // 혹시 숨겨져 있었다면 다시 표시
     badgeType.classList.add('bg-indigo-100', 'text-indigo-800');
 } else if (isExport) {
     badgeType.textContent = '수출';
     badgeType.className = badgeType.className.replace(/bg-(green|indigo)-100 text-(green|indigo)-800/g, '');
     badgeType.classList.remove('hidden'); // 혹시 숨겨져 있었다면 다시 표시
     badgeType.classList.add('bg-green-100', 'text-green-800');
 } else {
     // 수입도 수출도 아닌 미신고 화물인 경우 뱃지 숨김
     badgeType.classList.add('hidden');
 }

 setText('d-declNo',    data.declNo);
 setText('d-repName',   data.repName);
 setText('d-uniqueNo',  data.uniqueNo);
 setText('d-itemName',  data.itemName);
 document.getElementById('d-qtyWeight').textContent = (data.qty || 0) + 'EA / ' + (data.grossWeight || 0) + ' kg';
 setText('d-delYn', data.delYn === 'Y' ? '출고완료' : '재고중');

 document.getElementById('d-location').innerHTML = '<span class="text-blue-600 font-bold">' + (data.warehouseId || '-') + '</span>';
 const pos = data.positionArea;
 let posText = '-';

 if (pos === 'BONDED') {
     posText = '보세구역';
 } else if (pos === 'LOCAL') {
     posText = '국내구역';
 } else {
     // 값이 없거나 예상치 못한 값일 경우 처리
     posText = pos || '-'; 
 }

 setText('d-positionArea', posText);
 setText('d-outDate',  data.outDate  || '미출고');
 setText('d-regDate', data.regDate || '-');

 const fileListEl = document.getElementById('fileList');
 if (data.fileList && data.fileList.length > 0) {
     let fileHtml = '';
     data.fileList.forEach(file => {
         fileHtml += '<li class="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-lg hover:border-blue-300 transition-colors">' +
                     '  <div class="flex items-center gap-3 overflow-hidden">' +
                     '    <div class="bg-blue-50 p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>' +
                     '    <span class="text-[15px] text-gray-700 truncate font-medium">' + file.fileName + '</span>' +
                     '  </div>' +
                     '  <button onclick="downloadFile(\'' + file.fileId + '\')" class="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-semibold flex-shrink-0 flex items-center gap-1 transition-colors">' +
                     '    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>' +
                     '    다운로드' +
                     '  </button>' +
                     '</li>';
     });
     fileListEl.innerHTML = fileHtml;
 } else {
     fileListEl.innerHTML = '<li class="text-gray-400 text-[15px] py-10 text-center flex flex-col items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-300"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>첨부된 파일이 없습니다.</li>';
 }

 const masterBody = document.getElementById('masterInfoBody');
 let masterHtml = '';

 if (isImport && data.importMaster) {
     const im = data.importMaster;
     masterHtml += '<tr><th class="w-[30%] bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">수입신고번호</th><td class="px-6 py-4 text-gray-900 font-medium">' + (im.importNumber || '-') + '</td></tr>';
     masterHtml += '<tr><th class="bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">회사명</th><td class="px-6 py-4 text-gray-900 font-medium">' + (im.importerName || '-') + '</td></tr>';
     masterHtml += '<tr><th class="bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">통관 상태</th><td class="px-6 py-4">' + statusBadgeHtml(im.status) + '</td></tr>';
     masterHtml += '<tr><th class="bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">파손 여부</th><td class="px-6 py-4">' + getDamageInfoHtml(data.damagedYn, data.damagedComment) + '</td></tr>';
 } else if (isExport && data.exportMaster) {
     const em = data.exportMaster;
     masterHtml += '<tr><th class="w-[30%] bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">수출신고번호</th><td class="px-6 py-4 text-gray-900 font-medium">' + (em.exportNumber || '-') + '</td></tr>';
     masterHtml += '<tr><th class="bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">수출자</th><td class="px-6 py-4 text-gray-900 font-medium">' + (em.exporterName || '-') + '</td></tr>';
     masterHtml += '<tr><th class="bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">통관 상태</th><td class="px-6 py-4">' + statusBadgeHtml(em.status) + '</td></tr>';
     masterHtml += '<tr><th class="bg-gray-50/30 px-6 font-semibold text-gray-600 text-left py-4">파손 여부</th><td class="px-6 py-4">' + getDamageInfoHtml(data.damagedYn, data.damagedComment) + '</td></tr>';
 } else {
     masterHtml = '<tr><td colspan="2" class="px-6 py-10 text-gray-400 text-center">연결된 통관 정보가 없습니다.</td></tr>';
 }
 masterBody.innerHTML = masterHtml;
};

//1. 다운로드 실패 시 Swal 적용
const downloadFile = (fileId) => {
 if(!fileId) {
     Swal.fire({
         icon: 'warning',
         title: '다운로드 불가',
         text: '파일 ID가 존재하지 않습니다.',
         confirmButtonColor: '#0f4c81',
         confirmButtonText: '확인',
         scrollbarPadding: false,
         heightAuto: false
     });
     return;
 }
 location.href = '/download/' + fileId;
};

const renderHistory = (logs) => {
 const tbody = document.getElementById('historyBody');
 if (!logs || logs.length === 0) {
     tbody.innerHTML = '<tr><td colspan="3" class="px-5 py-8 text-gray-400 text-center">처리 이력이 없습니다.</td></tr>';
     return;
 }
 let html = '';
 logs.forEach(log => {
     html += '<tr class="hover:bg-blue-50/50 transition-colors">'
         + '<td class="px-5 py-3.5 text-gray-700 font-mono text-[14px]">' + (log.actionDate || '-') + '</td>'
         + '<td class="px-5 py-3.5 text-center"><span class="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-bold">' + actionLabel(log.status) + '</span></td>'
         + '<td class="px-5 py-3.5 text-right text-gray-900 font-semibold text-[14px]">' + (log.workerName || '-') + '</td>'
         + '</tr>';
 });
 tbody.innerHTML = html;
};

let currentDetailData = null;
	
//2. 데이터 조회 실패 시 Swal 적용
const loadDetail = () => {
 const stockNo = getStockNo();
 if (!stockNo || isNaN(Number(stockNo))) {
     console.error("잘못된 접근입니다. stockNo가 숫자가 아닙니다:", stockNo);
     return; 
 }

 axios.get('/rest/warehouse/' + stockNo)
     .then(res => {
         if (res.data) {
             currentDetailData = res.data;
             renderDetail(res.data);

             let targetDeclNo = res.data.declNo;
             if (!targetDeclNo && res.data.importMaster) targetDeclNo = res.data.importMaster.importNumber;
             if (!targetDeclNo && res.data.exportMaster) targetDeclNo = res.data.exportMaster.exportNumber;

             console.log("[디버그] 추출된 신고번호(declNo):", targetDeclNo);

             if (targetDeclNo) {
                 const historyUrl = '/rest/warehouse/history/' + encodeURIComponent(targetDeclNo);
                 console.log("[디버그] 호출할 이력 API 주소:", historyUrl);

                 axios.get(historyUrl)
                     .then(resHistory => {
                         console.log("[디버그] 백엔드에서 받은 이력 데이터:", resHistory.data);
                         renderHistory(resHistory.data || []);
                     })
                     .catch(err => {
                         console.error('[디버그] 이력 조회 API 에러 발생:', err);
                         renderHistory([]);
                     });
             } else {
                 console.warn("[디버그] 신고번호가 없어서 이력 조회를 스킵합니다.");
                 renderHistory([]);
             }
             
         } else {
             // 기존 alert 대신 Swal 적용
             Swal.fire({
                 icon: 'error',
                 title: '조회 실패',
                 text: '데이터를 찾을 수 없습니다.',
                 confirmButtonColor: '#0f4c81',
                 confirmButtonText: '확인',
                 scrollbarPadding: false,
                 heightAuto: false
             }).then(() => {
                 history.back(); // 확인 누르면 뒤로가기
             });
         }
     })
     .catch(err => {
         console.error('상세 조회 실패:', err);
         // 통신 에러 발생 시 Swal 적용
         Swal.fire({
             icon: 'error',
             title: '서버 오류',
             text: '상세 정보를 불러오는 중 서버 오류가 발생했습니다.',
             confirmButtonColor: '#dc3545',
             confirmButtonText: '확인',
             scrollbarPadding: false,
             heightAuto: false
         });
     });
};

document.addEventListener('DOMContentLoaded', () => {
 loadDetail();

 if (typeof initGlobalSSE === 'function') {
     initGlobalSSE(["WAREHOUSE_REFRESH", "IMPORT_REFRESH", "EXPORT_REFRESH"], () => {
         console.log("[화물 상세화면] 수입/수출/창고 상태가 변경되어 데이터를 갱신합니다.");
         loadDetail();
     });
 }
});

const goToDeclarationForm = () => {
 if (!currentDetailData) {
     Swal.fire({
         icon: 'warning',
         title: '알림',
         text: '화물 데이터를 불러오는 중입니다.',
         confirmButtonColor: '#0f4c81',
         confirmButtonText: '확인',
         scrollbarPadding: false,
         heightAuto: false
     });
     return;
 }

 Swal.fire({
     title: '신고서 작성',
     text: '어떤 신고서를 작성하시겠습니까?',
     icon: 'question',
     showCancelButton: true,
     showDenyButton: true,
     confirmButtonText: '수입 신고서',
     denyButtonText: '수출 신고서',
     cancelButtonText: '취소',
     confirmButtonColor: '#4f46e5',
     denyButtonColor: '#16a34a',
     scrollbarPadding: false,
     heightAuto: false
 }).then((result) => {
     if (result.isConfirmed) {
         sessionStorage.setItem('cargoDataForForm', JSON.stringify(currentDetailData));
         location.href = '/client/ims/imswrite/importBase';
     } else if (result.isDenied) {
         sessionStorage.setItem('cargoDataForForm', JSON.stringify(currentDetailData));
         location.href = '/client/exp/expwrite/exportBase';
     }
 });
};
</script>