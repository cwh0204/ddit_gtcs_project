<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<style>
/* 회원 상세 정보 전용 스타일 */
.content-area {
	background-color: #f8f9fa;
	padding: 20px;
}

.dashboard-grid {
	display: grid;
	grid-template-columns: 340px 1fr;
	gap: 25px;
	width: 100%;
}

.card-box {
	background: #ffffff;
	border-radius: 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	border: 1px solid #e9ecef;
	padding: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
}

/* 좌측 프로필 카드 */
.profile-card {
	text-align: center;
	padding: 45px 25px;
	position: relative;
}

.profile-avatar {
	width: 110px;
	height: 110px;
	margin: 0 auto 20px;
	border-radius: 50%;
	background: linear-gradient(135deg, #0a1929 0%, #1a5490 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 45px;
	color: #ffffff;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* .profile-name { */
/* 	font-size: 24px; */
/* 	font-weight: 700; */
/* 	color: #212529; */
/* 	margin-bottom: 6p */
/* 	letter-spacing: -0.02em; */
/* } */
.profile-role {
	font-size: 15px;
	color: #6c757d;
	margin-bottom: 18px;
	font-weight: 500;
}

.status-badge {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 7px 18px;
	background-color: #d1fae5;
	color: #065f46;
	font-size: 13px;
	font-weight: 600;
	border-radius: 20px;
	margin-bottom: 35px;
	border: 1px solid #a7f3d0;
}

.status-badge.inactive {
	background-color: #fee2e2;
	color: #991b1b;
	border-color: #fecaca;
}

.profile-contact-list {
	text-align: left;
	margin-top: 25px;
	padding-top: 25px;
	border-top: 1px solid #e9ecef;
	flex-grow: 1;
}

.contact-item {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
	font-size: 14px;
	color: #495057;
	padding: 10px 0;
	border-bottom: 1px solid #f8f9fa;
}

.contact-item:last-child {
	border-bottom: none;
}

.contact-item i {
	width: 36px;
	text-align: center;
	margin-right: 12px;
	color: #6c757d;
	font-size: 15px;
}

.contact-item span {
	font-weight: 500;
}

.btn-action-primary {
	width: 100%;
	padding: 14px;
	background-color: #212529;
	color: #ffffff;
	border: none;
	border-radius: 10px;
	font-weight: 600;
	font-size: 15px;
	cursor: pointer;
	margin-top: auto;
	transition: all 0.2s ease;
}

.btn-action-primary:hover {
	background-color: #343a40;
	transform: translateY(-1px);
}

/* 우측 상세 정보 카드 */
.detail-container {
	min-height: 700px;
	display: flex;
	flex-direction: column;
}

.tabs-nav {
	display: flex;
	border-bottom: 1px solid #e9ecef;
	padding: 0 25px;
	background: #f8f9fa;
	border-radius: 12px 12px 0 0;
}

.tab-link {
	padding: 20px 25px;
	font-size: 15px;
	font-weight: 600;
	color: #6c757d;
	cursor: pointer;
	border-bottom: 3px solid transparent;
	transition: all 0.2s ease;
	position: relative;
}

.tab-link:hover {
	color: #495057;
}

.tab-link.active {
	color: #212529;
	border-bottom-color: #212529;
	background: #ffffff;
}

.tab-content {
	padding: 40px;
	display: none;
}

.tab-content.active {
	display: block;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25px;
	padding-bottom: 12px;
	border-bottom: 2px solid #f1f3f5;
}

.section-title {
	font-size: 19px;
	font-weight: 700;
	color: #212529;
	letter-spacing: -0.02em;
}

.info-grid-row {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 30px;
}

.info-group {
	display: flex;
	flex-direction: column;
	margin-bottom: 25px;
}

.info-label {
	font-size: 13px;
	color: #6c757d;
	margin-bottom: 10px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	display: flex;
	align-items: center;
	gap: 8px;
}

.info-label i {
	color: #adb5bd;
	font-size: 13px;
}

.info-value {
	font-size: 17px;
	color: #212529;
	font-weight: 500;
	padding: 10px 0;
	border-bottom: 1px solid #f1f3f5;
	min-height: 24px;
}

.info-value:empty::before {
	content: '-';
	color: #ced4da;
}

@media ( max-width : 1024px) {
	.dashboard-grid {
		grid-template-columns: 1fr;
	}
}

/* 수정 모드 스타일 */
.info-group .edit-input, .contact-item .edit-input, .profile-role .edit-input
	{
	width: 100%;
	padding: 10px 12px;
	border: 1px solid #ced4da;
	border-radius: 10px;
	font-size: 15px;
	font-weight: 500;
	color: #212529;
	transition: border-color 0.2s;
	box-sizing: border-box;
}

.edit-input:focus {
	outline: none;
	border-color: #667eea;
	box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-group {
	display: flex;
	gap: 10px;
	margin-top: auto;
}

.btn-action-secondary {
	flex: 1;
	padding: 14px;
	background-color: #6c757d;
	color: #ffffff;
	border: none;
	border-radius: 10px;
	font-weight: 600;
	font-size: 15px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-action-secondary:hover {
	background-color: #5a6268;
}

.btn-group button {
	flex: 1;
}

/* 회원탈퇴 버튼 */
.btn-action-danger {
	width: 100%;
	padding: 14px;
	background-color: #dc3545;
	color: #ffffff;
	border: none;
	border-radius: 10px;
	font-weight: 600;
	font-size: 15px;
	cursor: pointer;
	margin-top: 10px;
	transition: all 0.2s ease;
}

.btn-action-danger:hover {
	background-color: #c82333;
	transform: translateY(-1px);
}

/* 모달 스타일 */
.modal {
	display: none;
	position: fixed;
	z-index: 1000;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	animation: fadeIn 0.3s;
}

@
keyframes fadeIn {from { opacity:0;
	
}

to {
	opacity: 1;
}

}
.modal-contents {
	background-color: #ffffff;
	margin: 15% auto;
	border-radius: 12px;
	width: 90%;
	max-width: 500px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	animation: slideDown 0.3s;
}

@
keyframes slideDown {from { transform:translateY(-50px);
	opacity: 0;
}

to {
	transform: translateY(0);
	opacity: 1;
}

}
.modal-header {
	padding: 25px 30px;
	border-bottom: 1px solid #e9ecef;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-header h2 {
	margin: 0;
	font-size: 22px;
	color: #dc3545;
	display: flex;
	align-items: center;
	gap: 10px;
}

.close {
	color: #adb5bd;
	font-size: 28px;
	font-weight: bold;
	cursor: pointer;
	transition: color 0.2s;
}

.close:hover {
	color: #495057;
}

.modal-body {
	padding: 30px;
}

.warning-text {
	background-color: #fff3cd;
	color: #856404;
	padding: 15px;
	border-radius: 8px;
	margin-bottom: 25px;
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 14px;
	border: 1px solid #ffeaa7;
}

.form-group {
	margin-bottom: 20px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: 600;
	color: #495057;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.modal-input {
	width: 100%;
	padding: 12px 15px;
	border: 1px solid #ced4da;
	border-radius: 8px;
	font-size: 15px;
	transition: border-color 0.2s;
	box-sizing: border-box;
}

.modal-input:focus {
	outline: none;
	border-color: #dc3545;
	box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.modal-footer {
	padding: 20px 30px;
	border-top: 1px solid #e9ecef;
	display: flex;
	justify-content: center;
	gap: 10px;
}

.btn-modal-cancel {
	padding: 12px 94px;
	background-color: #6c757d;
	color: #ffffff;
	border: none;
	border-radius: 8px;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-modal-cancel:hover {
	background-color: #5a6268;
}

.btn-modal-danger {
	padding: 12px 94px;
	background-color: #dc3545;
	color: #ffffff;
	border: none;
	border-radius: 8px;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-modal-danger:hover {
	background-color: #c82333;
}
</style>

<div class="dashboard-grid">
	<div class="card-box profile-card">
		<div class="profile-avatar" id="profileImgArea">
			<i class="fa-solid fa-user"></i>
		</div>

		<p class="profile-role">
			<span class="display-mode" id="memName">이름</span> <input type="text"
				class="edit-input edit-mode" id="memNameInput"
				style="display: none;" /> / <span class="display-mode"
				id="companyName">회사명</span> <input type="text"
				class="edit-input edit-mode" id="companyNameInput"
				style="display: none;" />
		</p>
		<div class="status-badge" id="statusBadge">
			<i class="fa-solid fa-circle-check"></i> <span id="memRole">권한</span>
		</div>

		<div class="profile-contact-list">
			<div class="contact-item">
				<i class="fa-regular fa-envelope"></i> <span class="display-mode"
					id="email">이메일</span> <input type="email"
					class="edit-input edit-mode" id="emailInput" style="display: none;" />
			</div>
			<div class="contact-item">
				<i class="fa-solid fa-phone"></i> <span class="display-mode"
					id="hpNo">휴대폰번호</span> <input type="text"
					class="edit-input edit-mode" id="hpNoInput" style="display: none;" />
			</div>
			<div class="contact-item">
				<i class="fa-regular fa-clock"></i> <span id="modDate">최근정보수정일시</span>
				<!-- 수정일시는 input 없음 (수정 불가) -->
			</div>
		</div>

		<div id="btnArea" style="margin-top: auto;">
			<!-- 기본 수정 버튼 -->
			<button class="btn-action-primary" id="editBtn">
				<i class="fa-solid fa-gear" style="margin-right: 8px"></i> 정보 수정
			</button>

			<!-- 수정 모드 버튼 그룹 -->
			<div class="btn-group" id="editBtnGroup" style="display: none;">
				<button class="btn-action-secondary" id="cancelBtn">취소</button>
				<button class="btn-action-primary" id="saveBtn">저장</button>
			</div>

			<button class="btn-action-danger" id="withdrawBtn">
				<i class="fa-solid fa-user-xmark" style="margin-right: 8px"></i>회원
				탈퇴
			</button>
		</div>

		<!-- 회원탈퇴 모달 -->
		<div id="withdrawModal" class="modal" style="display: none;">
			<div class="modal-contents">
				<div class="modal-header">
					<h2>
						<i class="fa-solid fa-triangle-exclamation"></i> 회원 탈퇴
					</h2>
					<span class="close" id="closeModal">&times;</span>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label for="withdrawLoginId">아이디</label> <input type="text"
							id="withdrawLoginId" class="modal-input" readonly
							style="width: 100%; height: 100%; padding: 12px 15px; border: 1px solid #ced4da; border-radius: 8px; font-size: 15px; box-sizing: border-box;">
					</div>
					<div class="form-group">
						<label for="withdrawPassword">비밀번호</label> <input type="password"
							id="withdrawPassword" class="modal-input"
							placeholder="비밀번호를 입력하세요">
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn-modal-cancel" id="cancelWithdraw">취소</button>
					<button class="btn-modal-danger" id="confirmWithdraw">확인</button>
				</div>
			</div>
		</div>


	</div>

	<div class="card-box detail-container">
		<div class="tabs-nav">
			<div class="tab-link active" onclick="openTab('general', event)">
				기본 정보</div>
			<div class="tab-link" onclick="openTab('business', event)">사업자
				정보</div>
		</div>

		<div id="general" class="tab-content active">
			<div class="section-header">
				<span class="section-title">개인 정보</span>
			</div>
			<div class="info-grid-row">
				<div class="info-group">
					<span class="info-label"> <i class="fa-solid fa-id-badge"></i>
						로그인 아이디
					</span> <span class="info-value" id="loginId"></span>
				</div>
<!-- 				<div class="info-group"> -->
<!-- 					<span class="info-label"> <i class="fa-solid fa-key"></i> -->
<!-- 						비밀번호 -->
<!-- 					</span> <span class="info-value">••••••••</span> -->
<!-- 				</div> -->
				<div class="info-group">
    <span class="info-label"> <i class="fa-solid fa-key"></i> 비밀번호 </span>
    <span class="info-value display-mode">••••••••</span>
    <div class="edit-mode" style="display:none; position:relative;">
        <input type="password" class="edit-input" id="newPasswordInput"
            placeholder="••••••••" style="padding-right: 40px;" />
        <i class="fa-regular fa-eye" id="togglePwdIcon"
            onclick="togglePwdVisibility()"
            style="position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; color:#aaa; font-size:15px;"></i>
    </div>
</div>
			</div>
			<div class="section-header" style="margin-top: 20px">
				<span class="section-title">주소 정보</span>
			</div>
			<div class="info-grid-row">
				<div class="info-group">
					<span class="info-label"> <i class="fa-solid fa-map-pin"></i>
						우편번호
					</span> <span class="info-value display-mode" id="zipCode"></span> <input
						type="text" class="edit-input edit-mode" id="zipCodeInput"
						style="display: none;" />
				</div>
			</div>
			<div class="info-group">
				<span class="info-label"> <i class="fa-regular fa-map"></i>
					기본 주소
				</span> <span class="info-value display-mode" id="address"></span> <input
					type="text" class="edit-input edit-mode" id="addressInput"
					style="display: none;" />
			</div>
			<div class="info-group">
				<span class="info-label"> <i
					class="fa-solid fa-location-arrow"></i> 상세 주소
				</span> <span class="info-value display-mode" id="addressDetail"></span> <input
					type="text" class="edit-input edit-mode" id="addressDetailInput"
					style="display: none;" />
			</div>

			<div class="section-header" style="margin-top: 40px">
				<span class="section-title">계정 정보</span>
			</div>
			<div class="info-grid-row">
				<div class="info-group">
					<span class="info-label"> <i
						class="fa-solid fa-calendar-plus"></i> 회원가입일시
					</span> <span class="info-value" id="regDate"></span>
				</div>
				<div class="info-group">
					<span class="info-label"> <i class="fa-solid fa-user-slash"></i>
						회원 탈퇴 여부
					</span> <span class="info-value" id="delYn"></span>
				</div>
			</div>
		</div>

		<div id="business" class="tab-content">
			<div class="section-header">
				<span class="section-title">사업자 기본 정보</span>
			</div>
			<div class="info-grid-row">
				<div class="info-group">
					<span class="info-label"> <i class="fa-solid fa-briefcase"></i>
						기업 대표자명
					</span> <span class="info-value display-mode" id="repName"></span> <input
						type="text" class="edit-input edit-mode" id="repNameInput"
						style="display: none;" />
				</div>
				<div class="info-group">
					<span class="info-label"> <i class="fa-solid fa-phone"></i>
						기업전화번호
					</span> <span class="info-value display-mode" id="repTelNo"></span> <input
						type="text" class="edit-input edit-mode" id="repTelNoInput"
						style="display: none;" />
				</div>
			</div>


			<div class="section-header" style="margin-top: 40px">
				<span class="section-title">사업자 등록 정보</span>
			</div>
			<div class="info-grid-row">
				<div class="info-group">
					<span class="info-label"> <i class="fa-solid fa-passport"></i>
						통관고유부호
					</span> <span class="info-value" id="customsIdNo"></span>
				</div>
				<div class="info-group">
					<span class="info-label"> <i
						class="fa-solid fa-file-invoice"></i> 사업자등록번호
					</span> <span class="info-value" id="bizRegNo"></span>
				</div>
			</div>

			<div class="section-header" style="margin-top: 40px">
				<span class="section-title">비상 연락처</span>
			</div>
			<div class="info-group">
				<span class="info-label"> <i class="fa-solid fa-phone-volume"></i>
					비상 연락망
				</span> <span class="info-value display-mode" id="emergencyContact"></span>
				<input type="text" class="edit-input edit-mode"
					id="emergencyContactInput" style="display: none;" />
			</div>
		</div>
	</div>
</div>

<script>
const swalConfig = {
		scrollbarPadding: false, 
	    heightAuto: false,
	    width: '400px',
	    padding: '1.5rem',
	    confirmButtonColor: '#0f4c81'
	};
	
let originUserData = {}; 

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // ===== JWT 토큰 확인 및 axios 헤더 설정 =====
    const token = localStorage.getItem('accessToken');
    if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        console.log('✅ axios 헤더 설정 완료');
    } else {
    	console.error('❌ 토큰이 없습니다!');
        Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '로그인 필요',
            text: '로그인이 필요합니다.'
        }).then(() => {
            location.href = '/member/auth/session/login';
        });
        return;
    }
    
    loadMemberData();
    
    // 취소 버튼
    document.querySelector('#cancelBtn').onclick = function() {
        toggleEditMode(false);
    };
    
    // 저장 버튼
    document.querySelector('#saveBtn').onclick = saveMemberData;
    
    // 회원탈퇴 버튼
    document.querySelector('#withdrawBtn').onclick = function() {
        openWithdrawModal();
    };
    
    // 모달 닫기 버튼
    document.querySelector('#closeModal').onclick = function() {
        closeWithdrawModal();
    };
    
    // 모달 취소 버튼
    document.querySelector('#cancelWithdraw').onclick = function() {
        closeWithdrawModal();
    };
    
    // 모달 탈퇴 확인 버튼
    document.querySelector('#confirmWithdraw').onclick = function() {
        handleWithdraw();
    };
}); 

// 회원탈퇴 모달 열기
function openWithdrawModal() {
    document.querySelector('#withdrawModal').style.display = 'block';
    document.querySelector('#withdrawLoginId').value = originUserData.loginId;
    document.querySelector('#withdrawPassword').value = '';
    document.querySelector('#withdrawPassword').focus();
}

// 회원탈퇴 모달 닫기
function closeWithdrawModal() {
    document.querySelector('#withdrawModal').style.display = 'none';
}

// 회원탈퇴 처리
function handleWithdraw() {
    const loginId = document.querySelector('#withdrawLoginId').value.trim();
    const password = document.querySelector('#withdrawPassword').value.trim();
    
    if (!password) {
    	Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '비밀번호를 입력해주세요.'
        });
        return;
    }
    
    axios.post('/member/deleteMem', {
        loginId: loginId,
        password: password
    })
    .then(res => {
        if (res.data === 'Y') {
            Swal.fire({
                ...swalConfig,
                icon: 'success',
                title: '탈퇴 완료',
                text: '회원 탈퇴가 완료되었습니다.'
            }).then(() => {
                localStorage.removeItem('accessToken');
                location.href = '/member/auth/session/login';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '비밀번호 불일치',
                text: '비밀번호가 일치하지 않습니다.'
            });
        }
    })
    .catch(err => {
        console.error('회원탈퇴 에러:', err);
        if (err.response?.status === 401) {
            Swal.fire({
                ...swalConfig,
                icon: 'warning',
                title: '인증 만료',
                text: '인증이 만료되었습니다. 다시 로그인해주세요.'
            }).then(() => {
                localStorage.removeItem('accessToken');
                location.href = '/member/auth/session/login';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '오류 발생',
                text: '회원탈퇴 처리 중 오류가 발생했습니다.'
            });
        }
    });
}

// 회원 정보 불러오기
function loadMemberData() {
	const token = localStorage.getItem('accessToken');
	
	if (!token) {
		Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '로그인 필요',
            text: '로그인 정보가 없습니다.'
        }).then(() => {
            location.href = "/member/auth/session/login";
        });
        return;
    }
	
	const base64Url = token.split('.')[1]; // "."으로 나눈 뒤 index 1번
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    // 3. JSON으로 변환하여 memId를 꺼냅니다.
    const payload = JSON.parse(jsonPayload);
    const memIdFromToken = payload.realUser.memId; // 181이 추출됨

    console.log("추출된 memId:", memIdFromToken);
    
	axios.get('/member/selectMem',{
		params: {
	        memId: memIdFromToken
	    }
	})
        .then(function(response) {
            const user = response.data;
            console.log('✅ 서버 응답:', user);
            
            if(!user || !user.loginId) {
                console.warn("회원 정보가 없습니다.");
                Swal.fire({
                    ...swalConfig,
                    icon: 'error',
                    title: '정보 없음',
                    text: '회원 정보를 불러올 수 없습니다.'
                });
                return;
            }
            
            originUserData = user;
            
            document.querySelector('#memName').textContent = user.memName || '-';
            document.querySelector('#companyName').textContent = user.companyName || '-';
            document.querySelector('#memRole').textContent = user.memRole || 'SHIPPER';
            document.querySelector('#email').textContent = user.email || '-';
            document.querySelector('#hpNo').textContent = user.hpNo || '-';
            document.querySelector('#modDate').textContent = user.modDate ? "최근 수정: " + user.modDate : "수정 이력 없음";
            
            document.querySelector('#loginId').textContent = user.loginId || '';
            document.querySelector('#zipCode').textContent = user.zipCode || '';
            document.querySelector('#address').textContent = user.address || '';
            document.querySelector('#addressDetail').textContent = user.addressDetail || '';
            document.querySelector('#regDate').textContent = user.regDate || '';
            document.querySelector('#delYn').textContent = user.delYn === 'Y' ? '탈퇴' : '정상';
            document.querySelector('#repName').textContent = user.repName || '';
            document.querySelector('#repTelNo').textContent = user.repTelNo || '';
            document.querySelector('#customsIdNo').textContent = user.customsIdNo || '';
            document.querySelector('#bizRegNo').textContent = user.bizRegNo || '';
            document.querySelector('#emergencyContact').textContent = user.emergencyContact || '-';
            
            document.querySelector('#editBtn').onclick = function() {
                toggleEditMode(true);
            };
        })
        .catch(function(error) {
            console.error('❌ 데이터 로드 실패:', error);
            if (error.response?.status === 401) {
                Swal.fire({
                    ...swalConfig,
                    icon: 'warning',
                    title: '로그인 만료',
                    text: '로그인이 만료되었습니다. 다시 로그인해주세요.'
                }).then(() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    location.href = '/member/auth/session/login';
                });
            } else {
                Swal.fire({
                    ...swalConfig,
                    icon: 'error',
                    title: '오류 발생',
                    text: '회원 정보를 불러오는 중 오류가 발생했습니다.'
                });
            }
        });
    }

// 탭 전환
function openTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(el => el.classList.remove('active'));
    document.querySelector('#' + tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 수정 모드 전환
function toggleEditMode(isEdit) {
    if (isEdit) {
        document.querySelectorAll('.display-mode').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'block');
        document.querySelector('#editBtn').style.display = 'none';
        document.querySelector('#editBtnGroup').style.display = 'flex';
        
        document.querySelector('#memNameInput').value = originUserData.memName || '';
        document.querySelector('#companyNameInput').value = originUserData.companyName || '';
        document.querySelector('#emailInput').value = originUserData.email || '';
        document.querySelector('#hpNoInput').value = originUserData.hpNo || '';
        document.querySelector('#zipCodeInput').value = originUserData.zipCode || '';
        document.querySelector('#addressInput').value = originUserData.address || '';
        document.querySelector('#addressDetailInput').value = originUserData.addressDetail || '';
        document.querySelector('#repNameInput').value = originUserData.repName || '';
        document.querySelector('#repTelNoInput').value = originUserData.repTelNo || '';
        document.querySelector('#emergencyContactInput').value = originUserData.emergencyContact || '';
    } else {
        document.querySelectorAll('.display-mode').forEach(el => el.style.display = '');
        document.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'none');
        document.querySelector('#editBtn').style.display = 'block';
        document.querySelector('#editBtnGroup').style.display = 'none';
    }
}

// 저장
function saveMemberData() {
	
	const token = localStorage.getItem('accessToken');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    const memIdFromToken = payload.realUser.memId;
    
    const data = {
    	memId: memIdFromToken,
        memName: document.querySelector('#memNameInput').value.trim(),
        companyName: document.querySelector('#companyNameInput').value.trim(),
        email: document.querySelector('#emailInput').value.trim(),
        hpNo: document.querySelector('#hpNoInput').value.trim(),
        zipCode: document.querySelector('#zipCodeInput').value.trim(),
        address: document.querySelector('#addressInput').value.trim(),
        addressDetail: document.querySelector('#addressDetailInput').value.trim(),
        repName: document.querySelector('#repNameInput').value.trim(),
        repTelNo: document.querySelector('#repTelNoInput').value.trim(),
        emergencyContact: document.querySelector('#emergencyContactInput').value.trim(),
        password: document.querySelector('#newPasswordInput').value.trim() || null
    };
    
    if (!data.memName || !data.email || !data.hpNo) {
    	Swal.fire({
            ...swalConfig,
            icon: 'warning',
            title: '입력 필요',
            text: '필수 항목을 입력해주세요.'
        });
        return;
    }
    
    axios.post('/member/updateMem', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        console.log('✅ 서버 응답 데이터:', response.data);
        
        // 🌟 서버가 보내준 응답 객체(Map)에서 newToken을 꺼내 저장합니다.
        // 백엔드에서 response.put("newToken", newToken) 이라고 보냈기 때문에 response.data.newToken으로 접근합니다.
        if (response.data && response.data.newToken) {
            localStorage.setItem('accessToken', response.data.newToken);
            console.log('⚡ 새 토큰 주머니에 저장 완료! (헤더가 감지하고 바뀔 겁니다)');
        }

        handleSaveSuccess(data);
    })
    .catch(function(error) {
        console.error('❌ 저장 에러:', error);
        if (error.response?.status === 401) {
            Swal.fire({
                ...swalConfig,
                icon: 'warning',
                title: '로그인 만료',
                text: '로그인이 만료되었습니다. 다시 로그인해주세요.'
            }).then(() => {
                localStorage.removeItem('accessToken');
                location.href = '/member/auth/session/login';
            });
        } else {
            Swal.fire({
                ...swalConfig,
                icon: 'error',
                title: '오류 발생',
                text: '회원 정보 수정 중 오류가 발생했습니다.'
            });
        }
    });
}

// 저장 성공 처리
function handleSaveSuccess(data) {
	Swal.fire({
        ...swalConfig,
        icon: 'success',
        title: '수정 완료',
        text: '수정되었습니다.'
    });
    
    originUserData.memName = data.memName;
    originUserData.companyName = data.companyName;
    originUserData.email = data.email;
    originUserData.hpNo = data.hpNo;
    originUserData.zipCode = data.zipCode;
    originUserData.address = data.address;
    originUserData.addressDetail = data.addressDetail;
    originUserData.repName = data.repName;
    originUserData.repTelNo = data.repTelNo;
    originUserData.emergencyContact = data.emergencyContact;
    
    // localStorage의 userInfo도 업데이트
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    userInfo.memName = data.memName;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    updateDisplayData();
    toggleEditMode(false);
}

// 화면 데이터 업데이트
function updateDisplayData() {
    document.querySelector('#memName').textContent = originUserData.memName || '-';
    document.querySelector('#companyName').textContent = originUserData.companyName || '-';
    document.querySelector('#email').textContent = originUserData.email || '-';
    document.querySelector('#hpNo').textContent = originUserData.hpNo || '-';
    document.querySelector('#zipCode').textContent = originUserData.zipCode || '';
    document.querySelector('#address').textContent = originUserData.address || '';
    document.querySelector('#addressDetail').textContent = originUserData.addressDetail || '';
    document.querySelector('#repName').textContent = originUserData.repName || '';
    document.querySelector('#repTelNo').textContent = originUserData.repTelNo || '';
    document.querySelector('#emergencyContact').textContent = originUserData.emergencyContact || '-';
}

// 비밀번호 눈 모양
function togglePwdVisibility() {
    const input = document.querySelector('#newPasswordInput');
    const icon  = document.querySelector('#togglePwdIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
</script>