<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<style>
/* ===== 공통 스타일 (기존과 동일) ===== */
.ag-grid-container {
	width: 100%;
	height: auto !important;
	min-height: 700px;
	padding: 30px;
	padding-bottom: 20px;
	background: #fff;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.page-header {
	margin-bottom: 20px;
	padding-bottom: 15px;
	border-bottom: 2px solid #e0e0e0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.page-title {
	font-size: 22px;
	font-weight: bold;
	color: #dc3545; /* 파손 페이지이므로 타이틀 색상을 붉은색 톤으로 변경 */
	margin: 0;
	display: flex;
	align-items: center;
	gap: 8px;
}

.breadcrumb-text {
	font-size: 12px;
	color: #888;
}

/* ===== 화물 유형 토글 (4종) ===== */
.toggle-group {
	display: inline-flex;
	background-color: #f3f4f6;
	padding: 4px;
	border-radius: 8px;
	gap: 2px;
}

.toggle-btn {
	padding: 8px 18px;
	border: none;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	background: transparent;
	color: #6b7280;
	transition: all 0.2s;
	white-space: nowrap;
}

.toggle-btn.active {
	background-color: #dc3545; /* 활성화 색상도 붉은 톤으로 통일 */
	color: #fff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* ===== 검색 바 & 기타 (기존과 동일) ===== */
.search-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 16px; background: #f8f9fa; border-top: 2px solid #dc3545; border-bottom: 1px solid #ddd; margin-bottom: 16px; }
.search-label { font-weight: 600; font-size: 12px; color: #374151; white-space: nowrap; }
.search-bar .form-select, .search-bar .form-input { height: 30px; padding: 0 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; color: #374151; background: #fff; box-sizing: border-box; }
.search-bar .form-select { min-width: 100px; cursor: pointer; }
.search-bar .form-input { width: 180px; }

/* 💡 날짜 입력창 크기를 일시(datetime-local)에 맞게 넓힘 */
.search-bar input[type="datetime-local"].form-input { width: 175px; font-family: inherit; }

.search-divider { width: 1px; height: 20px; background: #d1d5db; margin: 0 4px; }
.btn-search { height: 30px; padding: 0 18px; background: #4b5563; color: #fff; border: none; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; margin-left: auto; }
.btn-search:hover { background: #374151; }
.btn-reset { height: 30px; padding: 0 14px; background: #fff; color: #6b7280; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-reset:hover { background: #f3f4f6; }

.stats-bar { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #4b5563; margin-bottom: 10px; padding: 8px 14px; background: #fff1f2; border-radius: 6px; border-left: 3px solid #dc3545; }
.stats-value { font-weight: 700; color: #dc3545; }

/* 뱃지 및 기타 스타일 생략 (기존과 동일하게 유지) */
.badge { padding: 4px 10px; border-radius: 6px; color: #fff; font-size: 11px; font-weight: 600; display: inline-block; min-width: 80px; text-align: center; line-height: 1.2; box-shadow: 0 1px 2px rgba(0,0,0,0.1); letter-spacing: -0.3px; }
.badge.bonded-in { background-color: #3b82f6; } 
.badge.bonded { background-color: #2563eb; } 
.badge.local-in { background-color: #06b6d4; } 
.badge.local { background-color: #0891b2; } 
.badge.waiting { background-color: #f59e0b; } 
.badge.reviewing { background-color: #ea580c; } 
.badge.physical { background-color: #d97706; } 
.badge.supplement { background-color: #b45309; } 
.badge.accepted { background-color: #10b981; } 
.badge.approved { background-color: #059669; } 
.badge.wh-in-approved { background-color: #34d399; color: #064e3b; } 
.badge.rel-approved { background-color: #6ee7b7; color: #064e3b; } 
.badge.insp-done { background-color: #14b8a6; } 
.badge.pay-waiting { background-color: #d946ef; } 
.badge.pay-completed { background-color: #8b5cf6; } 
.badge.rejected { background-color: #ef4444; } 
.badge.wh-in-rejected { background-color: #b91c1c; } 
.badge.rel-rejected { background-color: #991b1b; } 
.badge.delivered { background-color: #6b7280; } 
.badge.unknown { background-color: #9ca3af; } 
</style>

<div class="ag-grid-container">

	<div class="page-header">
		<div>
			<h2 class="page-title"><i class="fas fa-exclamation-triangle"></i> 파손 화물 현황</h2>
			<div class="breadcrumb-text">
				<i class="fas fa-home"></i> Home &gt; 화물관리 &gt; 파손 화물 현황
			</div>
		</div>
		<div class="toggle-group">
			<button type="button" class="toggle-btn active" id="btn-all" onclick="changeCargoType('all')">전체 화물</button>
			<button type="button" class="toggle-btn" id="btn-undecl" onclick="changeCargoType('undecl')">미신고 화물</button>
			<button type="button" class="toggle-btn" id="btn-import" onclick="changeCargoType('import')">수입 화물</button>
			<button type="button" class="toggle-btn" id="btn-export" onclick="changeCargoType('export')">수출 화물</button>
		</div>
	</div>

	<div class="search-bar">
        <span class="search-label">등록일시</span> 
        <input type="datetime-local" id="s-dateFrom" class="form-input" title="시작 일시"> 
        <span style="font-size: 12px; color: #6b7280;">~</span> 
        <input type="datetime-local" id="s-dateTo" class="form-input" title="종료 일시">

		<div class="search-divider"></div>

		<span class="search-label">신고 상태</span> 
        <select id="s-status" class="form-select" style="min-width: 130px;">
			<option value="">전체</option>
			<option value="BONDED_IN">보세입고완료</option>
			<option value="BONDED">보세보관중</option>
            <option value="LOCAL_IN">국내창고입고완료</option>
			<option value="LOCAL">국내창고보관중</option>
			<option value="WAITING">심사대기</option>
			<option value="PHYSICAL">현품검사중</option>
			<option value="SUPPLEMENT">보완/정정</option>
			<option value="REVIEWING">심사중</option>
			<option value="ACCEPTED">수리</option>
			<option value="INSPECTION_COMPLETED">현품검사완료</option>
			<option value="REJECTED">반려</option>
			<option value="PAY_WAITING">납부 대기</option>
			<option value="PAY_COMPLETED">납부 완료</option>
			<option value="WH_IN_APPROVED">반입승인</option>
			<option value="WH_IN_REJECTED">반입차단</option>
			<option value="RELEASE_APPROVED">반출승인</option>
			<option value="RELEASE_REJECTED">반출차단</option>
			<option value="APPROVED">통관승인</option>
			<option value="DELIVERED">출고 완료</option>
		</select>

		<div class="search-divider"></div>

		<span class="search-label">검색</span> 
        <select id="s-searchField" class="form-select" style="min-width: 110px;">
			<option value="itemName">품명</option>
			<option value="contNo">컨테이너번호</option>
			<option value="declNo">신고번호</option>
			<option value="warehouseId">창고</option>
			<option value="positionArea">구역</option>
		</select> 
        <input type="text" id="s-keyword" class="form-input" placeholder="검색어 입력" onkeyup="if(event.keyCode===13) doSearch()">

		<button class="btn-reset" onclick="resetSearch()">
			<i class="fas fa-redo-alt"></i> 초기화
		</button>
		<button class="btn-search" onclick="doSearch()">
			<i class="fas fa-search"></i> 검색
		</button>
	</div>

	<div class="stats-bar" id="statsBar">
		<i class="fas fa-layer-group"></i> 총 파손 화물 <span class="stats-value" id="totalCountDisplay">0</span>건
	</div>

	<jsp:include page="/WEB-INF/components/AgGridList.jsp">
		<jsp:param name="gridId" value="damageTrackingGrid" />
		<jsp:param name="showSearch" value="false" />
		<jsp:param name="showActions" value="false" />
	</jsp:include>
</div>

<script>
// =========================================================
// [1] 전역 변수 (그리드 ID 변경)
// =========================================================
const GRID_ID          = 'damageTrackingGrid';
let currentCargoType   = 'all';
let originalData       = [];

// =========================================================
// [2] 상태코드 맵 (기존과 동일)
// =========================================================
const STATUS_MAP = {
    'BONDED_IN'            : { label: '보세입고완료',   cls: 'bonded-in' },
    'BONDED'               : { label: '보세보관중',     cls: 'bonded' },
    'LOCAL_IN'             : { label: '국내입고완료',   cls: 'local-in' },
    'LOCAL'                : { label: '국내보관중',     cls: 'local' },
    'WAITING'              : { label: '심사대기',       cls: 'waiting' },
    'REVIEWING'            : { label: '심사중',         cls: 'reviewing' },
    'PHYSICAL'             : { label: '현품검사중',     cls: 'physical' },
    'SUPPLEMENT'           : { label: '보완/정정',      cls: 'supplement' },
    'ACCEPTED'             : { label: '수리',           cls: 'accepted' },
    'INSPECTION_COMPLETED' : { label: '현품검사완료',   cls: 'insp-done' },
    'APPROVED'             : { label: '통관승인',       cls: 'approved' },
    'WH_IN_APPROVED'       : { label: '반입승인',       cls: 'wh-in-approved' },
    'RELEASE_APPROVED'     : { label: '반출승인',       cls: 'rel-approved' },
    'PAY_WAITING'          : { label: '납부 대기',      cls: 'pay-waiting' },
    'PAY_COMPLETED'        : { label: '납부 완료',      cls: 'pay-completed' },
    'REJECTED'             : { label: '반려',           cls: 'rejected' },
    'WH_IN_REJECTED'       : { label: '반입차단',       cls: 'wh-in-rejected' },
    'RELEASE_REJECTED'     : { label: '반출차단',       cls: 'rel-rejected' },
    'DELIVERED'            : { label: '출고 완료',      cls: 'delivered' }
};

// =========================================================
// [3] 헬퍼 함수
// =========================================================
const getGridApi = () => window[GRID_ID + '_api'];

const getCargoType = (item) => {
    if (!item.declNo || item.declNo.trim() === '') return 'undecl';
    const prefix = item.declNo.substring(0, 3).toUpperCase();
    if (prefix === 'IMP') return 'import';
    if (prefix === 'EXP') return 'export';
    return 'undecl';
};

const getStatus = (item) => {
    const type = getCargoType(item);
    if (type === 'import' && item.importMaster && item.importMaster.status) return item.importMaster.status;
    if (type === 'export' && item.exportMaster && item.exportMaster.status) return item.exportMaster.status;
    if (item.importMaster && item.importMaster.status) return item.importMaster.status;
    if (item.exportMaster && item.exportMaster.status) return item.exportMaster.status;
    return item.positionArea || '';
};

const cargoStatusRenderer = (params) => {
    const code = params.value || '';
    const m = STATUS_MAP[code];
    if (m) return '<span class="badge ' + m.cls + '">' + m.label + '</span>';
    return '<span class="badge unknown">' + (code || '-') + '</span>';
};

// =========================================================
// [4] 검색 / 초기화 / 토글
// =========================================================
const changeCargoType = (type) => {
    currentCargoType = type;
    ['all', 'undecl', 'import', 'export'].forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if (btn) btn.className = (t === type) ? 'toggle-btn active' : 'toggle-btn';
    });
    applyFiltersAndRender(false);
};

const doSearch = () => applyFiltersAndRender(false);

const resetSearch = () => {
    document.getElementById('s-dateFrom').value    = '';
    document.getElementById('s-dateTo').value      = '';
    document.getElementById('s-status').value      = '';
    document.getElementById('s-keyword').value     = '';
    document.getElementById('s-searchField').value = 'itemName';
    applyFiltersAndRender(false);
};

//=========================================================
//[5] 필터 적용 및 그리드 업데이트 (시간 비교 완벽 수정판)
//=========================================================
const applyFiltersAndRender = (isBackground) => {
 const api = getGridApi();
 if (!api) return;

 const rawDateFrom = document.getElementById('s-dateFrom').value;
 const rawDateTo   = document.getElementById('s-dateTo').value;

 // 💡 1. 검색할 시간을 문자열이 아닌 Date 객체(밀리초 숫자)로 변환
 const fromTime = rawDateFrom ? new Date(rawDateFrom).getTime() : null;
 const toTime   = rawDateTo   ? new Date(rawDateTo).getTime() : null;

 const statusVal   = document.getElementById('s-status').value;
 const keyword     = (document.getElementById('s-keyword').value || '').trim().toLowerCase();
 const searchField = document.getElementById('s-searchField').value;

 const filtered = originalData.filter(item => {
     // [핵심] 파손된 화물('Y')만 표시
     if (item.damagedYn !== 'Y') return false;

     if (currentCargoType !== 'all' && getCargoType(item) !== currentCargoType) return false;

     // 💡 2. 일시(Datetime) 숫자 비교 로직
     if (fromTime || toTime) {
         if (!item.regDate) return false;
         
         // DB 데이터에 띄어쓰기가 있다면 'T'로 바꿔서 Date 객체가 안전하게 인식하도록 처리
         const safeRegDate = item.regDate.replace(' ', 'T');
         const itemTime = new Date(safeRegDate).getTime();
         
         // 숫자로 변환된 시간끼리 정확하게 비교!
         if (fromTime && itemTime < fromTime) return false;
         if (toTime   && itemTime > toTime)   return false;
     }

     if (statusVal && getStatus(item) !== statusVal) return false;

     if (keyword) {
         let target = '';
         if      (searchField === 'itemName')     target = (item.itemName    || '').toLowerCase();
         else if (searchField === 'contNo')       target = (item.contNo      || '').toLowerCase();
         else if (searchField === 'declNo')       target = (item.declNo      || '').toLowerCase();
         else if (searchField === 'warehouseId')  target = (item.warehouseId || '').toLowerCase();
         else if (searchField === 'positionArea') target = (item.positionArea|| '').toLowerCase();
         if (!target.includes(keyword)) return false;
     }
     return true;
 });

 if (typeof api.setGridOption === 'function') {
     api.setGridOption('rowData', filtered);
 } else {
     api.setRowData(filtered);
 }

 const el = document.getElementById('totalCountDisplay');
 if (el) el.innerText = filtered.length.toLocaleString();

 if (!isBackground) {
     api.hideOverlay();
     if (filtered.length === 0) api.showNoRowsOverlay();
 }
};
// =========================================================
// [6] 데이터 로드
// =========================================================
const loadPageData = (isBackground) => {
    const api = getGridApi();
    
    if (!api) { 
        setTimeout(() => loadPageData(isBackground), 100); 
        return; 
    }
    
    if (!isBackground) api.showLoadingOverlay();

    axios.get('/rest/warehouse/list')
        .then(res => {
            originalData = res.data || [];
            applyFiltersAndRender(isBackground);
        })
        .catch(err => {
            console.error('데이터 로드 실패:', err);
            if (!isBackground) api.hideOverlay();
        });
};

// =========================================================
// [7] SSE 수신 함수
// =========================================================
function fetchSilentData() {
    loadPageData(true);
}

// =========================================================
// [8] 초기화
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

    const colDefs = [
        { headerName: '컨테이너 번호', field: 'contNo', width: 180, pinned: 'left', cellClass: 'cell-left' },
        { headerName: '신고 상태', width: 145, cellRenderer: cargoStatusRenderer, valueGetter: p => getStatus(p.data) },
        
        // 파손 내용 컬럼을 눈에 띄게 추가
        { 
            headerName: '파손 사유', 
            field: 'damagedComment', 
            width: 220, 
            cellRenderer: p => {
                return '<span style="color:#dc3545; font-weight:bold;">' + (p.value || '파손 사유 미기재') + '</span>';
            }
        },

        { headerName: '신고번호', field: 'declNo', width: 170 },
        { headerName: '창고', field: 'warehouseId', width: 120, valueGetter: p => p.data.warehouseId || '-' },
        { headerName: '품명', field: 'itemName', flex: 1, minWidth: 160, cellClass: 'cell-left' },
        { headerName: '최초등록일시', field: 'regDate', width: 160, valueGetter: p => p.data.regDate || '-' }
    ];

    initAgGrid(GRID_ID, {
        columnDefs: colDefs,
        rowData:    [],
        pageSize:   10,
        onRowClicked: e => {
            if (e.data && e.data.stockId) {
                location.href = '/client/cargo/status/detail?stockNo=' + e.data.stockId;
            }
        }
    });

    loadPageData(false);

    if (typeof initGlobalSSE === 'function') {
        initGlobalSSE(["WAREHOUSE_REFRESH", "IMPORT_REFRESH", "EXPORT_REFRESH"], fetchSilentData);
    }
});
</script>