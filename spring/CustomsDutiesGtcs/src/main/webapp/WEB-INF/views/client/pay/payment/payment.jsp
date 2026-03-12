<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<style>
/* ===== 고지서 전용 스타일 (G-TCS 레이아웃 내부용) ===== */
.notice-scroll-wrapper {
	width: 100%;
	height: calc(100vh - 60px);
	overflow-y: auto;
	padding: 20px 16px;
	background: #e9ecef;
	box-sizing: border-box;
}

.notice-container {
	width: 100%;
	max-width: 1100px;
	margin: 0 auto;
	background: #fff;
	padding: 40px 36px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
	border-radius: 2px;
	position: relative;
	font-family: "Malgun Gothic", "맑은 고딕", Arial, sans-serif;
	font-size: 13px;
	color: #212529;
	line-height: 1.6;
}

.header {
	text-align: center;
	border-bottom: 3px solid #333;
	padding-bottom: 18px;
	margin-bottom: 24px;
	position: relative;
}

.header h1 {
	font-size: 26px;
	margin-bottom: 8px;
	letter-spacing: 2px;
	color: #111;
	padding-right: 130px;
	margin-left: 129px;
}

.header .issue-info {
	font-size: 13px;
	color: #666;
	font-weight: bold;
}

.status-badge {
	position: absolute;
	top: 0;
	right: 0;
	padding: 6px 14px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: bold;
	color: #fff;
	white-space: nowrap;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.status-wait {
	background-color: #6c757d;
}

.status-waiting {
	background-color: #f39c12;
}

.status-completed {
	background-color: #28a745;
}

.reference-number {
	text-align: right;
	font-size: 13px;
	color: #333;
	margin-bottom: 20px;
}

.section-title {
	background: #e8f4f8;
	padding: 9px 14px;
	font-weight: bold;
	font-size: 14px;
	margin-top: 26px;
	margin-bottom: 8px;
	border-left: 5px solid #0056b3;
	color: #003d80;
}

.notice-container table {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 16px;
	font-size: 13px;
	table-layout: fixed;
}

.notice-container table th, .notice-container table td {
	border: 1px solid #dee2e6;
	padding: 9px 14px;
	word-break: keep-all;
	overflow-wrap: break-word;
}

.notice-container table th {
	background: #f8f9fa;
	font-weight: bold;
	text-align: left;
	width: 25%;
	color: #495057;
}

.notice-container table td {
	background: #fff;
	color: #212529;
}

.value {
	color: #0056b3;
	font-weight: 600;
}

.amount-table th {
	background: #e3f2fd;
	text-align: center;
	width: auto;
}

.amount-table td {
	text-align: right;
}

.total-row td {
	background: #fff3cd !important;
	font-weight: bold;
	font-size: 14px;
	border-top: 2px solid #ffc107;
}

.total-amount {
	font-size: 18px;
	color: #d32f2f;
}

.payment-info {
	background: #f1f8ff;
	border: 2px solid #0056b3;
	padding: 22px;
	margin-top: 26px;
	border-radius: 8px;
}

.payment-info h3 {
	font-size: 15px;
	margin-bottom: 12px;
	color: #0056b3;
}

.payment-info p {
	font-size: 13px;
	line-height: 1.8;
	margin-bottom: 4px;
}

.vacct-box {
	background-color: #fff;
	border: 2px dashed #0056b3;
	padding: 14px;
	border-radius: 5px;
	margin-top: 14px;
	display: none;
}

.vacct-box.active {
	display: block;
	animation: fadeIn 0.5s;
}

.action-buttons {
	text-align: center;
	margin-top: 32px;
	padding-top: 18px;
	border-top: 1px solid #ddd;
}

.btn {
	padding: 10px 22px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 600;
	transition: all 0.2s;
	margin: 0 4px;
	font-family: inherit;
}

.btn-primary {
	background-color: #0056b3;
	color: #fff;
	box-shadow: 0 2px 5px rgba(0, 86, 179, 0.3);
}

.btn-primary:hover {
	background-color: #004494;
	transform: translateY(-1px);
}

.btn-outline {
	background-color: #fff;
	border: 1px solid #ccc;
	color: #333;
}

.btn-outline:hover {
	background-color: #f8f9fa;
	border-color: #bbb;
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.important-notice {
	background: #fff8dc;
	border-left: 4px solid #ff9800;
	padding: 14px;
	margin-top: 22px;
	font-size: 12px;
	color: #5a4a25;
}

.important-notice p {
	margin-top: 4px;
}

.signature-section {
	margin-top: 36px;
	text-align: right;
	font-size: 13px;
}

.footer {
	margin-top: 32px;
	text-align: center;
	font-size: 11px;
	color: #999;
}

/* 모달 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: none;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.bank-modal {
	background: #fff;
	width: 380px;
	padding: 25px;
	border-radius: 12px;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
	text-align: center;
}

.bank-logo {
	font-size: 22px;
	font-weight: 900;
	color: #0046bb;
	margin-bottom: 20px;
	display: block;
	letter-spacing: -1px;
}

/* 로딩 오버레이 */
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.55);
	display: none;
	justify-content: center;
	align-items: center;
	z-index: 10000;
}

.loading-overlay.active {
	display: flex;
}

.loading-card {
	background: #fff;
	border-radius: 16px;
	padding: 40px 48px;
	text-align: center;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	min-width: 340px;
}

.spinner {
	width: 50px;
	height: 50px;
	border: 5px solid #e0e0e0;
	border-top: 5px solid #0056b3;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
	margin: 0 auto 22px;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.loading-title {
	font-size: 17px;
	font-weight: 700;
	color: #222;
	margin-bottom: 6px;
}

.loading-sub {
	font-size: 13px;
	color: #888;
	line-height: 1.6;
}

.loading-steps {
	margin-top: 22px;
	text-align: left;
	font-size: 13px;
}

.loading-step {
	padding: 7px 0;
	color: #ccc;
	display: flex;
	align-items: center;
	gap: 10px;
	transition: color 0.3s;
}

.loading-step.active {
	color: #0056b3;
	font-weight: 600;
}

.loading-step.done {
	color: #28a745;
	font-weight: 400;
}

.loading-step .step-icon {
	width: 20px;
	text-align: center;
	flex-shrink: 0;
	font-size: 14px;
}

.success-icon {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: #28a745;
	margin: 0 auto 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-icon svg {
	width: 32px;
	height: 32px;
}

@keyframes popIn {
	0% { transform: scale(0); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(-10px); }
	to { opacity: 1; transform: translateY(0); }
}

/* 페이지 로딩 */
.page-loading {
	text-align: center;
	padding: 80px 20px;
	color: #888;
	font-size: 15px;
}

.page-loading .spinner {
	margin-bottom: 16px;
}

/* 인쇄 */
@media print {
	.sidebar, .side-bar, .left-menu, .lnb, .gnb, nav, .nav-wrapper,
		.top-header, .header-wrap, .footer-wrap, .site-footer, #sidebar,
		#leftMenu, #gnb, #topHeader, aside {
		display: none !important;
		width: 0 !important;
	}
	.content, .content-wrapper, .main-content, .container, .page-wrapper,
		.wrapper, #content, #wrapper, main, [class*="content"], [class*="main"]
		{
		margin-left: 0 !important;
		padding-left: 0 !important;
		width: 100% !important;
		max-width: 100% !important;
		left: 0 !important;
	}
	body {
		margin: 0 !important;
		padding: 0 !important;
		background: #fff !important;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	.notice-scroll-wrapper {
		height: auto !important;
		overflow: visible !important;
		padding: 0 !important;
		background: #fff !important;
		width: 100% !important;
	}
	.notice-container {
		box-shadow: none !important;
		margin: 0 !important;
		padding: 30px !important;
		max-width: 100% !important;
		width: 100% !important;
	}
	.action-buttons, .status-badge {
		display: none !important;
	}
	.loading-overlay, .modal-overlay {
		display: none !important;
	}
}
/* 나타날 때: 위에서 아래로 스르륵 */
  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  /* 사라질 때: 아래에서 위로 스르륵 */
  @keyframes slideUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-100%); opacity: 0; }
  }

  /* SweetAlert2에 적용할 클래스 */
  .my-slide-down {
    animation: slideDown 0.3s ease-out !important;
  }
  .my-slide-up {
    animation: slideUp 0.3s ease-in !important;
  }
  
</style>

<!-- ===== 고지서 본문 ===== -->
<div class="notice-scroll-wrapper">
	<div class="notice-container">

		<!-- 초기 로딩 -->
		<div id="pageLoading" class="page-loading">
			<div class="spinner"></div>
			고지서 정보를 불러오는 중입니다...
		</div>

		<!-- 실제 고지서 (초기 숨김) -->
		<div id="noticeContent" style="display: none;">

			<div class="header">
				<h1>수입 납부 고지서</h1>
				<div class="issue-info">G-TCS (Global Trade Compliance & Logistics System)</div>
				<span id="currentStatusBadge" class="status-badge status-wait">로딩중</span>
			</div>

			<div class="reference-number">
				고지서 번호: <span class="value" id="payIdDisplay">-</span>
			</div>

			<!-- 1. 수입자 정보 -->
			<div class="section-title">1. 수입자 정보 (Importer)</div>
			<table>
				<tr>
					<th>사업자등록번호</th>
					<td class="value" id="bizRegNo">-</td>
				</tr>
				<tr>
					<th>상호명</th>
					<td class="value" id="importerName">-</td>
				</tr>
				<tr>
					<th>대표자명</th>
					<td class="value" id="repName">-</td>
				</tr>
				<tr>
					<th>주소</th>
					<td class="value" id="address">-</td>
				</tr>
			</table>

			<!-- 2. 수입신고 정보 -->
			<div class="section-title">2. 수입신고 정보 (Declaration Info)</div>
			<table>
				<tr>
					<th>수입신고번호</th>
					<td class="value" id="importNumber">-</td>
				</tr>
				<tr>
					<th>신고일자</th>
					<td class="value" id="submitDate">-</td>
				</tr>
				<tr>
					<th>수입물품명</th>
					<td class="value" id="itemName">-</td>
				</tr>
				<tr>
					<th>총과세가격</th>
					<td class="value" id="taxBase">-</td>
				</tr>
			</table>

			<!-- 3. 세액 명세 -->
			<div class="section-title">3. 세액 명세 (Tax Details)</div>
			<table class="amount-table">
				<thead>
					<tr>
						<th>구분</th>
						<th>세율</th>
						<th>세액</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>관세</td>
						<td id="dutyRate">-</td>
						<td class="value" id="dutyAmt">-</td>
					</tr>
					<tr>
						<td>부가가치세</td>
						<td id="vatRate">10.0%</td>
						<td class="value" id="vatAmt">-</td>
					</tr>
					<tr class="total-row">
						<td colspan="2">총 납부세액</td>
						<td class="value total-amount" id="totalAmount">-</td>
					</tr>
				</tbody>
			</table>

			<!-- 납부 안내 -->
			<div class="payment-info">
				<h3>■ 납부 안내 (Payment Guide)</h3>
				<p>
					<strong>납부기한:</strong> <span class="value" id="dueDate">-</span>
				</p>
				<p>
					<strong>납부방법:</strong> 인터넷 뱅킹, 모바일 뱅킹, 가상계좌 납부
				</p>
				<div id="beforeIssueMsg"
					style="margin-top: 10px; color: #666; font-style: italic;">
					※ 하단 <strong>'가상계좌 발급신청'</strong> 버튼을 눌러 전용 계좌를 발급받으시기 바랍니다.
				</div>
				<div id="vacctArea" class="vacct-box">
					<div
						style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
						<span style="font-weight: bold; color: #0056b3;">▶ <span
							id="bankNameDisplay">신한은행</span> 가상계좌 (예금주: 관세청_G-TCS)
						</span>
						<button class="btn btn-outline"
							style="padding: 4px 10px; font-size: 12px; height: auto;"
							onclick="copyToClipboard()">복사</button>
					</div>
					<div
						style="font-size: 22px; font-weight: bold; color: #333; text-align: center; margin: 10px 0;">
						<span id="vacctNumber">--</span>
					</div>
					<p id="vacctAmountMsg"
						style="text-align: center; font-size: 13px; color: #d32f2f;">
						※ 위 계좌로 <span id="paymentAmountText">0</span>원을 정확히 입금해주시기 바랍니다.
					</p>
				</div>
			</div>

			<!-- 유의사항 -->
			<div class="important-notice">
				<strong>⚠ 유의사항</strong>
				<p>• 납부기한 내 미납부 시 가산금(연 9.125%)이 부과됩니다.</p>
				<p>• 가상계좌는 발급일로부터 24시간 동안만 유효합니다.</p>
			</div>

			<!-- 서명 -->
			<div class="signature-section">
				<p>
					발행일자: <span class="value" id="issueDate">-</span>
				</p>
				<p>
					발행기관: <span class="value">서울세관</span>
				</p>
				<p style="margin-top: 18px; font-size: 14px;">서울세관장 (인)</p>
			</div>

			<!-- 버튼 -->
			<div class="action-buttons">
				<button id="btnIssue" class="btn btn-primary"
					onclick="issueVirtualAccount()">가상계좌 발급신청</button>
				<button id="btnSimulate" class="btn btn-outline"
					style="display: none; border-color: #f39c12; color: #f39c12;"
					onclick="openBankSimulator()">은행 납부</button>
				<button id="btnPrint" class="btn btn-outline" style="display: none;"
					onclick="window.print()">납부영수증 인쇄</button>
				<button class="btn btn-outline" onclick="history.back()">목록으로</button>
			</div>

			<div class="footer">
				<p>본 고지서는 G-TCS 관세 시스템에서 생성된 문서입니다.</p>
			</div>
		</div>
	</div>
</div>

<!-- 은행 확인 모달 -->
<div id="bankModal" class="modal-overlay">
	<div class="bank-modal">
		<span class="bank-logo">SOL 신한은행</span>
		<p style="margin-bottom: 20px; font-size: 15px; line-height: 1.5;">
			<strong id="modalCompanyName">-</strong> 님,<br /> 관세 <strong
				style="color: #d32f2f;" id="modalPayAmount">0원</strong>을<br />
			이체하시겠습니까?
		</p>
		<div
			style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; font-family: monospace; text-align: left; font-size: 13px; color: #555;">
			받는분: <strong>관세청_G-TCS</strong><br /> 은&nbsp;&nbsp;행: 신한은행<br />
			계&nbsp;&nbsp;좌: <span id="modalVacct"
				style="color: #0056b3; font-weight: bold;"></span>
		</div>
		<div
			style="display: flex; gap: 10px; justify-content: center; margin-top: 25px;">
			<button class="btn btn-outline" style="flex: 1;"
				onclick="closeBankModal()">취소</button>
			<button class="btn btn-primary" style="flex: 1;"
				onclick="confirmPayment()">이체 실행</button>
		</div>
	</div>
</div>

<!-- 로딩 오버레이 -->
<div id="loadingOverlay" class="loading-overlay">
	<div class="loading-card">
		<div id="loadingProgress">
			<div class="spinner"></div>
			<div class="loading-title">은행망 처리중</div>
			<div class="loading-sub">잠시만 기다려주세요...</div>
			<div class="loading-steps">
				<div class="loading-step" id="step1">
					<span class="step-icon">○</span> 이체 요청 전송
				</div>
				<div class="loading-step" id="step2">
					<span class="step-icon">○</span> 은행망 연동 확인
				</div>
				<div class="loading-step" id="step3">
					<span class="step-icon">○</span> 관세청 수납 처리
				</div>
				<div class="loading-step" id="step4">
					<span class="step-icon">○</span> 수입신고 수리 완료
				</div>
			</div>
		</div>
		<div id="loadingComplete" style="display: none;">
			<div class="success-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"
					stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
			</div>
			<div class="loading-title" style="color: #28a745;">납부가 정상
				처리되었습니다</div>
			<div class="loading-sub" id="completeMsg">납부 완료</div>
			<button class="btn btn-primary"
				style="margin-top: 24px; min-width: 140px;"
				onclick="goToDetail()">확인</button>
		</div>
	</div>
</div>

<script>
  /* ================================================================
   * G-TCS 납부고지서 — 백엔드 컨트롤러 완벽 연동 버전
   * ================================================================ */

  let importData  = null;       // 수입신고 마스터 데이터
  let currentImportId = null;   // 수입신고 고유 ID
  let currentImportNumber = null; // 수입신고번호
  
  let currentVacct = null;      // 발급된 가상계좌번호
  let currentBankName = null;   // 발급된 은행명
  let currentPayStatus = 'PAY_WAITING'; // 현재 납부 상태

  let els = {};

  document.addEventListener("DOMContentLoaded", function() {
    cacheDom();
    const urlParams = new URLSearchParams(window.location.search);
    const importId = urlParams.get('importId');

    if (importId) {
      currentImportId = importId;
      fetchImportData(importId);
    } else {
    	Swal.fire({
    		  icon: 'warning',
    		  title: '알림',
    		  text: '납부 정보가 존재하지 않습니다.',
    		  confirmButtonText: '확인',
    		  scrollbarPadding: false,
    		  heightAuto: false
    		});
      history.back();
    }
  });

  function cacheDom() {
    els = {
      pageLoading:     document.getElementById("pageLoading"),
      noticeContent:   document.getElementById("noticeContent"),
      badge:           document.getElementById("currentStatusBadge"),
      vacctArea:       document.getElementById("vacctArea"),
      beforeIssueMsg:  document.getElementById("beforeIssueMsg"),
      vacctNumber:     document.getElementById("vacctNumber"),
      vacctAmountMsg:  document.getElementById("vacctAmountMsg"),
      btnIssue:        document.getElementById("btnIssue"),
      btnSimulate:     document.getElementById("btnSimulate"),
      btnPrint:        document.getElementById("btnPrint"),
      bankModal:       document.getElementById("bankModal"),
      modalVacct:      document.getElementById("modalVacct"),
      loadingOverlay:  document.getElementById("loadingOverlay"),
      loadingProgress: document.getElementById("loadingProgress"),
      loadingComplete: document.getElementById("loadingComplete")
    };
  }

  /* ================================================================
   * 1. 데이터 조회 — 마스터 정보 + 납부 정보(컨트롤러 GET /info) 순차 호출
   * ================================================================ */
   function fetchImportData(importId) {
        // [1단계] 수입신고 기본 정보 조회
        axios.get('/rest/import/' + importId, { params: { memRole: 'UA', t: new Date().getTime() } })
          .then(function(res) {
            importData = res.data;
            currentImportId = importId;
            currentImportNumber = importData.importNumber;
            
            // [2단계] 백엔드 컨트롤러의 GET /rest/tax/info를 호출해서 진짜 DB 계좌 정보를 가져옵니다.
            return axios.get('/rest/tax/info', { params: { importId: importId } });
          })
          .then(function(taxRes) {
            const taxData = taxRes.data; // ImportTaxPaymentDTO 결과

            // [계좌번호 세팅] DB에 데이터가 있다면 변수에 할당 (로컬스토리지 배제)
            if (taxData && taxData.virtualAcct) {
                currentVacct = taxData.virtualAcct;
                currentBankName = taxData.bankName || '신한은행';
            }

            // [상태 판단] 마스터 상태와 납부 테이블 상태 교차 체크 (반출승인 포함)
            const rawStatus = (importData.status || '').toUpperCase();
            const payStatus = (taxData && taxData.payStatus ? taxData.payStatus : '').toUpperCase(); 
            
            if (rawStatus === 'PAY_COMPLETED' || 
                rawStatus === 'APPROVED' || 
                rawStatus === 'DONE' || 
                rawStatus === 'DELIVERED' || 
                rawStatus === 'RELEASE_APPROVED' || 
                payStatus === 'PAY_COMPLETED') { 
                
                currentPayStatus = 'PAY_COMPLETED';
            } else {
                currentPayStatus = 'PAY_WAITING';
            }

            console.log("DB 연동 완료 - 상태:", currentPayStatus, "/ 계좌:", currentVacct);
            
            bindDataToNotice(importData);
            applyStatus();
            showContent();
          })
          .catch(function(err) {
            console.error("데이터 조회 실패:", err);
            showError();
          });
    }

  /* ================================================================
   * 2. 데이터 바인딩 (기존 로직 유지)
   * ================================================================ */
  function bindDataToNotice(d) {
    setText('payIdDisplay', 'GTCS-' + d.importId);
    setText('importNumber', d.importNumber || '-');
    setText('submitDate', d.submitDate || '-');
    setText('bizRegNo', d.bizRegNo || '-');
    setText('importerName', d.importerName || '-');
    setText('repName', d.repName || '-');
    setText('address', d.address || '-');
    setText('taxBase', fmtKRW(d.totalTaxBase));
    setText('dutyAmt', fmtKRW(d.totalDuty));
    setText('vatAmt', fmtKRW(d.totalVat));
    setText('totalAmount', fmtKRW(d.totalTaxSum));
    setText('paymentAmountText', fmtNum(d.totalTaxSum));

    let itemText = d.itemNameDeclared || d.itemNameTrade || '-';
    if (d.hsCode) itemText += ' (HS CODE: ' + d.hsCode + ')';
    setText('itemName', itemText);
    
    if (d.totalTaxBase > 0) {
      if (d.totalDuty) setText('dutyRate', ((d.totalDuty / d.totalTaxBase) * 100).toFixed(1) + '%');
      setText('vatRate', '10.0%');
    }

    setText('dueDate', d.dueDate || '신고 후 15일 이내');
    setText('issueDate', new Date().toISOString().slice(0, 10));

    const mc = document.getElementById('modalCompanyName');
    const ma = document.getElementById('modalPayAmount');
    if (mc) mc.innerText = d.importerName || '-';
    if (ma) ma.innerText = fmtNum(d.totalTaxSum) + '원';

    const cm = document.getElementById('completeMsg');
    if (cm) cm.innerHTML = '납부금액: <strong style="color:#d32f2f;">' + fmtNum(d.totalTaxSum) + '원</strong><br/>수입신고가 수리되었습니다.';
  }

  /* ================================================================
   * 3. 상태 적용 (UI 제어)
   * ================================================================ */
  function applyStatus() {
    if (currentPayStatus === 'PAY_COMPLETED') {
      els.badge.className = 'status-badge status-completed';
      els.badge.innerText = '수납완료(수입신고수리)';
      els.beforeIssueMsg.style.display = 'none';
      els.btnIssue.style.display = 'none';
      els.btnSimulate.style.display = 'none';
      els.btnPrint.style.display = 'inline-block';

      if (currentVacct) {
        els.vacctArea.classList.add('active');
        els.vacctArea.style.backgroundColor = '#e8f5e9';
        els.vacctArea.style.border = '2px solid #4caf50';
        els.vacctNumber.innerText = currentVacct;
        els.vacctNumber.style.textDecoration = 'line-through';
        els.vacctNumber.style.color = '#999';
        if (currentBankName) setText('bankNameDisplay', currentBankName);
        els.vacctAmountMsg.innerHTML = '<strong>납부가 정상적으로 완료되었습니다.</strong>';
        els.vacctAmountMsg.style.color = '#2e7d32';
        els.vacctAmountMsg.style.fontSize = '15px';
      }

    } else if (currentPayStatus === 'PAY_WAITING' && currentVacct) {
      els.badge.className = 'status-badge status-waiting';
      els.badge.innerText = '납부대기(가상계좌)';
      els.beforeIssueMsg.style.display = 'none';
      els.vacctArea.classList.add('active');
      els.vacctNumber.innerText = currentVacct;
      if (currentBankName) setText('bankNameDisplay', currentBankName);
      els.btnIssue.style.display = 'none';
      els.btnSimulate.style.display = 'inline-block';

    } else {
      els.badge.className = 'status-badge status-wait';
      els.badge.innerText = '납부대기(미발급)';
      els.beforeIssueMsg.style.display = 'block';
      els.btnIssue.style.display = 'inline-block';
      els.btnSimulate.style.display = 'none';
      els.btnPrint.style.display = 'none';
    }
  }

  function showContent() {
    els.pageLoading.style.display = "none";
    els.noticeContent.style.display = "block";
  }

  function showError() {
    els.pageLoading.innerHTML =
      '<div style="color:#dc3545;font-size:15px;">고지서 정보를 불러올 수 없습니다.<br/>' +
      '<button class="btn btn-outline" style="margin-top:16px;" onclick="history.back()">돌아가기</button></div>';
  }

  /* ================================================================
   * 4. 가상계좌 발급 (POST /rest/tax/virtual-account)
   * ================================================================ */
  function issueVirtualAccount() {
    if (!currentImportId) {
    	Swal.fire({
            icon: 'warning',
            title: '알림',
            text: '수입신고 정보가 없습니다.',
            confirmButtonText: '확인',
            scrollbarPadding: false,  // 사이드바 보호 1
            heightAuto: false         // 사이드바 보호 2
        });
      return;
    }

    els.btnIssue.innerText = '은행 전산 통신중...';
    els.btnIssue.disabled = true;

    const bankList = ['신한은행', '국민은행', '우리은행', '하나은행', '기업은행'];
    const randomBank = bankList[Math.floor(Math.random() * bankList.length)];
    const datePart  = new Date().toISOString().slice(5, 10).replace('-', '');
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const newVacct  = '562-' + datePart + '-' + randomNum;

    setTimeout(function() {
        axios.post('/rest/tax/virtual-account', {
          importId:    currentImportId,
          bankName:    randomBank,
          virtualAcct: newVacct
        })
        .then(function(res) {
          // 데이터가 아니라 HTTP 상태 코드로 성공 여부 판단
          if (res.status === 200) { 
            currentVacct = newVacct;
            currentBankName = randomBank;
            currentPayStatus = 'PAY_WAITING';
            // 로컬스토리지 저장 로직 완전 삭제 (DB가 우선)
            applyStatus();
            Swal.fire({
            	  icon: 'success',
            	  title: '가상계좌가 발급되었습니다.',
            	  html: '은행: ' + randomBank + '<br>계좌: ' + newVacct,
            	  confirmButtonText: '확인',
            	  scrollbarPadding: false,
            	  heightAuto: false
            	});
          } else {
        	  Swal.fire({
        		  icon: 'error',
        		  title: '발급 실패',
        		  text: '가상계좌 발급에 실패했습니다.',
        		  confirmButtonText: '확인',
        		  scrollbarPadding: false,
        		  heightAuto: false
        		});
            els.btnIssue.innerText = '가상계좌 발급신청';
            els.btnIssue.disabled = false;
          }
      })
      .catch(function(err) {
        console.error("API 오류:", err);
        alert("서버 오류가 발생했습니다.");
        els.btnIssue.innerText = '가상계좌 발급신청';
        els.btnIssue.disabled = false;
      });
    }, 800);
  }

  /* ================================================================
   * 5. 은행 시뮬레이터 및 6. 납부 처리
   * ================================================================ */
  function openBankSimulator() {
    if (!currentVacct) return;
    els.modalVacct.innerText = currentVacct;
    const bankLogoEl = document.querySelector('.bank-logo');
    if (bankLogoEl && currentBankName) bankLogoEl.innerText = currentBankName;
    els.bankModal.style.display = 'flex';
  }
  
  function closeBankModal() { els.bankModal.style.display = 'none'; }

  function confirmPayment() {
    closeBankModal();
    showLoading();
  }

  function showLoading() {
    els.loadingProgress.style.display = 'block';
    els.loadingComplete.style.display = 'none';
    resetSteps();
    els.loadingOverlay.classList.add('active');

    setTimeout(function() { activateStep('step1'); }, 300);
    setTimeout(function() { completeStep('step1'); activateStep('step2'); }, 1200);
    setTimeout(function() { completeStep('step2'); activateStep('step3'); }, 2200);
    setTimeout(function() {
      completeStep('step3');
      activateStep('step4');
      callPaymentAPI(); 
    }, 3200);
  }

  function callPaymentAPI() {
	    const payerName = (importData && importData.importerName) ? importData.importerName : '납부자';
	    
	    axios.post('/rest/tax/pay', {
	      importId: currentImportId,
	      payerName: payerName
	    })
	    .then(function(res) {
	      // 수정된 부분: HTTP 상태 코드가 200번대(성공)인지 확인하도록 변경
	      if (res.status >= 200 && res.status < 300) { 
	        // 만약 백엔드에서 강제로 { success: false } 같은 값을 준다면 
	        // res.data.success === true 같은 조건을 추가하셔야 합니다.
	        return updateImportStatus();
	      } else {
	        throw new Error("납부 처리 응답 오류");
	      }
	    })
	    .then(function() {
	      completeStep('step4');
	      setTimeout(function() {
	          els.loadingProgress.style.display = 'none';
	          els.loadingComplete.style.display = 'block';
	          currentPayStatus = 'PAY_COMPLETED';
	          applyStatus();
	      }, 500);
	    })
	    .catch(function(err) {
	      handlePaymentError(err.message);
	    });
	}

   function updateImportStatus() {
        if (!currentImportNumber) return Promise.resolve();
        return axios.post('/rest/import/feedback', {
          importNumber: currentImportNumber,
          status: 'PAY_COMPLETED',
          docComment: '관세 납부 완료',
          checkId: '',
          officerId: ''
        });
    }

  function handlePaymentError(msg) {
    els.loadingOverlay.classList.remove('active');
    Swal.fire({
        icon: 'error',
        title: '납부 처리 실패',
        text: msg,
        confirmButtonText: '확인',
        scrollbarPadding: false,
        heightAuto: false // 사이드바 보호용 옵션
    });
  }

  function closeLoadingOverlay() { els.loadingOverlay.classList.remove('active'); }
  
  function goToDetail() {
    const timestamp = new Date().getTime();
    location.href = '/client/ims/status/detail?id=' + currentImportId + '&update=' + timestamp;
  }

  function resetSteps() {
    const steps = document.querySelectorAll('.loading-step');
    for (let i = 0; i < steps.length; i++) {
      steps[i].className = 'loading-step';
      steps[i].querySelector('.step-icon').textContent = '○';
    }
  }
  function activateStep(id) {
    const el = document.getElementById(id);
    el.className = 'loading-step active';
    el.querySelector('.step-icon').textContent = '◉';
  }
  function completeStep(id) {
    const el = document.getElementById(id);
    el.className = 'loading-step done';
    el.querySelector('.step-icon').textContent = '✓';
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = (value === null || value === undefined) ? '-' : value;
  }
  function fmtNum(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString();
  }
  function fmtKRW(num) { return fmtNum(num) + ' KRW'; }

  function copyToClipboard() {
    const text = els.vacctNumber.innerText;
    navigator.clipboard.writeText(text).then(function() {
    	Swal.fire({
    		  toast: true,
    		  position: 'top',
    		  icon: 'success',
    		  title: '계좌번호가 복사되었습니다.',
    		  showConfirmButton: false,
    		  timer: 1500,
    		  // 슬라이드 애니메이션 적용
    		  showClass: {
			    popup: 'my-slide-down'
			  },
			  hideClass: {
			    popup: 'my-slide-up'
			  }
    		});
    });
  }
</script>
