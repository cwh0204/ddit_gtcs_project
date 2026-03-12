<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<style>
/* 1. 그리드 컨테이너 */
.ag-grid-container {
	width: 100%;
	height: auto !important;
	min-height: 600px;
	padding: 30px;
	background: #fff;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.page-header {
	margin-bottom: 10px;
	padding-bottom: 15px;
	border-bottom: 2px solid #e0e0e0;
}

.page-title {
	font-size: 22px;
	font-weight: bold;
	color: #0f4c81;
	margin-bottom: 8px;
}

.breadcrumb-text {
	font-size: 12px;
	color: #888;
}

/* 2. 뱃지 스타일 */
.badge {
	padding: 3px 10px;
	border-radius: 12px;
	color: #fff;
	font-size: 11px;
	display: inline-block;
	min-width: 60px;
	text-align: center;
	font-weight: 500;
}

.badge.wait {
	background: #6c757d;
}

.badge.ing {
	background: #0d6efd;
}

.badge.inspect {
	background: #17a2b8;
}

.badge.supp {
	background: #fd7e14;
}

.badge.pay {
	background: #6f42c1;
}

.badge.done {
	background: #28a745;
}

.badge.err {
	background: #dc3545;
}

/* ▼▼▼ [추가] 커스텀 컨트롤 바 스타일 ▼▼▼ */
.custom-control-bar {
	display: flex;
	justify-content: space-between; /* 양 끝 정렬 */
	align-items: center;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 5px;
}

.custom-total-text {
	font-size: 14px;
	font-weight: 500;
	color: #333;
}

.custom-total-text strong {
	color: #000;
	font-weight: bold;
}

.btn-new-decl {
	background-color: #0f4c81;
	color: white;
	border: none;
	padding: 6px 14px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
	font-weight: bold;
	display: flex;
	align-items: center;
	gap: 6px;
}

.btn-new-decl:hover {
	background-color: #0a3b66;
}
/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
/* ▼▼▼ [추가] 커스텀 컨트롤 바 스타일 ▼▼▼ */
.custom-control-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 5px;
}

.custom-total-text {
	font-size: 14px;
	font-weight: 500;
	color: #333;
}

.custom-total-text strong {
	color: #000;
	font-weight: bold;
}

.control-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

/* 자동 새로고침 토글 스위치 스타일 */
.auto-refresh-label {
	font-size: 12px;
	color: #555;
	display: flex;
	align-items: center;
	gap: 5px;
	cursor: pointer;
	background: #f8f9fa;
	padding: 4px 10px;
	border-radius: 20px;
	border: 1px solid #dee2e6;
}

.auto-refresh-label:hover {
	background: #e9ecef;
}

.btn-refresh {
	background-color: #6c757d;
	color: white;
	border: none;
	padding: 6px 14px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
	font-weight: bold;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: background 0.2s;
}

.btn-refresh:hover {
	background-color: #5a6268;
}

.btn-new-decl {
	background-color: #0f4c81;
	color: white;
	border: none;
	padding: 6px 14px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
	font-weight: bold;
	display: flex;
	align-items: center;
	gap: 6px;
}

.btn-new-decl:hover {
	background-color: #0a3b66;
}
/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
</style>

<div class="ag-grid-container">
	<div class="page-header">
		<h2 class="page-title">수입신고 현황 조회</h2>
		<div class="breadcrumb-text">
			<i class="fas fa-home"></i> Home > 수입통관 > 수입신고 현황 조회
		</div>
	</div>

	<div id="newControlBarTemplate" style="display: none;">
		<div class="custom-control-bar">
			<span class="custom-total-text"> 총 <strong
				id="customTotalCount">0</strong>건의 데이터가 있습니다.
			</span>

			<div class="control-actions">
				<button type="button" class="btn-refresh" onclick="manualRefresh()">
					<i class="fas fa-sync-alt"></i> 새로고침
				</button>

				<button type="button" class="btn-new-decl"
					onclick="goToNewDeclaration()">
					<i class="fas fa-plus"></i> 신규 신고
				</button>
			</div>
		</div>
	</div> <jsp:include page="/WEB-INF/components/AgGridList.jsp">
		<jsp:param name="gridId" value="importDeclGrid" />
		<jsp:param name="showSearch" value="true" />
		<jsp:param name="showActions" value="false" />
	</jsp:include>
</div>

<script>
const GRID_ID = 'importDeclGrid';
let myGridApi = null;
let currentPageNum = 1;
const currentMemId = window.USER_CONTEXT?.memId || 0;

/* ★ [추가] URL 파라미터 파싱 유틸 */
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
}

// 1. 커스텀 컨트롤 바 주입 (재귀적으로 체크)
const injectCustomControlBar = () => {
    const searchBox = document.getElementById(GRID_ID + '_searchBox'); 
    const template = document.getElementById('newControlBarTemplate');
    
    if (searchBox && template) {
        searchBox.insertAdjacentElement('afterend', template.firstElementChild);
    } else {
        setTimeout(injectCustomControlBar, 100);
    }
};

// 2. 검색 파라미터 생성
const getSearchParams = (page) => {
    return {
        memId: parseInt(currentMemId),
        pageNum: page,
        amount: 10,
        status: document.getElementById('searchStatus')?.value || '',
        type: document.getElementById('searchCondition')?.value || '',
        keyword: document.getElementById('searchText')?.value || '',
        startDate: document.getElementById('startDate')?.value || '',
        endDate: document.getElementById('endDate')?.value || '',
        t: new Date().getTime()
    };
};

// 3. 데이터 로드 핵심 함수
const loadPageData = (pageNum = 1, isBackground = false) => {
    // 💡 중요: 실행 시점에 한 번 더 API를 잡아줍니다.
    if (!myGridApi) {
        const gridEl = document.getElementById(GRID_ID);
        myGridApi = (gridEl && gridEl.gridApi) ? gridEl.gridApi : window[GRID_ID + '_api'];
    }

    if (!myGridApi) {
        console.warn("⚠️ 그리드가 아직 준비되지 않아 대기합니다.");
        return;
    }

    currentPageNum = pageNum;
    if (!isBackground) myGridApi.showLoadingOverlay();

    axios.get('/rest/import', { params: getSearchParams(currentPageNum) })
        .then(res => {
            const data = res.data || [];
            console.log(isBackground ? "📥 [SSE 자동갱신] 데이터 도착" : "📥 [일반로드] 데이터 도착");

            // 데이터 반영
            if (typeof myGridApi.setGridOption === 'function') {
                myGridApi.setGridOption('rowData', data);
            } else {
                myGridApi.setRowData(data);
            }

            // 카운트/페이징 업데이트
            const totalCount = data.length > 0 ? (data[0].totalCount || 0) : 0;
            const totalEl = document.getElementById('customTotalCount');
            if(totalEl) totalEl.innerText = totalCount.toLocaleString();

            const totalPages = data.length > 0 ? (data[0].totalPage || 1) : 1;
            if(typeof renderCustomPagination === 'function') renderCustomPagination(currentPageNum, totalPages);
            
            myGridApi.hideOverlay();
            if (data.length === 0 && !isBackground) myGridApi.showNoRowsOverlay();
        })
        .catch(err => {
            console.error("데이터 로드 실패:", err);
            myGridApi?.hideOverlay();
        });
};

// 4. SSE 알림 수신 함수
function fetchSilentData() {
    console.log("🔔 [SSE] 신호 감지 -> 백그라운드 갱신 시도");
    loadPageData(currentPageNum, true);
}

const manualRefresh = () => loadPageData(currentPageNum, false);

// 5. 뱃지 및 페이징 (기존 로직 유지)
const normalizeStatus = (status) => {
    if (!status) return '-';
    const s = status.toString().toUpperCase().trim();
    const map = {
        'BONDED_IN': '보세입고완료', 'WAITING': '심사대기', 'PHYSICAL': '현품검사중',
        'SUPPLEMENT': '보완/정정', 'REVIEWING': '심사중', 'ACCEPTED': '수리', 'INSPECTION_COMPLETED': '현품검사완료',
        'REJECTED': '반려', 'PAY_WAITING': '납부 대기', 'PAY_COMPLETED': '납부 완료',
        'WH_IN_APPROVED': '반입승인', 'WH_IN_REJECTED': '반입차단',
        'RELEASE_APPROVED': '반출승인', 'RELEASE_REJECTED': '반출차단',
        'APPROVED': '통관승인', 'DELIVERED': '출고 완료'
    };
    return map[s] || status;
};

const statusBadgeRenderer = (p) => {
    const s = (p.value || '').toUpperCase().trim();
    const txt = normalizeStatus(s);
    let cls = 'wait';
    if (['REVIEWING','PHYSICAL','SUPPLEMENT'].includes(s)) cls = 'ing';
    else if (['ACCEPTED','PAY_WAITING','WH_IN_APPROVED','RELEASE_APPROVED'].includes(s)) cls = 'pay';
    else if (['PAY_COMPLETED','APPROVED','DELIVERED','INSPECTION_COMPLETED'].includes(s)) cls = 'done';
    else if (['REJECTED','WH_IN_REJECTED','RELEASE_REJECTED'].includes(s)) cls = 'err';
    return '<span class="badge ' + cls + '">' + txt + '</span>';
};

const renderCustomPagination = (curr, total) => {
    const area = document.getElementById(GRID_ID + '_pagination');
    if (!area || total <= 0) return;
    let h = '';
    const start = Math.max(1, curr - 2);
    const end = Math.min(total, start + 4);
    h += '<button class="pg-btn" onclick="loadPageData(1)" ' + (curr === 1 ? 'disabled' : '') + '><i class="fas fa-angle-double-left"></i></button>';
    h += '<button class="pg-btn" onclick="loadPageData(' + (curr - 1) + ')" ' + (curr === 1 ? 'disabled' : '') + '><i class="fas fa-angle-left"></i></button>';
    for(let i = start; i <= end; i++) {
        h += '<button class="pg-btn ' + (i === curr ? 'active' : '') + '" onclick="loadPageData(' + i + ')">' + i + '</button>';
    }
    h += '<button class="pg-btn" onclick="loadPageData(' + (curr + 1) + ')" ' + (curr === total ? 'disabled' : '') + '><i class="fas fa-angle-right"></i></button>';
    h += '<button class="pg-btn" onclick="loadPageData(' + total + ')" ' + (curr === total ? 'disabled' : '') + '><i class="fas fa-angle-double-right"></i></button>';
    area.innerHTML = h;
};

const goToNewDeclaration = () => location.href = '/client/ims/imswrite/importBase';

/* ★ [추가] URL 파라미터를 검색 필드에 세팅하는 함수 */
function applyUrlParamsToSearch() {
    const urlStatus = getUrlParam('status');
    const urlStartDate = getUrlParam('startDate');
    const urlEndDate = getUrlParam('endDate');

    let applied = false;

    if (urlStatus) {
        const statusEl = document.getElementById('searchStatus');
        if (statusEl) {
            statusEl.value = urlStatus;
            applied = true;
            console.log("🔍 URL 파라미터 적용 - status:", urlStatus);
        }
    }

    if (urlStartDate) {
        const startEl = document.getElementById('startDate');
        if (startEl) {
            startEl.value = urlStartDate;
            applied = true;
            console.log("🔍 URL 파라미터 적용 - startDate:", urlStartDate);
        }
    }

    if (urlEndDate) {
        const endEl = document.getElementById('endDate');
        if (endEl) {
            endEl.value = urlEndDate;
            applied = true;
            console.log("🔍 URL 파라미터 적용 - endDate:", urlEndDate);
        }
    }

    return applied;
}

// 6. 초기화
document.addEventListener('DOMContentLoaded', () => {
    const colDefs = [
        { headerName: "No", field: "rnum", width: 70, cellClass: "ag-center-cell" }, 
        { headerName: "수입신고번호", field: "importNumber", width: 180, cellClass: "cell-left" }, 
        { headerName: "신고일자", field: "submitDate", width: 110 },
        { headerName: "진행상태", field: "status", width: 120, cellRenderer: statusBadgeRenderer },
        { headerName: "신고품명", field: "itemNameDeclared", flex: 1, cellClass: "cell-left" },
        { headerName: "원산지", field: "originCountry", width: 120 },
        { headerName: "신고가격(원)", field: "totalTaxSum", width: 140, cellClass: "cell-right", valueFormatter: p => p.value ? Math.round(p.value).toLocaleString() : '0' }
    ];

    const searchFields = [
        { type: 'dateRange', label: '신고일자', startId: 'startDate', endId: 'endDate', field: 'submitDate' },
        { type: 'select', label: '진행상태', id: 'searchStatus', width: '140px', options: [
            { value: 'BONDED_IN', label: '보세입고완료' }, { value: 'WAITING', label: '심사대기' },
            { value: 'REVIEWING', label: '심사중' }, { value: 'PHYSICAL', label: '현품검사중' },
            { value: 'INSPECTION_COMPLETED', label: '현품검사완료' }, { value: 'SUPPLEMENT', label: '보완/정정' },
            { value: 'ACCEPTED', label: '수리' }, { value: 'REJECTED', label: '반려' },
            { value: 'PAY_WAITING', label: '납부 대기' }, { value: 'PAY_COMPLETED', label: '납부 완료' },
            { value: 'WH_IN_APPROVED', label: '반입승인' }, { value: 'WH_IN_REJECTED', label: '반입차단' },
            { value: 'RELEASE_APPROVED', label: '반출승인' }, { value: 'RELEASE_REJECTED', label: '반출차단' },
            { value: 'APPROVED', label: '통관승인' }, { value: 'DELIVERED', label: '출고 완료' }
        ]},
        { type: 'select', label: '검색조건', id: 'searchCondition', width: '120px', options: [
            { value: 'importNumber', label: '수입신고번호' },
            { value: 'itemNameDeclared', label: '신고품명' },
            { value: 'originCountry', label: '원산지' }
        ]},
        { type: 'text', label: '', id: 'searchText', width: '250px', placeholder: '검색어를 입력하세요' }
    ];
    
    // 그리드 초기화
    initAgGrid(GRID_ID, {
        columnDefs: colDefs,
        rowData: [], 
        pageSize: 10,
        searchFields: searchFields,
        serverSide: true,
        onRowClicked: (e) => { if (e.data.importId) location.href = '/client/ims/status/detail?id=' + e.data.importId; }
    });

    window[GRID_ID + '_customSearch'] = (p) => loadPageData(p, false);
    injectCustomControlBar();
    
    // 💡 충분한 시간을 두고 API 연결 및 초기 로드 수행
    setTimeout(() => {
        const gridEl = document.getElementById(GRID_ID);
        myGridApi = (gridEl && gridEl.gridApi) ? gridEl.gridApi : window[GRID_ID + '_api'];
        
        /* ★ [추가] URL 파라미터가 있으면 검색 필드에 세팅 후 검색 */
        applyUrlParamsToSearch();
        
        loadPageData(1); 
     	// 수정된 코드: 수입 리스트도 3가지 상태 변화를 모두 감지하도록 배열로 넘겨줍니다.
        initGlobalSSE(["IMPORT_REFRESH", "EXPORT_REFRESH", "WAREHOUSE_REFRESH"], fetchSilentData);
    }, 200);
});
</script>
