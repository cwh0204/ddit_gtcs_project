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
    console.log("전역 사용자 정보 확인 중...");
    
    // header.jsp에서 만들어준 window.USER_CONTEXT가 있는지 확인
    if (window.USER_CONTEXT && window.USER_CONTEXT.memId != 0) {
        console.log("사용자 인증됨:", window.USER_CONTEXT.memName);
        
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
    let i, tabcontent, tablinks;
    
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
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = "block";
        target.classList.add("active");
    }
    
    // 4. 클릭한 버튼 활성화
    if (evt && evt.currentTarget) {
        evt.currentTarget.className += " active";
    }
    
    console.log('탭 전환: ' + sectionId);
}

/* ========================================================================
   [완성형] 수입신고서 전 항목 유효성 및 형식 검사 로직
   ======================================================================== */
function validateImportData(data) {
    const missingFields = [];
    const formatErrors = [];

    // 1. [섹션 1] 거래당사자 및 기본신고 정보
    const section1Fields = {
        'importerName': '기업명',
        'repName': '성명',
        'telNo': '전화번호',
        'email': '이메일',
        'bizRegNo': '사업자등록번호',
        'customsId': '통관고유부호',
        'address': '주소',
        'overseasBizName': '해외거래처명',
        'overseasCountry': '해외거래처국적',
        'importType': '수입종류',
        'cargoMgmtNo': '화물관리번호',
        'vesselName': '선기명',
        'arrivalEstDate': '입항(예정)일',
        'bondedInDate': '보세구역 반입일자',
        'originCountry': '수입국',
        'blNo': 'B/L 또는 AWB'
    };

    // 2. [섹션 2] 결제 및 세액 정보
    const section2Fields = {
        'writeDate': '작성일자',
	    'currencyCode': '결제금액',
	    'payAmount': '결제금액',
	    'invoiceNo': '인보이스 번호',
	    'invoiceDate': '인보이스 발행일',
	    'contractNo': '계약번호',
	    'contractDate': '계약일자',
	    'poNo': '구매주문서번호',
	    'poDate': '구매주문일',
	    'incoterms': '인도조건',
	    'totalWeight': '총중량',
	    'containerNumbers': '컨테이너 번호'
    };

    // 3. [섹션 3] 물품 정보 (상표명, 모델명 포함)
    const section3Fields = {
        'hsCode': 'HS부호',
	    'taxType': '관세구분',
	    'taxBaseType': '관세액기준',
	    'itemNameDeclared': '신고품명',
	    'itemNameTrade': '거래품명',
	    'modelName': '모델 (규격)',
	    'qty': '수량',
	    'qtyUnit': '수량',
	    'unitPrice': '단가',
	    'totalAmount': '금액',
	    'netWeight': '순중량',
	    'taxBaseAmtItem': '과세가격',
	    'originCode': '원산지코드',
	    'originMarkYn': '원산지표시유무'
    };

    // --- [필수값 체크] ---
    const allRequired = { ...section1Fields, ...section2Fields, ...section3Fields };
    for (const [key, label] of Object.entries(allRequired)) {
        const val = data[key] ? data[key].toString().trim() : "";
        if (val === "" || val === "0") {
            missingFields.push(label);
        }
    }

    // --- [데이터 형식 정밀 검사] ---
    // 사업자등록번호 (10자리)
    if (data.bizRegNo && !/^\d{10}$/.test(data.bizRegNo.replace(/-/g, ''))) {
        formatErrors.push('사업자등록번호는 숫자 10자리여야 합니다.');
    }
    // 통관고유부호 (13자리)
    if (data.customsId && data.customsId.length !== 13) {
        formatErrors.push('통관고유부호는 13자리여야 합니다.');
    }
    // 화물관리번호 (14자리)
    if (data.cargoMgmtNo && data.cargoMgmtNo.length !== 14) {
        formatErrors.push('화물관리번호는 14자리여야 합니다.');
    }
    // HS Code (표준 10자리 포맷)
    if (data.hsCode && !/^\d{4}\.?\d{2}\.?\d{4}$/.test(data.hsCode)) {
        formatErrors.push('HS Code 형식이 올바르지 않습니다. (예: 8471.30.0000)');
    }
    // 이메일 형식
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        formatErrors.push('이메일 형식이 유효하지 않습니다.');
    }

    // 4. [섹션 4] 필수 첨부파일 체크
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

    // --- [결과 출력 (SweetAlert2)] ---
    if (missingFields.length > 0 || formatErrors.length > 0) {
        let errorHtml = '<div style="text-align: left; font-size: 14px; max-height: 300px; overflow-y: auto;">';
        
        if (missingFields.length > 0) {
            errorHtml += `<b style="color: #e11d48;">[누락 항목]</b><br>- ${missingFields.join('<br>- ')}<br><br>`;
        }
        if (formatErrors.length > 0) {
            errorHtml += `<b style="color: #f59e0b;">[형식 오류]</b><br>- ${formatErrors.join('<br>- ')}`;
        }
        errorHtml += '</div>';

        Swal.fire({
            icon: 'error',
            title: '입력 데이터 확인 필요',
            html: errorHtml,
            confirmButtonColor: '#0f4c81',
            confirmButtonText: '확인',
            scrollbarPadding: false,
            heightAuto: false
        }).then(() => {
            // 가장 먼저 누락된 필드로 포커스 이동
            const firstLabel = missingFields[0] || "";
            if (firstLabel) focusFirstMissingField(firstLabel);
        });
        
        return false;
    }

    return true;
}

// 누락된 필드가 있는 탭으로 자동 이동해주는 헬퍼 함수
function focusFirstMissingField(label) {
    console.log("[자동이동] 대상 라벨:", label);
    
    // 1. 모든 th, label, span 중 해당 텍스트를 포함한 요소 찾기
    const elements = document.querySelectorAll('th, label, span');
    let targetEl = null;

    for (let el of elements) {
        // 텍스트에서 '*'나 공백을 제거하고 비교
        const cleanText = el.textContent.replace(/\*/g, '').trim();
        
        // 핵심 버그 수정: cleanText가 비어있지 않을 때만 정확히 포함 여부를 검사합니다.
        if (cleanText.length > 0 && cleanText.includes(label)) {
            targetEl = el;
            break;
        }
    }

    if (targetEl) {
        // 2. 해당 요소가 포함된 상위 .tab-content 섹션 찾기
        const tabPane = targetEl.closest('.tab-content');
        if (tabPane) {
            const sectionId = tabPane.id; 
            console.log("[자동이동] 발견된 섹션 ID:", sectionId);
            
            // 3. 수입 신고서 JSP 베이스에 맞춘 핀포인트 인덱스 맵핑
            const indexMap = { 
                'section1': 0, // 1. 공통사항
                'section3': 1, // 2. 결제 및 세액
                'section4': 2, // 3. 물품 정보
                'section5': 3  // 4. 첨부파일
            };
            
            const targetIndex = indexMap[sectionId];
            const tabButtons = document.querySelectorAll('.tab-header .tab-btn');

            if (targetIndex !== undefined && tabButtons[targetIndex]) {
                console.log("[자동이동] 실행: " + (targetIndex + 1) + "번 탭 클릭");
                
                // 탭 클릭 실행
                tabButtons[targetIndex].click();
                
                // 4. 시각적 피드백 (해당 라벨로 스크롤 및 붉은색 강조)
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // 에러 항목 빨간색으로 1.5초간 깜빡임 효과
                    const originalColor = targetEl.style.color;
                    targetEl.style.color = '#dc3545';
                    setTimeout(() => { targetEl.style.color = originalColor; }, 1500);

                    // 입력 필드가 있다면 포커스
                    const input = targetEl.parentElement.querySelector('input:not([type="hidden"]), select, textarea');
                    if (input) input.focus();
                }, 300);
            }
        }
    } else {
        console.warn("[자동이동] 화면에서 해당 라벨을 찾을 수 없습니다: " + label);
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
    console.log('데이터 수집 시작');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const formData = {};
    
    // 1. Section1 (공통사항) - 19개 필드
    console.log('Section1 데이터 수집');
    
    // 이메일 통합
    const emailId = getElementValue('txtTaxpayerEmailId');
    const emailDomain = getElementValue('txtTaxpayerEmailDomain');
    if (emailId && emailDomain) {
        formData.email = emailId + '@' + emailDomain;
    }
    
    // Section1 필드
    const section1Fields = [
        'importerName', 'repName', 'telNo', 'bizRegNo', 'customsId', 'address',
        'overseasBizName', 'overseasCountry', 'importType', 'cargoMgmtNo',
        'vesselName', 'vesselNation', 'arrivalEstDate', 'bondedInDate',
        'originCountry', 'arrivalPort', 'blNo', 'awbNo'
    ];
    
    section1Fields.forEach(function(fieldName) {
        let value = getFieldValue(fieldName); // replace를 쓰므로 let으로 변경
        if (value !== null) {
            formData[fieldName] = value;
        }
    });
    
    // transMode (라디오)
    const transMode = document.querySelector('input[name="transMode"]:checked');
    if (transMode) {
        formData.transMode = transMode.value;
    }
    
    console.log('  ✓ Section1: ' + section1Fields.length + '개 필드');
    
    // 2. Section2 (결제/세액) - 23개 필드
    console.log('Section2 데이터 수집');
    
    const section2Fields = [
        'writeDate', 'currencyCode', 'payAmount', 'invoiceNo', 'invoiceDate',
        'contractNo', 'contractDate', 'poNo', 'poDate', 'incoterms',
        'totalWeight', 'originCertYn', 'freightCurrency', 'freightAmt',
        'insuranceCurrency', 'insuranceAmt', 'addAmtCurrency', 'addAmt',
        'totalTaxBase', 'totalDuty', 'totalVat', 'totalTaxSum',
        'containerNumbers'
    ];
    
    section2Fields.forEach(function(fieldName) {
        let value = getFieldValue(fieldName); // replace를 쓰므로 let으로 변경
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
        const containers = ContainerManager.getData();
        if (containers && containers.length > 0) {
            formData.contNo = containers[0].containerNo; // 첫 번째 컨테이너 번호
            console.log('컨테이너: ' + containers.length + '개 (첫번째: ' + formData.contNo + ')');
        }
    } else {
        // 대체 방법: name="containerNumbers" 직접 수집
        const containerInputs = document.querySelectorAll('input[name="containerNumbers"]');
        if (containerInputs.length > 0 && containerInputs[0].value.trim()) {
            formData.contNo = containerInputs[0].value.trim();
            console.log('  ✓ 컨테이너 (직접수집): ' + formData.contNo);
        }
    }
    
    console.log('Section2: ' + section2Fields.length + '개 필드');
    
    // 3. Section3 (물품정보) - 14개 필드
    console.log('Section3 데이터 수집...');
    
    const section3Fields = [
        'hsCode', 'taxType', 'itemNameDeclared', 'itemNameTrade',
        'brandName',
        'modelName', 'qty', 'qtyUnit', 'unitPrice', 'totalAmount',
        'netWeight', 'taxBaseAmtItem', 'originCode', 'originMarkYn'
    ];
    
    section3Fields.forEach(function(fieldName) {
        let value = getFieldValue(fieldName); // replace를 쓰므로 let으로 변경
        if (value !== null) {
            // 숫자 필드는 콤마 제거
            if (['qty', 'unitPrice', 'totalAmount', 'netWeight', 'taxBaseAmtItem'].includes(fieldName)) {
                value = value.replace(/,/g, '');
            }
            formData[fieldName] = value;
        }
    });
    
    // taxBaseType (라디오)
    const taxBaseType = document.querySelector('input[name="taxBaseType"]:checked');
    if (taxBaseType) {
        formData.taxBaseType = taxBaseType.value;
    }
    
    console.log('  ✓ Section3: ' + section3Fields.length + '개 필드');
    
    // 4. 시스템 필드
    formData.status = "심사대기";
    formData.memId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) ? window.USER_CONTEXT.memId : 0;
    
    console.log('데이터 수집 완료');
    console.log('총 필드 수: ' + Object.keys(formData).length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return formData;
}

/**
 * 필드 값 가져오기 (name 속성 기반)
 */
function getFieldValue(fieldName) {
    const element = document.querySelector('[name="' + fieldName + '"]');
    if (element) {
        return element.value.trim();
    }
    return null;
}

/**
 * 요소 값 가져오기 (ID 기반)
 */
function getElementValue(elementId) {
    const element = document.getElementById(elementId);
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
    console.log('유효성 검사 시작');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    let isValid = true; // 값이 변경되므로 let 사용
    
    // Section1 검사
    if (typeof validateSection1 === 'function') {
        console.log('Section1 검사...');
        if (!validateSection1()) {
            console.error('Section1 검사 실패');
            isValid = false;
        } else {
            console.log('Section1 검사 통과');
        }
    }
    
    // Section2 검사
    if (typeof validateSection2 === 'function') {
        console.log('Section2 검사...');
        if (!validateSection2()) {
            console.error('Section2 검사 실패');
            isValid = false;
        } else {
            console.log('Section2 검사 통과');
        }
    }
    
    // Section3 검사
    if (typeof validateSection3 === 'function') {
        console.log('Section3 검사...');
        if (!validateSection3()) {
            console.error('Section3 검사 실패');
            isValid = false;
        } else {
            console.log('Section3 검사 통과');
        }
    }
    
    if (isValid) {
        console.log('유효성 검사 통과');
    } else {
        console.error('유효성 검사 실패');
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
    console.log('파일 추가 시작');
    
    let fileCount = 0; // 값이 증가하므로 let 사용
    
    // 1. 필수 증빙 파일
    const essentialFiles = [
        { id: 'fileInvoice', paramName: 'invoiceFile' },
        { id: 'filePackingList', paramName: 'packinglistFile' },
        { id: 'fileBL', paramName: 'blFile' }
    ];
    
    essentialFiles.forEach(function(fileInfo) {
        const fileInput = document.getElementById(fileInfo.id);
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append(fileInfo.paramName, fileInput.files[0]);
            fileCount++;
            console.log('  ✓ ' + fileInfo.paramName + ': ' + fileInput.files[0].name);
        }
    });
    
    // 2. 기타 파일 (수정된 부분 - Swal 적용 완료)
    if (typeof FileManager !== 'undefined' && FileManager.getOtherFiles) {
        const otherFiles = FileManager.getOtherFiles();
        if (otherFiles && otherFiles.length > 0) {
            // 백엔드가 단일 MultipartFile(otherFile)만 받으므로 첫 번째 파일만 전송
            formData.append('otherFile', otherFiles[0]);
            fileCount++;
            console.log('기타 파일(otherFile): ' + otherFiles[0].name);
            
            // 만약 프론트에서 여러 개를 담았다면 경고 출력
            if (otherFiles.length > 1) {
                console.warn('백엔드 설정상 기타 파일은 1개만 전송됩니다.');
                
                //[수정됨] 스윗얼럿2 적용 및 사이드바 밀림 방지 처리
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
                    Swal.fire({
					    icon: 'info',
					    title: '파일 전송 제한',
					    text: '기타 첨부파일은 1개만 전송 가능합니다. 첫 번째 파일만 적용되었습니다.',
					    confirmButtonColor: '#3478f6',
					    confirmButtonText: '확인',
					    heightAuto: false // 사이드바 레이아웃 보호
					});
                }
            }
        }
    }
    
    console.log('총 ' + fileCount + '개 파일 추가 완료');
    return fileCount;
}

/* ========================================================================
   [Part 4] DB 전송 (Axios) - 스피너 및 Swal 적용 완료
   ======================================================================== */
async function submitDeclaration() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('수입신고서 제출 시작 (JSON Blob 방식)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const importData = collectAllData();

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
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(importData)], { 
            type: 'application/json' 
        }));
        
        const fileCount = appendFilesToFormData(formData);
		
        console.log('서버로 전송 중...');
        const response = await axios.post('/rest/import', formData);
        
        // 1. 서버로부터 응답을 받으면 즉시 로딩 스피너를 끕니다.
        toggleLoading(false);

        if ((response.data && response.data > 0) || response.status === 200) {
            // 2. 성공 알림창을 띄웁니다. (이때 스피너는 이미 꺼진 상태)
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
        //에러 발생 시에도 스피너를 끕니다.
        toggleLoading(false);

        console.error('전송 실패:', error);
        
        let errorMsg = "전송 중 오류가 발생했습니다.";
        if (error.response && error.response.data) {
             errorMsg += "\n(" + (error.response.data.message || error.response.statusText) + ")";
        }
        
        Swal.fire({
            icon: 'error',
            title: '제출 실패',
            text: errorMsg,
            confirmButtonColor: '#dc3545',
            scrollbarPadding: false,
            heightAuto: false
        });
    }
}
/* ========================================================================
   [Part 5] 페이지 초기화 (화물진행현황 동적 연동 보강 - 핀포인트 매핑)
   ======================================================================== */

document.addEventListener('DOMContentLoaded', async function() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('수입신고서 페이지 로드');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    initLoadingSpinner();
    await fetchUserInfo();
    
    if (typeof axios !== 'undefined') {
        console.log('Axios 라이브러리 로드 완료');
    } else {
        console.error('Axios 라이브러리가 로드되지 않았습니다!');
    }
    
    const firstTab = document.querySelector('.tab-btn');
    if (firstTab) firstTab.click();
    
    const submitButton = document.querySelector('button[onclick*="submitDeclaration"]');
    if (submitButton) console.log('제출 버튼 발견');
    
    // ========================================================================
    // 세션스토리지 데이터 기반 폼 자동 세팅 (cargoDetail.jsp 완벽 호환)
    // ========================================================================
    const cargoDataString = sessionStorage.getItem('cargoDataForForm');
    
    if (cargoDataString) {
        console.log('넘어온 화물 데이터 발견 핀포인트 연동 시작');
        try {
            const cargoData = JSON.parse(cargoDataString);
            console.log('화물 상세에서 넘어온 원본 데이터:', cargoData);

            // 1. 값 세팅 헬퍼 함수 (id와 name 모두 지원, 이벤트 강제 발생)
            const setFormValue = (targetNameOrId, dataValue) => {
                let el = document.getElementById(targetNameOrId) || document.querySelector(`[name="${targetNameOrId}"]`);
                if (!el || dataValue === null || dataValue === undefined || dataValue === '') return;

                el.value = dataValue;
                
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
                console.log(`[연동 성공] ${targetNameOrId} <- '${dataValue}'`);
            };

            setTimeout(() => {
                console.log('폼 렌더링 대기 완료, 1:1 데이터 주입 시작...');
                
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
                console.log('동적 데이터 연동 완료 및 세션스토리지 초기화');

            }, 300);

        } catch (error) {
            console.error('화물 데이터를 파싱/입력하는 중 오류 발생:', error);
        }
    } else {
        console.log('세션 스토리지에 화물 데이터가 없습니다. (일반 접근)');
    }
    
    console.log('페이지 초기화 완료');
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
        const span = document.getElementById(id);
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

console.log('importBase.js 로드 완료');

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
/* 자동 수리 전용 자동입력 함수 */
function autoFill() {
    console.log("자동 입력 프로세스 시작...");

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
            console.log(`입력 성공: ${nameOrId}`);
        } else {
            console.warn(`필드 없음: ${nameOrId}`);
        }
    }

    const testData = {
	    'importNumber': 'IMP-2026-TEST-001',
	    'overseasBizName': 'ACNE STUDIOS AB',
	    'overseasCountry': 'SE',
	    'importType': '21', 
	    'cargoMgmtNo': '26ABC123456789',
	    'transMode': '10', 
	    'vesselName': 'Sunny Ho',
	    'vesselNation': 'US',
	    
	    'contractDate': '2026-02-15',
	    'poDate': '2026-02-16',
	    'invoiceDate': '2026-02-25',
	    'arrivalEstDate': '2026-03-05',
	    'bondedInDate': '2026-03-08',
	    'writeDate': '2026-03-09',
	    
	    'originCountry': 'SE',
	    'arrivalPort': 'BUSAN',
	    'currencyCode': 'USD',
	    
	    'payAmount': '1000',
	    'invoiceNo': 'INV-20260305-0042',
	    'contractNo': 'CTR-001',
	    'incoterms': 'CIF',              
	    'originCertYn': 'Y',
	    'freightAmt': '0',               
	    'insuranceAmt': '0',             
	    
	    'totalTaxBase': '1400000',       
	    'totalDuty': '0',                
	    'totalVat': '140000',            
	    'totalTaxSum': '140000',         
	    
	    // hsCode 항목 삭제 완료
	    'modelName': '아크네 맨투맨 블랙 남성용 상의',
	    
	    'unitPrice': '100',              
	    'qty': '10',                     
	    'totalAmount': '1000',           
	    'qtyUnit': 'PCS',
	    'netWeight': '9',                
	    'totalWeight': '10',             
	    
	    'freightCurrency': 'USD',
	    'insuranceCurrency': 'USD',
	    'addAmtCurrency': 'KRW',
	    'poNo': 'PO-2026-ABC-01',
	    
	    'originMarkYn': 'Y',             
	    'taxBaseAmtItem': '1400000',     
	    'taxType': 'F',                  
	    'addAmt': '0',                   
	    'originCode': 'SE'
	};

    Object.keys(testData).forEach(key => setVal(key, testData[key]));
}


// --- 자동 반려 전용 자동입력 함수 ---
function autoFillRejectCase() {
    console.log("고위험(반려) 케이스 자동 입력 프로세스 시작...");

    // 작성해두신 완벽한 폼 세팅 로직을 똑같이 사용합니다.
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
            console.log(`고위험 데이터 입력 성공: ${nameOrId}`);
        } else {
            console.warn(`필드 없음: ${nameOrId}`);
        }
    }

    // AI 관세사가 100% 반려할 극단적 위험 데이터
    const rejectData = {
	    'importNumber': 'IMP-2026-DANGER-999',
	    'overseasBizName': 'UNKNOWN PAPER CO.', 
	    'overseasCountry': 'KP',                
	    'importType': '11', 
	    'cargoMgmtNo': '26XYZ999999999',
	    'transMode': '40',                      
	    'vesselName': 'BLACK FLIGHT 01',
	    'vesselNation': 'CN',                   
	    'arrivalEstDate': '2025-01-01',         // 1년 전 입항 (시간 모순)
	    'bondedInDate': '2026-03-05',
	    'originCountry': 'KP',                  // [반려 확정타] 원산지 북한
	    'arrivalPort': 'ICN',
	    'writeDate': '2026-03-05',
	    'currencyCode': 'USD',
	    'payAmount': '10',                      // 심각한 언더밸류 ($10)
	    'invoiceNo': 'FAKE-INV-001',
	    'invoiceDate': '2026-03-05',
	    'contractNo': 'NONE',
	    'incoterms': 'FOB',
	    'originCertYn': 'N',
	    
	    // 0원 방지: 15톤 화물인데 운임과 보험료가 단돈 $1인 어이없는 상황 연출
	    'freightAmt': '1',                      
	    'insuranceAmt': '1',
	    
	    'totalTaxBase': '14000',                
	    
	    // 0원 방지: 엉터리 관세 부과
	    'totalDuty': '100',                       
	    'totalVat': '100',
	    'totalTaxSum': '200',
	    
	    'modelName': '프라다 맨투맨 블랙 남성용 상의', 
	    'unitPrice': '0.001',
	    
	    // 누락되었던 수량 항목 추가! (맨투맨 1만 벌이 10달러)
	    'qty': '10000',                         
	    
	    'totalAmount': '10',
	    'qtyUnit': 'PCS',
	    'freightCurrency': 'USD',      
	    'insuranceCurrency': 'USD',    
	    'addAmtCurrency': 'KRW',       
	    'poNo': 'PO-DANGER-01',         
	    'contractDate': '2026-01-01',     
	    'poDate': '2026-02-01',           
	    'originMarkYn': 'N',                    // 원산지 미표시 불법
	    'totalWeight': '15000',                 // 10,000벌이 15톤 (물리적 모순)
	    'netWeight': '14500',             
	    'taxBaseAmtItem': '14000',     
	    'taxType': 'A',                   
	    
	    // 0원 방지: 가산금액에 의미 없는 적은 숫자 투척
	    'addAmt': '5',              
	    'originCode': 'KP'               
	};

    // 데이터 폼에 바인딩
    Object.keys(rejectData).forEach(key => setVal(key, rejectData[key]));
}

// 심사중(화면심사 유도) 케이스 자동 입력 함수
function autoFillPendingCase() {
    console.log("심사중(화면심사) 케이스 자동 입력 프로세스 시작...");

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
        }
    }

    const pendingData = {
	    'importNumber': 'IMP-2026-CHECK-002',
	    'overseasBizName': 'ACNE STUDIOS AB',
	    'overseasCountry': 'SE',
	    'importType': '21', 
	    'cargoMgmtNo': '26ABC123456789',
	    'transMode': '40',                
	    'vesselName': 'KE0612',           
	    'vesselNation': 'KR',
	    'arrivalEstDate': '2026-03-05',
	    'bondedInDate': '2026-03-06',
	    'originCountry': 'SE',
	    'arrivalPort': 'ICN',             
	    'writeDate': '2026-03-05',
	    'currencyCode': 'USD',
	    'payAmount': '1000',
	    'invoiceNo': 'INV-20260305-PEND',
	    'invoiceDate': '2026-03-05',
	    'contractNo': 'CTR-PEND-99',       
	    'contractDate': '2026-02-10',      
	    'poNo': 'PO-2026-PEND-01',         
	    'poDate': '2026-02-12',            
	    
	    // [심사항목 1] 모순 발생 콤보 (Incoterms vs 부대비용)
	    'incoterms': 'CIF',               // CIF 조건은 이미 결제금액에 운임/보험료가 포함된 조건인데...
	    'freightAmt': '150000',           // 1. 운임료 15만 원 별도 기재 (이중 과세 의심)
	    'insuranceAmt': '30000',          // 2. 보험료 3만 원 별도 기재 (이중 과세 의심)
	    'addAmt': '50000',                // 3. 가산금액 5만 원 추가
	    
	    'originCertYn': 'N',              
	    
	    // [심사항목 2] 과세가격 수학적 모순
	    // 총 결제금액($1,000=약 140만 원)에 위의 부대비용을 합치면 140만 원이 넘어야 하는데 그대로 140만 원임
	    'totalTaxBase': '1400000',   
	    'totalDuty': '350000',            
	    'totalVat': '175000',        
	    'totalTaxSum': '525000',     
	    
	    'modelName': '프라다 맨투맨 블랙 남성용 상의', 
	    'unitPrice': '100',
	    'totalAmount': '1000',
	    'qtyUnit': 'PCS',
	    'freightCurrency': 'KRW',         
	    'insuranceCurrency': 'KRW',       
	    'addAmtCurrency': 'KRW',          
	    'originMarkYn': 'Y',              
	    
	    // [심사항목 3] 물리적 모순
	    'netWeight': '100',               // 옷 10벌이 100kg?
	    'totalWeight': '120',             
	    
	    'taxBaseAmtItem': '1400000',     
	    'taxType': 'A',                   // 일반 세율 적용 (중복 키 제거)
	    'originCode': 'SE'               
	};

    Object.keys(pendingData).forEach(key => setVal(key, pendingData[key]));
}

document.addEventListener("DOMContentLoaded", function() {
    const btnAutoFill = document.getElementById('btnAutoFill');
    if(btnAutoFill) {
        btnAutoFill.addEventListener('click', function() {
            // 1. 로그인된 memId 가져오기
            const memId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) || 0;
            
            if (memId === 0) {
                Swal.fire({
				    icon: 'warning',
				    title: '로그인 실패',
				    text: '로그인 정보를 확인할 수 없습니다.',
				    confirmButtonColor: '#3478f6',
				    confirmButtonText: '확인',
				    heightAuto: false // 사이드바 짤림 방지
				});
                return;
            }

            console.log("정보 자동완성 API 호출 - memId:", memId);

            // 2. 백엔드 API 호출
            axios.get(`/member/selectMem?memId=${memId}`)
                .then(function(response) {
                    const data = response.data;
                    
                    if (!data) {
                        Swal.fire({
						    icon: 'error',
						    title: '데이터 로드 실패',
						    text: '회원 정보를 불러올 수 없습니다.',
						    confirmButtonColor: '#3478f6',
						    confirmButtonText: '확인',
						    heightAuto: false // 사이드바 레이아웃 짤림 방지 옵션
						});
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
                    Swal.fire({
					    icon: 'error',
					    title: '통신 오류',
					    text: '서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
					    confirmButtonColor: '#d33', // 에러 상황이므로 좀 더 경고 의미가 강한 붉은 계열 사용
					    confirmButtonText: '확인',
					    heightAuto: false // 사이드바 레이아웃 보호 옵션
					});
                });
        });
    }
});