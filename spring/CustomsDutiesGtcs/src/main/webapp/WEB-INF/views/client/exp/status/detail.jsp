<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<link rel="stylesheet"
	href="/css/shipper/ims/importreport/importstatusdetail.css">

<style>
/* 1. 레이아웃 및 탭 */
.tab-navigation {
	display: flex;
	border-bottom: 2px solid #0f4c81;
	margin-bottom: 0;
	background: transparent;
	margin-top: 20px;
}

.tab-btn {
	padding: 12px 20px;
	background: #f8f9fa;
	border: 1px solid #ddd;
	border-bottom: none;
	cursor: pointer;
	font-weight: bold;
	color: #666;
	margin-right: 4px;
	border-radius: 5px 5px 0 0;
	transition: all 0.2s;
	font-size: 13px;
}

.tab-btn:hover {
	background: #e9ecef;
	color: #0f4c81;
}

.tab-btn.active {
	background: #0f4c81;
	color: #fff;
	border-color: #0f4c81;
}

.tab-pane {
	display: none;
	background: #fff;
	padding: 30px;
	border: 1px solid #ddd;
	border-top: none;
	animation: fadeIn 0.3s ease-in-out;
	min-height: 300px;
}

.tab-pane.active {
	display: block;
}

@keyframes fadeIn {from { opacity:0;
	transform: translateY(5px);
}

to {
	opacity: 1;
	transform: translateY(0);
}

}

/* 2. 첨부파일 및 기타 스타일 */
.file-view-group {
	margin-bottom: 30px;
}

.file-group-title {
	font-size: 14px;
	font-weight: bold;
	color: #333;
	margin-bottom: 10px;
	border-left: 3px solid #0f4c81;
	padding-left: 10px;
}

.btn-file-del {
	color: #dc3545;
	background: none;
	border: none;
	font-weight: bold;
	cursor: pointer;
	padding: 5px 10px;
	margin-left: 10px;
	font-size: 14px;
}

.btn-file-del:hover {
	background-color: #ffe6e6;
	border-radius: 4px;
}

/* 3. 상태 피드백 박스 & 에러 */
.customs-feedback-box {
	animation: fadeIn 0.4s ease-out;
	background-color: #fff3cd;
	border: 1px solid #ffecb5;
	border-left: 5px solid #fd7e14;
	padding: 20px;
	margin-bottom: 20px;
	border-radius: 4px;
	display: none;
}

.customs-feedback-box.error {
	border-left-color: #dc3545;
	background-color: #f8d7da;
	border-color: #f5c6cb;
}

.customs-feedback-box h4 {
	margin: 0 0 10px 0;
	font-size: 15px;
	font-weight: bold;
	display: flex;
	align-items: center;
	gap: 8px;
}

.customs-feedback-box p {
	margin: 0;
	font-size: 13px;
	line-height: 1.6;
	color: #333;
}

.field-error {
	border: 2px solid #dc3545 !important;
	background-color: #fff !important;
	box-shadow: 0 0 5px rgba(220, 53, 69, 0.3);
}

/* 4. 로그 테이블 */
.log-table {
	width: 100%;
	border-top: 2px solid #666;
	border-collapse: collapse;
	margin-top: 10px;
}

.log-table th {
	background: #f8f9fa;
	padding: 12px;
	border-bottom: 1px solid #ccc;
	font-size: 13px;
	color: #333;
	font-weight: 600;
	text-align: center;
}

.log-table td {
	padding: 12px;
	border-bottom: 1px solid #eee;
	font-size: 13px;
	color: #555;
	text-align: center;
}

.log-table td.text-left {
	text-align: left;
}

/* 5. 폼 제어 */
.form-table input:not([readonly]), .form-table select:not([disabled]),
	.form-table textarea:not([readonly]) {
	pointer-events: auto !important;
	position: relative !important;
	z-index: 10 !important;
	cursor: text !important;
}

/* 6. 헤더 정보 박스 */
.decl-info-box {
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-left: 4px solid #0f4c81;
	padding: 15px 20px;
	margin: 15px 0;
	border-radius: 4px;
	display: flex;
	align-items: center;
	gap: 20px;
}

.decl-info-item {
	display: flex;
	align-items: center;
	gap: 10px;
}

.decl-info-label {
	font-size: 13px;
	color: #666;
	font-weight: 600;
}

.decl-info-value {
	font-size: 15px;
	color: #0f4c81;
	font-weight: bold;
	font-family: 'Courier New', monospace;
}

/* 7. 뱃지 스타일 */
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

/* 필수 증빙 서류 테이블 디자인 */
.essential-table {
	width: 100%;
	border-collapse: collapse;
	margin: 15px 0 30px 0;
	border-top: 2px solid #0f4c81;
}

.essential-table th {
	background-color: #fcfcfc;
	color: #333;
	font-weight: 600;
	padding: 15px;
	border: 1px solid #e1e4e8;
	text-align: left;
	width: 250px;
	font-size: 13px;
	display: table-cell;
	vertical-align: middle;
}

.essential-table td {
	vertical-align: middle !important;
	padding: 10px 20px !important;
	background-color: #fff;
	border: 1px solid #e1e4e8;
}

.file-slot-active {
	background-color: #f8fbff !important;
}

/* 파일 테이블 */
.file-list-table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 10px;
}

.file-list-table th {
	background: #f8f9fa;
	color: #333;
	padding: 12px;
	border: 1px solid #ddd;
	font-size: 13px;
	font-weight: 600;
}

.file-list-table td {
	padding: 10px;
	border: 1px solid #ddd;
	text-align: center;
	font-size: 13px;
}

/* 섹션 소제목 */
.section-subtitle {
	font-size: 15px;
	color: #0f4c81;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 20px;
	margin-bottom: 10px;
}

.section-subtitle::before {
	content: '';
	display: inline-block;
	width: 4px;
	height: 16px;
	background: #0f4c81;
	border-radius: 2px;
}

/* 파일 링크 */
.file-link {
	text-decoration: none;
	color: #0f4c81;
	font-weight: 600;
	font-size: 14px;
	display: inline-block;
	max-width: 400px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	vertical-align: middle;
}

.file-link:hover {
	text-decoration: underline;
}

/* 헤더 */
.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
	margin-bottom: 15px;
	border-bottom: 1px solid #eee;
}

.title-area {
	display: flex;
	align-items: center;
}

.action-buttons {
	display: flex;
	gap: 8px;
	flex-wrap: nowrap;
}

.action-buttons button {
	display: flex;
	align-items: center;
	gap: 5px;
	padding: 8px 15px;
	font-size: 13px;
	font-weight: 600;
	white-space: nowrap;
	cursor: pointer;
	border-radius: 4px;
}

/* 버튼 및 배지 UI 추가 */
.th-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.btn-file-change {
	padding: 4px 8px;
	background: #0f4c81;
	color: #fff;
	border: none;
	border-radius: 3px;
	cursor: pointer;
	font-size: 11px;
	white-space: nowrap;
	display: none;
}

.btn-file-change:hover {
	background: #09345a;
}

.new-file-badge {
	display: inline-block;
	background-color: #28a745;
	color: white;
	font-size: 11px;
	padding: 2px 6px;
	border-radius: 10px;
	margin-right: 5px;
	vertical-align: middle;
}

.pending-file-text {
	color: #28a745;
	font-weight: bold;
	font-size: 13px;
}

/* ===== 조회/환율조회 버튼 (슬림 네이비) ===== */
.btn-lookup {
	display: inline-flex;
	align-items: center !important;
	justify-content: center !important;
	height: 26px !important;
	padding: 0 10px !important;
	background: #4a5568 !important;
	color: #fff !important;
	border: none !important;
	border-radius: 4px !important;
	font-size: 11px !important;
	font-weight: 600 !important;
	cursor: pointer !important;
	transition: background-color 0.2s, transform 0.1s !important;
	line-height: 1 !important;
	white-space: nowrap !important;
}

.btn-lookup:hover {
	background-color: #2d3748 !important;
	transform: translateY(-1px);
}

.btn-lookup:active {
	transform: translateY(0);
}
</style>

<div class="main-content">

	<div class="page-breadcrumb">
		<i class="fas fa-home"></i> 홈 > 수출통관 > 수출신고현황 > 상세조회
	</div>

	<div class="detail-header">
		<div class="title-area">
			<h2 class="page-title">
				수출신고서 상세조회 <span id="statusBadge" class="badge wait"
					style="vertical-align: middle; margin-left: 10px;"></span>
			</h2>
		</div>

		<div class="action-buttons">
			<button id="btnPrintCert" class="btn-print" style="display: none;" onclick="printExportCertificate()">
				<i class="fas fa-file-invoice"></i> 필증 출력
			</button>

			<button id="btnSubmitAction" class="btn-primary"
				style="display: none;" onclick="handleFinalSubmit()">
				<i class="fas fa-check-circle"></i> <span id="btnSubmitText">내역
					제출</span>
			</button>

			<button class="btn-secondary" onclick="history.back()">목록</button>
		</div>
	</div>

	<div class="decl-info-box">
		<div class="decl-info-item">
			<span class="decl-info-label"><i class="fas fa-file-alt"></i>
				수출신고번호:</span> <span class="decl-info-value" id="declNoDisplay">-</span>
		</div>
		<div class="decl-info-item">
			<span class="decl-info-label"><i class="fas fa-calendar-alt"></i>
				신고일자:</span> <span class="decl-info-value" id="declDateDisplay">-</span>
		</div>
	</div>

	<div class="scrollable-content">

		<div id="customsFeedbackArea" class="customs-feedback-box">
			<h4>
				<i class="fas fa-exclamation-triangle"></i> <span id="feedbackTitle">세관
					요구사항</span>
			</h4>
			<p id="feedbackContent">내용이 여기에 표시됩니다.</p>
		</div>

		<div class="status-tabs">
			<div class="tab-btn active" onclick="switchTab('tab1', this)">1.
				공통사항1</div>
			<div class="tab-btn" onclick="switchTab('tab2', this)">2. 공통사항2</div>
			<div class="tab-btn" onclick="switchTab('tab3', this)">3. 물품정보</div>
			<div class="tab-btn" onclick="switchTab('tab4', this)">4. 첨부파일</div>
		</div>

		<div id="tab1" class="tab-pane active">
			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportCommon.jsp" />
		</div>
		<div id="tab2" class="tab-pane">
			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportCommon2.jsp" />
		</div>
		<div id="tab3" class="tab-pane">
			<jsp:include
				page="/WEB-INF/views/client/exp/expwrite/exportItemDetails.jsp" />
		</div>
		<div id="tab4" class="tab-pane">
			<div class="file-view-group">
				<span class="section-subtitle">증빙 서류 관리</span>
				<table class="essential-table">
					<colgroup>
						<col style="width: 35%">
						<col style="width: 65%">
					</colgroup>
					<tr>
						<th>
							<div class="th-content">
								<span>1. 인보이스 (Invoice) <span style="color: red">*</span></span>
								<span id="action-INVOICE"></span>
							</div>
						</th>
						<td id="cell-invoice"><span class="file-name-display"
							style="color: #ccc;">등록된 파일 없음</span></td>
					</tr>
					<tr>
						<th>
							<div class="th-content">
								<span>2. 패킹리스트 (Packing List) <span style="color: red">*</span></span>
								<span id="action-PACKINGLIST"></span>
							</div>
						</th>
						<td id="cell-packing"><span class="file-name-display"
							style="color: #ccc;">등록된 파일 없음</span></td>
					</tr>
					<tr>
						<th>
							<div class="th-content">
								<span>3. 선하증권 (B/L) <span style="color: red">*</span></span> <span
									id="action-BL"></span>
							</div>
						</th>
						<td id="cell-bl"><span class="file-name-display"
							style="color: #ccc;">등록된 파일 없음</span></td>
					</tr>
					<tr>
						<th>
							<div class="th-content">
								<span>4. 기타 첨부파일</span> <span id="action-OTHER"></span>
							</div>
						</th>
						<td id="cell-other"><span class="file-name-display"
							style="color: #ccc;">등록된 파일 없음</span></td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>

<script>
    // [1] 전역 변수 설정
    let g_exportData = null;
    let g_pendingFiles = {};
    let g_pendingOtherFiles = [];
    
    const API_URL = '/rest/export';
    const FILE_API_URL = '/rest/file';

    const FIELD_MAPPING = {
        exporterName: 'txtExporterName',      repName: 'txtExporterRep',
        bizRegNo: 'txtBizRegNo',             buyerIdNo: 'txtExporterIdNo',
        customsId: 'txtExporterCustomsCode',  buyerName: 'txtBuyerName',
        buyerAddress: 'txtBuyerCode',        dclType: 'selDclType',
        transMode: 'selTransMode',           exportKind: 'selExportKind',
        paymentMethod: 'selPaymentMethod',    incoterms: 'selIncoterms',
        destCountry: 'txtDestCountry',       loadingPort: 'txtLoadPort',
        transportMode: 'selTransportMode',    containerMode: 'selContainerMode',
        goodsLoc: 'txtGoodsLoc',             goodsType: 'selGoodsType',
        refundApplicant: 'selRefundApplicant',
        exchangeRate: 'txtExchangeRate',      currencyCode: 'selCurrencyCode',
        payAmount: 'txtPaymentAmount',       freightAmt: 'txtFreightKRW',
        insuranceAmt: 'txtInsuranceKRW',     cargoMgmtNo: 'txtCargoMgmtNo',
        bondedRepName: 'txtBondedReporter',   carrierName: 'txtCarrierCode',
        vesselName: 'txtVesselName',         loadingLoc: 'txtLoadBondedArea',
        contNo: 'txtContNo',
        invoiceNo: 'txtInvoiceNo',           hsCode: 'txtHsCode',
        itemNameDeclared: 'txtGoodsDesc',     itemNameTrade: 'txtTradeName',
        brandName: 'txtBrandName',           modelName: 'txtModelSpec',
        qty: 'txtQty',                       qtyUnit: 'selQtyUnit',
        unitPrice: 'txtUnitPrice',           totalDeclAmt: 'txtAmount',
        totalWeight: 'txtNetWeight',         totalPackCnt: 'txtPackageQty',
        originCountry: 'txtOriginCountry',    originCriteria: 'selOriginCriteria',
        originMarkYn: 'selOriginMarkYn',     originCertType: 'selOriginCertType',
        invoiceSign: 'selInvoiceSign',       attachYn: 'txtAttachYn'
    };

    document.addEventListener("DOMContentLoaded", function() {
        initPageLayout();
        const urlParams = new URLSearchParams(window.location.search);
        const exportId = urlParams.get('id');

        if (exportId) {
            fetchExportDetail(exportId);
            
            if (typeof initGlobalSSE === 'function') {
                initGlobalSSE(["EXPORT_REFRESH", "WAREHOUSE_REFRESH", "IMPORT_REFRESH"], function() {
                    console.log("🔄 [수출 상세화면] 수입/수출/창고 상태가 변경되어 최신 데이터를 다시 불러옵니다.");
                    fetchExportDetail(exportId); 
                });
            }
            
        } else {
            // 💡 잘못된 접근 Swal
            Swal.fire({
                icon: 'warning',
                title: '잘못된 접근',
                text: '조회할 데이터 ID가 없습니다.',
                confirmButtonColor: '#0f4c81',
                confirmButtonText: '이전으로',
                scrollbarPadding: false,
                heightAuto: false
            }).then(() => {
                history.back();
            });
        }
    });

    /* 수출신고 필증 출력 - iframe 백그라운드 인쇄 방식         */
    function printExportCertificate() {
        if (!g_exportData) { 
            // 💡 데이터 로드 전 인쇄 시도 Swal
            Swal.fire({
                icon: 'info',
                title: '데이터 확인 중',
                text: '데이터가 아직 로드되지 않았습니다.',
                confirmButtonColor: '#0f4c81',
                confirmButtonText: '확인',
                scrollbarPadding: false,
                heightAuto: false
            });
            return; 
        }
        const d = g_exportData;
        function V(v, f) { return (v != null && v !== '') ? String(v) : (f || ''); }
        function F(v) {
            if (!v && v !== 0) return '0';
            const n = Number(String(v).replace(/,/g, ''));
            return isNaN(n) ? String(v) : n.toLocaleString();
        }
        const DCL = { 'H': 'H (서류제출)', 'P': 'P (P/L)' };
        const TRANS = { '11': '11 (일반수출)', '15': '15 (위탁가공)' };
        const TMODE = { '10': '선박', '40': '항공' };
        const CMODE = { 'FCL': 'FCL (컨테이너)', 'LCL': 'LCL (소량화물)', 'BULK': 'BULK (산적화물)' };
        const GTYPE = { 'N': '신품', 'O': '중고품', 'D': '손상물품' };
        const PAY = { 'TT': 'TT (송금)', 'LC': 'LC (신용장)' };

        let b = '';
        b += '<div class="hdr"><div class="logo">G-TCS</div><div class="hm"><h1>수 출 신 고 필 증</h1></div><div class="hr"><div class="bdg">감 &nbsp; 지</div></div></div>';

        b += '<table><colgroup><col style="width:10%"><col style="width:20%"><col style="width:7%"><col style="width:15%"><col style="width:8%"><col style="width:12%"><col style="width:8%"><col style="width:20%"></colgroup>';
        b += '<tr><th><span class="cn">①</span>신고번호</th><td class="v">' + V(d.exportNumber) + '</td><th><span class="cn">②</span>신고일</th><td class="v">' + V(d.submitDate) + '</td><th><span class="cn">③</span>세관·과</th><td class="v">' + V(d.customsOffice) + '</td><th><span class="cn">④</span>신고구분</th><td class="v">' + V(DCL[d.dclType] || d.dclType) + '</td></tr></table>';

        b += '<table><colgroup><col style="width:4.5%"><col style="width:8%"><col style="width:22%"><col style="width:10%"><col style="width:15%"><col style="width:10%"><col style="width:30.5%"></colgroup>';
        b += '<tr><th rowspan="4" class="vt"><span class="cn">⑤</span>수출자</th><th>(상호)</th><td class="l v">' + V(d.exporterName) + '</td><th>거래구분</th><td class="c v">' + V(TRANS[d.transMode] || d.transMode) + '</td><th>수출종류</th><td class="v">' + V(d.exportKind) + '</td></tr>';
        b += '<tr><th>(대표자)</th><td class="l v">' + V(d.repName) + '</td><th>결제방법</th><td class="c v">' + V(PAY[d.paymentMethod] || d.paymentMethod) + '</td><th>인도조건</th><td class="v">' + V(d.incoterms) + '</td></tr>';
        b += '<tr><th>(부호)</th><td class="v">' + V(d.customsId) + '</td><th>사업자등록번호</th><td class="v" colspan="3">' + V(d.bizRegNo) + '</td></tr>';
        b += '<tr><th>식별번호</th><td class="v" colspan="5">' + V(d.buyerIdNo) + '</td></tr>';

        b += '<tr><th rowspan="2" class="vt"><span class="cn">⑥</span>구매자</th><th>(상호)</th><td class="l v" colspan="5">' + V(d.buyerName) + '</td></tr>';
        b += '<tr><th>(주소)</th><td class="l v" colspan="5">' + V(d.buyerAddress) + '</td></tr></table>';

        b += '<div class="bar"><span class="cn">⑦</span> 운송 / 물류 정보</div>';
        b += '<table><colgroup><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:22%"></colgroup>';
        b += '<tr><th>도착국</th><td class="v">' + V(d.destCountry) + '</td><th>적재항</th><td class="v">' + V(d.loadingPort) + '</td><th>운송수단</th><td class="c v">' + V(TMODE[d.transportMode] || d.transportMode) + '</td></tr>';
        b += '<tr><th>운송용기</th><td class="v">' + V(CMODE[d.containerMode] || d.containerMode) + '</td><th>물품소재지</th><td class="v">' + V(d.goodsLoc) + '</td><th>물품상태</th><td class="c v">' + V(GTYPE[d.goodsType] || d.goodsType) + '</td></tr>';
        b += '<tr><th>선박명(편명)</th><td class="v">' + V(d.vesselName) + '</td><th>선박회사(항공사)</th><td class="v">' + V(d.carrierName) + '</td><th>컨테이너번호</th><td class="v">' + V(d.contNo) + '</td></tr>';
        b += '<tr><th>화물관리번호</th><td class="v">' + V(d.cargoMgmtNo) + '</td><th>보세운송신고인</th><td class="v">' + V(d.bondedRepName) + '</td><th>적재예정보세구역</th><td class="v">' + V(d.loadingLoc) + '</td></tr></table>';

        b += '<div class="bar"><span class="cn">⑧</span> 결제 정보</div>';
        b += '<table><colgroup><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:22%"></colgroup>';
        b += '<tr><th>통화코드</th><td class="c v">' + V(d.currencyCode) + '</td><th>결제금액</th><td class="r v">' + (d.payAmount ? F(d.payAmount) : '') + '</td><th>적용환율</th><td class="r v">' + V(d.exchangeRate) + '</td></tr>';
        b += '<tr><th>운임료(KRW)</th><td class="r v">' + F(d.freightAmt) + '</td><th>운송보험료(KRW)</th><td class="r v">' + F(d.insuranceAmt) + '</td><th>인도조건</th><td class="c v">' + V(d.incoterms) + '</td></tr></table>';

        b += '<table><colgroup><col style="width:50%"><col style="width:50%"></colgroup>';
        b += '<tr><td class="l" style="font-weight:700;padding-left:5px;border-bottom:none"><span class="cn">⑨</span>품명·규격 <span class="sm">(란번호/총란수:<span class="v">001/001</span>)</span></td><td style="border-bottom:none"></td></tr>';
        b += '<tr><td style="border-top:none"><b>HS부호:</b> <span class="v">' + V(d.hsCode) + '</span></td><td style="border-top:none"><b>인보이스번호:</b> <span class="v">' + V(d.invoiceNo) + '</span></td></tr></table>';

        b += '<table><colgroup><col style="width:11%"><col style="width:89%"></colgroup>';
        b += '<tr><th><span class="cn">⑩</span>수출물품명</th><td class="v">' + V(d.itemNameDeclared) + '</td></tr>';
        b += '<tr><th><span class="cn">⑪</span>거래품명</th><td class="v">' + V(d.itemNameTrade) + '</td></tr></table>';

        b += '<table><colgroup><col style="width:10%"><col style="width:22%"><col style="width:6%"><col style="width:14%"><col style="width:6%"><col style="width:14%"><col style="width:6%"><col style="width:22%"></colgroup>';
        b += '<tr><th><span class="cn">⑫</span>모델·규격</th><td class="v">' + V(d.modelName) + '</td><th><span class="cn">⑬</span>수량</th><td class="r v">' + (d.qty ? F(d.qty) + (d.qtyUnit ? ' ' + d.qtyUnit : '') : '') + '</td><th><span class="cn">⑭</span>단가</th><td class="r v">' + V(d.unitPrice) + '</td><th><span class="cn">⑮</span>금액</th><td class="r v">' + (d.totalDeclAmt ? F(d.totalDeclAmt) : '') + '</td></tr></table>';

        b += '<table><colgroup><col style="width:8%"><col style="width:12%"><col style="width:4%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:16%"></colgroup>';
        b += '<tr><th><span class="cn">⑯</span>총중량</th><td class="r v">' + (d.totalWeight ? F(d.totalWeight) : '') + '</td><td class="c sm">KG</td><th><span class="cn">⑰</span>원산지</th><td class="c v">' + V(d.originCountry) + '</td><th>원산지표시</th><td class="c v">' + V(d.originMarkYn) + '</td><th>상표명</th><td class="v" colspan="2">' + V(d.brandName) + '</td></tr></table>';

        b += '<table><colgroup><col style="width:12%"><col style="width:15%"><col style="width:12%"><col style="width:15%"><col style="width:15%"><col style="width:15%"><col style="width:16%"></colgroup>';
        b += '<tr><th><span class="cn">⑱</span>전체포장개수</th><td class="r v">' + F(d.totalPackCnt) + '</td><th>원산지증명발급</th><td class="c v">' + V(d.originCertType) + '</td><th>인보이스서명</th><td class="c v">' + V(d.invoiceSign) + '</td><td></td></tr></table>';

        b += '<div class="bar"><span class="cn">⑲</span> 신고 요약</div>';
        b += '<table><colgroup><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:22%"></colgroup>';
        b += '<tr><th>총 신고금액</th><td class="r hl">' + (d.totalDeclAmt ? V(d.currencyCode) + ' ' + F(d.totalDeclAmt) : '') + '</td><th>총중량</th><td class="r v">' + (d.totalWeight ? F(d.totalWeight) + ' KG' : '') + '</td><th>총포장수</th><td class="r v">' + F(d.totalPackCnt) + '</td></tr></table>';

        b += '<table style="margin-bottom:3px"><colgroup><col style="width:8%"><col style="width:18%"><col style="width:8%"><col style="width:18%"><col style="width:48%"></colgroup>';
        b += '<tr><th>신고일</th><td class="v">' + V(d.submitDate) + '</td><th>수리일</th><td class="v">' + V(d.acceptDate || d.submitDate) + '</td><td></td></tr></table>';

        b += '<div class="ft" style="position:relative"><div class="fti"><div><b>발행번호:</b><br><span style="margin-top:2px;display:inline-block"><b>세관·과:</b> <span class="v">' + V(d.customsOffice) + '</span> &nbsp;&nbsp; <b>신고번호:</b> <span class="v">' + V(d.exportNumber) + '</span></span></div><div style="font-size:8px;color:#999">Page: 1/1</div></div>';
        b += '<div style="margin-top:4px;line-height:1.6">\u203B 본 신고필증은 발행 후 세관 심사시 등에 따라 정정, 수정할 수 있으므로 정확한 내용은 G-TCS 통관포탈에서 확인하시기 바랍니다.<br>\u203B 본 수출신고필증은 세관에서 행정적 요건만을 심사하므로 신고물품이 사실과 다른 때에는 신고인 또는 수출화주가 책임져야 합니다.<br>\u203B 본 신고필증은 전자문서로 발행된 것이며, 진위여부 확인은 G-TCS 통관포탈에서 확인할 수 있습니다.</div>';
        b += '<div class="stamp">G-TCS</div></div>';
        b += '<div class="fc">\u00A9 2026 G-TCS Global Trade Customs System. All rights reserved.</div>';

        const fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>\uC218\uCD9C\uC2E0\uACE0\uD544\uC99D</title><style>' +
            '*{box-sizing:border-box;margin:0;padding:0}' +
            '@page{size:A4 portrait;margin:5mm 7mm}' +
            'body{font-family:"Malgun Gothic",sans-serif;font-size:10px;color:#111;background:#fff;line-height:1.3;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
            '.pg{width:196mm;margin:0 auto;position:relative}' +
            'table{width:100%;border-collapse:collapse;border:1.5px solid #333;margin-bottom:2px}' +
            'th,td{border:.6px solid #999;padding:3.5px 5px;vertical-align:middle;font-size:10px;line-height:1.3}' +
            'th{background:#f0f2f4;font-weight:700;text-align:center;color:#222;white-space:nowrap}' +
            'td{background:#fff}' +
            '.v{color:#003d7a;font-weight:600;font-family:Consolas,"Courier New",monospace;font-size:10px}' +
            '.r{text-align:right}.c{text-align:center}.l{text-align:left}' +
            '.vt{writing-mode:vertical-rl;letter-spacing:3px;font-size:10px;padding:5px 2px!important}' +
            '.bar{background:#0f4c81;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;margin:3px 0 2px;border-radius:2px;letter-spacing:.5px}' +
            '.cn{font-weight:900;margin-right:2px;font-size:10px}' +
            '.sm{font-size:8.5px;color:#666}' +
            '.hl{font-weight:900;color:#c0392b;font-size:12px}' +
            '.hdr{display:flex;align-items:flex-start;margin-bottom:5px;padding-bottom:4px;border-bottom:2px solid #0f4c81}' +
            '.logo{width:55px;height:55px;border:2.5px solid #0f4c81;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;color:#0f4c81;font-weight:900;letter-spacing:1px}' +
            '.hm{flex:1;text-align:center}.hm h1{font-size:24px;font-weight:900;letter-spacing:10px;margin-top:8px;color:#111}' +
            '.hr{text-align:right;min-width:60px}.hr .bdg{border:1.5px solid #333;padding:1px 12px;font-size:11px;font-weight:700;display:inline-block}' +
            '.stamp{position:absolute;bottom:8px;right:10px;width:70px;height:70px;border:3px solid rgba(15,76,129,.25);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;color:rgba(15,76,129,.35);font-weight:900;text-align:center;transform:rotate(-12deg);letter-spacing:1px}' +
            '.ft{margin-top:6px;font-size:8px;color:#666;line-height:1.5}' +
            '.fti{display:flex;justify-content:space-between;align-items:center;padding-top:3px;border-top:1.5px solid #333;font-size:9.5px;margin-top:4px}' +
            '.fc{margin-top:5px;text-align:center;font-size:8.5px;color:#aaa;padding-top:3px;border-top:1px solid #ddd}' +
            '</style></head><body><div class="pg">' + b + '</div></body></html>';

        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);

        const printIframe = document.createElement('iframe');
        printIframe.style.position = 'fixed';
        printIframe.style.right = '0';
        printIframe.style.bottom = '0';
        printIframe.style.width = '0';
        printIframe.style.height = '0';
        printIframe.style.border = '0';
        printIframe.src = blobUrl;

        document.body.appendChild(printIframe);

        printIframe.onload = function() {
            setTimeout(function() {
                printIframe.contentWindow.focus();
                printIframe.contentWindow.print();
                URL.revokeObjectURL(blobUrl);
                setTimeout(function() {
                    document.body.removeChild(printIframe);
                }, 1000);
            }, 300);
        };
    }

    // [2] 데이터 상세 정보 호출
    function fetchExportDetail(id) {
        axios.get(`\${API_URL}/\${id}`, { params: { memRole: 'UA' } })
            .then(response => {
                console.log("📦 서버 응답 전체:", response);
                g_exportData = response.data;
                if (!g_exportData) { 
                    // 💡 상세 조회 실패 Swal
                    Swal.fire({
                        icon: 'error',
                        title: '조회 실패',
                        text: '데이터가 존재하지 않습니다.',
                        confirmButtonColor: '#0f4c81',
                        confirmButtonText: '확인',
                        scrollbarPadding: false,
                        heightAuto: false
                    }).then(() => {
                        history.back();
                    });
                    return; 
                }

                bindDataToForm(g_exportData);
                renderContainerList(g_exportData.containerList);

                document.getElementById('declNoDisplay').innerText = g_exportData.exportNumber || '-';
                document.getElementById('declDateDisplay').innerText = g_exportData.submitDate || '-';

                renderAttachments(g_exportData.fileList || []);
                applyPageStatus(g_exportData);
                
                if (g_exportData.logs) renderLogs(g_exportData.logs);
                showFeedbackBox(g_exportData);

                if (g_exportData.errorFields && g_exportData.errorFields.length > 0) {
                    highlightErrorFields(g_exportData.errorFields);
                }
            })
            .catch(error => {
                console.error("❌ 상세 정보 로드 실패:", error);
                // 💡 통신 오류 Swal
                Swal.fire({
                    icon: 'error',
                    title: '서버 오류',
                    text: '데이터 조회 중 오류가 발생했습니다.',
                    confirmButtonColor: '#dc3545',
                    confirmButtonText: '확인',
                    scrollbarPadding: false,
                    heightAuto: false
                });
            });
    }

    // [3] 첨부파일 렌더링
    function renderAttachments(fileList) {
        const uiMap = {
            'INVOICE':     { viewId: 'cell-invoice', actionId: 'action-INVOICE' },
            'PACKINGLIST': { viewId: 'cell-packing', actionId: 'action-PACKINGLIST' },
            'BL':          { viewId: 'cell-bl',      actionId: 'action-BL' },
            'OTHER':       { viewId: 'cell-other',   actionId: 'action-OTHER' }
        };

        Object.keys(uiMap).forEach(type => {
            const target = uiMap[type];
            const viewCell = document.getElementById(target.viewId);
            const actionSpan = document.getElementById(target.actionId);
            if(viewCell) {
                viewCell.innerHTML = `<div id="view-\${type}"><span class="file-name-display" style="color:#ccc;">등록된 파일 없음</span></div>`;
                viewCell.closest('td').classList.remove('file-slot-active');
            }
            if(actionSpan) actionSpan.innerHTML = '';
        });

        if (fileList && fileList.length > 0) {
            fileList.forEach(file => {
                let typeRaw = (file.fileType || '').toUpperCase().replace(/[\s_-]/g, '');
                let typeKey = 'OTHER';
                if (typeRaw === 'INVOICE') typeKey = 'INVOICE';
                else if (typeRaw.includes('PACKING') || typeRaw === 'PL') typeKey = 'PACKINGLIST';
                else if (typeRaw === 'BL') typeKey = 'BL';

                const fileName = file.fileName || '';
                const iconData = getFileIcon(fileName);
                const fileLinkHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 5px 0;">
                        <i class="fas \${iconData.class}" style="color: \${iconData.color}; font-size: 18px;"></i>
                        <a href="javascript:void(0);" onclick="downloadFileSwal('\${file.fileId}', '\${fileName}')" class="file-link" title="\${fileName}">\${fileName}</a>
                    </div>
                `;
                if (uiMap[typeKey]) {
                    const target = uiMap[typeKey];
                    const viewCell = document.getElementById(target.viewId);
                    const viewDiv = viewCell.querySelector(`#view-\${typeKey}`);
                    if(viewDiv) viewDiv.innerHTML = fileLinkHtml;
                    viewCell.closest('td').classList.add('file-slot-active');
                }
            });
        }

        Object.keys(uiMap).forEach(type => {
            const target = uiMap[type];
            const actionSpan = document.getElementById(target.actionId);
            if (actionSpan) {
                const accept = ".pdf,.jpg,.jpeg,.png,.xlsx,.xls";
                actionSpan.innerHTML = `
                    <input type="file" id="input-\${type}" style="display:none" accept="\${accept}" onchange="stageFileForUpload('\${type}', this)">
                    <button type="button" class="btn-file-change edit-only-btn" onclick="document.getElementById('input-\${type}').click()">
                        <i class="fas fa-folder-open"></i> \${type === 'OTHER' ? '파일 추가' : '파일 변경'}
                    </button>
                `;
            }
        });
    }

    // 파일 다운로드 에러 처리 함수
    function downloadFileSwal(fileId, fileName) {
        if (!fileId) {
            // 💡 파일 다운로드 실패 Swal
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
        location.href = `/download/\${fileId}`;
    }

    // [4] 파일 선택 핸들러
    function stageFileForUpload(type, input) {
        if (!input.files || input.files.length === 0) return;
        const file = input.files[0];
        if (file.size > 32 * 1024 * 1024) {
            // 💡 파일 용량 초과 Swal
            Swal.fire({
                icon: 'warning',
                title: '용량 초과',
                text: '파일 크기는 32MB를 초과할 수 없습니다.',
                confirmButtonColor: '#f59e0b',
                confirmButtonText: '확인',
                scrollbarPadding: false,
                heightAuto: false
            });
            input.value = "";
            return;
        }
        g_pendingFiles[type] = file;
        const viewIdMap = { 'INVOICE': 'cell-invoice', 'PACKINGLIST': 'cell-packing', 'BL': 'cell-bl', 'OTHER': 'cell-other' };
        const viewCell = document.getElementById(viewIdMap[type]);
        if(viewCell) {
            const viewDiv = viewCell.querySelector(`#view-\${type}`);
            viewDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 5px 0;">
                    <span class="new-file-badge">NEW</span>
                    <span class="pending-file-text">\${file.name}</span>
                    <span style="font-size:11px; color:#666;">(제출 시 업로드)</span>
                </div>
            `;
            viewCell.closest('td').classList.add('file-slot-active');
        }
    }

    // [5] 상태 제어
    function applyPageStatus(data) {
        if (!data) return;
        const statusRaw = (data.status || '').toString().toUpperCase().trim();
        updateStatusBadge(data);

        const btnSubmit = document.getElementById("btnSubmitAction");
        const btnPrint = document.getElementById("btnPrintCert"); 

        if(btnSubmit) btnSubmit.style.display = "none";
        if(btnPrint) btnPrint.style.display = "none"; 

        if (statusRaw === 'SUPPLEMENT' || statusRaw === 'CORRECTION') {
            if(btnSubmit) {
                btnSubmit.style.display = "inline-block";
                btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> 보완/정정 내역 제출';
            }
        }

        if (['RELEASE_APPROVED', 'DELIVERED'].includes(statusRaw)) {
            if (btnPrint) btnPrint.style.display = "inline-block";
        }

        toggleFormEditable(statusRaw === 'SUPPLEMENT' || statusRaw === 'CORRECTION');
    }

    // [6] 최종 제출 (보완/정정)
    async function handleFinalSubmit() {
        // 💡 보완/정정 제출 확인 Swal
        const result = await Swal.fire({
            title: '보완 내역 제출',
            text: '수정된 내용과 변경된 파일을 제출하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0f4c81',
            cancelButtonColor: '#d33',
            confirmButtonText: '제출',
            cancelButtonText: '취소',
            scrollbarPadding: false,
            heightAuto: false
        });

        if (!result.isConfirmed) return;

        const btnSubmit = document.getElementById("btnSubmitAction");
        btnSubmit.disabled = true;
        btnSubmit.innerText = "제출 중...";

        try {
            const formValues = collectFormToData();
            const submissionData = {
                ...g_exportData,
                ...formValues,
                status: 'REVIEWING',
                docComment: '보완/정정 자료 제출 완료 (파일 수정 포함)'
            };
            delete submissionData.fileList;
            delete submissionData.containerList;
            delete submissionData.logs;
            delete submissionData.aiDocCheck;

            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify(submissionData)], { type: 'application/json' }));
            if (g_pendingFiles['INVOICE']) formData.append('invoiceFile', g_pendingFiles['INVOICE']);
            if (g_pendingFiles['PACKINGLIST']) formData.append('packinglistFile', g_pendingFiles['PACKINGLIST']);
            if (g_pendingFiles['BL']) formData.append('blFile', g_pendingFiles['BL']);
            if (g_pendingFiles['OTHER']) formData.append('otherFile', g_pendingFiles['OTHER']);

            const res = await axios.put('/rest/export/modify', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200 || res.data > 0) {
                // 💡 보완/정정 제출 성공 Swal
                Swal.fire({
                    icon: 'success',
                    title: '제출 성공',
                    text: '성공적으로 제출되었습니다.',
                    confirmButtonColor: '#0f4c81',
                    confirmButtonText: '확인',
                    scrollbarPadding: false,
                    heightAuto: false
                }).then(() => {
                    location.href = "/client/exp/status/list";
                });
            } else {
                throw new Error("서버 응답 오류");
            }
        } catch (err) {
            console.error("제출 오류:", err);
            // 💡 보완/정정 제출 실패 Swal
            Swal.fire({
                icon: 'error',
                title: '제출 실패',
                text: '제출 중 오류가 발생했습니다: ' + (err.response?.data?.message || err.message),
                confirmButtonColor: '#dc3545',
                confirmButtonText: '확인',
                scrollbarPadding: false,
                heightAuto: false
            });
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> 보완/정정 내역 제출';
        }
    }

    function collectFormToData() {
        const updateData = {};
        Object.entries(FIELD_MAPPING).forEach(([dtoKey, htmlId]) => {
            const el = document.getElementById(htmlId);
            if (el) {
                let val = el.value.trim();
                const isNumeric = /Amt|Amount|Price|Qty|Weight|Rate|Cnt/i.test(dtoKey);
                if (isNumeric) val = val.replace(/,/g, '');
                updateData[dtoKey] = val;
            }
        });
        return updateData;
    }

    function toggleFormEditable(isEditable) {
        const inputs = document.querySelectorAll('.form-table input, .form-table select, .form-table textarea');
        inputs.forEach(el => {
            if (isEditable) {
                el.removeAttribute('readonly'); el.removeAttribute('disabled');
                el.style.backgroundColor = "#fff";
                el.style.border = "1px solid #ced4da";
            } else {
                el.setAttribute('readonly', true);
                if (el.tagName === 'SELECT') el.setAttribute('disabled', true);
                el.style.backgroundColor = "#f8f9fa";
                el.style.border = "1px solid #e9ecef";
            }
        });
        const editButtons = document.querySelectorAll('.edit-only-btn, .btn-lookup');
        editButtons.forEach(btn => {
            btn.style.display = isEditable ? 'inline-block' : 'none';
        });
    }

    function renderContainerList(list) {
        const tbody = document.getElementById('containerListBody');
        if (!tbody || !Array.isArray(list)) return;
        tbody.innerHTML = '';
        const isEditable = (g_exportData && (g_exportData.status === 'SUPPLEMENT' || g_exportData.status === 'CORRECTION'));
        list.forEach((item) => {
            if (typeof ContainerManager !== 'undefined') {
                ContainerManager.addRow();
                const rows = tbody.querySelectorAll('tr');
                const lastRow = rows[rows.length - 1];
                const input = lastRow.querySelector('input[name="containerNumbers"]');
                if (input) {
                    input.value = item.containerNo || '';
                    if (!isEditable) {
                        input.readOnly = true;
                        input.style.backgroundColor = "#f8f9fa";
                    }
                }
            }
        });
    }

    function bindDataToForm(data) {
        if (!data) return;
        Object.entries(FIELD_MAPPING).forEach(([dtoKey, htmlId]) => {
            const el = document.getElementById(htmlId);
            if (!el) return;
            let val = data[dtoKey] ?? '';
            if (val !== '' && !isNaN(val)) {
                const isNumeric = /Amt|Amount|Price|Qty|Weight|Rate|Cnt/i.test(dtoKey);
                if (isNumeric) val = Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 });
            }
            el.value = val;
        });
    }

    function updateStatusBadge(data) {
        const badge = document.getElementById("statusBadge");
        if (!badge || !data) return;
        const s = (data.status || '').toUpperCase().trim();
        const normalized = normalizeStatusString(s);
        let cls = 'wait';
        if (['REVIEWING', 'PHYSICAL'].includes(s)) cls = 'ing';
        else if (s === 'SUPPLEMENT') cls = 'supp';
        else if (['ACCEPTED', 'PAY_WAITING', 'WH_IN_APPROVED', 'RELEASE_APPROVED'].includes(s)) cls = 'pay';
        else if (['PAY_COMPLETED', 'APPROVED', 'DELIVERED'].includes(s)) cls = 'done';
        else if (['REJECTED', 'WH_IN_REJECTED', 'RELEASE_REJECTED'].includes(s)) cls = 'err';
        badge.innerText = normalized;
        badge.className = `badge \${cls}`;
    }

    function normalizeStatusString(s) {
        const map = {
            'BONDED_IN': '보세입고완료', 
            'WAITING': '심사대기', 
            'REVIEWING': '심사중', 
            'PHYSICAL': '현품검사중',
            'INSPECTION_COMPLETED': '현품검사완료',
            'SUPPLEMENT': '보완/정정', 
            'ACCEPTED': '수리', 
            'REJECTED': '반려', 
            'PAY_WAITING': '납부 대기', 
            'PAY_COMPLETED': '납부 완료',
            'WH_IN_APPROVED': '반입승인', 
            'WH_IN_REJECTED': '반입차단',
            'RELEASE_APPROVED': '반출승인', 
            'RELEASE_REJECTED': '반출차단',
            'APPROVED': '통관승인', 
            'DELIVERED': '출고 완료' 
        };
        return map[s] || s;
    }

    function showFeedbackBox(data) {
        if (!data) return;
        const aiCheck = data.aiDocCheck;
        const statusRaw = (data.status || '').toString().toUpperCase().trim();
        const feedbackBox = document.getElementById('customsFeedbackArea');
        const feedbackTitle = document.getElementById('feedbackTitle');
        const feedbackContent = document.getElementById('feedbackContent');
        if (!feedbackBox) return;

        if ((statusRaw === 'SUPPLEMENT' || statusRaw === 'CORRECTION')) {
            feedbackBox.style.display = "block";
            if (aiCheck && aiCheck.riskScore >= 80) feedbackBox.classList.add('error');
            else feedbackBox.classList.remove('error');
            feedbackTitle.innerText = "세관 보완 요구사항";
            let detail = '확인된 보완 요구사항 내용이 없습니다.';
            if (aiCheck && aiCheck.docComment) detail = aiCheck.docComment;
            else if (data.rejectReason) detail = data.rejectReason;
            feedbackContent.innerHTML = detail;
        	} else if (statusRaw.includes('REJECTED')) { 
            feedbackBox.style.display = "block";
            feedbackBox.classList.add('error');
            feedbackTitle.innerText = "세관 반려 사유";
            
            let rejectDetail = "반려 사유가 입력되지 않았습니다.";
            
            if (data.rejectReason) {
                rejectDetail = data.rejectReason;
            } else if (data.aiDocCheck) {
                // riskComment가 있으면 우선 표시, 없으면 docComment 표시
                rejectDetail = data.aiDocCheck.riskComment || data.aiDocCheck.docComment || rejectDetail;
            }
            
            // innerHTML을 써야 나중에 줄바꿈 등이 예쁘게 들어갈 수 있습니다.
            feedbackContent.innerHTML = rejectDetail; 
        } else {
            feedbackBox.style.display = "none";
        }
    }

    function highlightErrorFields(errorList) {
        document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
        if (!errorList || !Array.isArray(errorList)) return;
        errorList.forEach(fieldKey => {
            const elementId = FIELD_MAPPING[fieldKey];
            if (elementId) {
                const el = document.getElementById(elementId);
                if (el) el.classList.add('field-error');
            }
        });
    }

    function renderLogs(logs) {
        const tbody = document.getElementById('logTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!logs || logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; color: #999;">처리 이력이 없습니다.</td></tr>';
            return;
        }
        logs.forEach(log => {
            tbody.innerHTML += `<tr><td>\${log.regDate || '-'}</td><td>\${log.status || '-'}</td><td class="text-left">\${log.content || '-'}</td><td>\${log.processor || '시스템'}</td><td>\${log.dept || '-'}</td></tr>`;
        });
    }

    function switchTab(tabId, el) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        el.classList.add('active');
    }

    function initPageLayout() { document.querySelectorAll('.form-section').forEach(s => s.style.display = 'block'); }

    document.addEventListener('input', function(e) {
        if (e.target.id === 'txtQty' || e.target.id === 'txtUnitPrice') {
            const qty = parseFloat(document.getElementById('txtQty').value.replace(/,/g, '')) || 0;
            const price = parseFloat(document.getElementById('txtUnitPrice').value.replace(/,/g, '')) || 0;
            const total = (qty * price).toFixed(2);
            const amountEl = document.getElementById('txtAmount');
            if(amountEl) amountEl.value = total;
        }
    });

    function getFileIcon(fileName) {
        const ext = (fileName || '').split('.').pop().toLowerCase();
        let icon = { class: 'fa-file-alt', color: '#666' };
        switch (ext) {
            case 'pdf': icon = { class: 'fa-file-pdf', color: '#e74c3c' }; break;
            case 'xlsx': case 'xls': case 'csv': icon = { class: 'fa-file-excel', color: '#27ae60' }; break;
            case 'doc': case 'docx': icon = { class: 'fa-file-word', color: '#2980b9' }; break;
            case 'png': case 'jpg': case 'jpeg': case 'gif': icon = { class: 'fa-file-image', color: '#e67e22' }; break;
            case 'zip': case '7z': icon = { class: 'fa-file-archive', color: '#8e44ad' }; break;
        }
        return icon;
    }
</script>
