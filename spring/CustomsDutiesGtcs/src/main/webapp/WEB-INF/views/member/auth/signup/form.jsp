<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%> <%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>국가관세종합정보망 서비스 (UNI-PASS) - 회원가입</title>

    <!-- Font Awesome 아이콘 라이브러리 -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />

    <!-- 다음(카카오) 우편번호 API -->
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

    <!-- axios 라이브러리 추가 -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
      /* ========== 기본 설정 ========== */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* ========== 전체 페이지 배경 ========== */
      body {
        font-family:
          "Malgun Gothic",
          -apple-system,
          BlinkMacSystemFont,
          sans-serif;
        background-color: #f5f5f5; /* 연한 회색 배경 */
        padding: 30px 20px;
        min-height: 100vh;
      }

      /* ========== 메인 컨테이너 ========== */
      .container {
        max-width: 900px; /* 최대 너비 900px */
        margin: 0 auto; /* 중앙 정렬 */
        background-color: white;
        padding: 40px;
        border-radius: 12px; /* 둥근 모서리 */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* 그림자 효과 */
        animation: slideUp 0.5s ease-out; /* 등장 애니메이션 */
      }

      /* ========== 헤더 영역 수정 ========== */
      .header {
        display: flex; /* 플렉스 박스 사용 */
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 40px;
      }

      .header-icon {
        display: block;
        margin: 0 auto 12px auto;
        font-size: 40px;
        color: #0f4c81;
      }

      /* ========== 헤더 제목 ========== */
      .header h1 {
        color: #2c3e50; /* 진한 회색 */
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin-bottom: 6px;
      }

      /* ========== 헤더 부제목 ========== */
      .header p {
        color: #7f8c8d; /* 중간 회색 */
        font-size: 13px;
        font-weight: 400;
      }

      /* ========== 가로 정렬 컨테이너 (기본정보/사업자정보) ========== */
      .form-container {
        display: flex; /* 플렉스박스로 좌우 배치 */
        gap: 35px; /* 두 섹션 사이 간격 */
        margin-bottom: 30px;
      }

      /* ========== 왼쪽/오른쪽 섹션 ========== */
      .left-section,
      .right-section {
        flex: 1; /* 동일한 너비 */
      }

      /* ========== 섹션 타이틀 (기본정보, 사업자정보) ========== */
      .section-title {
        font-size: 18px;
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 10px;
        padding-left: 10px;
        border-left: 3px solid #0f4c81; /* 왼쪽 파란색 라인 */
        font-weight: 600;
        display: flex;
        align-items: center;
      }

      .section-title i {
        margin-right: 8px;
        color: #3498db; /* 아이콘 파란색 */
      }

      /* ========== 폼 그룹 (각 입력 필드 묶음) ========== */
      .form-group {
        margin-bottom: 18px;
      }

      /* ========== 라벨 스타일 ========== */
      .form-group label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: #2c3e50;
        font-weight: 600;
        font-size: 13px;
      }

      /* ========== 라벨 아이콘 ========== */
      .form-group label i {
        margin-right: 6px;
        color: #3498db;
        font-size: 14px;
        width: 16px;
      }

      /* ========== 필수 입력 표시(*) ========== */
      .required {
        color: #e74c3c;
        margin-left: 3px;
      }

      /* ========== 입력 필드 기본 스타일 ========== */
      .form-group input {
        width: 100%;
        padding: 11px 14px;
        border: 1px solid #ddd; /* 연한 회색 테두리 */
        border-radius: 6px;
        font-size: 13px;
        transition: all 0.2s; /* 부드러운 전환 효과 */
        background-color: #fafafa;
      }

      /* ========== 입력 필드 포커스 상태 ========== */
      .form-group input:focus {
        outline: none;
        border-color: #3498db; /* 파란색 테두리 */
        background-color: white;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
      }

      /* ========== placeholder 텍스트 스타일 ========== */
      .form-group input::placeholder {
        color: #aaa; /* 연한 회색 */
      }

      /* ========== 가로 배치 (대표전화/비상연락망) ========== */
      .form-row {
        display: flex;
        gap: 12px;
      }

      .form-row .form-group {
        flex: 1; /* 동일한 너비 */
        margin-bottom: 18px;
      }

      /* 스피너 */
      .loader {
        display: none;
        color: #3498db;
        font-size: 45px;
        text-indent: -9999em;
        overflow: hidden;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        position: relative;
        transform: translateZ(0);
        animation:
          mltShdSpin 1.7s infinite ease,
          round 1.7s infinite ease;
        margin: 0 auto;
      }

      .modal-overlay .loader {
        display: block;
      }

      @keyframes mltShdSpin {
        0% {
          box-shadow:
            0 -0.83em 0 -0.4em,
            0 -0.83em 0 -0.42em,
            0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em,
            0 -0.83em 0 -0.477em;
        }
        5%,
        95% {
          box-shadow:
            0 -0.83em 0 -0.4em,
            0 -0.83em 0 -0.42em,
            0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em,
            0 -0.83em 0 -0.477em;
        }
        10%,
        59% {
          box-shadow:
            0 -0.83em 0 -0.4em,
            -0.087em -0.825em 0 -0.42em,
            -0.173em -0.812em 0 -0.44em,
            -0.256em -0.789em 0 -0.46em,
            -0.297em -0.775em 0 -0.477em;
        }
        20% {
          box-shadow:
            0 -0.83em 0 -0.4em,
            -0.338em -0.758em 0 -0.42em,
            -0.555em -0.617em 0 -0.44em,
            -0.671em -0.488em 0 -0.46em,
            -0.749em -0.34em 0 -0.477em;
        }
        38% {
          box-shadow:
            0 -0.83em 0 -0.4em,
            -0.377em -0.74em 0 -0.42em,
            -0.645em -0.522em 0 -0.44em,
            -0.775em -0.297em 0 -0.46em,
            -0.82em -0.09em 0 -0.477em;
        }
        100% {
          box-shadow:
            0 -0.83em 0 -0.4em,
            0 -0.83em 0 -0.42em,
            0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em,
            0 -0.83em 0 -0.477em;
        }
      }

      @keyframes round {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* ========== 인증하기 버튼 ========== */
      .btn-verify {
        padding: 11px 18px;
        background-color: #0f4c81;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap; /* 텍스트 줄바꿈 방지 */
      }

      /* 인증하기 버튼 호버 효과 */
      .btn-verify:hover {
        background-color: #0a365c;
      }

      /* ========== 상태 메시지 (중복확인, 비밀번호 검증) ========== */
      #idCheckStatus,
      #passwordCheckStatus,
      #passwordValidStatus {
        display: block;
        margin-top: 6px;
        font-size: 12px;
        font-weight: 600;
        padding-left: 3px;
      }

      .success {
        color: #27ae60;
      }

      .error {
        color: #e74c3c;
      }

      /* ========== 비밀번호 필드 상태별 테두리 색상 ========== */
      /* 에러 상태 - 빨간색 테두리 */
      #passwordConfirm.error,
      #password.error {
        border-color: #e74c3c;
      }

      /* 성공 상태 - 초록색 테두리 */
      #passwordConfirm.success,
      #password.success {
        border-color: #27ae60;
      }

      /* ========== 주소 입력 그룹 ========== */
      .address-group {
        display: flex;
        flex-direction: column; /* 세로 배치 */
        gap: 8px;
      }

      /* ========== 주소검색 버튼 ========== */
      .btn-address {
        padding: 11px 18px;
        background-color: #d68910; /* 주황색 배경 */
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      /* 주소검색 버튼 호버 효과 */
      .btn-address:hover {
        background-color: #d35400; /* 진한 주황색 */
      }

      .btn-address i {
        margin-right: 5px;
      }

      /* ========== 버튼 그룹 컨테이너 (취소/완료) ========== */
      .button-group {
        display: flex;
        gap: 12px;
        margin-top: 30px;
      }

      /* ========== 취소 버튼 ========== */
      .btn-cancel {
        flex: 1;
        padding: 14px;
        background-color: #95a5a6; /* 회색 배경 */
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(149, 165, 166, 0.3);
      }

      /* 취소 버튼 호버 효과 */
      .btn-cancel:hover {
        background-color: #7f8c8d; /* 진한 회색 */
        transform: translateY(-1px); /* 위로 살짝 이동 */
        box-shadow: 0 4px 12px rgba(149, 165, 166, 0.4);
      }

      .btn-cancel:active {
        transform: translateY(0); /* 클릭 시 원위치 */
      }

      .btn-cancel i {
        margin-right: 6px;
      }

      /* ========== 완료(회원가입) 버튼 ========== */
      .btn-submit {
        flex: 1;
        padding: 14px;
        background-color: #0f4c81; /* 파란색 배경 */
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
      }

      /* 완료 버튼 호버 효과 */
      .btn-submit:hover {
        background-color: #0a365c; /* 진한 파란색 */
        transform: translateY(-1px); /* 위로 살짝 이동 */
        box-shadow: 0 4px 12px rgba(15, 76, 129, 0.4);
      }

      .btn-submit:active {
        transform: translateY(0); /* 클릭 시 원위치 */
      }

      .btn-submit i {
        margin-right: 6px;
      }

      /* ========== 모달 레이아웃 ========== */
      .modal-overlay {
        display: none; /* 기본적으로 숨김 */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
        justify-content: center;
        align-items: center;
        z-index: 1000; /* 최상단에 위치 */
      }

      /* 띄웠을 때 클래스 */
      .modal-overlay.active {
        display: flex;
      }

      /* 기존 성공 컨테이너 스타일 그대로 사용 */
      .successContainer {
        text-align: center;
        background: white;
        padding: 50px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        animation: fadeIn 0.4s ease;
        max-width: 400px;
        width: 90%;
      }

      .checkmark {
        font-size: 80px;
        color: #3498db;
        display: inline-block;
        margin-top: -10px;
        margin-bottom: 15px;
        animation: checkPop 0.8s ease; /* 애니메이션 추가 */
      }

      .btn-confirm {
        margin-top: 25px;
        padding: 12px 30px;
        font-size: 18px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
      }

      .btn-confirm:hover {
        background-color: #2980b9;
        transform: scale(1.05);
      }

      .btn-confirm:active {
        transform: scale(0.98);
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 체크 아이콘 애니메이션 */
      @keyframes checkPop {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.3) rotate(5deg);
          opacity: 1;
        }
        70% {
          transform: scale(0.9) rotate(-5deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      
  .btn-autofill {
  display: block;
  margin: 0 0 20px auto;
  padding: 5px 12px;
  background-color: #bdc3c7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-autofill:hover {
  background-color: #a0a8ae;
}
    </style>
  </head>

  <body>
    <!-- 메인 컨테이너 -->
    <div class="container">
      <!-- 헤더 영역 -->
      <div class="header">
        <a href="/">
          <span class="header-icon">
            <i class="fas fa-globe"></i>
          </span>
        </a>
        <h1>G-TCS 회원가입</h1>
      </div>
      
      <button type="button" class="btn-autofill" onclick="autoFill()">자동완성</button>

      <!-- 회원가입 폼 -->
      <form id="registerForm">
        <!-- 가로 정렬 컨테이너 -->
        <div class="form-container">
          <!-- 왼쪽 섹션: 기본 정보 -->
          <div class="left-section">
            <div class="form-section">
              <h2 class="section-title">기본 정보</h2>

              <!-- 아이디 입력 필드 -->
              <div class="form-group">
                <label> 아이디<span class="required">*</span> </label>
                <div style="display: flex; gap: 8px; align-items: flex-start">
                  <input
                    type="text"
                    name="loginId"
                    id="loginId"
                    required
                    style="flex: 1"
                    placeholder="영문, 숫자 조합 6자 이상"
                  />
                  <button
                    type="button"
                    class="btn-verify"
                    id="checkIdBtn"
                    onclick="checkId()"
                  >
                    중복확인
                  </button>
                </div>
                <span id="idCheckStatus"></span>
              </div>

              <!-- 비밀번호 입력 필드 -->
              <div class="form-group">
                <label> 비밀번호<span class="required">*</span> </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                />
                <span id="passwordValidStatus"></span>
                <span
                  id="passwordEmptyStatus"
                  class="error"
                  style="display: none"
                  >비밀번호를 입력해주세요.</span
                >
              </div>

              <!-- 비밀번호 재확인 필드 -->
              <div class="form-group">
                <label> 비밀번호 재확인<span class="required">*</span> </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  required
                />
                <span id="passwordCheckStatus"></span>
                <span
                  id="passwordConfirmEmptyStatus"
                  class="error"
                  style="display: none"
                  >비밀번호 재확인을 입력해주세요.</span
                >
              </div>

              <!-- 이름 입력 필드 -->
              <div class="form-group">
                <label> 이름 </label>
                <input type="text" name="memName" id="memName" required />
                <span
                  id="memNameEmptyStatus"
                  class="error"
                  style="display: none"
                  >이름을 입력해주세요.</span
                >
              </div>

              <!-- 이메일 입력 필드 -->
              <div class="form-group">
                <label> 이메일 <span class="loader"></span></label>
                <div style="display: flex; gap: 8px; align-items: flex-start">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    style="flex: 1"
                  />
                  <button
                    type="button"
                    class="btn-verify"
                    id="sendCodeBtn"
                    onclick="sendVerificationCode()"
                  >
                    전송
                  </button>
                </div>
                <span id="emailCheckStatus"></span>
              </div>

              <!-- 인증코드 입력 필드 -->
              <div class="form-group">
                <label> 인증코드 </label>
                <div style="display: flex; gap: 8px; align-items: flex-start">
                  <input
                    type="text"
                    name="verificationCode"
                    id="verificationCode"
                    style="flex: 1"
                    placeholder="인증코드 6자리 입력"
                    maxlength="6"
                  />
                  <button
                    type="button"
                    class="btn-verify"
                    id="verifyCodeBtn"
                    onclick="verifyCode()"
                  >
                    인증하기
                  </button>
                </div>
                <span id="verificationStatus"></span>
              </div>

              <!-- 통관고유부호 입력 필드 -->
              <div class="form-group">
                <label> 통관고유부호 </label>
                <input
                  type="text"
                  name="customsIdNo"
                  id="customsIdNo"
                  placeholder="예: P123456789012"
                  maxlength="13"
                />
                <span
                  id="customsIdNoEmptyStatus"
                  class="error"
                  style="display: none"
                  >통관고유부호를 입력해주세요.</span
                >
              </div>
            </div>
          </div>

          <!-- 오른쪽 섹션: 사업자 정보 -->
          <div class="right-section">
            <div class="form-section">
              <h2 class="section-title">사업자 정보</h2>

              <!-- 사업자등록번호 입력 필드 -->
              <div class="form-group">
                <label> 사업자등록번호 </label>
                <input type="text" name="bizRegNo" id="bizRegNo" />
                <span id="bizNoEmptyStatus" class="error" style="display: none"
                  >사업자등록번호를 입력해주세요.</span
                >
              </div>

              <!-- 회사명 입력 필드 -->
              <div class="form-group">
                <label> 회사명 </label>
                <input type="text" name="companyName" id="companyName" />
                <span
                  id="companyNameEmptyStatus"
                  class="error"
                  style="display: none"
                  >회사명을 입력해주세요.</span
                >
              </div>

              <!-- 사업자 대표자명 입력 필드 -->
              <div class="form-group">
                <label> 사업자 대표자명 </label>
                <input type="text" name="repName" id="repName" />
                <span
                  id="repNameEmptyStatus"
                  class="error"
                  style="display: none"
                  >사업자 대표자명을 입력해주세요.</span
                >
              </div>

              <!-- 사업장 주소 입력 필드 -->
              <div class="form-group">
                <label> 사업장 주소 </label>
                <div class="address-group">
                  <!-- 우편번호 + 주소검색 버튼 -->
                  <div style="display: flex; gap: 8px">
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      placeholder="우편번호"
                      readonly
                      style="flex: 1"
                    />
                    <button
                      type="button"
                      class="btn-address"
                      onclick="execDaumPostcode()"
                    >
                      <i class="fas fa-search"></i> 주소검색
                    </button>
                  </div>

                  <!-- 기본 주소 -->
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="기본 주소"
                    readonly
                  />

                  <!-- 상세 주소 -->
                  <input
                    type="text"
                    name="addressDetail"
                    id="addressDetail"
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>
                <span
                  id="addressEmptyStatus"
                  class="error"
                  style="display: none"
                  >사업장 주소를 입력해주세요.</span
                >
              </div>

              <!-- 기업 전화번호 입력 필드 -->
              <div class="form-group">
                <label> 기업 전화번호 </label>
                <input
                  type="tel"
                  name="repTelNo"
                  id="repTelNo"
                  placeholder="02-0000-0000"
                />
                <span
                  id="repTelNoEmptyStatus"
                  class="error"
                  style="display: none"
                  >기업 전화번호를 입력해주세요.</span
                >
              </div>

              <!-- 전화번호 입력 필드 (가로 배치) -->
              <div class="form-row">
                <!-- 대표 전화번호 -->
                <div class="form-group">
                  <label> 대표 전화번호 </label>
                  <input
                    type="tel"
                    name="hpNo"
                    id="hpNo"
                    required
                    placeholder="010-0000-0000"
                  />
                  <span id="hpNoEmptyStatus" class="error" style="display: none"
                    >대표 전화번호를 입력해주세요.</span
                  >
                </div>

                <!-- 비상연락망 -->
                <div class="form-group">
                  <label> 비상연락망 </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    id="emergencyContact"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 그룹 (취소/완료) -->
        <div class="button-group">
          <!-- 취소 버튼 -->
          <button
            type="button"
            class="btn-cancel"
            onclick="location.href = '/member/auth/session/login'"
          >
            <i class="fas fa-times-circle"></i> 취소
          </button>

          <!-- 완료 버튼 -->
          <button type="button" class="btn-submit" onclick="register()">
            <i class="fas fa-check-circle"></i> 완료
          </button>
        </div>
      </form>
      <div id="successModal" class="modal-overlay">
        <div class="successContainer">
          <div class="checkmark">✔</div>
          <h2>가입이 완료되었습니다!</h2>
          <p>로그인 후 서비스를 이용하실 수 있습니다.</p>
          <button type="button" class="btn-confirm" onclick="goToLogin()">
            확인
          </button>
        </div>
      </div>

      <!-- 스피너 모달 -->
      <div id="loadingModal" class="modal-overlay">
        <div class="successContainer">
          <div class="loader"></div>
          <h2 style="margin-top: 30px">인증번호 발송 중...</h2>
          <p>잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>

    <script>
    const swalConfig = {
    	    width: '400px',
    	    padding: '1.5rem',
    	    confirmButtonColor: '#0f4c81'
    	};
    
      // 아이디 중복 확인
      let IdCheck = false;

      function checkId() {
        const loginId = document.querySelector("#loginId").value.trim(); // trim: 양끝에 있는 공백 제거
        const statusElement = document.querySelector("#idCheckStatus");
        // ^: 시작, $: 끝, (?=.*[a-zA-Z]): 영문자 필수 체크, (?=.*[0-9]): 숫자 필수 체크, [a-zA-Z0-9]{6,}: 허용 범위와 길이
        //          const idRegExp =

        // 아이디 유효성 검사
        if (!loginId || loginId.length < 6) {
          statusElement.textContent = "아이디를 6자 이상 입력해주세요";
          statusElement.className = "error";
          document.querySelector("#loginId").focus();
          return;
        }

        axios
          .post("/member/idCheck/" + loginId)
          .then((res) => {
            if (res.data === "N") {
              statusElement.textContent = "✓ 사용 가능한 아이디입니다.";
              statusElement.className = "success";
              IdCheck = true;
            } else {
              statusElement.textContent = "이미 사용 중인 아이디입니다.";
              statusElement.className = "error";
              IdCheck = false;
            }
          })
          .catch((error) => {
            console.log("중복 확인 에러:", error);
            statusElement.textContent = "서버 오류 발생";
            statusElement.className = "error";
          });
      }

      // 아이디 입력창의 값이 바뀌면 중복 확인 재검사
      document.querySelector("#loginId").addEventListener("input", function () {
        IdCheck = false;
        const statusElement = document.querySelector("#idCheckStatus");
        statusElement.textContent = ""; // 메시지 초기화
      });

      document.addEventListener("DOMContentLoaded", function () {
        // 비밀번호 입력 시 유효성 검사 실행
        const password = document.querySelector("#password");
        password.addEventListener("input", checkPasswordValid);

        // 비밀번호/비밀번호 재확인 입력 시 일치 여부 확인
        const passwordConfirm = document.querySelector("#passwordConfirm");
        password.addEventListener("input", checkPasswordMatch);
        passwordConfirm.addEventListener("input", checkPasswordMatch);
      });

      // 영문, 숫자, 특수문자 포함 8자 이상인지 확인
      function checkPasswordValid() {
        const password = document.querySelector("#password").value;
        const passwordInput = document.querySelector("#password");
        const statusElement = document.querySelector("#passwordValidStatus");

        // 비밀번호 패턴: 영문 + 숫자 + 특수문자 포함, 8자 이상
        const passwordPattern =
          /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        // 패턴 검사
        if (passwordPattern.test(password)) {
          // 유효한 비밀번호
          statusElement.textContent = "✓ 사용 가능한 비밀번호입니다.";
          statusElement.className = "success"; // 성공 스타일 (초록색)
          passwordInput.style.borderColor = "#27ae60"; // 초록색 테두리
        } else {
          // 유효하지 않은 비밀번호
          statusElement.textContent = "8자 이상, 영문/숫자/특수문자를 포함";
          statusElement.className = "error"; // 에러 스타일 (빨간색)
          passwordInput.style.borderColor = "#e74c3c"; // 빨간색 테두리
        }
      }

      // ========== 비밀번호 일치 확인 함수 ==========
      function checkPasswordMatch() {
        const password = document.querySelector("#password").value;
        const passwordConfirm =
          document.querySelector("#passwordConfirm").value;
        const passwordConfirmInput = document.querySelector("#passwordConfirm");
        const statusElement = document.querySelector("#passwordCheckStatus");

        // 비밀번호 일치 여부 확인
        if (password === passwordConfirm) {
          // 일치함
          statusElement.textContent = "✓ 비밀번호가 일치합니다.";
          statusElement.className = "success";
          passwordConfirmInput.classList.remove("error");
          passwordConfirmInput.classList.add("success");
        } else {
          // 불일치
          statusElement.textContent = "비밀번호가 일치하지 않습니다.";
          statusElement.className = "error";
          passwordConfirmInput.classList.remove("success");
          passwordConfirmInput.classList.add("error");
        }
      }

      // ========== 우편번호 검색 함수 (다음 카카오 API 사용) ==========
      function execDaumPostcode() {
        new daum.Postcode({
          oncomplete: function (data) {
            // 우편번호 입력
            document.querySelector("#zipCode").value = data.zonecode;

            var addr = "";

            // 사용자가 선택한 주소 타입에 따라 기본 주소 설정
            if (data.userSelectedType === "R") {
              // 도로명 주소
              addr = data.roadAddress;
            } else {
              // 지번 주소
              addr = data.jibunAddress;
            }

            // 기본 주소 입력
            document.querySelector("#address").value = addr;
            // 상세 주소 입력 필드로 포커스 이동
            document.querySelector("#addressDetail").focus();
          },
        }).open();
      }

      // ========== 이메일 인증 함수 ==========
      let EmailAuthCode = false;

      // 임시로 인증번호 숨겨놓을 변수
      let eCode = "";

      // 1. 이메일 인증번호 발송
      async function sendVerificationCode() {
        const email = document.querySelector("#email").value.trim();
        const emailStatus = document.querySelector("#emailCheckStatus");

        if (!email) {
          Swal.fire("이메일을 입력해주세요.");
          return;
        }

        try {
          const checkRes = await axios.get("/member/emailCheck/" + email);

          if (checkRes.data === "Y") {
            emailStatus.textContent = "이미 사용 중인 이메일입니다.";
            emailStatus.className = "error";
            EmailAuthCode = false;
            return;
          }

          emailStatus.textContent = "";

          // 스피너 작업 시작
          document.querySelector("#loadingModal").classList.add("active");
          const res = await axios.get(`/member/verifyCode/\${email}`);
          // 작업 끝
          // document.querySelector("loadingModal").style.display="none";

          // 인증코드를 받아서 숨겨놓아야 함, 쪼금 사기, 제대로 하려면 발생 시킨 코드를 백엔드에서 저장해서 비교
          eCode = res.data;
          console.log("인증번호 확인:", eCode); // 백엔드 돌려받은 값 습관적으로 확인, 6자리 코드가 찍힘

          document.querySelector("#loadingModal").classList.remove("active");

          if (eCode) {
            Swal.fire("인증번호가 발송되었습니다.");
          } else {
            Swal.fire("메일 발송에 실패했습니다.");
          }
        } catch (error) {
          console.error("발송 에러:", error);
        }
      }

      // 2. 인증번호 확인
      async function verifyCode() {
        const code = document.querySelector("#verificationCode").value.trim();
        const statusElement = document.querySelector("#verificationStatus");

        if (!code) {
          Swal.fire("인증코드를 입력해주세요.");
          return;
        }

        if (code === eCode) {
          statusElement.textContent = "✓ 인증에 성공했습니다!";
          statusElement.className = "success";
          EmailAuthCode = true;
        } else {
          statusElement.textContent = "인증번호가 일치하지 않습니다.";
          statusElement.className = "error";
          EmailAuthCode = false;
        }
      }

      // 회원가입
      function register() {
        hideAllErrors();

        // 1. 아이디 중복 확인
        if (IdCheck === false) {
        	Swal.fire({
                ...swalConfig,
                icon: 'warning',
                title: '중복 확인',
                text: '아이디 중복 확인을 해주세요.'
            });
          return;
        }

        // 2. 이메일 중복 확인
        if (EmailAuthCode === false) {
        	Swal.fire({
                ...swalConfig,
                icon: 'warning',
                title: '인증 필요',
                text: '이메일 인증을 완료해주세요.'
            });
          return;
        }

        // 3. 비밀번호 확인
        if (!document.querySelector("#password").value.trim()) {
          showError("passwordEmptyStatus");
          document.querySelector("#password").focus();
          return;
        }

        // 4. 비밀번호 재확인
        if (!document.querySelector("#passwordConfirm").value.trim()) {
          showError("passwordConfirmEmptyStatus");
          document.querySelector("#passwordConfirm").focus();
          return;
        }

        // 5. 이름 확인
        if (!document.querySelector("#memName").value.trim()) {
          showError("memNameEmptyStatus");
          document.querySelector("#memName").focus();
          return;
        }

        // 6. 통관고유부호 확인
        if (!document.querySelector("#customsIdNo").value.trim()) {
          showError("customsIdNoEmptyStatus");
          document.querySelector("#customsIdNo").focus();
          return;
        }

        // 7. 사업자등록번호 확인
        if (!document.querySelector("#bizRegNo").value.trim()) {
          showError("bizNoEmptyStatus");
          document.querySelector("#bizRegNo").focus();
          return;
        }

        // 8. 회사명 확인
        if (!document.querySelector("#companyName").value.trim()) {
          showError("companyNameEmptyStatus");
          document.querySelector("#companyName").focus();
          return;
        }

        // 9. 사업자 대표자명 확인
        if (!document.querySelector("#repName").value.trim()) {
          showError("repNameEmptyStatus");
          document.querySelector("#repName").focus();
          return;
        }

        // 10. 사업장 주소 확인
        if (!document.querySelector("#address").value.trim()) {
          showError("addressEmptyStatus");
          document.querySelector("#address").focus();
          return;
        }

        // 11. 기업 전화번호 확인
        if (!document.querySelector("#repTelNo").value.trim()) {
          showError("repTelNoEmptyStatus");
          document.querySelector("#repTelNo").focus();
          return;
        }

        // 12. 대표 전화번호 확인
        if (!document.querySelector("#hpNo").value.trim()) {
          showError("hpNoEmptyStatus");
          document.querySelector("#hpNo").focus();
          return;
        }

        // 폼태그를 통째로 넣어서 코드 간단화
        const form = document.querySelector("#registerForm");
        const formData = new FormData(form);
        const memberData = Object.fromEntries(formData.entries()); // 자바 객체로 한번에 변환

        console.log("데이터 확인", memberData);

        //          memberData.regNo = memberData.residentNumber1 + "-" + memberData.residentNumber2;

        axios
        .post("/member/register", memberData)
        .then((res) => {
            if (res.data === "Y") {
                showSuccessModal();
            } else {
                Swal.fire({
                    ...swalConfig,
                    icon: 'error',
                    title: '회원가입 실패',
                    text: '회원가입에 실패했습니다.'
                });
            }
        })
        .catch((error) => {
            console.error("회원가입 에러:", error);
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '서버 오류',
                text: '서버 통신 오류가 발생했습니다.'
            });
        });
}

      // 에러 메시지 표시
      function showError(errorId) {
        document.querySelector("#" + errorId).style.display = "block";
      }

      // 모든 에러 메시지 숨기기
      function hideAllErrors() {
        const errorIds = [
          "passwordEmptyStatus",
          "passwordConfirmEmptyStatus",
          "memNameEmptyStatus",
          "customsIdNoEmptyStatus",
          "bizNoEmptyStatus",
          "companyNameEmptyStatus",
          "repNameEmptyStatus",
          "addressEmptyStatus",
          "repTelNoEmptyStatus",
          "hpNoEmptyStatus",
        ];
        errorIds.forEach((id) => {
          const element = document.querySelector("#" + id);
          if (element) {
            element.style.display = "none";
          }
        });
      }

      function showSuccessModal() {
        document.querySelector("#successModal").classList.add("active");
      }

      function goToLogin() {
        window.location.href = "/member/auth/session/login";
      }
      
      // 자동입력
      function autoFill() {
    	  document.querySelector("#loginId").value = "csc5090";
    	  document.querySelector("#customsIdNo").value = "P123456789015";
    	  document.querySelector("#bizRegNo").value = "740-13-12345";
    	  document.querySelector("#repName").value = "최상철";
    	  document.querySelector("#repTelNo").value = "02-1234-5678";
    	  document.querySelector("#hpNo").value = "010-5566-5090";
    	  document.querySelector("#emergencyContact").value = "043-255-5090";
    	  
    	  IdCheck = true;
    	  EmailAuthCode = true;
    	}
    </script>
  </body>
</html>
