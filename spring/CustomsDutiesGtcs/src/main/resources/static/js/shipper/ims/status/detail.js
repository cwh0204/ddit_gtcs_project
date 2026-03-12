/**
 * 
 */

// 탭 전환 함수
function switchTab(tabId, element) {
	// 모든 탭 컨텐츠 숨김
	const panes = document.querySelectorAll('.tab-pane');
	panes.forEach(pane => pane.classList.remove('active'));

	// 모든 탭 버튼 비활성화
	const btns = document.querySelectorAll('.tab-btn');
	btns.forEach(btn => btn.classList.remove('active'));

	// 선택된 탭 활성화
	document.getElementById(tabId).classList.add('active');
	element.classList.add('active');
}

// 정정신고 이동
function goToCorrection() {
	if (confirm('정정신고를 진행하시겠습니까?')) {
		alert('정정신고 화면으로 이동합니다.');
	}
}

// 초기화 로직
document.addEventListener("DOMContentLoaded", function() {
	// Input Readonly 처리
	const inputs = document.querySelectorAll('.form-table input, .form-table select, .form-table textarea');
	inputs.forEach(el => {
		el.setAttribute('readonly', true);
		if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
			el.setAttribute('disabled', true);
		}
		el.removeAttribute('placeholder');
	});

	// 내부 버튼 숨김 처리
	const actionBtns = document.querySelectorAll('button[id^="btnRan"], button[id^="btnAdd"], button[id^="btnDel"], .btn-search, .btn.micro');
	actionBtns.forEach(btn => btn.style.display = 'none');

	// Import된 JSP 탭 구조 초기화
	const tabContents = document.querySelectorAll('.tab-content');
	tabContents.forEach(content => {
		content.style.display = 'block';
		content.classList.remove('tab-content');
		content.style.border = 'none';
	});

	// 중복 타이틀 숨김
	const nestedTitles = document.querySelectorAll('.group-title, .section-title');
	// 주의: 로그 탭 등의 타이틀은 살려야 하므로 .section-content 내부 것만 숨김
	const innerTitles = document.querySelectorAll('.tab-pane .group-title');
	innerTitles.forEach(title => title.style.display = 'none');
});