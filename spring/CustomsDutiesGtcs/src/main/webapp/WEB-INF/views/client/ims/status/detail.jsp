<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<link rel="stylesheet"
	href="/css/shipper/ims/importreport/importstatusdetail.css">

<style>
.tab-navigation {
	display: flex;
	border-bottom: 2px solid #0f4c81;
	margin-bottom: 0;
	background: transparent;
	margin-top: 20px
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
	transition: all .2s;
	font-size: 13px
}

.tab-btn:hover {
	background: #e9ecef;
	color: #0f4c81
}

.tab-btn.active {
	background: #0f4c81;
	color: #fff;
	border-color: #0f4c81
}

.tab-pane {
	display: none;
	background: #fff;
	padding: 30px;
	border: 1px solid #ddd;
	border-top: none;
	animation: fadeIn .3s ease-in-out;
	min-height: 300px
}

.tab-pane.active {
	display: block
}

@
keyframes fadeIn {
	from {opacity: 0;
	transform: translateY(5px)
}

to {
	opacity: 1;
	transform: translateY(0)
}

}
.decl-info-box {
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-left: 4px solid #0f4c81;
	padding: 15px 20px;
	margin: 15px 0;
	border-radius: 4px;
	display: flex;
	align-items: center;
	gap: 20px
}

.decl-info-item {
	display: flex;
	align-items: center;
	gap: 10px
}

.decl-info-label {
	font-size: 13px;
	color: #666;
	font-weight: 600
}

.decl-info-value {
	font-size: 15px;
	color: #0f4c81;
	font-weight: bold;
	font-family: 'Courier New', monospace
}

.customs-feedback-box {
	background-color: #fff3cd;
	border: 1px solid #ffecb5;
	border-left: 5px solid #fd7e14;
	padding: 20px;
	margin-bottom: 20px;
	border-radius: 4px;
	display: none
}

.customs-feedback-box.error {
	border-left-color: #dc3545;
	background-color: #f8d7da;
	border-color: #f5c6cb
}

.customs-feedback-box h4 {
	margin: 0 0 10px 0;
	font-size: 15px;
	font-weight: bold;
	display: flex;
	align-items: center;
	gap: 8px
}

.customs-feedback-box p {
	margin: 0;
	font-size: 13px;
	line-height: 1.6;
	color: #333
}

.essential-table {
	width: 100%;
	border-collapse: collapse;
	margin: 15px 0 30px 0;
	border-top: 2px solid #0f4c81
}

.essential-table th {
	background-color: #fcfcfc;
	color: #333;
	font-weight: 600;
	padding: 15px;
	border: 1px solid #e1e4e8;
	text-align: left;
	width: 250px;
	font-size: 13px
}

.essential-table td {
	vertical-align: middle !important;
	padding: 10px 20px !important;
	background-color: #fff;
	border: 1px solid #e1e4e8
}

.section-subtitle {
	font-size: 15px;
	color: #0f4c81;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 20px;
	margin-bottom: 10px
}

.section-subtitle::before {
	content: '';
	display: inline-block;
	width: 4px;
	height: 16px;
	background: #0f4c81;
	border-radius: 2px
}

.badge {
	padding: 3px 10px;
	border-radius: 12px;
	color: #fff;
	font-size: 11px;
	display: inline-block;
	min-width: 60px;
	text-align: center;
	font-weight: 500
}

.badge.wait {
	background: #6c757d
}

.badge.ing {
	background: #0d6efd
}

.badge.inspect {
	background: #17a2b8
}

.badge.supp {
	background: #fd7e14
}

.badge.pay {
	background: #6f42c1
}

.badge.done {
	background: #28a745
}

.badge.err {
	background: #dc3545
}

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
	vertical-align: middle
}

.file-link:hover {
	text-decoration: underline
}

.file-view-group {
	margin-bottom: 30px
}

.file-name-display {
	display: inline-flex;
	align-items: center;
	font-size: 13px;
	color: #666
}

.btn-file-change {
	padding: 5px 10px;
	background: #0f4c81;
	color: #fff;
	border: none;
	border-radius: 3px;
	cursor: pointer;
	font-size: 12px;
	margin-left: 10px;
	display: none
}

.btn-file-change:hover {
	background: #09345a
}

.new-file-badge {
	display: inline-block;
	background-color: #28a745;
	color: white;
	font-size: 11px;
	padding: 2px 6px;
	border-radius: 10px;
	margin-right: 5px;
	vertical-align: middle
}

.pending-file-text {
	color: #28a745;
	font-weight: bold;
	font-size: 13px
}

.log-table {
	width: 100%;
	border-top: 2px solid #666;
	border-collapse: collapse;
	margin-top: 10px
}

.log-table th {
	background: #f8f9fa;
	padding: 12px;
	border-bottom: 1px solid #ccc;
	font-size: 13px;
	color: #333;
	font-weight: 600;
	text-align: center
}

.log-table td {
	padding: 12px;
	border-bottom: 1px solid #eee;
	font-size: 13px;
	color: #555;
	text-align: center
}

.log-table td.text-left {
	text-align: left
}

.form-table input:not([readonly]), .form-table select:not([disabled]),
	.form-table textarea:not([readonly]) {
	pointer-events: auto !important;
	position: relative !important;
	z-index: 10 !important;
	cursor: text !important
}

.field-error {
	border: 2px solid #dc3545 !important;
	background-color: #fff !important;
	box-shadow: 0 0 5px rgba(220, 53, 69, .3)
}

.scrollable-content {
	overflow-y: auto;
	max-height: 800px
}

.th-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%
}

.btn-lookup {
	align-items: center;
	justify-content: center;
	height: 26px;
	padding: 0 10px;
	background: #4a5568;
	color: #fff;
	border: none;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 600;
	cursor: pointer;
	line-height: 1;
	white-space: nowrap
}
</style>

<div class="main-content">
	<div class="page-breadcrumb">
		<i class="fas fa-home"></i> 홈 > 수입통관 > 수입신고현황 > 상세조회 (사후관리)
	</div>
	<div class="detail-header">
		<h2 class="page-title">
			수입신고서 상세조회 <span id="statusBadge" class="badge wait"
				style="vertical-align: middle; margin-left: 10px;"></span>
		</h2>
		<div class="action-buttons">
			<button id="btnPrintCert" class="btn-print" style="display: none;" onclick="printCertificate()">
			    <i class="fas fa-file-invoice"></i> 필증 출력
			</button>
			<button class="btn-secondary"
				onclick="location.href='/client/ims/status/list'">목록</button>
			<button id="btnSubmitAction" class="btn-primary"
				style="display: none;" onclick="handleFinalSubmit()">
				<i class="fas fa-check-circle"></i> <span id="btnSubmitText">내역
					제출</span>
			</button>
			<button id="btnPayTax" class="btn-primary"
				style="display: none; background-color: #6f42c1;"
				onclick="goToPaymentPage()">
				<i class="fas fa-credit-card"></i> 관세 납부하기
			</button>
		</div>
	</div>
	<div class="decl-info-box">
		<div class="decl-info-item">
			<span class="decl-info-label"><i class="fas fa-file-alt"></i>
				수입신고번호:</span><span class="decl-info-value" id="declNoDisplay">-</span>
		</div>
		<div class="decl-info-item">
			<span class="decl-info-label"><i class="fas fa-calendar-alt"></i>
				신고일자:</span><span class="decl-info-value" id="declDateDisplay">-</span>
		</div>
	</div>
	<div class="scrollable-content">
		<div id="customsFeedbackArea" class="customs-feedback-box">
			<h4>
				<i class="fas fa-exclamation-triangle"></i> <span id="feedbackTitle">세관
					요구사항</span>
			</h4>
			<p id="feedbackContent"></p>
		</div>
		<div class="status-tabs">
			<div class="tab-btn active" onclick="switchTab('tab1',this)">1.
				공통사항</div>
			<div class="tab-btn" onclick="switchTab('tab2',this)">2. 결제 및
				세액</div>
			<div class="tab-btn" onclick="switchTab('tab3',this)">3. 란(물품)
				정보</div>
			<div class="tab-btn" onclick="switchTab('tab4',this)">4. 첨부파일</div>
		</div>
		<div id="tab1" class="tab-pane active"><jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importCommon.jsp" /></div>
		<div id="tab2" class="tab-pane"><jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importPayment.jsp" /></div>
		<div id="tab3" class="tab-pane"><jsp:include
				page="/WEB-INF/views/client/ims/imswrite/importItemDetails.jsp" /></div>
		<div id="tab4" class="tab-pane">
			<div class="file-view-group">
				<span class="section-subtitle">증빙 서류 관리</span>
				<table class="essential-table">
					<colgroup>
						<col style="width: 35%">
						<col style="width: 65%">
					</colgroup>
					<tr>
						<th><div class="th-content">
								<span>1. 인보이스 (Invoice) <span style="color: red">*</span></span><span
									id="action-INVOICE"></span>
							</div></th>
						<td id="cell-invoice"><div id="view-INVOICE">
								<span class="file-name-display" style="color: #ccc;">등록된
									파일 없음</span>
							</div></td>
					</tr>
					<tr>
						<th><div class="th-content">
								<span>2. 패킹리스트 (Packing List) <span style="color: red">*</span></span><span
									id="action-PACKINGLIST"></span>
							</div></th>
						<td id="cell-packing"><div id="view-PACKINGLIST">
								<span class="file-name-display" style="color: #ccc;">등록된
									파일 없음</span>
							</div></td>
					</tr>
					<tr>
						<th><div class="th-content">
								<span>3. 선하증권 (B/L) <span style="color: red">*</span></span><span
									id="action-BL"></span>
							</div></th>
						<td id="cell-bl"><div id="view-BL">
								<span class="file-name-display" style="color: #ccc;">등록된
									파일 없음</span>
							</div></td>
					</tr>
					<tr>
						<th><div class="th-content">
								<span>4. 기타 첨부파일</span><span id="action-OTHER"></span>
							</div></th>
						<td id="cell-other"><div id="view-OTHER">
								<span class="file-name-display" style="color: #ccc;">등록된
									파일 없음</span>
							</div></td>
					</tr>
				</table>
			</div>
		</div>
		<div id="tab5" class="tab-pane">
			<h4
				style="font-size: 14px; margin: 0 0 15px 0; color: #333; border-left: 3px solid #0f4c81; padding-left: 10px;">수입신고
				진행 이력</h4>
			<table class="log-table">
				<thead>
					<tr>
						<th>일시</th>
						<th>상태</th>
						<th>상세 처리내용</th>
						<th>처리자</th>
						<th>처리부서</th>
					</tr>
				</thead>
				<tbody id="logTableBody"></tbody>
			</table>
		</div>
	</div>
</div>

<script>
    // [1] 전역 변수 설정
    let g_importData = null;
    const g_pendingFiles = {};
    const API_URL = '/rest/import';
    const FILE_API_URL = '/rest/file';
    const FIELD_MAPPING = {
        'importerName':'txtImporterTradeName', 'repName':'txtTaxpayerName', 'telNo':'txtRepTel',
        'bizRegNo':'txtBizRegNo', 'customsId':'txtTaxpayerCode', 'address':'txtAddress',
        'overseasBizName':'txtOverseasBiz', 'overseasCountry':'txtOverseasNation', 'importType':'selImportType',
        'cargoMgmtNo':'txtCargoManageNo', 'contNo':'txtContainerNo', 'vesselName':'txtVesselName',
        'vesselNation':'selVesselNation', 'arrivalEstDate':'dateArrival', 'bondedInDate':'dateCarryIn',
        'originCountry':'txtImportNation', 'arrivalPort':'txtArrivalPort', 'blNo':'txtBLNo',
        'submitDate':'dateWrite', 'currencyCode':'txtCurrency', 'payAmount':'txtPayAmt',
        'invoiceNo':'txtInvNo', 'invoiceDate':'dateInv', 'contractNo':'txtContractNo',
        'contractDate':'dateCont', 'poNo':'txtPoNo', 'poDate':'datePo', 'incoterms':'selIncoterms',
        'totalWeight':'txtTotalWeight', 'originCertYn':'selOriginCertYn', 'freightCurrency':'selFreightCurr',
        'freightAmt':'txtFreightAmt', 'insuranceCurrency':'selInsurCurr', 'insuranceAmt':'txtInsurAmt',
        'addAmtCurrency':'selAddCurr', 'addAmt':'txtAddAmt', 'totalTaxBase':'txtTotalTaxable',
        'totalDuty':'txtTotalDuty', 'totalVat':'txtTotalVat', 'totalTaxSum':'txtTotalTaxSum',
        'hsCode':'txtHsCode', 'taxType':'selTaxKind', 'itemNameDeclared':'txtItemName',
        'itemNameTrade':'txtTradeName', 'modelName':'txtModelSpec', 'qty':'txtQty',
        'qtyUnit':'txtQtyUnit', 'unitPrice':'txtUnitPrice', 'totalAmount':'txtAmount',
        'originCode':'txtOriginCode', 'originMarkYn':'selOriginMarkYN', 'netWeight':'txtNetWeight',
        'taxBaseAmtItem':'txtTaxableValueKRW'
    };

    document.addEventListener("DOMContentLoaded", function() {
        initPageLayout();
        const p = new URLSearchParams(window.location.search);
        const id = p.get('id');
        
        if (id) {
            fetchImportDetail(id);
            
            if (typeof initGlobalSSE === 'function') {
                initGlobalSSE(["IMPORT_REFRESH", "EXPORT_REFRESH", "WAREHOUSE_REFRESH"], function() { 
                    console.log(" [수입 상세화면] 수입/수출/창고 상태가 변경되어 최신 데이터를 다시 불러옵니다.");
                    fetchImportDetail(id); 
                });
            }
        } else {
            // 💡 ID 없을 때 Swal 적용
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

    window.addEventListener('pageshow', function(e) {
        if (e.persisted || (window.performance && window.performance.navigation.type == 2)) {
            const id = new URLSearchParams(window.location.search).get('id');
            if (id) fetchImportDetail(id);
        }
    });

    /* 필증 출력 - iframe 백그라운드 인쇄 방식 */
    function printCertificate() {
        if (!g_importData) { 
            // 💡 데이터 로드 전 필증 출력 클릭 시 Swal 적용
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
        const d = g_importData;
        function V(v, f) { return (v != null && v !== '') ? String(v) : (f || ''); }
        function F(v) { 
            if (!v && v !== 0) return '0'; 
            const n = Number(String(v).replace(/,/g, '')); 
            return isNaN(n) ? String(v) : n.toLocaleString(); 
        }
        const TX = { 'A': '기본세율', 'F': 'FTA 협정관세율' };
        const IM = { '11': '11 (신속)', '21': '21 (일반)' };

        let b = '';
        b += '<div class="hdr"><div class="logo">G-TCS</div><div class="hm"><h1>수 입 신 고 필 증</h1></div><div class="hr"><div class="bdg">감 &nbsp; 지</div></div></div>';
        
        b += '<table><colgroup><col style="width:10%"><col style="width:17%"><col style="width:7%"><col style="width:14%"><col style="width:7%"><col style="width:11%"><col style="width:7%"><col style="width:14%"><col style="width:13%"></colgroup>';
        b += '<tr><th><span class="cn">①</span>신고번호</th><td class="v">' + V(d.importNumber) + '</td><th><span class="cn">②</span>신고일</th><td class="v">' + V(d.submitDate) + '</td><th><span class="cn">③</span>세관·과</th><td class="v">' + V(d.customsOffice) + '</td><th><span class="cn">④</span>입항일</th><td class="v">' + V(d.arrivalEstDate) + '</td><td class="c sm">작성일:' + V(d.submitDate) + '</td></tr></table>';
        
        b += '<table><colgroup><col style="width:13%"><col style="width:27%"><col style="width:13%"><col style="width:25%"><col style="width:7%"><col style="width:15%"></colgroup>';
        b += '<tr><th><span class="cn">⑤</span>B/L(AWB)번호</th><td class="v">' + V(d.blNo) + '</td><th><span class="cn">⑥</span>화물관리번호</th><td class="v">' + V(d.cargoMgmtNo) + '</td><th>반입일</th><td class="v">' + V(d.bondedInDate) + '</td></tr></table>';
        
        b += '<table><colgroup><col style="width:4.5%"><col style="width:7%"><col style="width:19%"><col style="width:9%"><col style="width:13%"><col style="width:9%"><col style="width:12%"><col style="width:9%"><col style="width:17.5%"></colgroup>';
        b += '<tr><th rowspan="5" class="vt"><span class="cn">⑦</span>수입자</th><th>(상호)</th><td class="l v">' + V(d.importerName) + '</td><th>원산지증명서</th><td class="c v">' + V(d.originCertYn, 'N') + '</td><th>총중량</th><td class="r v" colspan="3">' + (d.totalWeight ? F(d.totalWeight) + ' KG' : '') + '</td></tr>';
        b += '<tr><th>(성명)</th><td class="l v">' + V(d.repName) + '</td><th>수입종류</th><td class="c v">' + V(IM[d.importType] || d.importType) + '</td><th>컨테이너번호</th><td class="v" colspan="3">' + V(d.contNo) + '</td></tr>';
        b += '<tr><th>(주소)</th><td class="l v" colspan="7">' + V(d.address) + '</td></tr>';
        b += '<tr><th>(부호)</th><td class="v">' + V(d.customsId) + '</td><th>사업자등록번호</th><td class="v" colspan="2">' + V(d.bizRegNo) + '</td><th>전화번호</th><td class="v" colspan="2">' + V(d.telNo) + '</td></tr>';
        b += '<tr><th>이메일</th><td class="v" colspan="7">' + V(d.email || d.repEmail || d.taxpayerEmail) + '</td></tr>';
        b += '<tr><th rowspan="2" class="vt" style="font-size:9px;letter-spacing:1px">운송<br>정보</th><th>선(기)명</th><td class="v">' + V(d.vesselName) + '</td><th>선기국적</th><td class="c v">' + V(d.vesselNation) + '</td><th>수입국</th><td class="v" colspan="3">' + V(d.originCountry) + '</td></tr>';
        b += '<tr><th>도착항</th><td class="v">' + V(d.arrivalPort) + '</td><th>입항예정일</th><td class="c v">' + V(d.arrivalEstDate) + '</td><th>보세반입일</th><td class="c v" colspan="3">' + V(d.bondedInDate) + '</td></tr>';
        b += '<tr><th colspan="2">해외거래처</th><td class="v" colspan="2">' + V(d.overseasBizName) + '</td><th>해외거래처국적</th><td class="v" colspan="4">' + V(d.overseasCountry) + '</td></tr></table>';
        
        b += '<div class="bar"><span class="cn">⑧</span> 가격신고 기본정보</div>';
        b += '<table><colgroup><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:21%"><col style="width:12%"><col style="width:22%"></colgroup>';
        b += '<tr><th>인보이스번호</th><td class="v">' + V(d.invoiceNo) + '</td><th>인보이스발행일</th><td class="v">' + V(d.invoiceDate) + '</td><th>인도조건</th><td class="c v">' + V(d.incoterms) + '</td></tr>';
        b += '<tr><th>계약번호</th><td class="v">' + V(d.contractNo) + '</td><th>계약일자</th><td class="v">' + V(d.contractDate) + '</td><th>결제통화/금액</th><td class="v">' + V(d.currencyCode) + ' ' + (d.payAmount ? F(d.payAmount) : '') + '</td></tr>';
        b += '<tr><th>구매주문번호</th><td class="v">' + V(d.poNo) + '</td><th>구매주문일</th><td class="v">' + V(d.poDate) + '</td><th>통화코드</th><td class="c v">' + V(d.currencyCode) + '</td></tr></table>';
        
        b += '<table><colgroup><col style="width:50%"><col style="width:50%"></colgroup>';
        b += '<tr><td class="l" style="font-weight:700;padding-left:5px;border-bottom:none"><span class="cn">⑨</span>품명·규격 <span class="sm">(란번호/총란수:<span class="v">001/001</span>)</span></td><td style="border-bottom:none"></td></tr>';
        b += '<tr><td style="border-top:none"><b>HS부호:</b> <span class="v">' + V(d.hsCode) + '</span></td><td style="border-top:none"><b>관세구분:</b> <span class="v">' + V(TX[d.taxType] || d.taxType) + '</span></td></tr></table>';
        
        b += '<table><colgroup><col style="width:11%"><col style="width:89%"></colgroup>';
        b += '<tr><th><span class="cn">⑩</span>신고품명</th><td class="v">' + V(d.itemNameDeclared) + '</td></tr>';
        b += '<tr><th><span class="cn">⑪</span>거래품명</th><td class="v">' + V(d.itemNameTrade) + '</td></tr></table>';
        
        b += '<table><colgroup><col style="width:10%"><col style="width:22%"><col style="width:6%"><col style="width:14%"><col style="width:6%"><col style="width:14%"><col style="width:6%"><col style="width:22%"></colgroup>';
        b += '<tr><th><span class="cn">⑫</span>모델·규격</th><td class="v">' + V(d.modelName) + '</td><th><span class="cn">⑬</span>수량</th><td class="r v">' + (d.qty ? F(d.qty) + (d.qtyUnit ? ' ' + d.qtyUnit : '') : '') + '</td><th><span class="cn">⑭</span>단가</th><td class="r v">' + V(d.unitPrice) + '</td><th><span class="cn">⑮</span>금액</th><td class="r v">' + V(d.totalAmount) + '</td></tr></table>';
        
        b += '<table><colgroup><col style="width:8%"><col style="width:10%"><col style="width:4%"><col style="width:10%"><col style="width:9%"><col style="width:9%"><col style="width:7%"><col style="width:11%"><col style="width:32%"></colgroup>';
        b += '<tr><th><span class="cn">⑯</span>순중량</th><td class="r v">' + (d.netWeight ? F(d.netWeight) : '') + '</td><td class="c sm">KG</td><th><span class="cn">⑰</span>원산지코드</th><td class="c v">' + V(d.originCode) + '</td><th>원산지표시</th><td class="c v">' + V(d.originMarkYn) + '</td><th><span class="cn">⑱</span>과세가격(란)</th><td class="r v">' + (d.taxBaseAmtItem ? F(d.taxBaseAmtItem) + ' KRW' : '') + '</td></tr></table>';
        
        b += '<div class="bar"><span class="cn">⑲</span> 세율 정보</div>';
        b += '<table><colgroup><col style="width:10%"><col style="width:18%"><col style="width:18%"><col style="width:18%"><col style="width:18%"><col style="width:18%"></colgroup>';
        b += '<tr style="background:#f0f2f4"><th>세종</th><th>세율(구분)</th><th>세액</th><th>감면액</th><th>가산/분납세액</th><th>처리기간</th></tr>';
        b += '<tr><td class="c" style="font-weight:700">관세</td><td class="r v"></td><td class="r v">' + F(d.totalDuty) + '</td><td class="r v">0</td><td class="r v">0</td><td></td></tr>';
        b += '<tr><td class="c" style="font-weight:700">부가세</td><td class="r v">10.00</td><td class="r v">' + F(d.totalVat) + '</td><td class="r v">0</td><td class="r v">0</td><td></td></tr></table>';
        
        b += '<div class="bar"><span class="cn">⑳</span> 결제금액</div>';
        b += '<table><colgroup><col style="width:10%"><col style="width:8%"><col style="width:8%"><col style="width:30%"><col style="width:7%"><col style="width:22%"><col style="width:15%"></colgroup>';
        b += '<tr><th>인도조건</th><td class="c v">' + V(d.incoterms) + '</td><th>통화</th><td class="v">' + V(d.currencyCode) + ' ' + (d.payAmount ? F(d.payAmount) : '') + '</td><th>합계</th><td class="r v">' + (d.payAmount ? F(d.payAmount) : '') + '</td><td></td></tr></table>';
        
        b += '<table><colgroup><col style="width:10%"><col style="width:4%"><col style="width:16%"><col style="width:7%"><col style="width:16%"><col style="width:7%"><col style="width:14%"><col style="width:8%"><col style="width:18%"></colgroup>';
        b += '<tr><th><span class="cn">㉑</span>과세가격</th><td class="c" style="font-weight:700">$</td><td class="r v">' + (d.payAmount ? F(d.payAmount) : '') + '</td><th>운임</th><td class="r v">' + F(d.freightAmt) + '</td><th>가산금액</th><td class="r v">' + F(d.addAmt) + '</td><td rowspan="2" colspan="2" style="vertical-align:top;padding:3px"><span class="sm">납부번호</span></td></tr>';
        b += '<tr><td></td><td class="c" style="font-weight:700">W</td><td class="r v">' + (d.totalTaxBase ? F(d.totalTaxBase) : '') + '</td><th>보험료</th><td class="r v">' + F(d.insuranceAmt) + '</td><td colspan="2"></td></tr></table>';
        
        b += '<table><colgroup><col style="width:11%"><col style="width:14%"><col style="width:24%"><col style="width:51%"></colgroup>';
        b += '<tr style="background:#f0f2f4"><th>세종</th><th>세액</th><th>신고인기재란</th><th>세관기재란</th></tr>';
        b += '<tr><td class="c" style="font-weight:700">관세</td><td class="r v">' + F(d.totalDuty) + '</td><td rowspan="4" style="vertical-align:top;padding:5px;font-size:9px;color:#444"></td><td rowspan="4" style="vertical-align:top;padding:5px;font-size:8px;color:#555;line-height:1.5">원산지표시대상 물품인 경우 원산지표시를 하여야 하며, 양도·양수할 경우 미표시를 통보하여야 합니다.<br><br>G-TCS (Global Trade Customs System)</td></tr>';
        b += '<tr><td class="c" style="font-weight:700">부가가치세</td><td class="r v">' + F(d.totalVat) + '</td></tr>';
        b += '<tr><th style="background:#fafafa;font-weight:900">총 세 액 합 계</th><td class="r hl">' + F(d.totalTaxSum) + '</td></tr>';
        b += '<tr><td colspan="2" style="height:15px"></td></tr></table>';
        
        b += '<table style="margin-bottom:3px"><colgroup><col style="width:8%"><col style="width:18%"><col style="width:8%"><col style="width:18%"><col style="width:48%"></colgroup>';
        b += '<tr><th>신고일</th><td class="v">' + V(d.submitDate) + '</td><th>수리일</th><td class="v">' + V(d.submitDate) + '</td><td></td></tr></table>';
        
        b += '<div class="ft" style="position:relative"><div class="fti"><div><b>발행번호:</b><br><span style="margin-top:2px;display:inline-block"><b>세관·과:</b> <span class="v">' + V(d.customsOffice) + '</span> &nbsp;&nbsp; <b>신고번호:</b> <span class="v">' + V(d.importNumber) + '</span></span></div><div style="font-size:8px;color:#999">Page: 1/1</div></div>';
        b += '<div style="margin-top:4px;line-height:1.6">\u203B 본 신고필증은 발행 후 세관 심사시 등에 따라 정정, 수정할 수 있으므로 정확한 내용은 G-TCS 통관포탈에서 확인하시기 바랍니다.<br>\u203B 본 수입신고필증은 세관에서 행정적 요건만을 심사하므로 신고물품이 사실과 다른 때에는 신고인 또는 수입화주가 책임져야 합니다.<br>\u203B 본 신고필증은 전자문서로 발행된 것이며, 진위여부 확인은 G-TCS 통관포탈에서 확인할 수 있습니다.</div>';
        b += '<div class="stamp">G-TCS</div></div>';
        b += '<div class="fc">\u00A9 2026 G-TCS Global Trade Customs System. All rights reserved.</div>';

        const fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>\uC218\uC785\uC2E0\uACE0\uD544\uC99D</title><style>' +
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

    // === 이하 기존 기능 ===
    function fetchImportDetail(id) {
        axios.get(API_URL + '/' + id, { params: { memRole: 'UA', t: new Date().getTime() } })
        .then(function(r) {
            g_importData = r.data;
            if (!g_importData) return;
            try {
                applyPageStatus(g_importData);
                bindDataToForm(g_importData);
                document.getElementById('declNoDisplay').innerText = g_importData.importNumber || '-';
                document.getElementById('declDateDisplay').innerText = g_importData.submitDate || '-';
                renderAttachments(g_importData.fileList || []);
                if (g_importData.logs) renderLogs(g_importData.logs);
                showFeedbackBox(g_importData);
                if (g_importData.errorFields) highlightErrorFields(g_importData.errorFields);
            } catch(e) {
                console.error("Rendering Error:", e);
            }
        })
        .catch(function() {
            // 💡 조회 실패 Swal 적용
            Swal.fire({
                icon: 'error',
                title: '조회 실패',
                text: '데이터 조회 중 오류가 발생했습니다.',
                confirmButtonColor: '#dc3545',
                confirmButtonText: '확인',
                scrollbarPadding: false,
                heightAuto: false
            });
        });
    }

    function bindDataToForm(data) {
        if (!data) return;
        Object.entries(FIELD_MAPPING).forEach(function(e) {
            const el = document.getElementById(e[1]);
            if (el && data[e[0]]) {
                let val = data[e[0]];
                if (String(val).match(/^\d+$/) && (e[1].includes('Amt') || e[1].includes('Price'))) {
                    val = Number(val).toLocaleString();
                }
                el.value = val;
            }
        });
        
        const dbEmail = data.email || data.repEmail || data.taxpayerEmail || '';
        if (dbEmail) {
            setTimeout(function() {
                const idEl = document.getElementById('txtTaxpayerEmailId');
                const domainEl = document.getElementById('txtTaxpayerEmailDomain');
                const selectEl = document.getElementById('selTaxpayerEmailDomain');
                if (idEl) {
                    const parts = dbEmail.split('@');
                    idEl.value = parts[0];
                    if (domainEl) domainEl.value = parts[1];
                    const h = document.getElementById('hiddenEmail');
                    if (h) h.value = dbEmail;
                    if (selectEl && parts[1]) {
                        let f = false;
                        for (let i = 0; i < selectEl.options.length; i++) {
                            if (selectEl.options[i].value == parts[1]) {
                                selectEl.selectedIndex = i;
                                f = true;
                                break;
                            }
                        }
                        if (!f) selectEl.value = "direct";
                    }
                }
            }, 10);
        }
    }

    function renderAttachments(fileList) {
        const uiMap = {
            'INVOICE': { viewId: 'cell-invoice', actionId: 'action-INVOICE' },
            'PACKINGLIST': { viewId: 'cell-packing', actionId: 'action-PACKINGLIST' },
            'BL': { viewId: 'cell-bl', actionId: 'action-BL' },
            'OTHER': { viewId: 'cell-other', actionId: 'action-OTHER' }
        };
        
        Object.keys(uiMap).forEach(function(t) {
            const u = uiMap[t];
            document.getElementById(u.viewId).innerHTML = '<div id="view-' + t + '"><span style="color:#ccc;">등록된 파일 없음</span></div>';
            document.getElementById(u.actionId).innerHTML = '';
        });
        
        if (fileList && fileList.length > 0) {
            fileList.sort(function(a, b) { return b.fileId - a.fileId; });
            const p = {};
            fileList.forEach(function(file) {
                const raw = (file.fileType || '').toUpperCase();
                let key = 'OTHER';
                if (raw.indexOf('INVOICE') > -1) key = 'INVOICE';
                else if (raw.indexOf('PACKING') > -1) key = 'PACKINGLIST';
                else if (raw.indexOf('BL') > -1) key = 'BL';
                
                if (key !== 'OTHER' && p[key]) return;
                p[key] = true;
                
                const icon = getFileIcon(file.fileName);
                const html = '<div style="display:flex;align-items:center;gap:10px;padding:5px 0;"><i class="fas ' + icon.class + '" style="color:' + icon.color + ';font-size:18px;"></i><a href="/download/' + file.fileId + '" class="file-link">' + file.fileName + '</a></div>';
                const vd = document.getElementById('view-' + key);
                if (vd) vd.innerHTML = html;
            });
        }
        
        Object.keys(uiMap).forEach(function(t) {
            const u = uiMap[t];
            const a = document.getElementById(u.actionId);
            if (a) a.innerHTML = '<input type="file" id="input-' + t + '" style="display:none" onchange="stageFileForUpload(\'' + t + '\',this)"><button type="button" class="btn-file-change edit-only-btn" onclick="document.getElementById(\'input-' + t + '\').click()"><i class="fas fa-folder-open"></i> ' + (t === 'OTHER' ? '파일 추가' : '파일 변경') + '</button>';
        });
    }

    function stageFileForUpload(type, input) {
        if (!input.files || !input.files.length) return;
        const file = input.files[0];
        if (file.size > 10 * 1024 * 1024) {
            // 💡 파일 용량 초과 시 Swal 적용
            Swal.fire({
                icon: 'warning',
                title: '용량 초과',
                text: '10MB 이하만 가능합니다.',
                confirmButtonColor: '#f59e0b',
                confirmButtonText: '확인',
                scrollbarPadding: false,
                heightAuto: false
            });
            input.value = "";
            return;
        }
        g_pendingFiles[type] = file;
        const vd = document.getElementById('view-' + type);
        if (vd) vd.innerHTML = '<div style="display:flex;align-items:center;gap:10px;padding:5px 0;"><span class="new-file-badge">NEW</span><span class="pending-file-text">' + file.name + '</span></div>';
    }

    function applyPageStatus(data) {
        if (!data) return;
        const s = (data.status || '').toUpperCase().trim();
        updateStatusBadge(data);
        
        const btnS = document.getElementById("btnSubmitAction");
        const btnP = document.getElementById("btnPayTax");
        const btnPrint = document.getElementById("btnPrintCert"); 
        
        btnS.style.display = "none";
        btnP.style.display = "none";
        if (btnPrint) btnPrint.style.display = "none"; 
        
        if (s === 'SUPPLEMENT' || s === 'CORRECTION') btnS.style.display = "inline-block";
        
        if (s === 'PAY_WAITING') {
            btnP.style.display = "inline-block";
            btnP.innerHTML = '<i class="fas fa-credit-card"></i> 관세 납부하기';
            btnP.onclick = goToPaymentPage;
        } else if (['PAY_COMPLETED', 'APPROVED', 'RELEASE_APPROVED', 'DELIVERED'].includes(s)) {
            btnP.style.display = "inline-block";
            btnP.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> 납부 내역';
            btnP.onclick = function() { location.href = '/client/pay/payment/payment?importId=' + g_importData.importId; };
        }

        if (['RELEASE_APPROVED', 'DELIVERED'].includes(s)) {
            if (btnPrint) btnPrint.style.display = "inline-block";
        }
        
        toggleFormEditable(s === 'SUPPLEMENT' || s === 'CORRECTION');
    }

    function normalizeStatusString(s) {
        const m = {
            'BONDED_IN': '보세입고완료', 'WAITING': '심사대기', 'PHYSICAL': '현품검사중',
            'INSPECTION_COMPLETED': '현품검사완료', 'SUPPLEMENT': '보완/정정',
            'REVIEWING': '심사중', 'ACCEPTED': '수리', 'REJECTED': '반려',
            'PAY_WAITING': '납부 대기', 'PAY_COMPLETED': '납부 완료',
            'WH_IN_APPROVED': '반입승인', 'WH_IN_REJECTED': '반입차단',
            'RELEASE_APPROVED': '반출승인', 'RELEASE_REJECTED': '반출차단',
            'APPROVED': '통관승인', 'DELIVERED': '출고 완료'
        };
        return m[s] || s;
    }

    function updateStatusBadge(data) {
        const badge = document.getElementById("statusBadge");
        if (!badge || !data) return;
        const s = (data.status || '').toUpperCase().trim();
        const n = normalizeStatusString(s);
        let cls = 'wait';
        if (['REVIEWING', 'PHYSICAL', 'SUPPLEMENT'].indexOf(s) > -1) cls = 'ing';
        else if (['ACCEPTED', 'PAY_WAITING', 'WH_IN_APPROVED', 'RELEASE_APPROVED'].indexOf(s) > -1) cls = 'pay';
        else if (['PAY_COMPLETED', 'APPROVED', 'DELIVERED', 'INSPECTION_COMPLETED'].includes(s)) cls = 'done';
        else if (['REJECTED', 'WH_IN_REJECTED', 'RELEASE_REJECTED'].includes(s)) cls = 'err';
        
        badge.innerText = n;
        badge.className = 'badge ' + cls;
    }

    // 💡 보완/정정 제출 시 Swal 적용
    async function handleFinalSubmit() {
        const confirmResult = await Swal.fire({
            title: '보완 내역 제출',
            text: '수정된 내용과 파일을 제출하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0f4c81',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '제출',
            cancelButtonText: '취소',
            scrollbarPadding: false,
            heightAuto: false
        });

        if (!confirmResult.isConfirmed) return;

        const btn = document.getElementById("btnSubmitAction");
        btn.disabled = true;
        btn.innerText = "제출 중...";

        try {
            const fv = collectFormToData();
            const sd = Object.assign({}, g_importData, fv, { status: 'REVIEWING' });
            delete sd.fileList;
            delete sd.logs;
            delete sd.aiDocCheck;
            
            const fd = new FormData();
            fd.append("data", new Blob([JSON.stringify(sd)], { type: 'application/json' }));
            if (g_pendingFiles['INVOICE']) fd.append('invoiceFile', g_pendingFiles['INVOICE']);
            if (g_pendingFiles['PACKINGLIST']) fd.append('packinglistFile', g_pendingFiles['PACKINGLIST']);
            if (g_pendingFiles['BL']) fd.append('blFile', g_pendingFiles['BL']);
            if (g_pendingFiles['OTHER']) fd.append('otherFile', g_pendingFiles['OTHER']);
            
            const res = await axios.put('/rest/import/modify', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            
            if (res.status === 200 || res.data > 0) {
                // 💡 성공 시 Swal 적용
                Swal.fire({
                    icon: 'success',
                    title: '제출 완료',
                    text: '보완/정정 제출이 완료되었습니다.',
                    confirmButtonColor: '#0f4c81',
                    confirmButtonText: '확인',
                    scrollbarPadding: false,
                    heightAuto: false
                }).then(() => {
                    location.href = "/client/ims/status/list";
                });
            } else throw new Error("서버 응답 오류");
        } catch(err) {
            console.error(err);
            // 💡 실패 시 Swal 적용
            Swal.fire({
                icon: 'error',
                title: '제출 실패',
                text: '제출 오류: ' + (err.response?.data?.message || err.message),
                confirmButtonColor: '#dc3545',
                confirmButtonText: '확인',
                scrollbarPadding: false,
                heightAuto: false
            });
            btn.disabled = false;
            btn.innerText = "내역 제출";
        }
    }

    function collectFormToData() {
        const data = {};
        Object.entries(FIELD_MAPPING).forEach(function(e) {
            const el = document.getElementById(e[1]);
            if (el) data[e[0]] = el.value.replace(/,/g, '');
        });
        return data;
    }

    function getFileIcon(fn) {
        const ext = (fn || '').split('.').pop().toLowerCase();
        if (['jpg', 'png', 'gif', 'jpeg'].includes(ext)) return { class: 'fa-file-image', color: '#e67e22' };
        if (ext === 'pdf') return { class: 'fa-file-pdf', color: '#e74c3c' };
        if (['xls', 'xlsx'].includes(ext)) return { class: 'fa-file-excel', color: '#27ae60' };
        return { class: 'fa-file-alt', color: '#666' };
    }

    function toggleFormEditable(e) {
        document.querySelectorAll('.form-table input,.form-table select,.form-table textarea').forEach(function(el) {
            if (e) {
                el.removeAttribute('readonly');
                if (el.tagName === 'SELECT') el.removeAttribute('disabled');
                el.style.backgroundColor = "#fff";
            } else {
                el.setAttribute('readonly', true);
                if (el.tagName === 'SELECT') el.setAttribute('disabled', true);
                el.style.backgroundColor = "#f8f9fa";
            }
        });
        document.querySelectorAll('.edit-only-btn').forEach(function(btn) {
            btn.style.display = e ? 'inline-block' : 'none';
        });
    }

    function renderLogs(logs) {
        const tbody = document.getElementById('logTableBody');
        if (!tbody) return;
        tbody.innerHTML = (logs && logs.length) ? '' : '<tr><td colspan="5" style="padding:30px;color:#999;text-align:center;">이력이 없습니다.</td></tr>';
        
        if (logs && logs.length) {
            logs.forEach(function(log) {
                const n = normalizeStatusString(log.status);
                let cls = 'wait';
                const s = (log.status || '').toUpperCase();
                
                if (s === 'REVIEWING') cls = 'ing';
                else if (s === 'PHYSICAL') cls = 'inspect';
                else if (s === 'SUPPLEMENT') cls = 'supp';
                else if (['ACCEPTED', 'PAY_WAITING', 'WH_IN_APPROVED', 'RELEASE_APPROVED'].includes(s)) cls = 'pay';
                else if (['PAY_COMPLETED', 'APPROVED', 'DELIVERED'].includes(s)) cls = 'done';
                else if (['REJECTED', 'WH_IN_REJECTED', 'RELEASE_REJECTED'].includes(s)) cls = 'err';
                
                const tr = document.createElement('tr');
                tr.innerHTML = '<td>' + (log.regDate || '-') + '</td><td><span class="badge ' + cls + '">' + n + '</span></td><td class="text-left">' + (log.content || '-') + '</td><td>' + (log.processorName || '시스템') + '</td><td>' + (log.deptName || '세관') + '</td>';
                tbody.appendChild(tr);
            });
        }
    }

    function showFeedbackBox(data) {
        const box = document.getElementById('customsFeedbackArea');
        if (!box) return;
        const s = (data.status || '').toUpperCase();
        if ((s === 'SUPPLEMENT' || s === 'REJECTED') && data.aiDocCheck) {
            box.style.display = "block";
            document.getElementById('feedbackContent').innerHTML = data.aiDocCheck.docComment || (data.rejectReason || '내용 없음');
            if (s === 'REJECTED') box.classList.add('error');
            else box.classList.remove('error');
        } else {
            box.style.display = "none";
        }
    }

    function highlightErrorFields(list) {
        document.querySelectorAll('.field-error').forEach(function(el) {
            el.classList.remove('field-error');
        });
        if (Array.isArray(list)) {
            list.forEach(function(key) {
                const id = FIELD_MAPPING[key];
                const el = document.getElementById(id);
                if (el) el.classList.add('field-error');
            });
        }
    }

    function switchTab(id, el) {
        document.querySelectorAll('.tab-pane').forEach(function(p) {
            p.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
        if (el) el.classList.add('active');
    }

    function initPageLayout() {
        document.querySelectorAll('.form-section').forEach(function(s) {
            s.style.display = 'block';
        });
    }

    function goToPaymentPage() {
        if (g_importData) location.href = '/client/pay/payment/payment?importId=' + g_importData.importId;
    }
</script>