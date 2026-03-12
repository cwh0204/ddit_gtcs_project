<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<link rel="stylesheet"
	href="/css/shipper/member/dashboard/dashboard.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
/*
 * JWT 토큰 기반 인증 (인덱스 페이지와 동일 패턴)
 * sessionScope.SPRING_SECURITY_CONTEXT는 JWT 방식에서 비어있으므로 사용하지 않음
 */
function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('토큰 파싱 오류:', e);
        return null;
    }
}

/*
 * 사용자 정보는 헤더(header.jsp)에서 JWT 파싱 후 window.USER_CONTEXT에 세팅됨.
 * 대시보드에서는 window.USER_CONTEXT.memId를 그대로 참조하여 사용합니다.
 */
</script>

<style>
@import
	url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap')
	;

:root {
	--bg-page: #fff;
	--bg-card: #fff;
	--bg-muted: #f5f6fa;
	--border-color: #e4e7f0;
	--border-accent: #d3d7e6;
	--text-primary: #1a1d2e;
	--text-secondary: #5a5f7a;
	--text-muted: #8b90a8;
	--primary: #3478f6;
	--primary-light: #eef3fe;
	--primary-border: rgba(52, 120, 246, .18);
	--accent-red: #e84057;
	--accent-red-bg: rgba(232, 64, 87, .07);
	--accent-red-border: rgba(232, 64, 87, .18);
	--accent-orange: #e8862a;
	--accent-orange-bg: rgba(232, 134, 42, .07);
	--accent-orange-border: rgba(232, 134, 42, .18);
	--accent-blue: #3478f6;
	--accent-blue-bg: rgba(52, 120, 246, .06);
	--accent-blue-border: rgba(52, 120, 246, .16);
	--accent-green: #1ba854;
	--accent-purple: #7c5cfc;
	--accent-purple-bg: rgba(124, 92, 252, .06);
	--accent-purple-border: rgba(124, 92, 252, .16);
	--radius-sm: 6px;
	--radius-md: 10px;
	--shadow-card: 0 1px 4px rgba(0, 0, 0, .04), 0 0 0 1px
		var(--border-color);
	--shadow-hover: 0 4px 14px rgba(0, 0, 0, .06), 0 0 0 1px
		var(--border-accent);
	--transition: .2s cubic-bezier(.4, 0, .2, 1);
}

.dashboard-shell {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--bg-page);
	font-family: 'Noto Sans KR', -apple-system, sans-serif;
	color: var(--text-primary);
	padding: 20px 24px 16px;
	width: 100%;
	min-width: 1400px;
	max-width: none !important;
	border: none !important;
	box-shadow: none !important;
	margin: 0;
	overflow-x: auto;
	overflow-y: hidden;
	box-sizing: border-box
}

.welcome-banner {
	display: flex;
	align-items: center;
	gap: 20px;
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	padding: 16px 24px;
	box-shadow: var(--shadow-card);
	flex-shrink: 0
}

.greeting-box h2 {
	font-size: 18px;
	font-weight: 700;
	margin: 0 0 3px
}

.greeting-box p {
	font-size: 12.5px;
	color: var(--text-muted);
	margin: 0
}

.banner-divider {
	width: 1px;
	height: 38px;
	background: var(--border-color);
	flex-shrink: 0
}

.ticker-area {
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 1;
	min-width: 0
}

.ticker-badge {
	flex-shrink: 0;
	font-size: 10.5px;
	font-weight: 700;
	letter-spacing: .5px;
	padding: 3px 10px;
	border-radius: 4px;
	background: var(--primary);
	color: #fff
}

.ticker-slot {
	position: relative;
	height: 24px;
	overflow: hidden;
	flex: 1
}

.ticker-msg {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	font-size: 14px;
	color: var(--text-secondary);
	line-height: 24px;
	white-space: nowrap;
	transition: opacity .45s ease, transform .45s ease;
	opacity: 0;
	transform: translateY(10px)
}

.ticker-msg.active {
	opacity: 1;
	transform: translateY(0)
}

.ticker-msg .hl {
	font-weight: 700;
	color: var(--primary)
}

.ticker-msg .hl-red {
	font-weight: 700;
	color: var(--accent-red)
}

.tab-nav {
	display: flex;
	gap: 0;
	margin-top: 12px;
	border-bottom: 2px solid var(--border-color);
	flex-shrink: 0
}

.tab-btn {
	position: relative;
	padding: 10px 20px;
	font-size: 13.5px;
	font-weight: 500;
	color: var(--text-muted);
	background: none;
	border: none;
	cursor: pointer;
	transition: color var(--transition), background var(--transition);
	white-space: nowrap;
	font-family: inherit;
	border-radius: 6px 6px 0 0
}

.tab-btn:hover {
	color: var(--text-secondary);
	background: var(--bg-muted)
}

.tab-btn.active {
	color: var(--primary);
	font-weight: 600;
	background: var(--primary-light)
}

.tab-btn.active::after {
	content: '';
	position: absolute;
	bottom: -2px;
	left: 0;
	right: 0;
	height: 2.5px;
	background: var(--primary);
	border-radius: 2px 2px 0 0
}

.tab-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 20px;
	height: 18px;
	padding: 0 6px;
	margin-left: 5px;
	border-radius: 9px;
	font-size: 11px;
	font-weight: 600;
	font-family: 'JetBrains Mono', monospace
}

.tab-count.red {
	background: var(--accent-red-bg);
	color: var(--accent-red);
	border: 1px solid var(--accent-red-border)
}

.tab-count.blue {
	background: var(--accent-blue-bg);
	color: var(--accent-blue);
	border: 1px solid var(--accent-blue-border)
}

.tab-count.purple {
	background: var(--accent-purple-bg);
	color: var(--accent-purple);
	border: 1px solid var(--accent-purple-border)
}

.tab-panels {
	flex: 1;
	min-height: 0;
	position: relative;
	overflow: hidden
}

.tab-panel {
	display: none;
	padding-top: 14px;
	height: 100%;
	flex-direction: column;
	box-sizing: border-box
}

.tab-panel.active {
	display: flex
}

#dashPanel-0 {
	overflow-y: hidden
}

#dashPanel-1 {
	overflow: hidden;
	height: 100%
}

#dashPanel-2 {
	overflow: hidden;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: 8px;
}

.urgent-grid {
	min-height: 0;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 14px;
	flex: 1;
	min-height: 400px
}

.urgent-column {
	min-height: 0;
	display: flex;
	flex-direction: column;
	height: 100%
}

.column-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md) var(--radius-md) 0 0;
	border-bottom: none;
	flex-shrink: 0
}

.column-header h3 {
	font-size: 13.5px;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 8px
}

.col-count {
	font-family: 'JetBrains Mono', monospace;
	font-size: 11.5px;
	padding: 2px 9px;
	border-radius: 10px;
	font-weight: 600
}

.col-count.red {
	background: var(--accent-red-bg);
	color: var(--accent-red);
	border: 1px solid var(--accent-red-border)
}

.col-count.orange {
	background: var(--accent-orange-bg);
	color: var(--accent-orange);
	border: 1px solid var(--accent-orange-border)
}

.list-body {
	flex: 1;
	overflow-y: auto;
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-top: none;
	border-radius: 0 0 var(--radius-md) var(--radius-md);
	padding: 4px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, .03)
}

.list-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
	padding: 14px;
	border-radius: var(--radius-sm);
	transition: background var(--transition);
	cursor: pointer;
	min-height: 0;
	border-bottom: 1px solid var(--bg-muted)
}

.list-item:last-child {
	border-bottom: none
}

.list-item:hover {
	background: var(--bg-muted)
}

.item-top {
	display: flex;
	align-items: center;
	justify-content: space-between
}

.item-badge {
	font-size: 11px;
	font-weight: 600;
	padding: 2px 8px;
	border-radius: 4px
}

.badge-supplement {
	background: var(--accent-orange-bg);
	color: var(--accent-orange);
	border: 1px solid var(--accent-orange-border)
}

.badge-reject-import {
	background: var(--accent-red-bg);
	color: var(--accent-red);
	border: 1px solid var(--accent-red-border)
}

.badge-reject-export {
	background: var(--accent-purple-bg);
	color: var(--accent-purple);
	border: 1px solid var(--accent-purple-border)
}

.item-deadline {
	font-family: 'JetBrains Mono', monospace;
	font-size: 11px;
	color: var(--text-muted)
}

.item-deadline.urgent {
	color: var(--accent-red);
	font-weight: 600
}

.item-deadline.soon {
	color: var(--accent-orange)
}

.item-title {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;

    display: -webkit-box;
    -webkit-line-clamp: 2;      /* 최대 2줄 */
    -webkit-box-orient: vertical;

    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
}

.item-meta {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 11.5px;
	color: var(--text-muted)
}

.item-btn {
	margin-top: 3px;
	align-self: flex-end;
	font-size: 11.5px;
	font-weight: 500;
	padding: 5px 14px;
	border-radius: var(--radius-sm);
	border: none;
	cursor: pointer;
	font-family: inherit;
	transition: all var(--transition)
}

.item-btn.orange {
	background: var(--accent-orange-bg);
	color: var(--accent-orange);
	border: 1px solid var(--accent-orange-border)
}

.item-btn.red {
	background: var(--accent-red-bg);
	color: var(--accent-red);
	border: 1px solid var(--accent-red-border)
}

.urgent-grid .urgent-column:nth-child(3) .list-item {
	padding: 10px 12px;
	gap: 4px
}

.urgent-grid .urgent-column:nth-child(3) .sub-header {
	padding: 10px 12px 3px
}

.urgent-grid .urgent-column:nth-child(3) .sub-divider {
	margin: 6px 12px
}

.urgent-grid .urgent-column:nth-child(3) .item-meta {
	font-size: 11px
}

.urgent-grid .urgent-column:nth-child(3) .item-title{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  white-space: normal;     /* nowrap 제거 */
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}


.urgent-grid .urgent-column:nth-child(3) .item-btn {
	padding: 4px 12px;
	font-size: 11px;
	margin-top: 2px
}

.sub-header {
	font-size: 12px;
	font-weight: 600;
	color: var(--text-secondary);
	padding: 12px 14px 4px;
	display: flex;
	align-items: center;
	gap: 6px
}

.sub-header .sub-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%
}

.sub-header .sub-dot.red {
	background: var(--accent-red)
}

.sub-header .sub-dot.purple {
	background: var(--accent-purple)
}

.sub-divider {
	height: 1px;
	background: var(--border-color);
	margin: 8px 14px
}

.split-layout-container {
	display: flex;
	gap: 16px;
	width: 100%;
	flex: 1;
	min-height: 0;
	margin-bottom: 12px
}

.split-column {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
	min-width: 0
}

.split-header {
	font-size: 13.5px;
	font-weight: 700;
	color: var(--text-primary);
	display: flex;
	align-items: center;
	gap: 8px;
	padding-bottom: 6px;
	border-bottom: 2px solid var(--border-color);
	margin-bottom: 2px;
	flex-shrink: 0
}

.split-header.import {
	border-color: var(--primary)
}

.split-header.export {
	border-color: var(--accent-purple)
}

.split-header .icon-box {
	width: 22px;
	height: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	font-size: 11px;
	font-weight: 800
}

.split-header.import .icon-box {
	background: var(--primary-light);
	color: var(--primary)
}

.split-header.export .icon-box {
	background: var(--accent-purple-bg);
	color: var(--accent-purple)
}

.kpi-grid-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	flex-shrink: 0
}

.status-grid-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	flex: 1;
	min-height: 0
}

.kpi-section-title {
	font-size: 12px;
	font-weight: 600;
	color: var(--text-secondary);
	margin: 0;
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px
}

.kpi-section-title.full-width {
	margin-top: 4px;
	flex-shrink: 0
}

.kpi-section-title.full-width::after {
	content: '';
	flex: 1;
	height: 1px;
	background: var(--border-color)
}

.kpi-grid-4 {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 12px;
	margin-bottom: 0;
	flex-shrink: 0;
	padding-bottom: 2px
}

.kpi-grid-3 {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	flex-shrink: 0
}

.kpi-card {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	padding: 20px 24px; /* 기존 14px 16px 에서 확대 */
	display: flex;
	flex-direction: column;
	gap: 10px; /* 기존 4px 에서 확대 */
	justify-content: center; /* 세로 중앙 정렬 유지 */
	transition: all var(--transition);
	position: relative;
	overflow: hidden;
	box-shadow: var(--shadow-card);
	cursor: pointer;
}

.kpi-card:hover {
	box-shadow: var(--shadow-hover);
	transform: translateY(-1px)
}

.kpi-card.import::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: var(--primary)
}

.kpi-card.export::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: var(--accent-purple)
}

.kpi-card.common::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: var(--text-secondary)
}

/* 카드 제목 크기 및 굵기 확대 */
.kpi-label {
	font-size: 15px; /* 기존 12px 에서 확대 */
	color: var(--text-secondary);
	font-weight: 500; /* 약간 더 또렷하게 변경 */
}

.kpi-value-row {
	display: flex;
	align-items: baseline;
	gap: 4px
}

/* 메인 숫자 크기 대폭 확대 */
.kpi-value {
	font-family: 'JetBrains Mono', monospace;
	font-size: 38px; /* 기존 24px 에서 확대 */
	font-weight: 700;
	line-height: 1;
	color: var(--text-primary);
}

.kpi-card.import .kpi-value {
	color: var(--primary)
}

.kpi-card.export .kpi-value {
	color: var(--accent-purple)
}

/* '건', '원' 등 단위 텍스트 확대 */
.kpi-unit {
	font-size: 16px; /* 기존 13px 에서 확대 */
	color: var(--text-muted);
	font-weight: 500;
	margin-left: 2px;
}

/* 하단 서브 텍스트(상태 설명) 확대 */
.kpi-sub {
	font-size: 13.5px; /* 기존 11px 에서 확대 */
	color: var(--text-muted);
}

.kpi-sub span {
	font-weight: 600;
}

.kpi-sub span.up {
	color: var(--accent-green)
}

.kpi-sub span.down {
	color: var(--accent-red)
}

.status-item {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	padding: 12px 14px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	justify-content: center;
	box-shadow: var(--shadow-card);
	height: 100%;
	box-sizing: border-box;
	cursor: pointer;
	transition: all var(--transition)
}

.status-item:hover {
	box-shadow: var(--shadow-hover)
}

.status-item .s-label {
	font-size: 11.5px;
	color: var(--text-secondary)
}

.status-item .s-value {
	font-family: 'JetBrains Mono', monospace;
	font-size: 18px;
	font-weight: 700;
	color: var(--text-primary)
}

.status-item .s-value .s-unit {
	font-size: 11px;
	color: var(--text-muted);
	font-weight: 400;
	margin-left: 2px
}

.status-item .s-bar {
	height: 3px;
	background: var(--bg-muted);
	border-radius: 2px;
	overflow: hidden;
	margin-top: 4px
}

.status-item .s-bar-fill {
	height: 100%;
	border-radius: 2px;
	transition: width .6s ease
}

.import-section .s-bar-fill, .import-section .s-value {
	color: var(--primary)
}

.import-section .s-bar-fill {
	background: var(--primary)
}

.export-section .s-bar-fill, .export-section .s-value {
	color: var(--accent-purple)
}

.export-section .s-bar-fill {
	background: var(--accent-purple)
}

.charts-layout {
	display: grid;
	grid-template-columns: 1fr 2fr;
	gap: 14px;
	width: 100%;
	min-width: 1400px;
	flex: 1;
	min-height: 0;
}

.chart-left {
	display: flex;
	flex-direction: column;
	min-width: 0;
	height: 100%
}

.chart-right {
	display: flex;
	flex-direction: column;
	gap: 14px;
	min-width: 0;
	height: 100%
}

.chart-row-top {
	display: flex;
	gap: 14px;
	flex: 1;
	min-height: 0
}

.chart-card {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	box-shadow: var(--shadow-card);
	min-width: 0;
	flex: 1;
	min-height: 0;
	height: 100%
}

.chart-card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 6px;
	flex-shrink: 0
}

.chart-card-header h4 {
	font-size: 13.5px;
	font-weight: 600
}

.chart-card-header .chart-period {
	font-size: 11px;
	color: var(--text-muted);
	font-family: 'JetBrains Mono', monospace
}

.chart-canvas-wrap {
	flex: 1;
	position: relative;
	min-height: 0;
	width: 100%;
	overflow: hidden
}

.empty-list {
	text-align: center;
	padding: 40px 20px;
	color: var(--text-muted);
	font-size: 13px
}

@keyframes fadeInUp {
	from { opacity: 0; transform: translateY(6px) }
	to   { opacity: 1; transform: translateY(0) }
}

.tab-panel.active>* {
	animation: fadeInUp .2s ease forwards
}

.tab-panel.active>*:nth-child(2) {
	animation-delay: .03s
}

.tab-panel.active>*:nth-child(3) {
	animation-delay: .06s
}
/* 새로 추가할 클래스 (2열 3행으로 세로 여백을 꽉 채움) */
.kpi-grid-2x3 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(3, 1fr); /* 3줄을 동일한 높이로 분배 */
	gap: 12px;
	flex: 1;       /* 부모의 남는 세로 공간을 모두 차지 */
	min-height: 0;
}

/* 기존 .kpi-card 클래스에 justify-content 속성 추가 */
.kpi-card {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	padding: 14px 16px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	justify-content: center; /* 추가: 카드가 위아래로 늘어날 때 내부 요소 세로 중앙 정렬 */
	transition: all var(--transition);
	position: relative;
	overflow: hidden;
	box-shadow: var(--shadow-card);
	cursor: pointer;
}
</style>

<main class="content-area">
	<div class="dashboard-shell">

		<!-- 배너 -->
		<div class="welcome-banner">
			<div class="greeting-box">
				<h2 id="greetingName">안녕하세요</h2>
				<p>오늘도 안전하고 신속한 통관을 기원합니다.</p>
			</div>
			<div class="banner-divider"></div>
			<div class="ticker-area">
				<span class="ticker-badge">NOTICE</span>
					<div class="ticker-slot">
						<p class="ticker-msg active" data-idx="0">
							금일 신규 업무 <span class="hl" id="tickerNew">-</span>건, 긴급 처리 <span
								class="hl-red" id="tickerUrgent">-</span>건입니다.
						</p>
						<p class="ticker-msg" data-idx="1">
							미완료 잔여: 수입 <span class="hl" id="tickerPendingImp">-</span>건,
							수출 <span class="hl" id="tickerPendingExp">-</span>건
						</p>
						<p class="ticker-msg" data-idx="2">
							금일 납부 예정 세액: <span class="hl" id="tickerTax">-</span>원 (납기일 도래 <span
								class="hl-red" id="tickerTaxCount">-</span>건)
						</p>
						<p class="ticker-msg" data-idx="3">
							보완/정정 요청 잔여 <span class="hl-red" id="tickerSupp">-</span>건 — 기한 내
							처리 바랍니다.
						</p>
					</div>
			</div>
		</div>

		<!-- 탭 -->
		<nav class="tab-nav">
		    <button class="tab-btn active" onclick="switchDashTab(0)" data-idx="0">
		        긴급 처리 사항 <span class="tab-count red" id="tabCount0">-</span>
		    </button>
		    <button class="tab-btn" onclick="switchDashTab(1)" data-idx="1">
		        핵심 업무 지표
		    </button>
		    <button class="tab-btn" onclick="switchDashTab(2)" data-idx="2">
		        통계 차트
		    </button>
		</nav>

		<div class="tab-panels">

			<!-- Tab 1: 긴급 처리 사항 -->
			<div class="tab-panel active" id="dashPanel-0">
				<div class="urgent-grid">
					<div class="urgent-column">
						<div class="column-header">
							<h3>수입 보완/정정 요청</h3>
							<span class="col-count orange" id="impSuppCount">0</span>
						</div>
						<div class="list-body" id="impSuppList">
							<div class="empty-list">데이터를 불러오는 중...</div>
						</div>
					</div>
					<div class="urgent-column">
						<div class="column-header">
							<h3>수출 보완/정정 요청</h3>
							<span class="col-count orange" id="expSuppCount">0</span>
						</div>
						<div class="list-body" id="expSuppList">
							<div class="empty-list">데이터를 불러오는 중...</div>
						</div>
					</div>
					<div class="urgent-column">
						<div class="column-header">
							<h3>반려 건</h3>
							<span class="col-count red" id="rejectTotalCount">0</span>
						</div>
						<div class="list-body" id="rejectList">
							<div class="empty-list">데이터를 불러오는 중...</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Tab 2: 핵심 업무 지표 -->
			<div class="tab-panel" id="dashPanel-1">
			    <div class="split-layout-container">
			        
			        <div class="split-column import-section">
			            <div class="split-header import">
			                <div class="icon-box">IN</div>
			                수입 (Import) 금일 현황
			            </div>
			            
			            <div class="kpi-grid-2x3">
			                <div class="kpi-card import" onclick="goToList('import','REJECTED','today')">
			                    <span class="kpi-label">금일 수입 반려</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiImpReject">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub"><span class="down">즉시 조치 필요</span></span>
			                </div>
			                <div class="kpi-card import" onclick="goToList('import','PHYSICAL','today')">
			                    <span class="kpi-label">금일 현품검사중</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiImpPhysical">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">검사 진행중</span>
			                </div>
			                <div class="kpi-card import" onclick="goToList('import','WAITING','today')">
			                    <span class="kpi-label">금일 심사대기</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiImpWaiting">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">심사 접수 대기</span>
			                </div>
			                <div class="kpi-card import" onclick="goToList('import','REVIEWING','today')">
			                    <span class="kpi-label">금일 심사중</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiImpReviewing">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">심사 진행중</span>
			                </div>
			                <div class="kpi-card import" onclick="goToList('import','PAY_COMPLETED','today')">
			                    <span class="kpi-label">금일 납부완료</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiImpPayCompleted">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">납부 처리 완료</span>
			                </div>
			                <div class="kpi-card import" onclick="goToList('import','DELIVERED','today')">
			                    <span class="kpi-label">금일 출고완료</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiImpDelivered">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub"><span class="up">통관 완료</span></span>
			                </div>
			            </div>
			        </div>
			        
			        <div class="split-column export-section">
			            <div class="split-header export">
			                <div class="icon-box">OUT</div>
			                수출 (Export) 금일 현황
			            </div>
			            
			            <div class="kpi-grid-2x3">
			                <div class="kpi-card export" onclick="goToList('export','REJECTED','today')">
			                    <span class="kpi-label">금일 수출 반려</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiExpReject">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub"><span class="down">즉시 조치 필요</span></span>
			                </div>
			                <div class="kpi-card export" onclick="goToList('export','PHYSICAL','today')">
			                    <span class="kpi-label">금일 현품검사중</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiExpPhysical">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">검사 진행중</span>
			                </div>
			                <div class="kpi-card export" onclick="goToList('export','WAITING','today')">
			                    <span class="kpi-label">금일 심사대기</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiExpWaiting">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">심사 접수 대기</span>
			                </div>
			                <div class="kpi-card export" onclick="goToList('export','REVIEWING','today')">
			                    <span class="kpi-label">금일 심사중</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiExpReviewing">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">심사 진행중</span>
			                </div>
			                <div class="kpi-card export" onclick="goToList('export','INSPECTION_COMPLETED','today')">
			                    <span class="kpi-label">금일 현품검사완료</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiExpInspCompleted">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub">검사 완료 처리</span>
			                </div>
			                <div class="kpi-card export" onclick="goToList('export','DELIVERED','today')">
			                    <span class="kpi-label">금일 출고완료</span>
			                    <div class="kpi-value-row">
			                        <span class="kpi-value" id="kpiExpDelivered">0</span><span class="kpi-unit">건</span>
			                    </div>
			                    <span class="kpi-sub"><span class="up">통관 완료</span></span>
			                </div>
			            </div>
			        </div>
			    </div>
			    
			    <p class="kpi-section-title full-width">통합 부가 지표</p>
			    <div class="kpi-grid-3">
			        <div class="kpi-card common" onclick="goToList('import','PAY_WAITING')">
			            <span class="kpi-label">납부예정 세액</span>
			            <div class="kpi-value-row">
			                <span class="kpi-value" id="kpiTaxAmt">0</span><span class="kpi-unit" id="kpiTaxUnit">원</span>
			            </div>
			            <span class="kpi-sub">납기일 도래 <span class="down" id="kpiTaxDueCount">0건</span></span>
			        </div>
			        <div class="kpi-card common" onclick="goToList('import','','today')">
			            <span class="kpi-label">금일 신규 접수</span>
			            <div class="kpi-value-row">
			                <span class="kpi-value" id="kpiNewTotal">0</span><span class="kpi-unit">건</span>
			            </div>
			            <span class="kpi-sub" id="kpiNewDetail">수입 0건 · 수출 0건</span>
			        </div>
			        <div class="kpi-card common">
			            <span class="kpi-label">미완료 잔여 건수</span>
			            <div class="kpi-value-row">
			                <span class="kpi-value" id="kpiPendingTotal">0</span><span class="kpi-unit">건</span>
			            </div>
			            <span class="kpi-sub" id="kpiPendingDetail">수입 0건 · 수출 0건</span>
			        </div>
			    </div>
			</div>

			<!-- Tab 3: 통계 차트 -->
			<div class="tab-panel" id="dashPanel-2">
				<div class="charts-layout">
					<div class="chart-left">
						<div class="chart-card">
							<div class="chart-card-header">
								<h4>수입/수출 비율</h4>
								<span class="chart-period" id="chartRatioYear">올해 승인 건수</span>
							</div>
							<div class="chart-canvas-wrap">
								<canvas id="chartRatio"></canvas>
							</div>
						</div>
					</div>
					<div class="chart-right">
						<div class="chart-row-top">
							<div class="chart-card">
								<div class="chart-card-header">
									<h4>월별 납부 세액 추이</h4>
									<span class="chart-period">최근 6개월</span>
								</div>
								<div class="chart-canvas-wrap">
									<canvas id="chartTax"></canvas>
								</div>
							</div>
							<div class="chart-card">
								<div class="chart-card-header">
									<h4>월별 반려/보완정정 현황</h4>
									<span class="chart-period">최근 6개월</span>
								</div>
								<div class="chart-canvas-wrap">
									<canvas id="chartIssues"></canvas>
								</div>
							</div>
						</div>
						<div class="chart-card">
							<div class="chart-card-header">
								<h4>월별 수입/수출 건수</h4>
								<span class="chart-period">최근 6개월</span>
							</div>
							<div class="chart-canvas-wrap">
								<canvas id="chartVolume"></canvas>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</main>

<script>
/* ================================================================
 * G-TCS Dashboard — JWT 인증 + DB 연동
 *
 * [페이지 이동 URL]
 * - 수입 상세: /client/ims/status/detail?id={importId}
 * - 수출 상세: /client/exp/status/detail?id={exportId}
 * - 수입 리스트: /client/ims/status/list?status=XXX
 * - 수출 리스트: /client/exp/status/list?status=XXX
 * - 수입 재신고: /client/ims/imswrite/importBase?resubmitId={id}
 * - 수출 재신고: /client/exp/write?resubmitId={id}
 * ================================================================ */

let dashData = null;

document.addEventListener("DOMContentLoaded", function() {
    /* 인사말에 사용자명 세팅 */
    const memName = (window.USER_CONTEXT && window.USER_CONTEXT.memName) || '';
    const greetEl = document.getElementById('greetingName');
    if (greetEl) {
        greetEl.innerText = memName ? memName + '님, 안녕하세요' : '안녕하세요';
    }
    loadDashboardData();
    initTicker();
});

function loadDashboardData() {
    /* 헤더에서 세팅된 USER_CONTEXT의 memId를 사용 */
    const currentMemId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) || 0;
    console.log("대시보드 API 호출 - memId:", currentMemId);
    
    axios.get('/rest/dashboard', { params: { memId: parseInt(currentMemId), t: new Date().getTime() } })
        .then(function(res) {
            dashData = res.data;
            
            // ===============================================================
            // [추가] 반려 건 3일 이내 데이터 필터링 로직
            // ===============================================================
            const todayZero = new Date().setHours(0,0,0,0); // 오늘 자정 기준
            
            const filterRecent3Days = function(arr) {
                if (!arr) return [];
                return arr.filter(function(it) {
                    const targetDateStr = it.statusDate || it.submitDate;
                    if (!targetDateStr) return true; // 날짜가 없으면 기본적으로 표시
                    
                    const tDate = new Date(targetDateStr).setHours(0,0,0,0);
                    const diffDays = (todayZero - tDate) / 864e5; // 864e5 = 24시간을 밀리초로 변환한 값
                    
                    // 반려일로부터 3일 이내(0, 1, 2, 3일)인 건만 유지
                    return diffDays <= 3;
                });
            };

            // 필터링 적용 및 카운트 재할당
            dashData.importRejects = filterRecent3Days(dashData.importRejects);
            dashData.exportRejects = filterRecent3Days(dashData.exportRejects);
            dashData.importRejectCount = dashData.importRejects.length;
            dashData.exportRejectCount = dashData.exportRejects.length;
            // ===============================================================

            console.log("대시보드 데이터 수신 (필터링 완료):", dashData);
            
            renderTab1(dashData);
            renderTab2(dashData);
            updateTicker(dashData);
            updateTabCounts(dashData);
        })
        .catch(function(err) {
            console.error("대시보드 조회 실패:", err);
            ['impSuppList','expSuppList','rejectList'].forEach(function(id) {
                const el = document.getElementById(id);
                if (el) el.innerHTML = '<div class="empty-list">데이터를 불러올 수 없습니다.</div>';
            });
        });
}

/* ===========================================================
 * Tab 1: 긴급 처리 사항
 * =========================================================== */
function renderTab1(d) {
    /* 수입 보완/정정 */
    document.getElementById('impSuppCount').innerText = d.importSupplementCount || 0;
    renderSuppList('impSuppList', d.importSupplements || [], 'IMPORT');

    /* 수출 보완/정정 */
    document.getElementById('expSuppCount').innerText = d.exportSupplementCount || 0;
    renderSuppList('expSuppList', d.exportSupplements || [], 'EXPORT');

    /* 반려 건 (수입 + 수출) */
    document.getElementById('rejectTotalCount').innerText = (d.importRejectCount || 0) + (d.exportRejectCount || 0);
    renderRejectList('rejectList', d.importRejects || [], d.exportRejects || []);
}

function renderSuppList(containerId, items, type) {
    const c = document.getElementById(containerId);
    if (!items || !items.length) {
        c.innerHTML = '<div class="empty-list">보완/정정 요청이 없습니다.</div>';
        return;
    }
    let h = '';
    items.forEach(function(it) {
        const dlClass = calcDlClass(it.statusDate || it.submitDate);
        const dlText  = calcDlText(it.statusDate || it.submitDate);
        
        h += '<div class="list-item" onclick="goDetail(\'' + type + '\',\'' + esc(it.id) + '\')">'
           +   '<div class="item-top">'
           +     '<span class="item-badge badge-supplement">보완/정정요청</span>'
           +     '<span class="item-deadline ' + dlClass + '">' + dlText + '</span>'
           +   '</div>'
           +   '<div class="item-title">' + esc(it.docComment || it.itemName || '-') + '</div>'
           +   '<div class="item-meta">'
           +     '<span>' + esc(it.declNumber || '-') + '</span>'
           +     '<span>' + esc(it.submitDate || '') + '</span>'
           +   '</div>'
           +   '<button class="item-btn orange" onclick="event.stopPropagation();goDetail(\'' + type + '\',\'' + esc(it.id) + '\')">상세보기</button>'
           + '</div>';
    });
    c.innerHTML = h;
}

function renderRejectList(containerId, impArr, expArr) {
    const c = document.getElementById(containerId);
    let h = '';

    if (impArr && impArr.length) {
        h += '<div class="sub-header"><span class="sub-dot red"></span> 수입 반려</div>';
        impArr.forEach(function(it) { h += buildRejectItem(it, 'IMPORT'); });
    }
    if (impArr.length && expArr.length) {
        h += '<div class="sub-divider"></div>';
    }
    if (expArr && expArr.length) {
        h += '<div class="sub-header"><span class="sub-dot purple"></span> 수출 반려</div>';
        expArr.forEach(function(it) { h += buildRejectItem(it, 'EXPORT'); });
    }

    c.innerHTML = h || '<div class="empty-list">반려 건이 없습니다.</div>';
}

function buildRejectItem(it, type) {
    const badgeClass = (type === 'IMPORT') ? 'badge-reject-import' : 'badge-reject-export';
    const badgeText  = (type === 'IMPORT') ? '수입반려' : '수출반려';

    return '<div class="list-item" onclick="goDetail(\'' + type + '\',\'' + esc(it.id) + '\')">'
         +   '<div class="item-top">'
         +     '<span class="item-badge ' + badgeClass + '">' + badgeText + '</span>'
         +     '<span class="item-deadline urgent">즉시 조치</span>'
         +   '</div>'
         +   '<div class="item-title">' + esc(it.docComment || it.itemName || '반려 처리') + '</div>'
         +   '<div class="item-meta">'
         +     '<span>' + esc(it.declNumber || '-') + '</span>'
         +     '<span>' + esc(it.submitDate || '') + '</span>'
         +   '</div>'
         +   '<button class="item-btn red" onclick="event.stopPropagation();goResubmit(\'' + type + '\',\'' + esc(it.id) + '\')">재신고</button>'
         + '</div>';
}


/* ===========================================================
 * Tab 2: KPI 렌더링
 * =========================================================== */
function renderTab2(d) {
    // 수입 6개 (금일)
    setText('kpiImpReject', d.importRejectToday || 0);
    setText('kpiImpPhysical', d.importPhysicalToday || 0);
    setText('kpiImpWaiting', d.importWaitingToday || 0);
    setText('kpiImpReviewing', d.importReviewingToday || 0);
    setText('kpiImpPayCompleted', d.importPayCompletedToday || 0);
    setText('kpiImpDelivered', d.importDeliveredToday || 0);

    // 수출 6개 (금일)
    setText('kpiExpReject', d.exportRejectToday || 0);
    setText('kpiExpPhysical', d.exportPhysicalToday || 0);
    setText('kpiExpWaiting', d.exportWaitingToday || 0);
    setText('kpiExpReviewing', d.exportReviewingToday || 0);
    setText('kpiExpInspCompleted', d.exportInspCompletedToday || 0);
    setText('kpiExpDelivered', d.exportDeliveredToday || 0);

    // 통합: 납부예정 세액
    const ta = d.taxPaymentDueToday || 0;
    if (ta >= 1e8)      { setText('kpiTaxAmt',(ta/1e8).toFixed(2)); setText('kpiTaxUnit','억원'); }
    else if (ta >= 1e4) { setText('kpiTaxAmt',Math.round(ta/1e4).toLocaleString()); setText('kpiTaxUnit','만원'); }
    else                { setText('kpiTaxAmt',ta.toLocaleString()); setText('kpiTaxUnit','원'); }
    document.getElementById('kpiTaxDueCount').innerText = (d.taxPaymentDueCount||0)+'건';

    // 통합: 금일 신규 접수
    setText('kpiNewTotal', d.newSubmitToday||0);
    document.getElementById('kpiNewDetail').innerText = '수입 '+(d.newImportToday||0)+'건 · 수출 '+(d.newExportToday||0)+'건';

    // 통합: 미완료 잔여 건수
    const pi = d.totalPendingImport||0, pe = d.totalPendingExport||0;
    setText('kpiPendingTotal', pi + pe);
    document.getElementById('kpiPendingDetail').innerText = '수입 '+pi+'건 · 수출 '+pe+'건';
}

function setBar(vid, bid, val, max) {
    const e = document.getElementById(vid);
    if(e) e.innerHTML = val + '<span class="s-unit">건</span>';
    const b = document.getElementById(bid);
    if(b) b.style.width = (max>0? Math.round(val/max*100):0)+'%';
}


/* ===========================================================
 * Tab 3: Charts (lazy init)
 * =========================================================== */
let chartsReady = false;

function initDashCharts() {
    if(chartsReady || !dashData) return;
    chartsReady = true;
    
    const fc = '#5a5f7a';
    const gc = 'rgba(228,231,240,0.8)';
    const pr = '#3478f6';
    const cOpt = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: 0, right: 0 } },
        plugins: { legend: { labels: { color: fc, font: { family: 'Noto Sans KR', size: 10 }, boxWidth: 10, padding: 10 } } },
        scales: {
            x: { offset: false, ticks: { color: fc, font: { size: 10 } }, grid: { color: gc } },
            y: { ticks: { color: fc, font: { size: 10 } }, grid: { color: gc } }
        }
    };

    // 1. 수입/수출 비율 차트
    const ia = dashData.yearApprovedImport || 0;
    const ea = dashData.yearApprovedExport || 0;
    const yr = new Date().getFullYear();
    const ratioEl = document.getElementById('chartRatioYear');
    if (ratioEl) ratioEl.textContent = yr + '년 승인 건수';
    
    new Chart(document.getElementById('chartRatio'), {
        type: 'doughnut',
        data: {
            labels: ['수입 (' + ia + '건)', '수출 (' + ea + '건)'],
            datasets: [{ data: [ia || 1, ea || 1], backgroundColor: ['rgba(52,120,246,.75)', 'rgba(124,92,252,.55)'], borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { color: fc, font: { family: 'Noto Sans KR', size: 12 }, padding: 16 } } } }
    });

    // 2. 월별 납부 세액 추이 차트 (업그레이드 버전)
    const tm = [];
    const td = [];
    const tv = [];
    
    (dashData.monthlyTaxList || []).forEach(t => {
        tm.push(fmtM(t.month));
        td.push(Math.round((t.dutyTotal || 0) / 1e4));
        tv.push(Math.round((t.vatTotal || 0) / 1e4));
    });

    const taxOpt = JSON.parse(JSON.stringify(cOpt));
    taxOpt.plugins.tooltip = {
        callbacks: {
            label: context => {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += context.parsed.y.toLocaleString('ko-KR') + '만원';
                }
                return label;
            }
        }
    };

    new Chart(document.getElementById('chartTax'), {
        type: 'bar',
        data: {
            labels: tm.length ? tm : ['없음'],
            datasets: [
                {
                    label: '관세',
                    data: td,
                    backgroundColor: 'rgba(52,120,246,.6)',
                    borderRadius: 3,
                    barPercentage: .5
                },
                {
                    label: '부가세',
                    data: tv,
                    backgroundColor: 'rgba(52,120,246,.25)',
                    borderRadius: 3,
                    barPercentage: .5
                }
            ]
        },
        options: taxOpt
    });

    // 3. 월별 반려/보완정정 현황 차트
    const im2 = [];
    const ir = [];
    const is2 = [];
    
    (dashData.monthlyIssueList || []).forEach(i => {
        im2.push(fmtM(i.month));
        ir.push(i.rejectCount || 0);
        is2.push(i.supplementCount || 0);
    });
    
    new Chart(document.getElementById('chartIssues'), {
        type: 'bar',
        data: {
            labels: im2.length ? im2 : ['없음'],
            datasets: [
                { label: '반려', data: ir, backgroundColor: 'rgba(232,64,87,.6)', borderRadius: 2, barPercentage: .55 },
                { label: '보완/정정', data: is2, backgroundColor: 'rgba(232,134,42,.55)', borderRadius: 2, barPercentage: .55 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: fc, font: { family: 'Noto Sans KR', size: 10 }, boxWidth: 10, padding: 10 } } }, scales: { x: { stacked: true, ticks: { color: fc, font: { size: 10 } }, grid: { color: gc } }, y: { stacked: true, ticks: { color: fc, font: { size: 10 } }, grid: { color: gc } } } }
    });

    // 4. 월별 수입/수출 건수 차트
    const vm = [];
    const vi = [];
    const ve = [];
    
    (dashData.monthlyVolumeList || []).forEach(v => {
        vm.push(fmtM(v.month));
        vi.push(v.importCount || 0);
        ve.push(v.exportCount || 0);
    });
    
    new Chart(document.getElementById('chartVolume'), {
        type: 'line',
        data: {
            labels: vm.length ? vm : ['없음'],
            datasets: [
                { label: '수입 건수', data: vi, borderColor: pr, backgroundColor: 'rgba(52,120,246,.06)', tension: .35, fill: true, pointRadius: 3, pointBackgroundColor: pr, borderWidth: 2 },
                { label: '수출 건수', data: ve, borderColor: 'rgba(124,92,252,.7)', backgroundColor: 'rgba(124,92,252,.05)', tension: .35, fill: true, pointRadius: 3, pointBackgroundColor: 'rgba(124,92,252,.7)', borderWidth: 2 }
            ]
        },
        options: cOpt
    });
}


/* ===========================================================
 * 페이지 이동 함수
 * =========================================================== */

function goDetail(type, id) {
    if (type === 'IMPORT') {
        location.href = '/client/ims/status/detail?id=' + id;
    } else {
        location.href = '/client/exp/status/detail?id=' + id;
    }
}

function goResubmit(type, id) {
    if (type === 'IMPORT') {
        location.href = '/client/ims/imswrite/importBase?resubmitId=' + id;
    } else {
        location.href = '/client/exp/write?resubmitId=' + id;
    }
}

function goToList(category, status, dateFilter) {
    const base = (category === 'import')
        ? '/client/ims/status/list'
        : '/client/exp/status/list';

    const p = [];
    
    if (status) {
        p.push('status=' + encodeURIComponent(status));
    }

    if (dateFilter === 'today') {
        const d = new Date();
        const todayStr = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
        p.push('startDate=' + todayStr);
        p.push('endDate=' + todayStr);
    }

    const url = base + (p.length ? '?' + p.join('&') : '');
    console.log("페이지 이동:", url);
    location.href = url;
}


/* ===========================================================
 * 유틸리티
 * =========================================================== */
function setText(id, v) { const e = document.getElementById(id); if (e) e.innerText = (v == null ? '0' : v); }
function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function fmtM(m) { if (!m) return '-'; const p = m.split('-'); return p.length === 2 ? parseInt(p[1]) + '월' : m; }
function calcDlClass(d) { if (!d) return ''; const r = daysLeft(d); return r <= 0 ? 'urgent' : r <= 2 ? 'soon' : ''; }
function calcDlText(d) { if (!d) return ''; const r = daysLeft(d); return r <= 0 ? 'D-0 (긴급)' : 'D-' + r; }
function daysLeft(d) { const b = new Date(d).getTime(), dl = b + 7 * 864e5, n = new Date().setHours(0,0,0,0); return Math.ceil((dl - n) / 864e5); }

function updateTabCounts(d) {
    const e0 = document.getElementById('tabCount0');
    if (e0) e0.innerText = (d.importSupplementCount||0) + (d.exportSupplementCount||0) + (d.importRejectCount||0) + (d.exportRejectCount||0);
}

function updateTicker(d) {
    const s = function(id, v) { const e = document.getElementById(id); if (e) e.innerText = v; };
    s('tickerNew', d.newSubmitToday || 0);
    s('tickerUrgent', (d.importSupplementCount||0) + (d.exportSupplementCount||0) + (d.importRejectCount||0) + (d.exportRejectCount||0));
    s('tickerPendingImp', d.totalPendingImport || 0);
    s('tickerPendingExp', d.totalPendingExport || 0);
    s('tickerTax', (d.taxPaymentDueToday || 0).toLocaleString());
    s('tickerTaxCount', d.taxPaymentDueCount || 0);
    s('tickerSupp', d.supplementRemaining || 0);
}

function initTicker() {
    const m = document.querySelectorAll('.ticker-msg');
    if (!m.length) return;
    let c = 0;
    setInterval(function() {
        m[c].classList.remove('active');
        c = (c + 1) % m.length;
        m[c].classList.add('active');
    }, 4000);
}

function switchDashTab(i) {
    document.querySelectorAll('.dashboard-shell .tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.dashboard-shell .tab-panel').forEach(function(p) { p.classList.remove('active'); });
    document.querySelector('.dashboard-shell .tab-btn[data-idx="' + i + '"]').classList.add('active');
    document.getElementById('dashPanel-' + i).classList.add('active');
    if (i === 2) requestAnimationFrame(function() { requestAnimationFrame(function() { initDashCharts(); }); });
}
</script>
