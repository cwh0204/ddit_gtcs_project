<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>국가관세종합정보망 서비스 (UNI-PASS) - 로그인</title>

<!-- Font Awesome 아이콘 라이브러리 -->
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- 네이버 로그인 SDK -->
<!-- <script -->
<!-- 	src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js" -->
<!-- 	charset="utf-8"></script> -->

<!-- axios 라이브러리 추가 -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

 <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<style>
/* ========== body 전체 스타일 설정 ========== */
body {
	margin: 0;
	padding: 0;
	overflow-x: hidden; /* 가로 스크롤바 숨김 */
	background-image:
		url('${pageContext.request.contextPath}/images/HD현대중공업바다.png');
	background-size: cover; /* 배경 이미지를 화면에 꽉 차게 */
	background-position: center; /* 배경 이미지 중앙 정렬 */
	background-repeat: no-repeat; /* 배경 이미지 반복 방지 */
	background-attachment: fixed; /* 스크롤 시 배경 이미지 고정 */
	min-height: 300vh; /* 스크롤 공간 확보 (화면 높이의 3배) */
}

/* ========== 메인 타이틀 (WELCOME) 스타일 ========== */
.main-title {
	position: fixed; /* 화면에 고정 */
	top: 50%; /* 화면 세로 중앙 */
	left: 50%; /* 화면 가로 중앙 */
	transform: translate(-50%, -50%); /* 정확한 중앙 정렬 */
	font-size: 120px; /* 글자 크기 */
	font-weight: bold; /* 굵은 글씨 */
	color: white; /* 글자 색상 흰색 */
	text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.7); /* 그림자 효과 */
	z-index: 5; /* 요소의 앞뒤 순서 (배보다 뒤에 위치) */
	letter-spacing: 15px; /* 글자 간격 */
	transition: opacity 0.5s ease; /* 부드러운 페이드 효과 */
	text-align: center; /* 중앙 정렬 */
}

/* ========== 부제목 (Global Trade Compliance) 스타일 ========== */
.subtitle {
	position: fixed; /* 화면에 고정 */
	top: 50%; /* 화면 세로 중앙 */
	left: 50%; /* 화면 가로 중앙 */
	transform: translate(-50%, -50%); /* 정확한 중앙 정렬 */
	font-size: 100px; /* 글자 크기 */
	font-weight: 700; /* 글자 굵기 */
	color: white; /* 글자 색상 흰색 */
	text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.8); /* 그림자 효과 */
	z-index: 5; /* 요소의 앞뒤 순서 */
	letter-spacing: 5px; /* 글자 사이의 가로 간격 */
	text-align: center; /* 중앙 정렬 */
	width: 100vw; /* 화면 전체 너비 */
	line-height: 1.1; /* 줄 간격 */
	white-space: nowrap; /* 자동 줄바꿈 방지 */
	opacity: 0; /* 투명도 (처음엔 안 보임) */
	visibility: hidden; /* 숨김 */
	transition: opacity 0.7s ease-in, visibility 0.7s ease-in;
	/* 부드러운 전환 효과 */
}

/* 부제목이 보일 때 */
.subtitle.show {
	opacity: 1; /* 불투명하게 */
	visibility: visible; /* 보이게 */
}

/* ========== 스크롤 힌트 텍스트 ========== */
.scroll-hint {
	font-size: 20px; /* 작은 글자 크기 */
	font-weight: normal; /* 보통 굵기 */
	letter-spacing: 2px; /* 글자 간격 */
	margin-top: 30px; /* WELCOME과의 간격 */
	color: white; /* 글자 색상 흰색 */
	text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7); /* 그림자 효과 */
	animation: arrowFloat 2s infinite; /* 위아래로 움직이는 애니메이션 */
}

/* ========== 화살표 이미지 애니메이션 ========== */
.arrow-bounce {
	display: inline-block; /* 인라인 블록으로 설정 */
	animation: arrowFloat 2s ease-in-out infinite; /* 2초 동안 무한 반복 */
}

/* 위아래로 둥둥 뜨는 애니메이션 정의 */
@
keyframes arrowFloat { 0%, 100% {
	transform: translateY(0); /* 원래 위치 */
}50%
{
transform:translateY(-10px); /* 위로 10px 이동 */
}
}

/* ========== 배 컨테이너 스타일 ========== */
.ship-container {
	position: fixed; /* 스크롤해도 화면에 고정 */
	top: 50%; /* 세로 위치를 화면 중앙에 고정 */
	right: -1500px; /* 초기 위치를 화면 오른쪽 밖으로 설정 (배가 완전히 숨겨짐) */
	transform: translateY(-50%); /* 세로 중앙 정렬 */
	transition: right 0.3s ease-out; /* 부드러운 이동 효과 */
	z-index: 10; /* 다른 요소들 위에 표시 */
}

/* ========== 로그인 폼 컨테이너 스타일 ========== */
.login-form-container {
	position: fixed; /* 브라우저 화면을 기준으로 특정 위치에 고정 */
	top: 50%; /* 화면 세로 중앙 */
	left: 50%; /* 화면 가로 중앙 */
	transform: translate(-50%, -50%); /* 정확한 중앙 정렬 */
	background: white; /* 배경색 흰색 */
	padding: 30px 35px; /* 내부 여백 */
	border-radius: 12px; /* 모서리 둥글게 */
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
	z-index: 20; /* 다른 요소들 위에 표시 */
	opacity: 0; /* 투명도 (처음엔 안 보임) */
	visibility: hidden; /* 숨김 */
	transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
	/* 부드러운 전환 효과 */
	min-width: 300px; /* 최소 너비 */
	max-width: 400px; /* 최대 너비 */
}

/* 로그인 폼이 보일 때 */
.login-form-container.show {
	opacity: 1; /* 불투명하게 */
	visibility: visible; /* 보이게 */
}

/* ========== 라벨 텍스트 스타일 ========== */
.label-text {
	margin-bottom: 5px; /* 아래 여백 */
}

/* ========== 폼 그룹 (아이디, 비밀번호 칸) 간격 ========== */
.form-group {
	margin-bottom: 10px; /* 아래 여백 */
}

/* ========== 비밀번호 입력 필드 wrapper ========== */
.input-wrapper {
	position: relative; /* 상대 위치 (자식 요소의 절대 위치 기준점) */
	width: 100%; /* 너비 100% */
}

/* 비밀번호 입력 필드 (아이콘 공간 확보) */
.input-wrapper input {
	width: 100%; /* 너비 100% */
	padding-right: 40px; /* 오른쪽 여백 (눈 아이콘 공간) */
}

/* ========== 눈 아이콘 위치 ========== */
.input-icon {
	position: absolute; /* 절대 위치 (부모 요소 기준) */
	right: 12px; /* 오른쪽에서 12px */
	top: 50%; /* 세로 중앙 */
	transform: translateY(-50%); /* 정확한 세로 중앙 정렬 */
	cursor: pointer; /* 마우스 커서를 손가락 모양으로 */
	color: #718096; /* 아이콘 색상 */
	font-size: 16px; /* 아이콘 크기 */
}

/* 아이콘에 마우스 올렸을 때 */
.input-icon:hover {
	color: #4a5568; /* 색상 변경 */
}

/* ========== 로그인 폼 제목 ========== */
.login-form-container h2 {
	margin-top: 0; /* 위 여백 제거 */
	margin-bottom: 20px; /* 아래 여백 */
	color: #333; /* 글자 색상 */
	text-align: center; /* 중앙 정렬 */
}

/* ========== 입력 필드 스타일 ========== */
.login-form-container input {
    width: 100%;
	padding: 12px; /* 내부 여백 */
	border: 1px solid #ddd; /* 테두리 */
	border-radius: 5px; /* 모서리 둥글게 */
	box-sizing: border-box; /* 패딩과 테두리를 너비에 포함 */
	font-size: 14px; /* 글자 크기 */
}

/* ========== 로그인 버튼 스타일 ========== */
.login-form-container button {
	width: 100%; /* 너비 100% */
	padding: 12px; /* 내부 여백 */
	border-radius: 5px; /* 모서리 둥글게 */
	cursor: pointer; /* 마우스 커서를 손가락 모양으로 */
	font-size: 16px; /* 글자 크기 */
	font-weight: bold; /* 굵은 글씨 */
	box-sizing: border-box; /* 패딩과 테두리를 너비에 포함 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

/* 로그인 버튼 */
.btn-login {
	border: none; /* 테두리 제거 */
	background-color: #0f4c81; /* 배경색 파란색 */
	color: white; /* 글자 색상 흰색 */
}

/* 로그인 버튼에 마우스 올렸을 때 */
.btn-login:hover {
	background-color: #0a365c; /* 배경색 어두운 파란색 */
}

/* ========== 소셜 로그인 버튼 컨테이너 ========== */
.sociallogin {
	display: flex; /* 플렉스 박스 레이아웃 */
	gap: 10px; /* 버튼 사이 간격 */
	margin-top: 15px; /* 위 여백 */
	margin-bottom: 15px; /* 아래 여백 */
}

/* ========== 카카오 로그인 버튼 ========== */
.btn-kakao {
	background-color: white; /* 배경색 흰색 */
	border: 1px solid #FEE500; /* 테두리 카카오 노란색 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

/* 카카오 버튼 아이콘 */
.btn-kakao i {
	color: #3C1E1E; /* 아이콘 색상 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

/* 카카오 버튼에 마우스 올렸을 때 */
.btn-kakao:hover {
	background-color: #FEE500; /* 배경색 카카오 노란색 */
}

/* ========== 네이버 로그인 버튼 ========== */
.btn-naver {
	background-color: white; /* 배경색 흰색 */
	border: 1px solid #03C75A; /* 테두리 네이버 초록색 */
	color: #03C75A; /* 글자 색상 네이버 초록색 */
}

/* 네이버 버튼에 마우스 올렸을 때 */
.btn-naver:hover {
	background-color: #03C75A; /* 배경색 네이버 초록색 */
	color: white; /* 글자 색상 흰색 */
}

/* ========== 깃허브 로그인 버튼 ========== */
.btn-github {
	background-color: white; /* 배경색 흰색 */
	border: 1px solid #333; /* 테두리 검정색 */
	color: #333; /* 글자 색상 검정색 */
}

/* 깃허브 버튼에 마우스 올렸을 때 */
.btn-github:hover {
	background-color: #333; /* 배경색 검정색 */
	color: white; /* 글자 색상 흰색 */
}

/* ========== 하단 링크 (ID 찾기, PW 찾기, 회원가입) ========== */
.bottom-links {
	text-align: center; /* 중앙 정렬 */
	font-size: 13px; /* 글자 크기 */
	color: #718096; /* 글자 색상 회색 */
	margin-bottom: 20px; /* 아래 여백 */
}

/* 하단 링크 스타일 */
.bottom-links a {
	color: #0f4c81; /* 링크 색상 파란색 */
	text-decoration: none; /* 밑줄 제거 */
	font-weight: 600; /* 글자 굵기 */
	margin: 0 5px; /* 좌우 여백 */
	cursor: pointer;
}

/* 링크에 마우스 올렸을 때 */
.bottom-links a:hover {
	text-decoration: underline; /* 밑줄 표시 */
}

/* 링크 사이 구분선(|) 스타일 */
.bottom-links span {
	color: #cbd5e0; /* 구분선 색상 연한 회색 */
	margin: 0 5px; /* 좌우 여백 */
}

/* ========== 세관원 로그인 섹션 ========== */
.officer-login-section {
	margin-top: 20px;
	margin-bottom: 20px;
}

.divider {
	display: flex;
	align-items: center;
	margin: 25px 0;
}

.divider::before {
	content: '';
	flex: 1;
	border-bottom: 1px solid #e2e8f0;
}

.divider span {
	display: none;
}

.btn-officer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px;
	background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
	border: 2px solid #cbd5e0;
	border-radius: 10px;
	text-decoration: none;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.officer-text {
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
	margin-left: 15px;
	z-index: 1;
}

.officer-title {
	font-size: 16px;
	font-weight: 700;
	color: #2d3748;
	transition: color 0.3s ease;
}

.btn-officer:hover .officer-title {
	color: #0f4c81;
}

.officer-subtitle {
	font-size: 11px;
	font-weight: 500;
	color: #718096;
	letter-spacing: 0.5px;
}

.arrow-icon {
	font-size: 16px;
	color: #cbd5e0;
	transition: all 0.3s ease;
	z-index: 1;
}

.btn-officer:hover .arrow-icon {
	color: #0f4c81;
	transform: translateX(5px);
}

/* ========== 안내사항 박스 ========== */
.login-info-list {
	background-color: #f7fafc; /* 배경색 연한 회색 */
	border-radius: 8px; /* 모서리 둥글게 */
	padding: 12px; /* 내부 여백 */
	font-size: 11px; /* 글자 크기 */
	color: #4a5568; /* 글자 색상 회색 */
	line-height: 1.7; /* 줄 간격 */
	text-align: left; /* 왼쪽 정렬 */
}

/* 안내사항 항목 */
.info-item {
	display: flex; /* 플렉스 박스 레이아웃 */
	align-items: flex-start; /* 위쪽 정렬 */
	margin-bottom: 8px; /* 아래 여백 */
}

/* 마지막 항목은 아래 여백 제거 */
.info-item:last-child {
	margin-bottom: 0;
}

/* 안내사항 아이콘 (느낌표) */
.info-icon {
	color: #ed8936; /* 아이콘 색상 주황색 */
	font-weight: bold; /* 굵은 글씨 */
	margin-right: 6px; /* 오른쪽 여백 */
	font-size: 12px; /* 글자 크기 */
	flex-shrink: 0; /* 크기 축소 방지 */
}

/* ========== 모달 오버레이 (배경 어둡게) ========== */
.modal-overlay {
	position: fixed; /* 화면에 고정 */
	top: 0; /* 위쪽 끝 */
	left: 0; /* 왼쪽 끝 */
	width: 100%; /* 너비 100% */
	height: 100%; /* 높이 100% */
	background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정색 배경 */
	display: flex; /* 플렉스 박스 레이아웃 */
	justify-content: center; /* 가로 중앙 정렬 */
	align-items: center; /* 세로 중앙 정렬 */
	z-index: 1000; /* 모든 요소 위에 표시 */
}

/* ========== 모달 컨테이너 ========== */
.modal-container {
	background: white; /* 배경색 흰색 */
	border-radius: 12px; /* 모서리 둥글게 */
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); /* 그림자 효과 */
	max-width: 450px; /* 최대 너비 */
	width: 90%; /* 너비 90% */
	overflow: hidden; /* 넘치는 내용 숨김 */
	animation: slideUp 0.3s ease-out; /* 슬라이드 업 애니메이션 */
	position: relative; /* 상대 위치 (X 버튼 절대 위치 기준점) */
}

/* 슬라이드 업 애니메이션 정의 */
@
keyframes slideUp {from { opacity:0; /* 투명 */
	transform: translateY(30px); /* 아래에서 시작 */
}

to {
	opacity: 1; /* 불투명 */
	transform: translateY(0); /* 원래 위치 */
}

}

/* ========== 모달 헤더 ========== */
.modal-header {
	background: linear-gradient(135deg, #0f4c81 0%, #1a5fa0 100%);
	/* 그라데이션 배경 */
	padding: 25px 30px; /* 내부 여백 */
	color: white; /* 글자 색상 흰색 */
	position: relative; /* 상대 위치 */
}

/* 모달 헤더 제목 */
.modal-header h3 {
	margin: 0; /* 여백 제거 */
	font-size: 20px; /* 글자 크기 */
	font-weight: 600; /* 글자 굵기 */
}

/* ========== 모달 닫기 버튼 (X) ========== */
.modal-close-btn {
	position: absolute; /* 절대 위치 */
	top: 20px; /* 위에서 20px */
	left: 170px; /* 오른쪽에서 20px */
	width: auto; /* 너비 자동 */
	height: auto; /* 높이 자동 */
	border-radius: 0; /* 원형 제거 */
	background-color: transparent; /* 배경 투명 */
	border: none; /* 테두리 제거 */
	cursor: pointer; /* 마우스 커서를 손가락 모양으로 */
	display: flex; /* 플렉스 박스 레이아웃 */
	align-items: center; /* 세로 중앙 정렬 */
	justify-content: center; /* 가로 중앙 정렬 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
	color: white; /* 글자 색상 흰색 */
	font-size: 24px; /* 글자 크기 증가 */
	padding: 5px; /* 클릭 영역 확보 */
}

/* X 버튼에 마우스 올렸을 때 */
.modal-close-btn:hover {
	background-color: transparent; /* 배경색 투명 유지 */
	transform: scale(1.2); /* 크기 확대 */
	color: rgba(255, 255, 255, 0.8); /* 약간 투명하게 */
}

/* ========== 모달 본문 내용 ========== */
.modal-content {
	padding: 30px; /* 내부 여백 */
}

/* ========== 모달 폼 그룹 ========== */
.modal-form-group {
	margin-bottom: 20px; /* 아래 여백 */
}

/* 모달 폼 라벨 */
.modal-form-group label {
	display: block; /* 블록 요소로 표시 */
	margin-bottom: 8px; /* 아래 여백 */
	font-size: 14px; /* 글자 크기 */
	font-weight: 600; /* 글자 굵기 */
	color: #4a5568; /* 글자 색상 회색 */
}

/* 모달 폼 입력 필드 */
.modal-form-group input {
	width: 100%; /* 너비 100% */
	padding: 12px 15px; /* 내부 여백 */
	border: 2px solid #e2e8f0; /* 테두리 */
	border-radius: 8px; /* 모서리 둥글게 */
	box-sizing: border-box; /* 패딩과 테두리를 너비에 포함 */
	font-size: 14px; /* 글자 크기 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

/* 입력 필드에 포커스 했을 때 */
.modal-form-group input:focus {
	outline: none; /* 기본 아웃라인 제거 */
	border-color: #0f4c81; /* 테두리 색상 파란색 */
	box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.1); /* 파란색 그림자 효과 */
}

/* ========== 모달 버튼 그룹 ========== */
.modal-button-group {
	display: flex; /* 플렉스 박스 레이아웃 */
	gap: 12px; /* 버튼 사이 간격 */
	margin-top: 30px; /* 위 여백 */
}

/* ========== 취소 버튼 ========== */
.btn-cancel {
	flex: 1; /* 동일한 너비로 분배 */
	padding: 14px; /* 내부 여백 */
	border: 2px solid #e2e8f0; /* 테두리 */
	background: white; /* 배경색 흰색 */
	border-radius: 8px; /* 모서리 둥글게 */
	cursor: pointer; /* 마우스 커서를 손가락 모양으로 */
	font-size: 15px; /* 글자 크기 */
	font-weight: 600; /* 글자 굵기 */
	color: #718096; /* 글자 색상 회색 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

/* 취소 버튼에 마우스 올렸을 때 */
.btn-cancel:hover {
	background-color: #f7fafc; /* 배경색 연한 회색 */
	border-color: #cbd5e0; /* 테두리 색상 진한 회색 */
	transform: translateY(-2px); /* 위로 2px 이동 */
}

/* ========== 확인 버튼 ========== */
.btn-confirm {
	flex: 1; /* 동일한 너비로 분배 */
	padding: 14px; /* 내부 여백 */
	border: none; /* 테두리 제거 */
	background: linear-gradient(135deg, #0f4c81 0%, #1a5fa0 100%);
	/* 선형 그라데이션(방향, 시작점 색상, 끝색상) */
	color: white; /* 글자 색상 흰색 */
	border-radius: 8px; /* 모서리 둥글게 */
	cursor: pointer; /* 마우스 커서를 손가락 모양으로 */
	font-size: 15px; /* 글자 크기 */
	font-weight: 600; /* 글자 굵기 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
	box-shadow: 0 4px 6px rgba(15, 76, 129, 0.2); /* 그림자 효과 */
}

/* 확인 버튼에 마우스 올렸을 때 */
.btn-confirm:hover {
	background: linear-gradient(135deg, #0a365c 0%, #0f4c81 100%);
	/* 선형 그라데이션(방향, 시작점 색상, 끝색상) */
	transform: translateY(-2px); /* 위로 2px 이동 */
	box-shadow: 0 6px 12px rgba(15, 76, 129, 0.3); /* 그림자 효과 강화 */
}

/* ========== 필수 입력 표시 (빨간 별표) ========== */
.required {
	color: red; /* 글자 색상 빨간색 */
}

/* ========== 아이디 찾기 결과 표시 영역 ========== */
.find-id-result {
	margin-top: 20px; /* 위 여백 */
	margin-bottom: 10px; /* 아래 여백 */
	padding: 15px; /* 내부 여백 */
	background-color: #f0f9ff; /* 연한 파란색 배경 */
	border: 2px solid #0f4c81; /* 파란색 테두리 */
	border-radius: 8px; /* 모서리 둥글게 */
	animation: fadeIn 0.5s ease-in; /* 페이드인 애니메이션 */
}

/* 페이드인 애니메이션 */
@
keyframes fadeIn {from { opacity:0; /* 투명 */
	transform: translateY(-10px); /* 위에서 시작 */
}

to {
	opacity: 1; /* 불투명 */
	transform: translateY(0); /* 원래 위치 */
}
}

/* ========== 인증하기 버튼 스타일 ========== */
.btn-verify {
	padding: 12px 10px; /* 내부 여백 */
	border: none; /* 테두리 제거 */
	background: linear-gradient(135deg, #0f4c81 0%, #1a5fa0 100%);
	/* 그라데이션 배경 */
	color: white; /* 글자 색상 흰색 */
	border-radius: 8px; /* 모서리 둥글게 */
	cursor: pointer; /* 마우스 커서를 손가락 모양으로 */
	font-size: 14px; /* 글자 크기 */
	font-weight: 600; /* 글자 굵기 */
	transition: all 0.3s ease; /* 부드러운 전환 효과 */
	box-shadow: 0 2px 4px rgba(15, 76, 129, 0.2); /* 그림자 효과 */
	white-space: nowrap; /* 텍스트 줄바꿈 방지 */
	min-width: 50px; /* 최소 너비 */
}

/* 인증하기 버튼에 마우스 올렸을 때 */
.btn-verify:hover {
	background: linear-gradient(135deg, #0a365c 0%, #0f4c81 100%);
	/* 어두운 그라데이션 */
	transform: translateY(-2px); /* 위로 2px 이동 */
	box-shadow: 0 4px 8px rgba(15, 76, 129, 0.3); /* 그림자 효과 강화 */
}

/* ========== 이메일 입력 그룹 (인증하기 버튼 포함) ========== */
.email-input-group {
	display: flex; /* 플렉스 박스 레이아웃 */
	gap: 8px; /* 입력 필드와 버튼 사이 간격 */
	align-items: stretch; /* 높이를 동일하게 */
}

/* 이메일 입력 필드 */
.email-input-group input {
	flex: 1; /* 남은 공간 모두 차지 */
}

/* 제목 컨테이너 */
.login-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 25px !important;
    color: #333;
    font-size: 24px;
    font-weight: 800;
}

/* 아이콘 개별 스타일 */
.login-title i {
    font-size: 28px;
    color: #0f4c81; /* 아이콘만 포인트 컬러 */
}

</style>
</head>

<body>
	<!-- ========== 메인 타이틀 (WELCOME) ========== -->
	<div class="main-title">
		WELCOME
		<div class="scroll-hint">
			스크롤을 내려주세요 <img
				src="${pageContext.request.contextPath}/images/down-arrow.png"
				alt="화살표" class="arrow-bounce"
				style="width: 20px; height: auto; margin-left: 8px; margin-bottom: -10px;" />
		</div>
	</div>

	<!-- ========== 부제목 (배가 지나가고 나타나는 글씨) ========== -->
	<div class="subtitle" id="subtitle">
		Global Trade Compliance<br> Logistics System
	</div>

	<!-- ========== 스크롤에 따라 오른쪽에서 왼쪽으로 움직이는 배 이미지 ========== -->
	<div class="ship-container" id="ship">
		<img src="${pageContext.request.contextPath}/images/현대중공업 배.png"
			alt="배" style="width: 1500px; height: auto;" />
	</div>

	<!-- ========== 로그인 폼 (배가 사라지면 나타남) ========== -->
	<div class="login-form-container" id="loginForm">
        <h2 class="login-title">
        <a href="/" class="login-logo-link">
            <i class="fas fa-globe"></i>
         </a> 
         <span>G-TCS 로그인</span>    
        </h2>
   

		<!-- 로그인 폼 -->
		<!-- 아이디 입력 필드 -->
		<form method="post" action="/member/login" >
			<div class="form-group">
				<div class="label-text">
					아이디 <span class="required">*</span>
				</div>
				<input type="text" id="loginId" name="loginId"
					placeholder="아이디를 입력하세요" required />
			</div>

			<!-- 비밀번호 입력 필드 -->
			<div class="form-group" style="margin-bottom: 20px;">
				<div class="label-text">
					비밀번호 <span class="required">*</span>
				</div>
				<div class="input-wrapper">
					<input type="password" name="password" id="password"
						placeholder="비밀번호를 입력하세요" required />
					<!-- 비밀번호 보기/숨기기 아이콘 -->
					<i class="fa-solid fa-eye-slash input-icon"></i>
				</div>
			</div>

			<!-- 로그인 버튼 -->
			<div class="form-group">
				<button type="submit" class="btn-login" >로그인</button>
			</div>
		</form>
		<!-- 소셜 로그인 버튼 -->
<!-- 		<div class="sociallogin"> -->
			<!-- 카카오 로그인 --> 
<!-- 			<button type="button" class="btn-kakao" onclick="loginWithKakao()"> -->
<!-- 				<i class="fas fa-comment"></i> -->
<!-- 			</button> -->
 			<!-- 네이버 로그인 --> 
<!-- 			<button type="button" class="btn-naver" onclick="loginWithNaver()"> -->
<!-- 				<span style="font-weight: bold; font-size: 16px;">N</span> -->
<!-- 			</button> -->
			<!-- 깃허브 로그인 --> 
<!-- 			<button type="button" class="btn-github" onclick="loginWithGithub()"> -->
<!-- 				<i class="fab fa-github"></i> -->
<!-- 			</button> -->
<!-- 		</div> -->

		<!-- 하단 링크 (ID 찾기, PW 찾기, 회원가입) -->
		<div class="bottom-links">
			<a href="#" id="findIdLink">ID 찾기</a> <span>|</span>
			<a href="#" id="findPwLink">PW 찾기</a> <span>|</span>
			<a href="/member/auth/signup/form">회원가입</a> 
		</div>
		
		<!-- 세관원 로그인 버튼 -->
		<div class="officer-login-section">
		<div class="divider">
		<span></span>
		</div>
		<a href="http://localhost:5173/login" target="_blank" class="btn-officer">
        <div class="officer-text">
            <span class="officer-title">직원용 로그인</span>
            <span class="officer-subtitle">Officer Login</span>
        </div>
        <i class="fas fa-arrow-right arrow-icon"></i>
		</a>
		</div>

		<!-- ========== 아이디 찾기 모달 ========== -->
		<div id="findIdModal" class="modal-overlay" style="display: none;">
			<div class="modal-container">
				<!-- 모달 헤더 -->
				<div class="modal-header">
					<h3>아이디 찾기</h3>
					<!-- X 버튼 추가 -->
					<button type="button" class="modal-close-btn">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<!-- 모달 본문 -->
				<div class="modal-content">
					<!-- 이메일 입력 -->
					<div class="modal-form-group">
						<label>이메일</label> <input type="email" id="findIdEmail" required />
					</div>

					<!-- 버튼 그룹 -->
					<div class="modal-button-group">
						<button type="button" class="btn-confirm">아이디 찾기</button>
					</div>
				</div>
			</div>
		</div>

		<!-- ========== 비밀번호 찾기 모달 ========== -->
		<div id="findPwModal" class="modal-overlay" style="display: none;">
			<div class="modal-container">
				<!-- 모달 헤더 -->
				<div class="modal-header">
					<h3>비밀번호 찾기</h3>
					<button type="button" class="modal-close-btn">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<!-- 모달 본문 -->
				<div class="modal-content">
					<!-- 아이디 입력 -->
					<div class="modal-form-group">
						<label>아이디</label> <input type="text" id="findPwUserId" required />
					</div>

					<!-- 이메일 입력 -->
					<div class="modal-form-group" style="margin-bottom: 10px;">
						<label>이메일</label>
						<div class="email-input-group">
							<input type="email" id="findPwEmail" style="width: 1000px;"
								required />
						</div>
					</div>

					<!-- 버튼 그룹 -->
					<div class="modal-button-group">
						<button type="button" class="btn-confirm">비밀번호 찾기</button>
					</div>
				</div>
			</div>
		</div>

		<!-- ========== 안내사항 박스 ========== -->
		<div class="login-info-list">

			<div class="info-item">
				<span class="info-icon">!</span> <span>기술지원센터 : 1544-1285</span>
			</div>

			<div class="info-item">
				<span class="info-icon">!</span> <span>통관고유부호, 해외거래처부호는 본
					사이트에서 사용자등록 없이 공동 · 금융인증서로 신청하실 수 있습니다.</span>
			</div>

			<div class="info-item">
				<span class="info-icon">!</span> <span>해외직구 등에 사용되는 개인통관고유부호는
					별도 사이트에서 사용자등록 없이 신청하실 수 있습니다. </span>
			</div>
		</div>
	</div>

	<script>
	const swalConfig = {
		    width: '430px',
		    padding: '1.5rem',
		    confirmButtonColor: '#0f4c81'
		};
// ===== 스크롤 애니메이션 (배, 타이틀, 로그인 폼) =====
// ===== 스크롤 애니메이션 =====
const ship = document.querySelector('#ship');
const loginForm = document.querySelector('#loginForm');
const mainTitle = document.querySelector('.main-title');
const subtitle = document.querySelector('#subtitle');

window.addEventListener('load', () => {
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
});

window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const windowWidth = window.innerWidth;      
    const shipWidth = ship.offsetWidth;         
    const scrollProgress = scrollTop / maxScroll;
    const newRight = (scrollProgress * (windowWidth + shipWidth)) - shipWidth;  

    ship.style.right = newRight + 'px';
    mainTitle.style.opacity = scrollProgress >= 0.3 ? 0 : 1;
    subtitle.classList.toggle('show', scrollProgress >= 0.75 && scrollProgress < 0.95);
    loginForm.classList.toggle('show', scrollProgress >= 1);
});

// ===== JWT 토큰 디코딩 =====
function parseJwt(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        ));
    } catch (error) {
        console.error('토큰 파싱 오류:', error);
        return null;
    }
}

// ===== 버튼 로딩 상태 공통 처리 =====
function setButtonLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? '처리중...' : button.dataset.originalText;
}

// ===== 모달 공통 열기/닫기 =====
function openModal(modalId) {
    document.querySelector('#' + modalId).style.display = 'flex';
}

function closeModal(modalId, ...inputIds) {
    document.querySelector('#' + modalId).style.display = 'none';
    inputIds.forEach(id => {
        const el = document.querySelector('#' + id);
        if (el) el.value = '';
    });
}

// ===== 로그인 처리 =====
async function handleLogin(event) {
    event.preventDefault();

    const loginId = document.querySelector('#loginId').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (!loginId || !password) {
    	Swal.fire({
    		...swalConfig,
            icon: 'warning',
            title: '입력 오류',
            text: '아이디와 비밀번호를 모두 입력하세요'
        });
        return;
    }

    try {
        const { data } = await axios.post('/rest/login', { loginId, password });
        const token = data.token;

        if (!token) {
        	Swal.fire({
        		...swalConfig,
                icon: 'error',
                title: '로그인 실패',
                text: '아이디 또는 비밀번호를 확인하세요.'
            });
            return;
        }

        const payload = parseJwt(token);
        if (!payload?.roles?.includes('SHIPPER')) {
        	Swal.fire({
        		...swalConfig,
                icon: 'error',
                title: '권한 없음',
                text: '화주 전용 로그인 페이지입니다. 권한이 없습니다.'
            });
            return;
        }

        localStorage.setItem('accessToken', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        location.href = '/';

    } catch (error) {
        Swal.fire({
        	...swalConfig,
            icon: 'error',
            title: '로그인 오류',
            text: error.response?.status === 401
                ? '아이디 또는 비밀번호가 일치하지 않습니다.'
                : '서버 오류가 발생했습니다.'
        });
    }
}

// ===== 비밀번호 보기/숨기기 =====
function togglePassword() {
    const passwordInput = document.querySelector('#password');
    const icon = document.querySelector('.input-icon');
    const isPassword = passwordInput.type === 'password';

    passwordInput.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('fa-eye-slash', !isPassword);
    icon.classList.toggle('fa-eye', isPassword);
}

// ===== 아이디 찾기 =====
async function idFind() {
    const email = document.querySelector('#findIdEmail').value.trim();
    const button = document.querySelector('#findIdModal .btn-confirm');

    if (!email) {
    	Swal.fire({
    		...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '이메일을 입력해주세요'
        });
        return;
    }

    button.dataset.originalText = button.textContent;
    setButtonLoading(button, true);

    try {
        const { data } = await axios.post('/member/sendIdEmail/' + email);
        if (data === 'Y') {
            Swal.fire({
            	...swalConfig,
                icon: 'success',
                title: '전송 완료',
                text: '입력하신 이메일로 아이디를 발송했습니다.'
            });
            closeModal('findIdModal', 'findIdEmail');
        } else {
            Swal.fire({
            	...swalConfig,
                icon: 'info',
                title: '아이디 없음',
                text: '입력하신 이메일로 등록된 아이디가 없습니다.'
            });
        }

    } catch (error) {
    	console.error('에러 발생:', error);
        Swal.fire({
        	...swalConfig,
            icon: 'error',
            title: '오류 발생',
            text: '서버 오류가 발생했습니다.'
        });
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== 비밀번호 찾기 =====
async function findPw() {
    const userId = document.querySelector('#findPwUserId').value.trim();
    const email = document.querySelector('#findPwEmail').value.trim();
    const button = document.querySelector('#findPwModal .btn-confirm');

    if (!userId || !email) {
    	Swal.fire({
    		...swalConfig,
            icon: 'warning',
            title: '입력 오류',
            text: '아이디와 이메일을 모두 입력하세요'
        });
        return;
    }

    button.dataset.originalText = button.textContent;
    setButtonLoading(button, true);

    try {
        const { data } = await axios.post('/member/sendPwEmail/' + userId + '/' + email);
        if (data === 'Y') {
            Swal.fire({
            	...swalConfig,
                icon: 'success',
                title: '전송 완료',
                text: '입력하신 이메일로 비밀번호를 발송했습니다.'
            });
            closeModal('findPwModal', 'findPwUserId', 'findPwEmail');
        } else {
            Swal.fire({
            	...swalConfig,
                icon: 'error',
                title: '전송 실패',
                text: '비밀번호 전송이 실패했습니다.'
            });
        }

    } catch (error) {
        console.error('에러 발생:', error);
        Swal.fire({
        	...swalConfig,
            icon: 'error',
            title: '오류 발생',
            text: '서버 오류가 발생했습니다.'
        });
    } finally {
        setButtonLoading(button, false);
    }
}

// ===== DOMContentLoaded 이벤트 등록 =====
document.addEventListener('DOMContentLoaded', () => {
    // 로그인 폼
    document.querySelector('form[action="/member/login"]')
        ?.addEventListener('submit', handleLogin);

    // 비밀번호 토글
    document.querySelector('.input-icon')
        ?.addEventListener('click', togglePassword);

    // 아이디/비밀번호 찾기 링크
    document.querySelector('#findIdLink')
        ?.addEventListener('click', e => { e.preventDefault(); openModal('findIdModal'); });

    document.querySelector('#findPwLink')
        ?.addEventListener('click', e => { e.preventDefault(); openModal('findPwModal'); });

    // 모달 닫기 버튼
    document.querySelector('#findIdModal .modal-close-btn')
        ?.addEventListener('click', () => closeModal('findIdModal', 'findIdEmail'));

    document.querySelector('#findPwModal .modal-close-btn')
        ?.addEventListener('click', () => closeModal('findPwModal', 'findPwUserId', 'findPwEmail'));

    // 모달 확인 버튼
    document.querySelector('#findIdModal .btn-confirm')
        ?.addEventListener('click', idFind);

    document.querySelector('#findPwModal .btn-confirm')
        ?.addEventListener('click', findPw);
});
</script>
</body>
</html>