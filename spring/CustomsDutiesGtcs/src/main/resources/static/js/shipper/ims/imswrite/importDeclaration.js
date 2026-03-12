/* ========================================================================
   수입신고서 작성 페이지 JavaScript
   라이브러리: Axios, SweetAlert2
   ======================================================================== */

// "데이터가 없을 때만" 기본값으로 설정 (JSP 데이터 보호)
if (!window.USER_CONTEXT) {
    window.USER_CONTEXT = { memId: 0, memRole: 'GUEST' };
}


/**
 * 서버에 "나 누구야?" 하고 물어보는 함수
 */
async function fetchUserInfo() {
    console.log("🔍 전역 사용자 정보 확인 중...");
    
    // header.jsp에서 만들어준 window.USER_CONTEXT가 있는지 확인
    if (window.USER_CONTEXT && window.USER_CONTEXT.memId != 0) {
        console.log("✅ 사용자 인증됨:", window.USER_CONTEXT.memName);
        
        // 바로 자동완성 실행
        if (typeof autoFillImporterInfo === 'function') {
            autoFillImporterInfo(); 
        }
    } else {
        console.warn("로그인 정보가 없습니다 (Guest).");
        // 비로그인 상태 처리 (필요하다면)
    }
}

/* ========================================================================
   [Part 0] 내비게이션 (탭 전환)
   ======================================================================== */
function openTab(evt, sectionId) {
    var i, tabcontent, tablinks;
    
    // 1. 모든 섹션 숨기기
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    // 2. 모든 버튼 비활성화
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 3. 선택한 섹션만 표시
    var target = document.getElementById(sectionId);
    if (target) {
        target.style.display = "block";
        target.classList.add("active");
    }
    
    // 4. 클릭한 버튼 활성화
    if (evt && evt.currentTarget) {
        evt.currentTarget.className += " active";
    }
    
    console.log('📑 탭 전환: ' + sectionId);
}

/* ========================================================================
   [추가] 필수 입력값 중앙 검증 로직 (Swal 적용 및 사이드바 밀림 방지)
   ======================================================================== */
function validateImportData(data) {
	const missingFields = [];

	// 1. 텍스트 및 선택 필드 검증 대상 (수입신고서 필수값)
	const requiredFields = {
		'importerName': '수입자 상호',
		'repName': '대표자 성명',
		'bizRegNo': '사업자등록번호',
		'customsId': '통관고유부호',
		'blNo': 'B/L 번호',
		'currencyCode': '통화코드',
		'payAmount': '결제금액',
		'hsCode': 'HS Code',
		'itemNameDeclared': '수입물품명',
		'qty': '수량',
		'unitPrice': '단가'
	};

	// 필드 값 체크
	for (const [key, label] of Object.entries(requiredFields)) {
		if (!data[key] || data[key].toString().trim() === "" || data[key] === "0") {
			missingFields.push(label);
		}
	}

	// 2. 필수 첨부파일 체크
	const essentialFiles = {
		'fileInvoice': '인보이스 (Invoice)',
		'filePackingList': '패킹리스트 (Packing List)',
		'fileBL': '선하증권 (B/L)'
	};

	for (const [id, label] of Object.entries(essentialFiles)) {
		const fileInput = document.getElementById(id);
		if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
			missingFields.push(label);
		}
	}

	// 3. 누락 항목이 있다면 스윗알러트 호출
	if (missingFields.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: '필수 항목 누락',
            html: `다음 필수 항목을 입력하거나 첨부해주세요:<br><br>
                   <div style="text-align: left; display: inline-block; color: #dc3545; font-weight: bold;">
                     - ${missingFields.join("<br>- ")}
                   </div>`,
            confirmButtonColor: '#0f4c81',
            confirmButtonText: '확인',
            scrollbarPadding: false, // 사이드바 덜컹거림 방지
            heightAuto: false        // 화면 밀림 방지
        }).then(() => {
            focusFirstMissingField(missingFields[0]);
        });
		return false;
	}
	return true;
}

// 누락된 필드가 있는 탭으로 자동 이동해주는 헬퍼 함수
function focusFirstMissingField(label) {
	const elements = document.querySelectorAll('th, label');
	for (let el of elements) {
		if (el.textContent.includes(label)) {
			const tabPane = el.closest('.tab-content');
			if (tabPane) {
				const sectionId = tabPane.id;
				const tabButtons = document.querySelectorAll('.tab-header .tab-btn, .tab-btn');
				const indexMap = { 'section1': 0, 'section2': 1, 'section3': 2, 'section4': 3 };
				if (tabButtons[indexMap[sectionId]]) {
					tabButtons[indexMap[sectionId]].click();
				}
			}
			break;
		}
	}
}

/* ========================================================================
   [Part 1] 데이터 수집
   ======================================================================== */

/**
 * 모든 섹션 데이터 수집
 */
function collectAllData() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 데이터 수집 시작');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    var formData = {};
    
    // 1. Section1 (공통사항) - 19개 필드
    console.log('📋 Section1 데이터 수집...');
    
    // 이메일 통합
    var emailId = getElementValue('txtTaxpayerEmailId');
    var emailDomain = getElementValue('txtTaxpayerEmailDomain');
    if (emailId && emailDomain) {
        formData.email = emailId + '@' + emailDomain;
    }
    
    // Section1 필드
    var section1Fields = [
        'importerName', 'repName', 'telNo', 'bizRegNo', 'customsId', 'address',
        'overseasBizName', 'overseasCountry', 'importType', 'cargoMgmtNo',
        'vesselName', 'vesselNation', 'arrivalEstDate', 'bondedInDate',
        'originCountry', 'arrivalPort', 'blNo', 'awbNo'
    ];
    
    section1Fields.forEach(function(fieldName) {
        var value = getFieldValue(fieldName);
        if (value !== null) {
            formData[fieldName] = value;
        }
    });
    
    // transMode (라디오)
    var transMode = document.querySelector('input[name="transMode"]:checked');
    if (transMode) {
        formData.transMode = transMode.value;
    }
    
    console.log('  ✓ Section1: ' + section1Fields.length + '개 필드');
    
    // 2. Section2 (결제/세액) - 23개 필드
    console.log('💰 Section2 데이터 수집...');
    
    var section2Fields = [
        'writeDate', 'currencyCode', 'payAmount', 'invoiceNo', 'invoiceDate',
        'contractNo', 'contractDate', 'poNo', 'poDate', 'incoterms',
        'totalWeight', 'originCertYn', 'freightCurrency', 'freightAmt',
        'insuranceCurrency', 'insuranceAmt', 'addAmtCurrency', 'addAmt',
        'totalTaxBase', 'totalDuty', 'totalVat', 'totalTaxSum'
    ];
    
    section2Fields.forEach(function(fieldName) {
        var value = getFieldValue(fieldName);
        if (value !== null) {
            // 숫자 필드는 콤마 제거
            if (['payAmount', 'totalWeight', 'freightAmt', 'insuranceAmt', 
                 'addAmt', 'totalTaxBase', 'totalDuty', 'totalVat', 'totalTaxSum'].includes(fieldName)) {
                value = value.replace(/,/g, '');
            }
            formData[fieldName] = value;
        }
    });
    
    // 컨테이너 번호 수집
    if (typeof ContainerManager !== 'undefined' && ContainerManager.getData) {
        var containers = ContainerManager.getData();
        if (containers && containers.length > 0) {
            formData.contNo = containers[0].containerNo; // 첫 번째 컨테이너 번호
            console.log('  ✓ 컨테이너: ' + containers.length + '개 (첫번째: ' + formData.contNo + ')');
        }
    } else {
        // 대체 방법: name="containerNumbers" 직접 수집
        var containerInputs = document.querySelectorAll('input[name="containerNumbers"]');
        if (containerInputs.length > 0 && containerInputs[0].value.trim()) {
            formData.contNo = containerInputs[0].value.trim();
            console.log('  ✓ 컨테이너 (직접수집): ' + formData.contNo);
        }
    }
    
    console.log('  ✓ Section2: ' + section2Fields.length + '개 필드');
    
    // 3. Section3 (물품정보) - 14개 필드
    console.log('📦 Section3 데이터 수집...');
    
    var section3Fields = [
        'hsCode', 'taxType', 'itemNameDeclared', 'itemNameTrade',
        'modelName', 'qty', 'qtyUnit', 'unitPrice', 'totalAmount',
        'netWeight', 'taxBaseAmtItem', 'originCode', 'originMarkYn'
    ];
    
    section3Fields.forEach(function(fieldName) {
        var value = getFieldValue(fieldName);
        if (value !== null) {
            // 숫자 필드는 콤마 제거
            if (['qty', 'unitPrice', 'totalAmount', 'netWeight', 'taxBaseAmtItem'].includes(fieldName)) {
                value = value.replace(/,/g, '');
            }
            formData[fieldName] = value;
        }
    });
    
    // taxBaseType (라디오)
    var taxBaseType = document.querySelector('input[name="taxBaseType"]:checked');
    if (taxBaseType) {
        formData.taxBaseType = taxBaseType.value;
    }
    
    console.log('  ✓ Section3: ' + section3Fields.length + '개 필드');
    
    // 4. 시스템 필드
    formData.status = "심사대기";
    formData.memId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) ? window.USER_CONTEXT.memId : 0;
    
    console.log('✅ 데이터 수집 완료');
    console.log('총 필드 수: ' + Object.keys(formData).length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return formData;
}

/**
 * 필드 값 가져오기 (name 속성 기반)
 */
function getFieldValue(fieldName) {
    var element = document.querySelector('[name="' + fieldName + '"]');
    if (element) {
        return element.value.trim();
    }
    return null;
}

/**
 * 요소 값 가져오기 (ID 기반)
 */
function getElementValue(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        return element.value.trim();
    }
    return '';
}

/* ========================================================================
   [Part 2] 유효성 검사
   ======================================================================== */

/**
 * 전체 유효성 검사
 */
function validateAllSections() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✔️ 유효성 검사 시작');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    var isValid = true;
    
    // Section1 검사
    if (typeof validateSection1 === 'function') {
        console.log('  → Section1 검사...');
        if (!validateSection1()) {
            console.error('  ✗ Section1 검사 실패');
            isValid = false;
        } else {
            console.log('  ✓ Section1 검사 통과');
        }
    }
    
    // Section2 검사
    if (typeof validateSection2 === 'function') {
        console.log('  → Section2 검사...');
        if (!validateSection2()) {
            console.error('  ✗ Section2 검사 실패');
            isValid = false;
        } else {
            console.log('  ✓ Section2 검사 통과');
        }
    }
    
    // Section3 검사
    if (typeof validateSection3 === 'function') {
        console.log('  → Section3 검사...');
        if (!validateSection3()) {
            console.error('  ✗ Section3 검사 실패');
            isValid = false;
        } else {
            console.log('  ✓ Section3 검사 통과');
        }
    }
    
    if (isValid) {
        console.log('✅ 유효성 검사 통과');
    } else {
        console.error('❌ 유효성 검사 실패');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return isValid;
}

/* ========================================================================
   [Part 3] 파일 수집
   ======================================================================== */

/**
 * FormData에 파일 추가
 */
function appendFilesToFormData(formData) {
    console.log('📎 파일 추가 시작');
    
    var fileCount = 0;
    
    // 1. 필수 증빙 파일
    var essentialFiles = [
        { id: 'fileInvoice', paramName: 'invoiceFile' },
        { id: 'filePackingList', paramName: 'packinglistFile' },
        { id: 'fileBL', paramName: 'blFile' }
    ];
    
    essentialFiles.forEach(function(fileInfo) {
        var fileInput = document.getElementById(fileInfo.id);
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append(fileInfo.paramName, fileInput.files[0]);
            fileCount++;
            console.log('  ✓ ' + fileInfo.paramName + ': ' + fileInput.files[0].name);
        }
    });
    
    // 2. 기타 파일 (수정된 부분 - Swal 적용 완료)
    if (typeof FileManager !== 'undefined' && FileManager.getOtherFiles) {
        var otherFiles = FileManager.getOtherFiles();
        if (otherFiles && otherFiles.length > 0) {
            // 백엔드가 단일 MultipartFile(otherFile)만 받으므로 첫 번째 파일만 전송
            formData.append('otherFile', otherFiles[0]);
            fileCount++;
            console.log('  ✓ 기타 파일(otherFile): ' + otherFiles[0].name);
            
            // 만약 프론트에서 여러 개를 담았다면 경고 출력
            if (otherFiles.length > 1) {
                console.warn('⚠️ 백엔드 설정상 기타 파일은 1개만 전송됩니다.');
                
                // 💡 [수정됨] 스윗얼럿2 적용 및 사이드바 밀림 방지 처리
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'info',
                        title: '첨부파일 안내',
                        text: '기타 첨부파일은 1개만 전송 가능합니다. 첫 번째 파일만 적용되었습니다.',
                        confirmButtonColor: '#0f4c81',
                        confirmButtonText: '확인',
                        scrollbarPadding: false, // 사이드바 덜컹거림 방지
                        heightAuto: false        // 세로 화면 밀림 완벽 방지
                    });
                } else {
                    alert('기타 첨부파일은 1개만 전송 가능합니다. 첫 번째 파일만 적용되었습니다.');
                }
            }
        }
    }
    
    console.log('✅ 총 ' + fileCount + '개 파일 추가 완료');
    return fileCount;
}

/* ========================================================================
   [Part 4] DB 전송 (Axios) - 스피너 및 Swal 적용 완료
   ======================================================================== */
async function submitDeclaration() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 수입신고서 제출 시작 (JSON Blob 방식)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    var importData = collectAllData();

    if (!validateImportData(importData)) {
        return; 
    }
    
    const result = await Swal.fire({
        title: '수입신고서 제출',
        text: '수입신고서를 제출하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f4c81',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '제출',
        cancelButtonText: '취소',
        scrollbarPadding: false,
        heightAuto: false
    });

    if (!result.isConfirmed) return;
    
    // 로딩 스피너 시작
    toggleLoading(true);
    
    try {
        var formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(importData)], { 
            type: 'application/json' 
        }));
        
        var fileCount = appendFilesToFormData(formData);
		
        console.log('🌐 서버로 전송 중...');
        var response = await axios.post('/rest/import', formData);
        
        // ✅ 1. 서버로부터 응답을 받으면 즉시 로딩 스피너를 끕니다.
        toggleLoading(false);

        if ((response.data && response.data > 0) || response.status === 200) {
            // ✅ 2. 성공 알림창을 띄웁니다. (이때 스피너는 이미 꺼진 상태)
            Swal.fire({
                icon: 'success',
                title: '제출 성공',
                text: '수입신고서가 성공적으로 제출되었습니다!',
                confirmButtonColor: '#0f4c81',
                timer: 2000,
                timerProgressBar: true,
                scrollbarPadding: false,
                heightAuto: false
            }).then(() => {
                window.location.href = '/client/ims/status/list';
            });
        } else {
            throw new Error('서버 응답이 올바르지 않습니다.');
        }
        
    } catch (error) {
        // ✅ 에러 발생 시에도 스피너를 끕니다.
        toggleLoading(false);

        console.error('❌ 전송 실패:', error);
        
        let errorMsg = "전송 중 오류가 발생했습니다.";
        if (error.response && error.response.data) {
             errorMsg += "\n(" + (error.response.data.message || error.response.statusText) + ")";
        }
        
        Swal.fire({
            icon: 'error',
            title: '제출 실패',
            text: errorMsg,
            confirmButtonColor: '#dc3545',
            scrollbarPadding: true,
            heightAuto: false
        });
    }
}
/* ========================================================================
   [Part 5] 페이지 초기화 (화물진행현황 동적 연동 보강 - 핀포인트 매핑)
   ======================================================================== */

document.addEventListener('DOMContentLoaded', async function() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 수입신고서 페이지 로드');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    initLoadingSpinner();
    await fetchUserInfo();
    
    if (typeof axios !== 'undefined') {
        console.log('✓ Axios 라이브러리 로드 완료');
    } else {
        console.error('❌ Axios 라이브러리가 로드되지 않았습니다!');
    }
    
    var firstTab = document.querySelector('.tab-btn');
    if (firstTab) firstTab.click();
    
    var submitButton = document.querySelector('button[onclick*="submitDeclaration"]');
    if (submitButton) console.log('✓ 제출 버튼 발견');
    
    // ========================================================================
    // 세션스토리지 데이터 기반 폼 자동 세팅 (cargoDetail.jsp 완벽 호환)
    // ========================================================================
    const cargoDataString = sessionStorage.getItem('cargoDataForForm');
    
    if (cargoDataString) {
        console.log('📦 넘어온 화물 데이터 발견! 핀포인트 연동을 시작합니다.');
        try {
            const cargoData = JSON.parse(cargoDataString);
            console.log('🔍 화물 상세에서 넘어온 원본 데이터:', cargoData);

            // 1. 값 세팅 헬퍼 함수 (id와 name 모두 지원, 이벤트 강제 발생)
            const setFormValue = (targetNameOrId, dataValue) => {
                let el = document.getElementById(targetNameOrId) || document.querySelector(`[name="${targetNameOrId}"]`);
                if (!el || dataValue === null || dataValue === undefined || dataValue === '') return;

                el.value = dataValue;
                
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
                console.log(`✅ [연동 성공] ${targetNameOrId} <- '${dataValue}'`);
            };

            setTimeout(() => {
                console.log('⏳ 폼 렌더링 대기 완료, 1:1 데이터 주입 시작...');
                
				setFormValue('customsId', cargoData.customsId); 
				setFormValue('blNo', cargoData.uniqueNo || cargoData.blNo);
				setFormValue('repName', cargoData.repName); 
				setFormValue('itemNameDeclared', cargoData.itemName);
				setFormValue('itemNameTrade', cargoData.itemName);
				setFormValue('qty', cargoData.qty);
				setFormValue('totalWeight', cargoData.grossWeight);
				
				if (cargoData.contNo) {
				    setFormValue('txtContainerNo', cargoData.contNo);
				}
                
                sessionStorage.removeItem('cargoDataForForm');
                console.log('🎉 동적 데이터 연동 완료 및 세션스토리지 초기화');

            }, 300);

        } catch (error) {
            console.error('❌ 화물 데이터를 파싱/입력하는 중 오류 발생:', error);
        }
    } else {
        console.log('ℹ️ 세션 스토리지에 화물 데이터가 없습니다. (일반 접근)');
    }
    
    console.log('✅ 페이지 초기화 완료');
});

/* ========================================================================
   [Part 6] 유틸리티 함수 (Swal 초기화 적용)
   ======================================================================== */

/**
 * 폼 초기화
 */
async function resetForm() {
    const result = await Swal.fire({
        title: '작성 내용 초기화',
        text: '모든 입력 내용을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '초기화',
        cancelButtonText: '취소',
        scrollbarPadding: false,
        heightAuto: false
    });

    if (!result.isConfirmed) return;
    
    document.querySelectorAll('input:not([type="button"]):not([type="submit"]), select, textarea').forEach(function(element) {
        if (element.type === 'checkbox' || element.type === 'radio') {
            element.checked = false;
        } else if (element.type === 'file') {
            element.value = '';
        } else {
            element.value = '';
        }
    });
    
    ['nameInvoice', 'namePacking', 'nameBL'].forEach(function(id) {
        var span = document.getElementById(id);
        if (span) {
            span.textContent = '선택된 파일 없음';
            span.classList.remove('selected');
        }
    });
    
    Swal.fire({
        icon: 'success',
        title: '초기화 완료',
        text: '폼이 초기화되었습니다.',
        confirmButtonColor: '#0f4c81',
        scrollbarPadding: false,
        heightAuto: false
    });
}

/* ========================================================================
   [Part 7] 전역 함수 등록
   ======================================================================== */

// 전역에서 접근 가능하도록 window 객체에 등록
window.openTab = openTab;
window.submitDeclaration = submitDeclaration;
window.collectAllData = collectAllData;
window.validateAllSections = validateAllSections;
window.resetForm = resetForm;

console.log('✅ importBase.js 로드 완료');

/* ========================================================================
   [Part 8] UI 유틸리티 (로딩 스피너) - 동적 생성
   ======================================================================== */

/**
 * 로딩 스피너 HTML/CSS 초기화 (페이지 로드 시 1회 실행)
 */
function initLoadingSpinner() {
    // 1. 스타일이 이미 있는지 확인 후 없으면 추가
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.innerHTML = `
            #loadingOverlay {
                display: none;
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            .spinner {
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 50px; height: 50px;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            .loading-text {
                color: white;
                font-weight: bold;
                font-size: 16px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. 오버레이 요소가 없으면 body에 추가
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">처리 중입니다...</div>
        `;
        document.body.appendChild(overlay);
    }
}

/**
 * 로딩 화면 제어 함수
 */
function toggleLoading(isShow) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = isShow ? 'flex' : 'none';
    }
}

function autoFill() {
    console.log("🚀 자동 입력 프로세스 시작...");

    function setVal(nameOrId, value) {
        let el = document.querySelector(`[name="${nameOrId}"]`) || 
                 document.getElementById(nameOrId) ||
                 document.querySelector(`[name$="${nameOrId}"]`); 
        
        if (el) {
            if (el.type === 'radio') {
                const radio = document.querySelector(`input[name*="${nameOrId}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else if (el.tagName === 'SELECT') {
                el.value = value;
            } else {
                el.value = value;
            }
            
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ 입력 성공: ${nameOrId}`);
        } else {
            console.warn(`❌ 필드 없음: ${nameOrId}`);
        }
    }

    const testData = {
        'importNumber': 'IMP-2026-TEST-001',
        'overseasBizName': 'Global Export Ltd.',
        'overseasCountry': 'US',
        'importType': '21', 
        'cargoMgmtNo': '26ABC123456789',
        'transMode': '10', 
        'vesselName': 'Sunny Ho',
        'vesselNation': 'US',
        'arrivalEstDate': '2026-02-15',
        'bondedInDate': '2026-02-16',
        'originCountry': 'US',
        'arrivalPort': 'BUSAN',
        'writeDate': '2026-02-05',
        'currencyCode': 'USD',
        'payAmount': '10000',
        'invoiceNo': 'INV-001',
        'invoiceDate': '2026-02-01',
        'contractNo': 'CTR-001',
        'incoterms': 'CIF',
        'totalWeight': '1000',
        'originCertYn': 'Y',
        'freightAmt': '500',
        'insuranceAmt': '100',
        'totalTaxBase': '13000000',
        'totalDuty': '1040000',
        'totalVat': '1404000',
        'totalTaxSum': '2444000',
        'hsCode': '8471.30.0000',
        'qty': '10',
        'unitPrice': '1000',
        'totalAmount': '10000',
        'qtyUnit': 'EA',
        'freightCurrency': 'KRW',      
        'insuranceCurrency': 'KRW',    
        'addAmtCurrency': 'KRW',       
        'poNo': 'PO-2026-ABC-01',         
        'contractDate': '2026-02-01',     
        'poDate': '2026-02-05',           
        'invoiceNo': 'INV-2026-001',
        'originMarkYn': 'Y',              
        'netWeight': '450',             
        'totalWeight': '500',             
        'taxBaseAmtItem': '35000000',     
        'totalTaxBase': '35000000',       
        'taxType': 'A',                   
        'addAmt': '2000',              
        'originCode': 'US'               
    };

    Object.keys(testData).forEach(key => setVal(key, testData[key]));
}
document.addEventListener("DOMContentLoaded", function() {
    const btnAutoFill = document.getElementById('btnAutoFill');
    if(btnAutoFill) {
        btnAutoFill.addEventListener('click', function() {
            // 1. 로그인된 memId 가져오기
            const memId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) || 0;
            
            if (memId === 0) {
                alert("로그인 정보를 확인할 수 없습니다.");
                return;
            }

            console.log("정보 자동완성 API 호출 - memId:", memId);

            // 2. 백엔드 API 호출
            axios.get(`/member/selectMem?memId=${memId}`)
                .then(function(response) {
                    const data = response.data;
                    
                    if (!data) {
                        alert("회원 정보를 불러올 수 없습니다.");
                        return;
                    }

                    console.log("불러온 회원 정보:", data);

                    // ==========================================
                    // 3. 실제 JSP의 ID에 맞춰서 데이터 꽂아넣기
                    // ==========================================
                    
                    // 기업명 (상호)
                    const importerName = document.getElementById('txtImporterTradeName');
                    if(importerName) {
                        importerName.value = data.companyName || ''; 
                        
                        // 값 들어갔다고 확실하게 브라우저에 알리기
                        importerName.dispatchEvent(new Event('input', { bubbles: true }));
                        importerName.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    // 성명 (대표자)
                    const repName = document.getElementById('txtTaxpayerName');
                    if(repName) repName.value = data.memName || '';

                    // 전화번호
                    const repTel = document.getElementById('txtRepTel');
                    if(repTel) {
                        repTel.value = data.hpNo || ''; 
                        
                        // 값 들어갔다고 브라우저에 소문내기
                        repTel.dispatchEvent(new Event('input', { bubbles: true }));
                        repTel.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    // 1. 사업자등록번호 (하이픈 제거 로직 추가 + 변수명 다중 대응)
					const bizRegNo = document.getElementById('txtBizRegNo');
					if(bizRegNo) {
					    // DB에서 어떤 이름으로 오든 다 잡히게 세팅
					    let rawBizNo = data.memBizNo || data.bizRegNo || data.businessNo || data.crn || '';
					    // JSP 플레이스홀더 요구사항에 맞춰 하이픈(-) 제거하고 꽂기
					    bizRegNo.value = rawBizNo.replace(/-/g, ''); 
					}
                    // 통관고유부호
                    const customsInput = document.getElementById('txtTaxpayerCode');
                    if(customsInput) {
                        // data.customsIdNo 적용
                        customsInput.value = data.customsIdNo || ''; 
                        
                        // 폼에 값이 들어갔다고 브라우저 알림
                        customsInput.dispatchEvent(new Event('input', { bubbles: true }));
                        customsInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    // 주소
                    const address = document.getElementById('txtAddress');
                    if(address) address.value = data.memAddress || data.address || '';

                    // ==========================================
                    // 4. 이메일 쪼개서 넣기 (아이디 / 도메인)
                    // ==========================================
                    const fullEmail = data.memEmail || data.email || '';
                    if (fullEmail && fullEmail.includes('@')) {
                        const emailParts = fullEmail.split('@');
                        
                        const emailIdInput = document.getElementById('txtTaxpayerEmailId');
                        const emailDomainInput = document.getElementById('txtTaxpayerEmailDomain');
                        
                        if (emailIdInput) emailIdInput.value = emailParts[0];
                        if (emailDomainInput) {
                            emailDomainInput.value = emailParts[1];
                            emailDomainInput.readOnly = false; // 도메인 인풋 활성화
                        }
                        
                        // 셀렉트 박스 '직접입력'으로 맞추기
                        const selDomain = document.getElementById('selTaxpayerEmailDomain');
                        if (selDomain) selDomain.value = 'direct';

                        // 이메일 통합 hidden 필드 업데이트 함수 호출 (JSP에 있는 함수)
                        if (typeof updateEmailField === 'function') {
                            updateEmailField();
                        }
                    }

                    // SweetAlert2가 있다면 띄우고, 없으면 기본 alert
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'success',
                            title: '불러오기 완료',
                            text: '내 기본정보가 폼에 채워졌습니다.',
                            confirmButtonColor: '#0f4c81',
                            timer: 1500,
                            scrollbarPadding: false,
                            heightAuto: false
                        });
                    } else {
                        alert("내 기본정보가 성공적으로 입력되었습니다!");
                    }
                    
                })
                .catch(function(error) {
                    console.error("회원 정보 조회 실패:", error);
                    alert("서버와 통신 중 오류가 발생했습니다.");
                });
        });
    }
});