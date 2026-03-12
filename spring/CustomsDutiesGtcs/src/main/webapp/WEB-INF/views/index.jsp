<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>G-TCS 관세행정 통합포털</title>

<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- axios 라이브러리 추가 -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=423ff4e622802939da1f2eb930591d44"></script>
<style>
/* ========================================================================
   관세청 행정시스템 통합 스타일시트
   Customs Administration Integrated Stylesheet
   ======================================================================== */

/* ========== 기본 설정 및 변수 정의 ========== */
:root {
	/* 관세청 공식 브랜드 컬러 */
	--primary-navy: #003876;
	--secondary-navy: #004a99;
	--accent-blue: #0066cc;
	--light-navy: #1a5490;
	--lighter-blue: #e6f2ff;
	
	/* 시스템 컬러 */
	--success-green: #28a745;
	--warning-orange: #ff9800;
	--danger-red: #dc3545;
	--info-blue: #17a2b8;
	
	/* 텍스트 컬러 */
	--text-primary: #1a1a1a;
	--text-secondary: #4a4a4a;
	--text-tertiary: #757575;
	--text-white: #ffffff;
	
	/* 배경 컬러 */
	--bg-white: #ffffff;
	--bg-light: #f8fafc;
	--bg-gray: #f0f4f8;
	--bg-dark: #0a1929;
	
	/* 경계선 컬러 */
	--border-light: #e5e7eb;
	--border-medium: #d1d5db;
	--border-dark: #9ca3af;
	
	/* 그림자 */
	--shadow-sm: 0 2px 4px rgba(0, 56, 118, 0.05);
	--shadow-md: 0 4px 12px rgba(0, 56, 118, 0.1);
	--shadow-lg: 0 8px 24px rgba(0, 56, 118, 0.15);
	--shadow-xl: 0 12px 40px rgba(0, 56, 118, 0.2);
	
	/* 전환 효과 */
	--transition-fast: 0.2s ease;
	--transition-normal: 0.3s ease;
	--transition-slow: 0.5s ease;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html {
	scroll-behavior: smooth;
	scroll-snap-type: y mandatory;
	font-size: 16px;
}

body {
	font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", 
				 -apple-system, BlinkMacSystemFont, sans-serif;
	background: var(--bg-light);
	color: var(--text-primary);
	min-height: 100vh;
	position: relative;
	overflow-x: hidden;
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/* ========== 스크롤 인디케이터 (우측 네비게이션) ========== */
.scroll-indicator {
	position: fixed;
	right: 40px;
	top: 50%;
	transform: translateY(-50%);
	z-index: 999;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0;
}

/* 세로 연결선 배경 */
.scroll-indicator::before {
	content: '';
	position: absolute;
	top: 10px;
	bottom: 10px;
	left: 50%;
	transform: translateX(-50%);
	width: 2px;
	background: linear-gradient(180deg, 
		rgba(0, 56, 118, 0.1) 0%, 
		rgba(0, 56, 118, 0.15) 50%, 
		rgba(0, 56, 118, 0.1) 100%);
	border-radius: 2px;
	z-index: 0;
}

/* 진행 상태 표시 트랙 */
.scroll-track-fill {
	position: absolute;
	top: 10px;
	left: 50%;
	transform: translateX(-50%);
	width: 3px;
	background: linear-gradient(180deg, 
		var(--primary-navy) 0%, 
		var(--secondary-navy) 50%, 
		var(--accent-blue) 100%);
	border-radius: 2px;
	z-index: 1;
	transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	height: 0;
	box-shadow: 0 0 8px rgba(0, 56, 118, 0.3);
}

.scroll-dot {
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background: var(--bg-white);
	cursor: pointer;
	transition: all var(--transition-normal);
	position: relative;
	border: 2.5px solid rgba(0, 56, 118, 0.25);
	z-index: 2;
	margin: 16px 0;
}

.scroll-dot:hover {
	border-color: var(--primary-navy);
	transform: scale(1.2);
	box-shadow: 0 0 0 6px rgba(0, 56, 118, 0.1);
}

.scroll-dot.active {
	width: 14px;
	height: 14px;
	background: var(--primary-navy);
	border: 2.5px solid var(--primary-navy);
	box-shadow: 
		0 0 0 6px rgba(0, 56, 118, 0.15), 
		0 0 16px rgba(0, 56, 118, 0.25);
	transform: scale(1.15);
}

/* 활성 점 내부 펄스 애니메이션 */
.scroll-dot.active::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 6px;
	height: 6px;
	background: var(--text-white);
	border-radius: 50%;
	animation: dotPulse 2.5s ease-in-out infinite;
}

@keyframes dotPulse {
	0%, 100% {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
	50% {
		opacity: 0.6;
		transform: translate(-50%, -50%) scale(0.75);
	}
}

/* 라벨 툴팁 */
.scroll-dot::after {
	content: attr(data-label);
	position: absolute;
	right: 32px;
	top: 50%;
	transform: translateY(-50%) translateX(8px);
	white-space: nowrap;
	font-size: 13px;
	font-weight: 600;
	color: var(--text-white);
	background: var(--primary-navy);
	padding: 6px 16px;
	border-radius: 8px;
	opacity: 0;
	pointer-events: none;
	transition: all var(--transition-normal);
	box-shadow: var(--shadow-lg);
	letter-spacing: 0.3px;
}

.scroll-dot:hover::after,
.scroll-dot.active::after {
	opacity: 1;
	transform: translateY(-50%) translateX(0);
}

/* ========== 페이지 섹션 스냅 설정 ========== */
.snap-section {
	scroll-snap-align: start;
	scroll-snap-stop: always;
	min-height: 100vh;
	position: relative;
}

/* ========== 헤더 스타일 (관세청 공식 디자인) ========== */
.global-header {
	background: #123150;
	color: var(--text-white);
	padding: 0;
	box-shadow: 0 4px 20px rgba(0, 56, 118, 0.2);
	position: sticky;
	top: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	min-height: 60px;
}

.header-center-group {
	padding: 0 25px;
	display: flex;
	align-items: center;
	gap: 15px;
}

.logo {
	font-size: 19px;
	font-weight: 800;
	color: var(--text-white);
	text-decoration: none;
	display: flex;
	align-items: center;
	transition: all var(--transition-normal);
	letter-spacing: 1.5px;
	transform: translateY(2px);
}

.logo i {
	font-size: 25px;
	margin-right: 12px;
	color: #ffffff;
}

.header-right-area {
	display: flex;
	align-items: center;
	gap: 18px;
	padding: 0 25px;
	margin-left: auto;
}

.user-info-text {
	color: rgba(255, 255, 255, 0.95);
	font-size: 14px;
	font-weight: 500;
}

.user-name {
	font-weight: 700;
	color: #ffffff;
	margin-left: 4px;
}

.logout-icon-btn {
	color: rgba(255, 255, 255, 0.8);
	font-size: 22px;
	transition: all var(--transition-normal);
	text-decoration: none;
}

.logout-icon-btn:hover {
	color: var(--danger-red);
	transform: scale(1.15);
}

/* ========== 첫 번째 페이지: 관세청 메인 대시보드 ========== */
.first-page {
	background: linear-gradient(180deg, #0a1929 0%, #1a2f4a 50%, #0f1f35 100%);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	position: relative;
	overflow: hidden;
}

/* 메시 그래디언트 오브 1 - 상단 우측 */
.first-page::before {
	content: '';
	position: absolute;
	top: -12%;
	right: -8%;
	width: 60vw;
	height: 60vw;
	max-width: 900px;
	max-height: 900px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(0, 102, 204, 0.25) 0%,
		rgba(0, 74, 153, 0.12) 40%, 
		transparent 70%);
	filter: blur(70px);
	pointer-events: none;
	animation: meshFloat1 14s ease-in-out infinite;
}

/* 메시 그래디언트 오브 2 - 하단 좌측 */
.first-page::after {
	content: '';
	position: absolute;
	bottom: -8%;
	left: -6%;
	width: 55vw;
	height: 55vw;
	max-width: 800px;
	max-height: 800px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(0, 56, 118, 0.2) 0%,
		rgba(26, 84, 144, 0.1) 40%, 
		transparent 70%);
	filter: blur(90px);
	pointer-events: none;
	animation: meshFloat2 16s ease-in-out infinite;
}

@keyframes meshFloat1 {
	0%, 100% {
		transform: translate(0, 0) scale(1);
	}
	50% {
		transform: translate(-25px, 30px) scale(1.08);
	}
}

@keyframes meshFloat2 {
	0%, 100% {
		transform: translate(0, 0) scale(1);
	}
	50% {
		transform: translate(30px, -20px) scale(1.1);
	}
}

/* 그리드 패턴 오버레이 (관세행정 데이터 이미지) */
.grid-overlay {
	position: absolute;
	inset: 0;
	background-image: 
		linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
	background-size: 100px 100px;
	pointer-events: none;
	mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black, transparent);
	-webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black, transparent);
}

/* 글로우 라인 - 수평 장식 */
.glow-line {
	position: absolute;
	top: 40%;
	left: 0;
	width: 100%;
	height: 1px;
	background: linear-gradient(90deg, 
		transparent 0%, 
		rgba(0, 102, 204, 0.2) 15%, 
		rgba(0, 102, 204, 0.4) 50%, 
		rgba(0, 102, 204, 0.2) 85%,
		transparent 100%);
	pointer-events: none;
	animation: glowPulse 4.5s ease-in-out infinite;
}

.glow-line::after {
	content: '';
	position: absolute;
	top: -4px;
	left: 0;
	width: 100%;
	height: 9px;
	background: linear-gradient(90deg, 
		transparent 0%, 
		rgba(0, 102, 204, 0.08) 15%, 
		rgba(0, 102, 204, 0.15) 50%, 
		rgba(0, 102, 204, 0.08) 85%,
		transparent 100%);
	filter: blur(6px);
}

@keyframes glowPulse {
	0%, 100% {
		opacity: 0.5;
	}
	50% {
		opacity: 1;
	}
}

/* 부유하는 데이터 입자들 */
.particle {
	position: absolute;
	width: 4px;
	height: 4px;
	background: rgba(0, 102, 204, 0.5);
	border-radius: 50%;
	pointer-events: none;
	animation: particleFloat linear infinite;
	box-shadow: 0 0 6px rgba(0, 102, 204, 0.6);
}

@keyframes particleFloat {
	0% {
		transform: translateY(0) translateX(0);
		opacity: 0;
	}
	10% {
		opacity: 1;
	}
	90% {
		opacity: 1;
	}
	100% {
		transform: translateY(-100vh) translateX(40px);
		opacity: 0;
	}
}

/* 코너 장식 - 공식 문서 프레임 */
.corner-decor {
	position: absolute;
	width: 130px;
	height: 130px;
	pointer-events: none;
	opacity: 0.2;
}

.corner-decor.top-left {
	top: 110px;
	left: 60px;
	border-top: 3px solid rgba(0, 102, 204, 0.9);
	border-left: 3px solid rgba(0, 102, 204, 0.9);
}

.corner-decor.bottom-right {
	bottom: 130px;
	right: 60px;
	border-bottom: 3px solid rgba(0, 102, 204, 0.9);
	border-right: 3px solid rgba(0, 102, 204, 0.9);
}

.hero-section {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 70px 40px;
	position: relative;
	z-index: 2;
}

/* 서브타이틀 - 정부기관 스타일 */
.hero-subtitle {
	font-size: 14px;
	color: rgba(100, 200, 255, 0.9);
	letter-spacing: 8px;
	text-transform: uppercase;
	margin-bottom: 28px;
	font-weight: 600;
	animation: subtitleIn 1s ease 0.3s both;
	border: 1px solid rgba(100, 200, 255, 0.3);
	padding: 8px 24px;
	border-radius: 30px;
	background: rgba(100, 200, 255, 0.05);
}

@keyframes subtitleIn {
	from {
		opacity: 0;
		transform: translateY(15px);
		letter-spacing: 14px;
	}
	to {
		opacity: 1;
		transform: translateY(0);
		letter-spacing: 8px;
	}
}

.hero-title {
	font-size: 58px;
	color: var(--text-white);
	font-weight: 800;
	line-height: 1.3;
	animation: titleIn 1s ease 0.5s both;
	margin-bottom: 8px;
}

.hero-title .accent {
	background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	text-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
}

@keyframes titleIn {
	from {
		opacity: 0;
		transform: translateY(25px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 타이틀 아래 설명 텍스트 */
.hero-desc {
	font-size: 18px;
	color: rgba(226, 232, 240, 0.75);
	margin-top: 24px;
	font-weight: 400;
	line-height: 1.7;
	animation: titleIn 1s ease 0.7s both;
	max-width: 700px;
}

/* ========== 하단 아이콘 바 (업무 프로세스 메뉴) ========== */
.bottom-icon-bar {
	width: calc(100% - 100px);
	max-width: 1230px;
	margin-left: auto;
	margin-right: auto;
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(25px) saturate(180%);
	border-radius: 24px;
	margin-bottom: 45px;
	padding: 25px 15px;
	box-shadow: 
		0 12px 60px rgba(0, 56, 118, 0.3), 
		0 0 0 1px rgba(255, 255, 255, 0.2),
		inset 0 1px 0 rgba(255, 255, 255, 0.5);
	position: relative;
	z-index: 2;
	animation: barIn 0.9s ease 0.9s both;
	border: 1px solid rgba(0, 102, 204, 0.1);
}

@keyframes barIn {
	from {
		opacity: 0;
		transform: translateY(40px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.icon-scroll-wrapper {
	display: flex;
	align-items: center;
	gap: 24px;
}

.icon-scroll-container {
	flex: 1;
	overflow-x: auto;
	scrollbar-width: none;
}

.icon-scroll-container::-webkit-scrollbar {
	display: none;
}

.icons-horizontal {
	display: flex;
	gap: 18px;
	min-width: min-content;
	justify-content: center;
	width: 100%;
}

.icon-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-decoration: none;
	padding: 22px 12px;
	background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
	border-radius: 18px;
	transition: all var(--transition-normal);
	border: 2px solid var(--border-light);
	min-width: 130px;
	position: relative;
	overflow: hidden;
}

.icon-box::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, var(--primary-navy) 0%, var(--secondary-navy) 100%);
	opacity: 0;
	transition: opacity var(--transition-normal);
	z-index: 0;
}

.icon-box:hover::before {
	opacity: 1;
}

.icon-box:hover {
	border-color: var(--primary-navy);
	box-shadow: 
		0 8px 20px rgba(0, 56, 118, 0.2),
		0 0 0 3px rgba(0, 56, 118, 0.1);
}

.icon-box-icon {
	width: 65px;
	height: 65px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32px;
	color: var(--primary-navy);
	margin-bottom: 12px;
	position: relative;
	z-index: 1;
	transition: all var(--transition-normal);
}

.icon-box:hover .icon-box-icon,
.icon-box:hover .icon-box-text {
	color: var(--text-white);
}

.icon-box-text {
	font-size: 13.5px;
	font-weight: 600;
	color: var(--text-primary);
	position: relative;
	z-index: 1;
	transition: all var(--transition-normal);
	letter-spacing: -0.3px;
}

/* ========== 두 번째 페이지 (공지사항 & 정보 대시보드) ========== */
.second-page {
	/* 1페이지 하단 배경색(#0f1f35)에서 부드럽게 이어지는 다크 테마 적용 */
	background: linear-gradient(180deg, #0f1f35 0%, #162842 50%, #0c1c2e 100%);
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

/* 1페이지와 통일감을 주는 부유하는 메시 그래디언트 배경 장식 */
.second-page::before {
	content: '';
	position: absolute;
	top: -10%;
	left: -10%;
	width: 700px;
	height: 700px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(0, 102, 204, 0.15) 0%,
		rgba(0, 74, 153, 0.05) 40%, 
		transparent 70%);
	filter: blur(60px);
	pointer-events: none;
	animation: meshFloat2 15s ease-in-out infinite reverse;
}

.second-page::after {
	content: '';
	position: absolute;
	bottom: -15%;
	right: -10%;
	width: 600px;
	height: 600px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(26, 84, 144, 0.15) 0%,
		rgba(0, 56, 118, 0.08) 40%, 
		transparent 70%);
	filter: blur(70px);
	pointer-events: none;
	animation: meshFloat1 18s ease-in-out infinite reverse;
}

/* 두 번째 페이지 미세 그리드 배경 (다크 테마에 맞춰 반투명한 흰색 선으로 변경) */
.second-page-grid {
	position: absolute;
	inset: 0;
	background-image: 
		linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
	background-size: 80px 80px;
	pointer-events: none;
	mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%);
	-webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%);
}

/* 상단 그라데이션 바 장식 (데이터 흐름을 연상시키는 글로우 효과 추가) */
.second-page-top-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: linear-gradient(90deg, 
		transparent, 
		rgba(0, 102, 204, 0.4) 20%, 
		rgba(100, 200, 255, 0.9) 50%,
		rgba(0, 102, 204, 0.4) 80%, 
		transparent);
	box-shadow: 0 2px 15px rgba(100, 200, 255, 0.3);
}

/* 로고 텍스트 (어두운 배경에 대비되도록 흰색과 은은한 푸른빛 발광 효과 적용) */
.second-page-logo {
	position: absolute;
	top: 90px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 38px;
	font-weight: 800;
	color: var(--text-white);
	z-index: 10;
	display: flex;
	align-items: center;
	gap: 14px;
	letter-spacing: -1px;
	text-shadow: 0 0 20px rgba(0, 102, 204, 0.6);
}

/* ========== K-Water 스타일 레이아웃 (관세청용 수정) ========== */
.kwater-layout {
	max-width: 1400px;
	width: 95%;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 420px 1fr 420px;
	grid-template-rows: 290px 290px;
	gap: 28px;
	height: auto;
	padding: 75px 0 45px 0;
}

.kwater-layout .ceo-card,
.kwater-layout .strategy-card,
.kwater-layout .location-card,
.kwater-layout .sns-card {
	padding: 24px;
	box-shadow: var(--shadow-lg);
	display: flex;
	flex-direction: column;
	transition: all var(--transition-normal);
}

.kwater-layout .ceo-card {
	grid-column: 1;
	grid-row: 1;
	background: linear-gradient(135deg, 
		var(--primary-navy) 0%, 
		var(--secondary-navy) 100%);
	color: var(--text-white);
	border-radius: 24px 0 24px 0;
	border: 2px solid rgba(255, 255, 255, 0.1);
}

.kwater-layout .strategy-card {
	grid-column: 1;
	grid-row: 2;
	background: linear-gradient(135deg, 
		#e6f2ff 0%, 
		#d0e7ff 100%);
	border-radius: 24px 0 24px 0;
	border: 2px solid var(--accent-blue);
}

.kwater-layout .main-slider {
	grid-column: 2;
	grid-row: 1/3;
	background: linear-gradient(135deg, 
		var(--primary-navy) 0%, 
		var(--light-navy) 100%);
	border-radius: 24px;
	overflow: hidden;
	position: relative;
	box-shadow: var(--shadow-xl);
	border: 3px solid rgba(255, 215, 0, 0.2);
}

.kwater-layout .location-card {
	grid-column: 3;
	grid-row: 1;
	background: var(--bg-white);
	border-radius: 24px 0 24px 0;
	border: 2px solid var(--border-light);
}

.kwater-layout .sns-card {
	grid-column: 3;
	grid-row: 2;
	background: linear-gradient(135deg, 
		#f0f8ff 0%, 
		#e0f0ff 100%);
	border-radius: 24px 0 24px 0;
	border: 2px solid var(--accent-blue);
}

.kwater-layout h3 {
	font-size: 17px;
	margin-bottom: 14px;
	font-weight: 700;
	letter-spacing: -0.3px;
}

.kwater-layout ul {
	list-style: none;
	flex: 1;
}

.kwater-layout li {
	padding: 8px 0;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	font-size: 12px;
	display: flex;
	justify-content: space-between;
	transition: background var(--transition-fast);
	cursor: pointer;
	border-radius: 4px;
	padding-left: 8px;
	padding-right: 8px;
}

.kwater-layout li:hover {
	background: rgba(0, 56, 118, 0.05);
}

.ceo-card li {
	border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.ceo-card li:hover {
	background: rgba(255, 255, 255, 0.1);
}

.kwater-layout li span:first-child {
	font-size: 14.5px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
	padding-right: 18px;
	font-weight: 500;
}

.kwater-layout li:hover span:first-child {
	text-decoration: underline;
    text-decoration-color: var(--text-primary);
}

.ceo-card li:hover span:first-child {
	text-decoration: underline;
    text-decoration-color: var(--text-white);
}

.kwater-layout .date {
	opacity: 0.65;
	font-size: 13px;
	white-space: nowrap;
	flex-shrink: 0;
	font-weight: 500;
}

.main-slider .slide {
	display: none;
	padding: 0;
	min-height: 100%;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.main-slider .slide.active {
	display: block;
	width: 100%;
	height: 100%;
}

.slide-content h2 {
	font-size: 36px;
	color: var(--text-white);
	margin-bottom: 24px;
	font-weight: 800;
	letter-spacing: -0.5px;
}

.slide-content p {
	font-size: 17px;
	color: rgba(255, 255, 255, 0.92);
	line-height: 1.7;
	max-width: 85%;
	margin: 0 auto;
}

/* ========== 세 번째 페이지: 환율 정보 - 세련된 전환 ========== */
.third-page {
	/* 2페이지 하단에서 이어지되, 밝은 톤으로 전환 */
	background: linear-gradient(180deg, 
		#1a2f45 0%,
		#2a4560 15%,
		#3a5575 30%,
		#e8f0f8 60%,
		#f0f5fa 100%);
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

/* 첫 페이지/두 번째 페이지와 통일된 메시 그래디언트 오브 - 좌상단 */
.third-page::before {
	content: '';
	position: absolute;
	top: -8%;
	left: -5%;
	width: 650px;
	height: 650px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(0, 102, 204, 0.12) 0%,
		rgba(0, 74, 153, 0.06) 40%, 
		transparent 70%);
	filter: blur(75px);
	pointer-events: none;
	animation: meshFloat1 17s ease-in-out infinite;
}

/* 메시 그래디언트 오브 - 우하단 */
.third-page::after {
	content: '';
	position: absolute;
	bottom: -6%;
	right: -7%;
	width: 700px;
	height: 700px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(26, 84, 144, 0.1) 0%,
		rgba(0, 56, 118, 0.05) 40%, 
		transparent 70%);
	filter: blur(80px);
	pointer-events: none;
	animation: meshFloat2 19s ease-in-out infinite;
}

/* 첫 페이지와 동일한 스타일의 그리드 패턴 */
.third-page-grid {
	position: absolute;
	inset: 0;
	background-image: 
		linear-gradient(rgba(0, 56, 118, 0.035) 1px, transparent 1px),
		linear-gradient(90deg, rgba(0, 56, 118, 0.035) 1px, transparent 1px);
	background-size: 100px 100px;
	pointer-events: none;
	mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%);
	-webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%);
	opacity: 0.6;
}

/* 상단 그라데이션 바 - 첫/두 번째 페이지와 통일 */
.third-page-top-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4px;
	background: linear-gradient(90deg, 
		transparent 0%, 
		var(--primary-navy) 15%, 
		var(--accent-blue) 50%,
		var(--primary-navy) 85%, 
		transparent 100%);
	opacity: 0.45;
	box-shadow: 0 2px 15px rgba(0, 102, 204, 0.2);
}

/* 글로우 라인 - 첫 페이지 스타일 (밝은 버전) */
.third-page-glow-line {
	position: absolute;
	top: 42%;
	left: 0;
	width: 100%;
	height: 1px;
	background: linear-gradient(90deg, 
		transparent 0%, 
		rgba(0, 102, 204, 0.2) 15%, 
		rgba(0, 102, 204, 0.35) 50%, 
		rgba(0, 102, 204, 0.2) 85%,
		transparent 100%);
	pointer-events: none;
	animation: thirdGlowPulse 5.5s ease-in-out infinite;
}

.third-page-glow-line::after {
	content: '';
	position: absolute;
	top: -3px;
	left: 0;
	width: 100%;
	height: 7px;
	background: linear-gradient(90deg, 
		transparent 0%, 
		rgba(0, 102, 204, 0.08) 15%, 
		rgba(0, 102, 204, 0.15) 50%, 
		rgba(0, 102, 204, 0.08) 85%,
		transparent 100%);
	filter: blur(5px);
}

@keyframes thirdGlowPulse {
	0%, 100% {
		opacity: 0.5;
	}
	50% {
		opacity: 1;
	}
}

/* 코너 장식 - 첫 페이지와 동일한 스타일 */
.third-page-corner {
	position: absolute;
	width: 110px;
	height: 110px;
	pointer-events: none;
	opacity: 0.18;
}

.third-page-corner.tl {
	top: 70px;
	left: 60px;
	border-top: 2.5px solid rgba(0, 102, 204, 0.8);
	border-left: 2.5px solid rgba(0, 102, 204, 0.8);
}

.third-page-corner.br {
	bottom: 70px;
	right: 60px;
	border-bottom: 2.5px solid rgba(0, 102, 204, 0.8);
	border-right: 2.5px solid rgba(0, 102, 204, 0.8);
}

.exchange-container {
	max-width: 1300px;
	width: 92%;
	margin: 0 auto;
	position: relative;
	z-index: 2;
	margin-top: -100px; 
}

.exchange-title {
	text-align: center;
	font-size: 40px;
	color: #ffffff;
	margin-top: 20px;    
	margin-bottom: 60px;   
	font-weight: 700;
	letter-spacing: -1px;
}

.exchange-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 24px;
}

.exchange-card {
	background: var(--bg-white);
	border-radius: 18px;
	padding: 24px;
	border: 2px solid var(--border-light);
	text-align: center;
	transition: all var(--transition-normal);
	box-shadow: var(--shadow-sm);
}

.exchange-card:hover {
	border-color: var(--primary-navy);
	box-shadow: var(--shadow-lg);
}

.exchange-flag {
	font-size: 44px;
	margin-bottom: 12px;
}

.exchange-country {
	font-size: 17px;
	color: var(--primary-navy);
	font-weight: 700;
	margin-bottom: 4px;
}

.exchange-rate {
	font-size: 26px;
	font-weight: 800;
	margin: 8px 0;
	color: var(--text-primary);
}

.exchange-change {
	font-size: 14.5px;
	font-weight: 600;
}

.up {
	color: var(--danger-red);
}

.up::before {
	content: '▲ ';
}

.down {
	color: var(--success-green);
}

.down::before {
	content: '▼ ';
}

.neutral {
	color: var(--text-tertiary);
}

.neutral::before {
	content: '- ';
}

/* ========== 로그인 버튼 ========== */
.login-btn {
	color: rgba(255, 255, 255, 0.95);
	font-size: 14.5px;
	font-weight: 600;
	text-decoration: none;
	padding: 8px 18px;
	border: 2px solid rgba(255, 255, 255, 0.4);
	border-radius: 10px;
	transition: all var(--transition-normal);
	display: flex;
	align-items: center;
	gap: 7px;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
}

.login-btn:hover {
	background: rgba(255, 255, 255, 0.95);
	color: var(--primary-navy);
	border-color: rgba(255, 255, 255, 0.95);
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.login-btn i {
	margin-right: 4px;
	font-size: 16px;
}

/* ========== 드롭다운 메뉴 ========== */
.user-menu-wrapper {
	display: flex;
	align-items: center;
	gap: 14px;
}

.header-user-name {
	color: #ffffff;
	font-size: 15.5px;
	font-weight: 700;
	margin: 0 12px;
	transform: translateY(2px);
}

.user-menu-container {
	position: relative;
	display: flex;
	align-items: center;
}

.menu-trigger {
	color: rgba(255, 255, 255, 0.9);
	font-size: 24px;
	cursor: pointer;
	text-decoration: none;
	transition: all var(--transition-normal);
	transform: translateY(2px);
}

.menu-trigger:hover {
	color: var(--text-white);
}

.dropdown-content {
	display: none;
	position: absolute;
	right: 0;
	top: 45px;
	background-color: var(--bg-white);
	min-width: 200px;
	border: 1px solid var(--border-light);
	border-radius: 12px;
	box-shadow: var(--shadow-xl);
	z-index: 2000;
	overflow: hidden;
}

.dropdown-info {
	padding: 18px;
	background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
	text-align: left;
	border-bottom: 2px solid var(--primary-navy);
}

.info-name {
	display: block;
	color: var(--text-primary);
	font-weight: 700;
	font-size: 16px;
	margin-bottom: 4px;
}

.info-status {
	font-size: 12px;
	color: var(--text-tertiary);
	font-weight: 500;
}

.dropdown-divider {
	height: 1px;
	background-color: var(--border-light);
}

.dropdown-item {
	padding: 14px 20px;
	display: flex;
	align-items: center;
	color: var(--text-secondary);
	text-decoration: none;
	font-size: 14.5px;
	transition: all var(--transition-fast);
	font-weight: 500;
}

.dropdown-item i {
	margin-right: 14px;
	width: 22px;
	text-align: center;
	color: var(--text-tertiary);
	font-size: 16px;
}

.dropdown-item:hover {
	background: linear-gradient(135deg, #f0f4f8 0%, #f8fafc 100%);
	color: var(--primary-navy);
}

.dropdown-item:hover i {
	color: var(--primary-navy);
}

.logout-item {
	color: var(--danger-red);
	border-top: 1px solid var(--border-light);
}

.logout-item i {
	color: var(--danger-red);
}

.logout-item:hover {
	background: rgba(220, 53, 69, 0.05);
}

.show {
	display: block;
	animation: dropdownSlide 0.25s ease;
}

@keyframes dropdownSlide {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

#beforeLogin,
#afterLogin {
	display: flex;
	align-items: center;
	gap: 12px;
}

/* ========== 게시판 헤더 (+ 버튼 포함) ========== */
.board-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 14px;
	padding-bottom: 8px;
	border-bottom: 2px solid rgba(0, 56, 118, 0.15);
}

/* 공지사항 카드 내부의 헤더는 밝은 색 밑줄 사용 */
.ceo-card .board-header {
	border-bottom: 2px solid rgba(255, 255, 255, 0.25);
}

.board-header h3 {
	margin-bottom: 0;
}

.board-more-btn {
	text-decoration: none;
	font-size: 18px;
	padding: 0 6px;
	transition: all var(--transition-fast);
	color: inherit;
}


.ceo-card .board-more-btn {
	color: #ffffff;
}

.ceo-card .board-more-btn:hover {
	color: var(--text-white);
}

.strategy-card .board-more-btn,
.location-card .board-more-btn {
	color: var(--primary-navy);
}

/* ========== 대시보드 커스텀 이미지 아이콘 설정 ========== */
.menu-img-icon {
	width: 36px;
	height: 36px;
	object-fit: contain;
	transition: all var(--transition-normal);
	filter: brightness(0) saturate(100%) 
			invert(15%) sepia(85%) saturate(2500%) 
			hue-rotate(195deg) brightness(95%) contrast(105%);
}

.icon-box:hover .menu-img-icon {
	filter: brightness(0) invert(1);
	transform: scale(1.05);
}

/* ========== 반응형 디자인 ========== */
@media (max-width: 1400px) {
	.kwater-layout {
		max-width: 1200px;
		grid-template-columns: 380px 1fr 380px;
	}
}

@media (max-width: 1200px) {
	.kwater-layout {
		grid-template-columns: 1fr;
		grid-template-rows: auto;
		height: auto;
		padding: 25px;
		gap: 20px;
	}
	
	.kwater-layout .main-slider {
		grid-row: auto;
		height: 450px;
		border-radius: 24px;
	}
	
	.kwater-layout .ceo-card,
	.kwater-layout .strategy-card,
	.kwater-layout .location-card,
	.kwater-layout .sns-card {
		border-radius: 20px;
	}
	
	.exchange-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 18px;
	}
	
	.hero-title {
		font-size: 48px;
	}
	
	.scroll-indicator {
		right: 25px;
	}
}

@media (max-width: 768px) {
	.exchange-grid {
		grid-template-columns: 1fr;
	}
	
	.hero-title {
		font-size: 38px;
	}
	
	.bottom-icon-bar {
		width: calc(100% - 40px);
		padding: 20px 10px;
	}
	
	.icons-horizontal {
		gap: 12px;
	}
	
	.icon-box {
		min-width: 110px;
		padding: 18px 10px;
	}
}

/* ========== 접근성 개선 ========== */
*:focus {
	outline: 2px solid var(--accent-blue);
	outline-offset: 2px;
}

*:focus:not(:focus-visible) {
	outline: none;
}

/* ========== 인쇄 스타일 ========== */
@media print {
	.scroll-indicator,
	.logout-icon-btn,
	.board-more-btn,
	.particle,
	.corner-decor {
		display: none !important;
	}
	
	body {
		background: white;
	}
	
	.global-header {
		position: relative;
		box-shadow: none;
	}
}

/* ========== 네 번째 페이지: 찾아오시는 길 ========== */
.fourth-page {
	background: linear-gradient(180deg, 
		#f0f5fa 0%,
		#e8f0f8 30%,
		#d4e4f4 100%);
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	padding: 80px 0;
}

/* 배경 장식 오브 */
.fourth-page::before {
	content: '';
	position: absolute;
	top: -5%;
	right: -8%;
	width: 600px;
	height: 600px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(0, 102, 204, 0.08) 0%,
		transparent 70%);
	filter: blur(70px);
	pointer-events: none;
}

.fourth-page::after {
	content: '';
	position: absolute;
	bottom: -8%;
	left: -5%;
	width: 650px;
	height: 650px;
	border-radius: 50%;
	background: radial-gradient(circle, 
		rgba(26, 84, 144, 0.06) 0%,
		transparent 70%);
	filter: blur(75px);
	pointer-events: none;
}

/* 네 번째 페이지 상단 그라데이션 바 */
.fourth-page-top-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4px;
	background: linear-gradient(90deg, 
		transparent 0%, 
		var(--primary-navy) 15%, 
		var(--accent-blue) 50%,
		var(--primary-navy) 85%, 
		transparent 100%);
	opacity: 0.25;
	box-shadow: 0 2px 15px rgba(0, 102, 204, 0.2);
}

.location-container {
	max-width: 1400px;
	width: 92%;
	margin: 0 auto;
	position: relative;
	z-index: 2;
}

.location-title {
	text-align: center;
	font-size: 42px;
	color: var(--primary-navy);
	margin-bottom: 60px;
	font-weight: 700;
	letter-spacing: -1px;
}

/* 네 번째 페이지 레이아웃 수정 */
/* ========== 네 번째 페이지: 지도 강조 및 정보 최적화 ========== */
.fourth-page {
    background: #f0f5fa;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0; /* 패딩 제거하여 공간 확보 */
}

.location-container {
    max-width: 1200px;
    width: 92%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px; /* 요소 간 간격 최적화 */
}

.location-title {
    text-align: center;
    font-size: 32px;
    color: var(--primary-navy);
    margin-top: 20px;  
    margin-bottom: 0;
    font-weight: 700;
}

/* 지도 세로 길이를 55vh로 대폭 키움 (화면의 절반 이상) */
.location-map-box {
    width: 100%;
    height: 55vh; 
    border: 1px solid #eee;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    margin-bottom: 30px;
}

/* 정보 섹션 - 부피 축소 */
.location-info-wrapper {
    background: none;
    padding: 0;
}

/* 주소 및 연락처 행 - 높이와 간격을 줄임 */
.info-main-row {
    display: flex;
    justify-content: flex-start;
    gap: 60px; /* 간격 축소 */
    border-top: 2px solid #333;
    border-bottom: 1px solid #eee;
    padding: 30px 0; /* 패딩 축소 */
    margin-bottom: 25px; /* 하단 여백 축소 */
}

.info-item h4 {
    font-size: 15px; /* 제목 크기 줄임 */
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 5px; /* 간격 축소 */
}

.info-item p {
    font-size: 14px; /* 글씨 크기 줄임 */
    color: #555;
    line-height: 1.4;
}

/* 교통수단 그리드 - 높이 효율을 위해 폰트 및 아이콘 크기 미세 조정 */
.transport-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
}

.transport-item {
    display: flex;
    align-items: center; /* 아이콘과 텍스트 수직 중앙 정렬 */
    gap: 15px;
}

.transport-icon {
    width: 50px; /* 아이콘 크기 미세 축소 */
    height: 50px;
    background-color: #d9c8b0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #fff;
    font-size: 20px;
}

.transport-text h5 {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 3px;
}

.transport-text p {
    font-size: 13px;
    color: #777;
    line-height: 1.4;
    word-break: keep-all;
}



</style>
</head>

<body>
	<div class="scroll-indicator">
	<div class="scroll-track-fill" id="scrollTrackFill"></div>
	<div class="scroll-dot active" data-label="메인" data-section="0"></div>
	<div class="scroll-dot" data-label="G-TCS" data-section="1"></div>
	<div class="scroll-dot" data-label="환율" data-section="2"></div>
	<div class="scroll-dot" data-label="지도" data-section="3"></div>
</div>

	<header class="global-header">
		<div class="header-center-group">
			<a href="/" class="logo"><i class="fas fa-globe"></i> G-TCS</a>
		</div>

		<div class="header-right-area">
			<!-- 로그인 안했을 때 -->
			<div id="beforeLogin" style="display: none;">
				<a href="/member/auth/session/login" class="login-btn"> <i
					class="fas fa-sign-in-alt"></i> 로그인
				</a>
			</div>

			<!-- 로그인 했을 때 -->
			<div id="afterLogin" style="display: none;">
				<div class="user-menu-wrapper">
					<span class="header-user-name" id="userName">00님</span>

					<div class="user-menu-container">
						<a href="javascript:void(0);" class="menu-trigger"
							onclick="toggleUserMenu()"> <i class="fa-solid fa-bars"></i>
						</a>

						<div id="userDropdown" class="dropdown-content">
							<div class="dropdown-info">
								<span class="info-name" id="dropdownUserName">00님</span> <span
									class="info-status">Logged in</span>
							</div>
							<div class="dropdown-divider"></div>
							<a href="/client/member/memberdetail/detail"
								class="dropdown-item"> <i class="fa-solid fa-circle-user"></i>
								회원 상세 정보
							</a> <a href="javascript:void(0);" class="dropdown-item logout-item"
								onclick="handleLogout()"> <i
								class="fa-solid fa-right-from-bracket"></i> 로그아웃
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>

	<div class="main-body">
		<main class="content-area">
			<div class="first-page snap-section" data-section="0">

				<!-- 배경 장식 요소들 -->
				<div class="grid-overlay"></div>
				<div class="glow-line"></div>
				<div class="corner-decor top-left"></div>
				<div class="corner-decor bottom-right"></div>

				<div class="hero-section">
					<div class="hero-subtitle">Global Trade Compliance &
						Logistics System</div>
					<div class="hero-title">
						빠르고 정확한 <span class="accent">통관 서비스</span>로 <br> 신뢰받는 관세 행정
						시스템
					</div>
					<div class="hero-desc">대한민국 관세행정의 디지털 혁신, G-TCS가 함께합니다</div>
				</div>
				<div class="bottom-icon-bar">
					<div class="icon-scroll-wrapper">
						<div class="icon-scroll-container">
							<div class="icons-horizontal">
								<a href="/client/member/dashboard/dashboard" id="link-dashboard"
									class="icon-box"><div class="icon-box-icon">
										<img src="/images/menu.png" alt="대시보드" class="menu-img-icon">
									</div> <span class="icon-box-text">대시보드</span></a> <a
									href="/client/ims/imswrite/importBase" id="link-import"
									class="icon-box"><div class="icon-box-icon">
										<i class="fa-solid fa-file-import"></i>
									</div> <span class="icon-box-text">수입신고</span></a> <a
									href="/client/exp/expwrite/exportBase" id="link-export"
									class="icon-box"><div class="icon-box-icon">
										<i class="fa-solid fa-file-export"></i>
									</div> <span class="icon-box-text">수출신고</span></a> <a
									href="/client/cargo/status/list" id="link-cargo"
									class="icon-box"><div class="icon-box-icon">
										<i class="fa-solid fa-truck-fast"></i>
									</div> <span class="icon-box-text">화물진행정보</span></a> <a
									href="/client/cargo/status/damagelist" id="link-damage"
									class="icon-box"><div class="icon-box-icon">
										<i class="fa-solid fa-triangle-exclamation"></i>
									</div> <span class="icon-box-text">화물예외처리현황</span></a> <a
									id="link-pay-waiting" class="icon-box"><div
										class="icon-box-icon">
										<i class="fa-solid fa-file-invoice-dollar"></i>
									</div>
									<span class="icon-box-text">세금납부</span></a> <a
									id="link-import-supp" class="icon-box"><div
										class="icon-box-icon">
										<i class="fa-solid fa-file-pen"></i>
									</div>
									<span class="icon-box-text">수입보완정정</span></a> <a
									id="link-export-supp" class="icon-box"><div
										class="icon-box-icon">
										<i class="fa-solid fa-file-circle-check"></i>
									</div>
									<span class="icon-box-text">수출보완정정</span></a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="second-page snap-section" data-section="1">
				<!-- 두 번째 페이지 배경 장식 -->
				<div class="second-page-grid"></div>
				<div class="second-page-top-bar"></div>

				<div
					style="position: absolute; top: 90px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 5px; z-index: 10;">
					<a href="/"
						style="display: flex; flex-direction: column; align-items: center; gap: 5px; text-decoration: none;">
						<i class="fas fa-globe" style="color: #ffffff; font-size: 30px;"></i>
						<span style="font-size: 30px; font-weight: 900; color: #ffffff;">G-TCS</span>
					</a>
				</div>
				<div class="kwater-layout">
					<div class="ceo-card">
						<div class="board-header">
			<h3>📢 공지사항</h3>
			<a href="/client/information/notice/noticelist" class="board-more-btn"><i class="fas fa-plus"></i></a>
		</div>
						<ul id="noticeList"></ul>
					</div>
					<div class="strategy-card">
						<div class="board-header">
			<h3>📋 행정예고</h3>
			<a href="javascript:void(0);" onclick="checkLoginAndGo('/client/information/announcement/announcement_list')" class="board-more-btn"><i class="fas fa-plus"></i></a>
		</div>
						<ul id="announcementList"></ul>
					</div>
					<div class="main-slider">
						<div class="slide active">
							<iframe width="100%" height="100%"
								src="https://www.youtube.com/embed/NI0iiTu7pz0" frameborder="0"
								allowfullscreen style="display: block;"> </iframe>
						</div>
					</div>
					<div class="location-card">
						<div class="board-header">
			<h3>💬 민원사항 (Q&A)</h3>
			<a href="javascript:void(0);" onclick="checkLoginAndGo('/client/information/complaint/complaint_list')" class="board-more-btn"><i class="fas fa-plus"></i></a>
		</div>
						<ul id="complaintList"></ul>
					</div>
					<div class="sns-card"
						style="padding: 18px; overflow: hidden; display: flex; flex-direction: column; background: linear-gradient(135deg, #1a2845 0%, #2d4a8a 60%, #1e6bb8 100%); position: relative;">
						<!-- 배경 장식 원 -->
						<div
							style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255, 255, 255, 0.05);"></div>
						<div
							style="position: absolute; bottom: -20px; left: 60px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255, 255, 255, 0.05);"></div>

						<h3
							style="margin-bottom: 5px; font-size: 22px; font-weight: 700; color: #ffffff; padding-left: 8px; padding-top: 20px; letter-spacing: 1px;">
							<span style="color: #7eb8f7;">G-TCS</span> SNS
						</h3>
						<p
							style="font-size: 11px; color: rgba(255, 255, 255, 0.6); padding-left: 8px; margin-bottom: 10px; letter-spacing: 0.5px;">관세청
							공식 소셜미디어</p>

						<div style="display: flex; flex: 1; align-items: center;">
							<div
								style="display: flex; flex-direction: column; gap: 12px; margin-top: -30px;">
								<div style="display: flex; gap: 12px;">
									<a
										href="https://www.youtube.com/@%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%EA%B4%80%EC%84%B8%EC%B2%AD"
										target="_blank"
										style="width: 55px; height: 55px; border-radius: 50%; background: #FF0000; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.2s; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);"
										onmouseover="this.style.transform='scale(1.1)'"
										onmouseout="this.style.transform='scale(1)'"> <i
										class="fab fa-youtube" style="color: white; font-size: 22px;"></i>
									</a> <a href="https://www.facebook.com/ftacustoms" target="_blank"
										style="width: 55px; height: 55px; border-radius: 50%; background: #1877F2; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.2s; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);"
										onmouseover="this.style.transform='scale(1.1)'"
										onmouseout="this.style.transform='scale(1)'"> <i
										class="fab fa-facebook-f"
										style="color: white; font-size: 22px;"></i>
									</a> <a href="https://www.instagram.com/korea_customs/"
										target="_blank"
										style="width: 55px; height: 55px; border-radius: 50%; background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.2s; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);"
										onmouseover="this.style.transform='scale(1.1)'"
										onmouseout="this.style.transform='scale(1)'"> <i
										class="fab fa-instagram"
										style="color: white; font-size: 22px;"></i>
									</a>
								</div>
								<div style="display: flex; gap: 12px;">
									<a href="https://blog.naver.com/k_customs" target="_blank"
										style="width: 55px; height: 55px; border-radius: 50%; background: #03C75A; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.2s; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);"
										onmouseover="this.style.transform='scale(1.1)'"
										onmouseout="this.style.transform='scale(1)'"> <span
										style="color: white; font-size: 20px; font-weight: 900; font-family: Arial;">N</span>
									</a> <a href="https://pf.kakao.com/_Xfuxcj" target="_blank"
										style="width: 55px; height: 55px; border-radius: 50%; background: #FEE500; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.2s; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);"
										onmouseover="this.style.transform='scale(1.1)'"
										onmouseout="this.style.transform='scale(1)'"> <span
										style="color: #3A1D1D; font-size: 18px; font-weight: 900; font-family: Arial;">K</span>
									</a>
								</div>
							</div>
							<div
								style="flex: 1; display: flex; align-items: flex-start; justify-content: center; padding-top: 0px;">
								<img src="/images/character.png"
									style="max-height: 350px; max-width: 100%; object-fit: contain; margin-top: -90px; margin-left: 20px;">
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 세 번째 페이지: 환율 정보 -->
			<div class="third-page snap-section" data-section="2">
				<!-- 세 번째 페이지 배경 장식 -->
				<div class="third-page-grid"></div>
				<div class="third-page-top-bar"></div>
				<div class="third-page-corner tl"></div>
				<div class="third-page-corner br"></div>

				<div class="exchange-container">
					<h2 class="exchange-title">실시간 환율 정보</h2>
					<div class="exchange-grid">
				    <div class="exchange-loading" style="grid-column: 1/-1; text-align:center; padding:40px; color:#888;">
				        <i class="fas fa-spinner fa-spin" style="font-size:24px; color:#0f4c81;"></i>
				        <p style="margin-top:10px;">환율 정보를 불러오는 중...</p>
				    </div>
				</div>
				</div>
			</div>
			
			<div class="fourth-page snap-section" data-section="3">
    <div class="fourth-page-top-bar"></div>
    <div class="location-container">
        <h2 class="location-title"><img src="/images/map.png" alt="지도" style="width: 35px; height: 35px; vertical-align: middle; margin-right: 8px;">오시는 길</h2>
        
        <div class="location-content">
            <div class="location-map-box">
                <div id="map" style="width:100%; height:100%;"></div>
            </div>

            <div class="location-info-wrapper">
                <div class="info-main-row">
                    <div class="info-item">
                        <h4>주소</h4>
                        <p>34908 대전광역시 중구 계룡로 846, 3층</p>
                    </div>
                    <div class="info-item">
                        <h4>연락처</h4>
                        <p>Tel: 042-222-8202 | Fax: 042-222-8203 | Email: admin@gtcs.com</p>
                    </div>
                </div>

                <div class="transport-grid">
                    <div class="transport-item">
                        <div class="transport-icon"><i class="fas fa-walking"></i></div>
                        <div class="transport-text">
                            <h5>도보</h5>
                            <p>서대전네거리역 5번 출구 방향 200m</p>
                        </div>
                    </div>
                    <div class="transport-item">
                        <div class="transport-icon"><i class="fas fa-car"></i></div>
                        <div class="transport-text">
                            <h5>자차</h5>
                            <p>서대전네거리에서 계룡로 방향 진입</p>
                        </div>
                    </div>
                    <div class="transport-item">
                        <div class="transport-icon"><i class="fas fa-bus"></i></div>
                        <div class="transport-text">
                            <h5>버스</h5>
                            <p>서대전네거리역 정류장 하차 후 도보 3분</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
		</main>
	</div>

	<script>
	const swalConfig = {
		    width: '400px',
		    padding: '1.5rem',
		    confirmButtonColor: '#0f4c81'
		};
	
	// ========== 카카오맵 초기화 ==========
	   function initMap() {
	       var container = document.getElementById('map');
	       var options = {
	           center: new kakao.maps.LatLng(36.324887, 127.408661),
	           level: 3
	       };
	       
	       var map = new kakao.maps.Map(container, options);
	       
	       // 마커 생성
	       var markerPosition = new kakao.maps.LatLng(36.324887, 127.408661);
	       var marker = new kakao.maps.Marker({
	           position: markerPosition
	       });
	       marker.setMap(map);
	   }
	
   function parseJwt(token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
          );
          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error('토큰 파싱 오류:', error);
          return null;
        }
      }
   
   // ========== 로그인 상태 확인 및 UI 업데이트 ==========
function updateUserUI() {
  const token = localStorage.getItem('accessToken');
  
  const beforeLogin = document.querySelector('#beforeLogin');
  const afterLogin = document.querySelector('#afterLogin');
  const userName = document.querySelector('#userName');
  const dropdownUserName = document.querySelector('#dropdownUserName');
  
  if (token) {
    const payload = parseJwt(token);
    
    if (payload && payload.realUser) {
      const memName = payload.realUser.memName;
      
      beforeLogin.style.display = 'none';
      afterLogin.style.display = 'flex';
      userName.textContent = memName + '님';  
      dropdownUserName.textContent = memName + '님';  
      
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
      beforeLogin.style.display = 'flex';
      afterLogin.style.display = 'none';
    }
  } else {
    beforeLogin.style.display = 'flex';
    afterLogin.style.display = 'none';
  }
}

   // ========== 로그아웃 처리 ==========
   function handleLogout() {
    Swal.fire({
        ...swalConfig,
        icon: 'question',
        title: '로그아웃',
        text: '로그아웃 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('accessToken');
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: '완료',
                text: '로그아웃 되었습니다.'
            }).then(() => {
                location.reload();
            });
        }
    });
}
   
   function checkLoginAndGo(url) {
	    const token = localStorage.getItem('accessToken');
	    if(token) {
	        location.href = url;
	    }else {
	        Swal.fire({
	            ...swalConfig,
	            icon: 'warning',
	            title: '로그인 필요',
	            text: '로그인 후 확인할 수 있습니다.'
	        });
	    }
	}
   
   function fetchExchangeRates() {
	    axios.get('/index/exchange')
	    .then(response => {
	        const exchangeData = response.data;
	        
	        const gridContainer = document.querySelector('.exchange-grid');
	        if(!gridContainer) return; // 컨테이너가 없는 경우 대비
	        
	        gridContainer.innerHTML = '';
	        const flags = {
	            "미국 (USD)": "🇺🇸", "일본 (JPY 100)": "🇯🇵", "유럽연합 (EUR)": "🇪🇺",
	            "중국 (CNY)": "🇨🇳", "영국 (GBP)": "🇬🇧", "홍콩 (HKD)": "🇭🇰",
	            "캐나다 (CAD)": "🇨🇦", "호주 (AUD)": "🇦🇺", "스위스 (CHF)": "🇨🇭", "싱가포르 (SGD)": "🇸🇬"
	        };

	        exchangeData.forEach(item => {
	            let statusClass = (item.status === 'UP') ? 'up' : (item.status === 'DOWN' ? 'down' : 'neutral');
	            let arrow = (item.status === 'UP') ? '▲' : (item.status === 'DOWN' ? '▼' : '-');

				const cardHtml = `
				    <div class="exchange-card">
				        <div class="exchange-flag">\${flags[item.name] || '🏳️'}</div>
				        <div class="exchange-country">\${item.name}</div>
				        <div class="exchange-rate">\${Number(item.todayPrice).toLocaleString()}</div>
				        <div class="exchange-change \${statusClass}">
				            \${arrow} \${item.diff}
				        </div>
				    </div>
				`;
	            gridContainer.insertAdjacentHTML('beforeend', cardHtml);
	        });
	    })
	    .catch(err => console.error("환율 로드 에러:", err));
	}
   // ========== 페이지 로드 시 실행 ==========
   document.addEventListener('DOMContentLoaded', function() {
     updateUserUI();
     loadBoardList('공지사항', 'noticeList', 5, '/client/information/notice/noticedetail');
     loadBoardList('행정예고', 'announcementList', 5, '/client/information/announcement/announcement_detail');
     loadBoardList('민원사항', 'complaintList', 5, '/client/information/complaint/complaint_detail');
     createParticles();
     // 파티클 생성
     fetchExchangeRates();
     
     // 카카오맵 초기화
     if (typeof kakao !== 'undefined' && kakao.maps) {
         initMap();
     } else {
         console.error('카카오맵 API가 로드되지 않았습니다.');
     }
     
     const protectedLinks = [
    	    'link-dashboard', 'link-import', 'link-export',
    	    'link-cargo', 'link-damage',
    	    'link-pay-waiting', 'link-import-supp', 'link-export-supp'
    	];
    	protectedLinks.forEach(function(id) {
    	    const el = document.querySelector('#' + id);
    	    if (!el) return;
    	    el.addEventListener('click', function(e) {
    	        if (!localStorage.getItem('accessToken')) {
    	            e.preventDefault();
    	            Swal.fire({
                        ...swalConfig,
                        icon: 'warning',
                        title: '로그인 필요',
                        text: '로그인 후 확인할 수 있습니다.'
                    });
    	        }
    	    });
    	});
     
     // 세금 납부 및 수입/수출 링크 연결 부분
  	// 1. 오늘 날짜 구하기 (YYYY-MM-DD)
     const d = new Date();
     const year = d.getFullYear();
     const month = String(d.getMonth() + 1).padStart(2, '0');
     const day = String(d.getDate()).padStart(2, '0');
     const todayStr = `${year}-${month}-${day}`;

     // 2. 세금납부 링크 주소 세팅
     const payWaitingBtn = document.querySelector('#link-pay-waiting');
     if(payWaitingBtn) {
         payWaitingBtn.href = `/client/ims/status/list?status=PAY_WAITING&startDate=${todayStr}&endDate=${todayStr}`;
     }

     // 3. 수입보완정정 링크 주소 세팅
     const importSuppBtn = document.querySelector('#link-import-supp');
     if(importSuppBtn) {
         importSuppBtn.href = `/client/ims/status/list?status=SUPPLEMENT&startDate=${todayStr}&endDate=${todayStr}`;
     }

     // 4. 수출보완정정 링크 주소 세팅
     const exportSuppBtn = document.querySelector('#link-export-supp');
     if(exportSuppBtn) {
         exportSuppBtn.href = `/client/exp/status/list?status=SUPPLEMENT&startDate=${todayStr}&endDate=${todayStr}`;
     }
   });
   
   // ========== 부유 파티클 생성 ==========
   function createParticles() {
       const firstPage = document.querySelector('.first-page');
       if (!firstPage) return;
       
       for (let i = 0; i < 20; i++) {
           const particle = document.createElement('div');
           particle.className = 'particle';
           particle.style.left = Math.random() * 100 + '%';
           particle.style.top = (60 + Math.random() * 40) + '%';
           particle.style.animationDuration = (8 + Math.random() * 12) + 's';
           particle.style.animationDelay = (Math.random() * 10) + 's';
           particle.style.width = (2 + Math.random() * 2) + 'px';
           particle.style.height = particle.style.width;
           particle.style.opacity = 0.2 + Math.random() * 0.4;
           firstPage.appendChild(particle);
       }
   }

   // 드롭다운 토글
   function toggleUserMenu() {
       document.querySelector("#userDropdown").classList.toggle("show");
   }

   // 외부 클릭 시 닫기
   window.addEventListener('click', function(event) {
       if (!event.target.matches('.menu-trigger') && !event.target.matches('.fa-bars')) {
           const dropdowns = document.querySelectorAll('.dropdown-content');
           for (let i = 0; i < dropdowns.length; i++) {
               const openDropdown = dropdowns[i];
               if (openDropdown.classList.contains('show')) {
                   openDropdown.classList.remove('show');
               }
           }
       }
   });

      // 슬라이더
      let slideIndex = 1;
      function showSlides(n) {
        let slides = document.querySelectorAll('.slide');
        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;
        for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
        slides[slideIndex-1].style.display = "flex";
      }

      function nextSlide() { showSlides(++slideIndex); }
      function prevSlide() { showSlides(--slideIndex); }

   // ========== 게시판 데이터 로드 ==========
      async function loadBoardList(bdType, ulId, limit, detailUrl) {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('/rest/board/list', {
            params: { bdType: bdType }
        });
        
        const ul = document.querySelector('#' + ulId);
        const data = res.data.slice(0, limit);

        if (data.length === 0) {
            ul.innerHTML = '<li><span>등록된 게시글이 없습니다.</span></li>';
            return;
        }

        ul.innerHTML = data.map(function(item) {
        	var date = item.bdRegdate ? item.bdRegdate.substring(0, 10) : '';
            
            var clickAction;
            if (bdType === '공지사항') {
                clickAction = 'location.href=\'' + detailUrl + '?bdId=' + item.bdId + '\'';
            } else {
                var token = localStorage.getItem('accessToken');
                if (token) {
                    clickAction = 'location.href=\'' + detailUrl + '?bdId=' + item.bdId + '\'';
                } else {
                	clickAction = 'Swal.fire({...swalConfig, icon:\'warning\', title:\'로그인 필요\', text:\'로그인 후 확인할 수 있습니다.\'})';
                }
            }
            
            return '<li style="cursor:pointer;" onclick="' + clickAction + '">'
                + '<span>' + item.bdTitle + '</span>'
                + '<span class="date">' + date + '</span>'
                + '</li>';
        }).join('');
    } catch (e) {
        console.error(bdType + ' 로드 실패:', e);
    }
}
   
      const scrollDots = document.querySelectorAll('.scroll-dot');
      const sections = document.querySelectorAll('.snap-section');
      const scrollTrackFill = document.querySelector('#scrollTrackFill');

      // 스크롤 트랙 채우기 업데이트
      function updateScrollTrack(activeIndex) {
          const dots = document.querySelectorAll('.scroll-dot');
          if (dots.length < 2) return;
          
          const firstDot = dots[0];
          const activeDot = dots[activeIndex];
          const indicator = document.querySelector('.scroll-indicator');
          
          const startY = firstDot.offsetTop + firstDot.offsetHeight / 2 - indicator.offsetTop;
          const endY = activeDot.offsetTop + activeDot.offsetHeight / 2 - indicator.offsetTop;
          
          scrollTrackFill.style.top = startY + 'px';
          scrollTrackFill.style.height = (endY - startY) + 'px';
      }

      window.addEventListener('scroll', () => {
        let current = 0;
        sections.forEach((s, i) => { if (pageYOffset >= s.offsetTop - 100) current = i; });
        scrollDots.forEach((d, i) => d.classList.toggle('active', i === current));
        updateScrollTrack(current);
      });

      scrollDots.forEach((d, i) => d.addEventListener('click', () => sections[i].scrollIntoView({ behavior: 'smooth' })));
      
      // 초기 트랙 설정
      setTimeout(() => updateScrollTrack(0), 100);
    </script>
</body>
</html>