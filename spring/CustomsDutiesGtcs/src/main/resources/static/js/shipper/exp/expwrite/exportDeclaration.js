/* ========================================================================
   수출신고서 작성 페이지 JavaScript
   라이브러리: Axios, SweetAlert2
   ======================================================================== */

/** 데이터 바인딩
*/
const FIELD_MAPPING = {
    // [공통사항 1]
    'exporterName': 'txtExporterName',
    'repName': 'txtExporterRep',
    'bizRegNo': 'txtBizRegNo',
    'buyerIdNo': 'txtExporterIdNo',
    'customsId': 'txtExporterCustomsCode',
    'buyerName': 'txtBuyerName',
    'buyerAddress': 'txtBuyerCode',
    'dclType': 'selDclType',
    'transMode': 'selTransMode',
    'exportKind': 'selExportKind',
    'paymentMethod': 'selPaymentMethod',
    'incoterms': 'selIncoterms',
    'destCountry': 'txtDestCountry',
    'loadingPort': 'txtLoadPort',
    'transportMode': 'selTransportMode',
    'containerMode': 'selContainerMode',
    'goodsLoc': 'txtGoodsLoc',
    'goodsType': 'selGoodsType',
    'refundApplicant': 'selRefundApplicant',

    // [공통사항 2]
    'exchangeRate': 'txtExchangeRate',
    'currencyCode': 'selCurrencyCode',
    'payAmount': 'txtPaymentAmount',
    'freightAmt': 'txtFreightKRW',
    'insuranceAmt': 'txtInsuranceKRW',
    'cargoMgmtNo': 'txtCargoMgmtNo',
    'bondedRepName': 'txtBondedReporter',
    'carrierName': 'txtCarrierCode',
    'vesselName': 'txtVesselName',
    'loadingLoc': 'txtLoadBondedArea',
    'contNo': 'txtContNo',             

    // [물품정보]
    'invoiceNo': 'txtInvoiceNo',
    'hsCode': 'txtHsCode',
    'itemNameDeclared': 'txtGoodsDesc',
    'itemNameTrade': 'txtTradeName',
    'brandName': 'txtBrandName',
    'modelName': 'txtModelSpec',
    'qty': 'txtQty',
    'qtyUnit': 'selQtyUnit',
    'unitPrice': 'txtUnitPrice',
    'totalDeclAmt': 'txtAmount',
    'totalWeight': 'txtNetWeight',
    'totalPackCnt': 'txtPackageQty',
    'originCountry': 'txtOriginCountry',
    
    // [추가된 원산지 필드 - DTO와 매칭]
    'originCriteria': 'selOriginCriteria', 
    'originMarkYn': 'selOriginMarkYn',     
    'originCertType': 'selOriginCertType',  
    
    // [DB 필수 필드 추가 항목]
    'invoiceSign': 'selInvoiceSign',    
    'attachYn': 'txtAttachYn'          
};

/* ========================================================================
   [완성형] 전 항목 유효성 검사 로직
   ======================================================================== */
function validateExportData(data) {
    const missingFields = [];
    const formatErrors = [];

    // 1. [섹션 1] 거래당사자 및 기본신고 정보
    const section1Fields = {
        'exporterName': '수출자 상호',
        'repName': '대표자 성명',
        'bizRegNo': '사업자등록번호',
        'customsId': '통관고유부호',
        'buyerName': '구매자 상호',
        'dclType': '신고구분',
        'transMode': '거래구분',
        'destCountry': '도착국(목적국)',
        'loadingPort': '적재항'
    };

    // 2. [섹션 2] 결제 및 운송 정보
    const section2Fields = {
        'currencyCode': '결제통화',
        'payAmount': '결제금액',
        'incoterms': '인도조건',
        'vesselName': '선기명',
        'cargoMgmtNo': '화물관리번호'
    };

    // 3. [섹션 3] 물품 정보
    const section3Fields = {
        'hsCode': 'HS Code',
        'itemNameDeclared': '수출물품명(영문)',
        'brandName': '상표명',
    	'modelName': '모델(규격)',
        'qty': '수량',
        'qtyUnit': '수량단위',
        'unitPrice': '단가',
        'totalWeight': '총 중량',
        'originCountry': '원산지국가'
    };

    // --- 필수값 체크 통합 실행 ---
    const allRequired = { ...section1Fields, ...section2Fields, ...section3Fields };
    for (const [key, label] of Object.entries(allRequired)) {
        const val = data[key] ? data[key].toString().trim() : "";
        if (val === "" || val === "0") {
            missingFields.push(label);
        }
    }

    // --- 데이터 형식(포맷) 정밀 검사 ---
    if (data.bizRegNo && !/^\d{10}$/.test(data.bizRegNo.replace(/-/g, ''))) {
        formatErrors.push('사업자등록번호는 숫자 10자리여야 합니다.');
    }
    if (data.customsId && data.customsId.length !== 13) {
        formatErrors.push('통관고유부호는 13자리여야 합니다.');
    }
    if (data.hsCode && !/^\d{4}\.?\d{2}\.?\d{4}$/.test(data.hsCode)) {
        formatErrors.push('HS Code 형식이 올바르지 않습니다. (예: 8517.13.0000)');
    }
    if (data.cargoMgmtNo && data.cargoMgmtNo.length < 10) {
        formatErrors.push('화물관리번호가 너무 짧습니다.');
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

    // --- 결과 출력 (SweetAlert2) ---
    if (missingFields.length > 0 || formatErrors.length > 0) {
        let errorHtml = '<div style="text-align: left; font-size: 14px;">';
        
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
            confirmButtonText: '수정하기',
            scrollbarPadding: false,
            heightAuto: false
        }).then(() => {
            // 첫 번째 에러가 발생한 필드로 포커스 이동
            const firstLabel = missingFields[0] || "";
            if (firstLabel) focusFirstMissingField(firstLabel);
        });
        
        return false;
    }

    return true;
}

// 누락된 필드가 속한 탭을 찾아 활성화해주는 함수
function focusFirstMissingField(label) {
	const elements = document.querySelectorAll('th, label');
	for (let el of elements) {
		if (el.textContent.includes(label)) {
			const tabPane = el.closest('.tab-content');
			if (tabPane) {
				const sectionId = tabPane.id;
				const tabButtons = document.querySelectorAll('.tab-header .tab-btn');
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
   [Part 0] 네비게이션 & 탭 UI
   ======================================================================== */
function openTab(evt, sectionId) {
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tab-content");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
		tabcontent[i].classList.remove("active");
	}

	tablinks = document.getElementsByClassName("tab-btn");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	var target = document.getElementById(sectionId);
	if (target) {
		target.style.display = "block";
		target.classList.add("active");
	}

	if (evt && evt.currentTarget) {
		evt.currentTarget.className += " active";
	}
}

/* ========================================================================
   [Part 1] 데이터 수집 (JSON Blob 방식)
   ======================================================================== */
function collectAllData() {
	console.log('전체 데이터 수집 시작...');
	var formData = {};

	const inputs = document.querySelectorAll('.tab-content input:not([type="file"]), .tab-content select, .tab-content textarea');

	inputs.forEach(el => {
		var key = el.name || el.id;
		if (key) {
			var value = el.value.trim();

			if (/Amt|Price|Qty|Weight|Rate|Amount/i.test(key)) {
				value = value.replace(/,/g, ''); 

				if (['payAmount', 'totalDeclAmt', 'totalPackCnt', 'qty'].includes(key)) {
					value = value === "" ? "0" : String(Math.floor(parseFloat(value) || 0));
				}
				else {
					if (value === "") value = "0";
				}
			}

			if (value !== "") formData[key] = value;
		}
	});

    const contInput = document.getElementById('txtContNo');
    if (contInput) {
        formData.contNo = contInput.value.trim() || "N/A";
    }

	formData.status = "WAITING";
    formData.memId = (window.USER_CONTEXT && window.USER_CONTEXT.memId) ? window.USER_CONTEXT.memId : 0;

    console.log(`작성자 ID 설정 완료: ${formData.memId}`);
	console.log('수집된 데이터:', formData);
	return formData;
}

/* ========================================================================
   [Part 2] 컨테이너 관리자 (ContainerManager) - Swal 적용
   ======================================================================== */
var ContainerManager = (function() {
	'use strict';

	const MAX_CONTAINERS = 50;
	const TABLE_BODY_ID = 'containerListBody'; 
	const COUNT_ID = 'containerCount';

	function getTbody() { return document.getElementById(TABLE_BODY_ID); }

	function reindex() {
		const tbody = getTbody();
		if (!tbody) return;
		const rows = tbody.querySelectorAll('tr');
		rows.forEach((row, index) => {
			const idxCell = row.querySelector('.row-index');
			if (idxCell) idxCell.textContent = index + 1;
		});
		updateCount(rows.length);
	}

	function updateCount(count) {
		const span = document.getElementById(COUNT_ID);
		if (span) span.textContent = count;
	}

	return {
		addRow: function() {
			const tbody = getTbody();
			if (!tbody) return;

			if (tbody.rows.length >= MAX_CONTAINERS) {
                Swal.fire({
                    icon: 'warning',
                    title: '추가 제한',
                    text: `최대 ${MAX_CONTAINERS}개까지만 추가 가능합니다.`,
                    confirmButtonColor: '#0f4c81',
                    scrollbarPadding: false, 
                    heightAuto: false       
                });
				return;
			}

			const tr = document.createElement('tr');
			tr.innerHTML = `
                <td style="text-align: center;"><input type="checkbox" name="containerRowCheck" /></td>
                <td class="text-center row-index"></td>
                <td>
                    <input type="text" name="containerNumbers" class="w-full border-none" 
                           placeholder="컨테이너 번호 (11자리)" maxlength="11" 
                           style="width:100%; border:0; text-align:center; background:transparent;" />
                </td>
            `;
			tbody.appendChild(tr);
			reindex();
		},

		// 비동기로 변경하여 Swal 사용
		deleteRow: async function() {
			const tbody = getTbody();
			if (!tbody) return;
			const checkboxes = tbody.querySelectorAll('input[name="containerRowCheck"]:checked');

			if (checkboxes.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: '선택 항목 없음',
                    text: '삭제할 행을 선택해주세요.',
                    confirmButtonColor: '#0f4c81',
                    scrollbarPadding: false, 
                    heightAuto: false
                });
				return;
			}

            const result = await Swal.fire({
                title: '행 삭제',
                text: `선택된 ${checkboxes.length}개의 행을 삭제하시겠습니까?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                scrollbarPadding: false,
                heightAuto: false
            });

			if (result.isConfirmed) {
				checkboxes.forEach(chk => chk.closest('tr').remove());
				reindex();
			}
		},

		toggleAll: function(masterCheckbox) {
			const checkboxes = document.querySelectorAll('input[name="containerRowCheck"]');
			checkboxes.forEach(chk => chk.checked = masterCheckbox.checked);
		},

		getData: function() {
			const list = [];
			const inputs = document.querySelectorAll('input[name="containerNumbers"]');
			inputs.forEach((input, index) => {
				if (input.value.trim()) {
					list.push({ sequence: index + 1, containerNo: input.value.trim() });
				}
			});
			return list;
		},

		init: function() {
			reindex();
		}
	};
})();

/* ========================================================================
   [Part 3] 파일 관리자 (FileManager) - Swal 적용
   ======================================================================== */
var FileManager = (function() {
    'use strict';

    var otherFilesList = [];
    const MAX_FILE_SIZE = 32 * 1024 * 1024; 
    
    const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx', 'hwp'];

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

function validateFile(file) {
        if (!file) return false;
        
        const fileName = file.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        
        if (lastDotIndex === -1) {
            Swal.fire({
                icon: 'error',
                title: '형식 오류',
                text: `확장자가 없는 파일은 업로드할 수 없습니다.\n파일명: ${fileName}`,
                confirmButtonColor: '#0f4c81',
                scrollbarPadding: false, 
                heightAuto: false // 추가
            });
            return false;
        }

        const ext = fileName.substring(lastDotIndex + 1).toLowerCase();
        
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            Swal.fire({
                icon: 'warning',
                title: '업로드 불가',
                html: `지원하지 않는 파일 형식입니다.<br><br><b>파일명:</b> ${fileName}<br><b>형식:</b> .${ext}<br><br><span style="color:#666; font-size:13px;">(허용: pdf, jpg, png, xlsx, docx 등)</span>`,
                confirmButtonColor: '#0f4c81',
                scrollbarPadding: false, heightAuto: false // 추가
            });
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            Swal.fire({
                icon: 'warning',
                title: '용량 초과',
                html: `파일 크기는 32MB를 넘을 수 없습니다.<br><br><b>현재 크기:</b> ${formatFileSize(file.size)}`,
                confirmButtonColor: '#0f4c81',
                scrollbarPadding: false, heightAuto: false // 추가
            });
            return false;
        }

        return true;
    }

    function renderOtherFiles() {
        const tbody = document.getElementById('fileTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (otherFilesList.length === 0) {
            tbody.innerHTML = '<tr id="emptyFileRow"><td colspan="6" style="text-align: center; padding: 20px; color: #999;">등록된 기타 첨부파일이 없습니다.</td></tr>';
            return;
        }

        otherFilesList.forEach((file, index) => {
            const tr = document.createElement('tr');
            const fileExt = file.name.split('.').pop().toUpperCase();
            tr.innerHTML = `
                <td style="text-align:center"><input type="checkbox" name="fileRowCheck"></td>
                <td style="text-align:center">${index + 1}</td>
                <td style="text-align:center">기타</td>
                <td style="text-align:center"><span style="color: #0f4c81; font-weight: 600;">${fileExt}</span></td>
                <td style="text-align: left; padding-left: 15px;">${file.name}</td>
                <td style="text-align:center">${formatFileSize(file.size)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    return {
        updateEssentialFile: function(input, displayId) {
            const displaySpan = document.getElementById(displayId);
            if (!displaySpan) return;

            if (!input.files || input.files.length === 0) {
                displaySpan.textContent = '선택된 파일 없음';
                displaySpan.classList.remove('selected');
                displaySpan.style.color = '#666';
                return;
            }

            const file = input.files[0];

            if (!validateFile(file)) {
                console.warn('필수 파일 유효성 검사 실패:', file.name);
                input.value = ''; 
                displaySpan.textContent = '파일 형식이 올바르지 않습니다.';
                displaySpan.classList.remove('selected');
                displaySpan.style.color = 'red'; 
                return; 
            }

            console.log('필수 파일 등록 성공:', file.name);
            displaySpan.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
            displaySpan.style.color = "#0f4c81";
            displaySpan.classList.add('selected');
        },

        handleFiles: function(files) {
            const fileInput = document.getElementById('fileInput');
            if (files.length === 0) return;

            const file = files[0]; 

            if (!validateFile(file)) {
                console.warn('기타 파일 유효성 검사 실패:', file.name);
                if (fileInput) fileInput.value = ''; 
                return;
            }

            console.log('기타 파일 리스트 추가:', file.name);
            otherFilesList = [file]; 
            renderOtherFiles();

            if (fileInput) fileInput.value = '';
        },

        // 비동기로 변경하여 Swal 적용
        deleteSelected: async function() {
            const checkboxes = document.querySelectorAll('input[name="fileRowCheck"]:checked');
            if (checkboxes.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: '선택 항목 없음',
                    text: '삭제할 파일을 선택하세요.',
                    confirmButtonColor: '#0f4c81',
                    scrollbarPadding: false, heightAuto: false // 추가
                });
                return;
            }

            const result = await Swal.fire({
                title: '파일 삭제',
                text: '선택한 파일을 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                scrollbarPadding: false, heightAuto: false // 추가
            });

            if (result.isConfirmed) {
                otherFilesList = [];
                renderOtherFiles();
                const masterChk = document.querySelector('input[onclick*="FileManager.toggleAll"]');
                if (masterChk) masterChk.checked = false;
            }
        },

        toggleAll: function(source) {
            document.querySelectorAll('input[name="fileRowCheck"]').forEach(cb => cb.checked = source.checked);
        },

        getOtherFiles: function() {
            return otherFilesList;
        },

        init: function() {
            const dropZone = document.getElementById('dropZone');
            const fileInput = document.getElementById('fileInput');

            if (dropZone && fileInput) {
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
                    dropZone.addEventListener(e, ev => { ev.preventDefault(); ev.stopPropagation(); });
                });
                dropZone.addEventListener('dragover', () => dropZone.classList.add('drag-over'));
                dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
                
                dropZone.addEventListener('drop', ev => {
                    dropZone.classList.remove('drag-over');
                    this.handleFiles(ev.dataTransfer.files);
                });

                dropZone.addEventListener('click', () => fileInput.click());
                
                fileInput.addEventListener('change', function() {
                    FileManager.handleFiles(this.files);
                });
            }
        }
    };
})();

/* ========================================================================
   [Part 4] 서버 전송 (Axios) - Swal 및 스피너 적용 버전
   ======================================================================== */
async function submitDeclaration(type) {
    const actionTitle = (type === 'SUBMIT') ? "수출신고서 전송" : "수출신고서 저장";
    const msg = (type === 'SUBMIT') ? "수출신고서를 전송하시겠습니까?" : "작성 중인 내용을 저장하시겠습니까?";
    
    // 1. 데이터 수집 및 유효성 검사
    const exportData = collectAllData();

    if (!validateExportData(exportData)) {
        return; 
    }

    // 2. 전송 확인 (Swal)
    const result = await Swal.fire({
        title: actionTitle,
        text: msg,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f4c81',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        scrollbarPadding: false, 
        heightAuto: false
    });

    if (!result.isConfirmed) return;

    // 로딩 스피너 시작
    toggleLoading(true);

    try {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(exportData)], {
            type: "application/json"
        }));

        const appendFile = (id, paramName) => {
            const el = document.getElementById(id);
            if (el && el.files[0]) formData.append(paramName, el.files[0]);
        };

        appendFile('fileInvoice', 'invoiceFile');
        appendFile('filePackingList', 'packinglistFile'); 
        appendFile('fileBL', 'blFile');

        const otherFiles = FileManager.getOtherFiles();
        otherFiles.forEach(f => formData.append('otherFile', f)); 

        console.log('서버로 전송 중...');
        const response = await axios.post('/rest/export', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        toggleLoading(false);
        
        if (response.status === 200) {
            const loadingText = document.querySelector('.loading-text');
            if(loadingText) loadingText.textContent = "처리 완료 이동 중...";

            // 성공 알림 후 이동
            Swal.fire({
                icon: 'success',
                title: '처리 완료',
                text: '정상적으로 처리되었습니다.',
                confirmButtonColor: '#0f4c81',
                timer: 2000,
                timerProgressBar: true,
                scrollbarPadding: false, 
        		heightAuto: false
            }).then(() => {
                location.href = "/client/exp/status/list";
            });
            
        } else {
            throw new Error("서버 응답이 올바르지 않습니다.");
        }
    } catch (err) {
        // 에러 발생 시에만 로딩 끄기
        toggleLoading(false);
        
        console.error("전송 에러 상세:", err.response);
        const errMsg = err.response && err.response.data && err.response.data.message 
                       ? err.response.data.message 
                       : err.message;
                       
        Swal.fire({
            icon: 'error',
            title: '전송 실패',
            text: `처리 중 오류가 발생했습니다.\n[${errMsg}]`,
            confirmButtonColor: '#dc3545',
            scrollbarPadding: false,
            heightAuto: false
        });
    }
}

/* ========================================================================
   [Part 5] 초기화 및 이벤트 바인딩 (화물진행현황 동적 연동 보강)
   ======================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Export Page Loaded');

    initLoadingSpinner();
    ContainerManager.init();
    FileManager.init();
    
    const txtQty = document.getElementById('txtQty');
    const txtUnitPrice = document.getElementById('txtUnitPrice');

    function calcAmount() {
        const q = parseFloat(txtQty.value.replace(/,/g, '')) || 0;
        const p = parseFloat(txtUnitPrice.value.replace(/,/g, '')) || 0;
        const amt = document.getElementById('txtAmount');
        if (amt) amt.value = (q * p).toFixed(2); 
    }

    if (txtQty) txtQty.addEventListener('blur', calcAmount);
    if (txtUnitPrice) txtUnitPrice.addEventListener('blur', calcAmount);

    // ========================================================================
    // 세션스토리지 데이터 기반 폼 자동 세팅
    // ========================================================================
    const cargoDataString = sessionStorage.getItem('cargoDataForForm');
    
    if (cargoDataString) {
        console.log('넘어온 화물 데이터 발견! 핀포인트 연동을 시작합니다.');
        try {
            const cargoData = JSON.parse(cargoDataString);
            console.log('화물 상세에서 넘어온 원본 데이터:', cargoData);

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
                
                setFormValue('txtExporterCustomsCode', cargoData.customsId); 
                setFormValue('txtExporterRep', cargoData.repName); 
                setFormValue('txtExporterName', cargoData.companyName || cargoData.consigneeCompany);
                setFormValue('txtLoadPort', cargoData.loadPort);
                if (cargoData.originCountry) {
                    setFormValue('txtDestCountry', cargoData.originCountry);
                }

                setFormValue('txtVesselName', cargoData.vesselName);
                if (cargoData.contNo) {
                    setFormValue('txtContNo', cargoData.contNo);
                }

                setFormValue('txtGoodsDesc', cargoData.itemName);
                setFormValue('txtTradeName', cargoData.itemName); 
                setFormValue('txtQty', cargoData.qty);
                setFormValue('txtNetWeight', cargoData.grossWeight);
                setFormValue('txtOriginCountry', cargoData.originCountry);
                
                sessionStorage.removeItem('cargoDataForForm');
                console.log('수출신고서 동적 데이터 연동 완료');

            }, 300);

        } catch (error) {
            console.error('❌ 화물 데이터를 파싱/입력하는 중 오류 발생:', error);
        }
    } else {
        console.log('세션 스토리지에 화물 데이터가 없습니다. (일반 접근)');
    }
});

// 전역 함수 매핑 (HTML onclick 지원)
window.openTab = openTab;
window.submitDeclaration = submitDeclaration;
window.ContainerManager = ContainerManager;
window.FileManager = FileManager;

/* ========================================================================
   [Part 6] UI 유틸리티 (로딩 스피너) - 동적 생성
   ======================================================================== */
function initLoadingSpinner() {
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

/* ========================================================================
   [Part 7] 전체 폼 초기화 (삭제) 버튼 - Swal 적용
   ======================================================================== */
function resetDeclaration() {
    Swal.fire({
        title: '작성 내용 초기화',
        text: '현재 입력한 모든 데이터와 첨부파일 내역이 지워집니다. 계속하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545', 
        cancelButtonColor: '#6c757d',
        confirmButtonText: '삭제(초기화)',
        cancelButtonText: '취소',
        scrollbarPadding: false,
        heightAuto: false 

    }).then((result) => {
        if (result.isConfirmed) {
            // 1. 모든 입력 폼(input, select, textarea) 값 비우기
            document.querySelectorAll('input:not([type="button"]):not([type="submit"]), select, textarea').forEach(function(element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = false;
                } else if (element.type === 'file') {
                    element.value = '';
                } else {
                    element.value = '';
                }
            });
            
            // 2. 필수 파일 업로드 영역 표시 초기화
            ['nameInvoice', 'namePacking', 'nameBL'].forEach(function(id) {
                var span = document.getElementById(id);
                if (span) {
                    span.textContent = '선택된 파일 없음';
                    span.classList.remove('selected');
                }
            });

            // 3. 기타 첨부파일(FileManager) 리스트 비우기
            if (typeof FileManager !== 'undefined' && FileManager.getOtherFiles) {
                // 편법: 강제로 전체 선택 후 삭제 함수 호출
                const masterChk = document.querySelector('input[onclick*="FileManager.toggleAll"]');
                if (masterChk) masterChk.checked = true;
                FileManager.toggleAll(masterChk);
                
                // FileManager 내부 변수 초기화를 위해 직접 조작 (위 deleteSelected를 안쓰고 직접 비움)
                const tbody = document.getElementById('fileTableBody');
                if (tbody) tbody.innerHTML = '<tr id="emptyFileRow"><td colspan="6" style="text-align: center; padding: 20px; color: #999;">등록된 기타 첨부파일이 없습니다.</td></tr>';
            }

            // 4. 컨테이너 리스트 초기화
            if (typeof ContainerManager !== 'undefined') {
                const tbody = document.getElementById('containerListBody');
                if (tbody) tbody.innerHTML = '';
                const span = document.getElementById('containerCount');
                if (span) span.textContent = '0';
            }
            
            // 완료 알림
            Swal.fire({
                icon: 'success',
                title: '초기화 완료',
                text: '모든 내용이 초기화되었습니다.',
                confirmButtonColor: '#0f4c81',
                scrollbarPadding: false,
                heightAuto: false
            });
        }
    });
}

// HTML 파일에서 onclick으로 바로 호출할 수 있도록 전역에 등록해줍니다.
window.resetDeclaration = resetDeclaration;

function toggleLoading(isShow) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = isShow ? 'flex' : 'none';
    }
}
/* 자동 심사중 처리용 자동 함수 */
function autoFillExport() {
    console.log("수출신고서 자동 입력 시작 (JSP 섹션 최적화)");

    function setVal(id, value) {
        const el = document.getElementById(id);
        if (el) {
            let finalValue = value;

            if (['txtExchangeRate', 'txtNetWeight', 'txtPackageQty'].includes(id)) {
                finalValue = Math.floor(parseFloat(value) || 0).toString();
            }

            if (el.tagName === 'SELECT') {
                el.value = finalValue;
            } else {
                el.value = finalValue;
            }

            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log(`입력 성공: ${id} -> ${finalValue}`);
        } else {
            console.warn(`필드 없음(ID확인): ${id}`);
        }
    }
    
    const exportData = {
        'txtExporterIdNo': '9876543210',
        'txtBuyerName': 'GLOBAL BUYER CO.',
        'txtBuyerCode': '101 Trade St, New York, US',
        'selDclType': 'P',               
        'selTransMode': '11',           
        'selExportKind': 'A',           
        'selPaymentMethod': 'TT',       
        'selIncoterms': 'FOB',          
        'txtDestCountry': 'US',
        'txtLoadPort': 'KRPUS',
        'selTransportMode': '10',       
        'selContainerMode': 'FCL',      
        'txtGoodsLoc': '부산광역시 강서구 보세구역 123',
        'selGoodsType': 'N',            
        'selRefundApplicant': '1',      

        'txtExchangeRate': '1345.89',
        'selExchangeCurr': 'USD',
        'selCurrencyCode': 'USD',
        'txtPaymentAmount': '25000',
        'txtFreightKRW': '850000',
        'txtInsuranceKRW': '35000',
        'selContainerInd': 'Y',
        'txtCargoMgmtNo': '26EXP' + String(Math.floor(Math.random() * 1000000000)).padStart(9, '0'),
        'txtBondedReporter': '김관세사',
        'txtCarrierCode': 'HMM',
        'txtVesselName': 'PACIFIC STAR',
        'txtLoadBondedArea': '03077005',
        
        'txtBrandName': '루이비똥',             // 상표명
    	'txtModelSpec': '트레이닝 바지',       // 모델명

        'txtInvoiceNo': 'INV-2026-02-20',
        'selQtyUnit': 'EA',
        'txtUnitPrice': '500',
        'txtAmount': '25000',
        'txtPackageQty': '5.2',         
        'txtOriginCountry': 'KR',
        'selOriginCriteria': 'X',       
        'selOriginMarkYn': 'Y',         
        'selOriginCertType': 'N',       
        'selInvoiceSign': 'Y',          
        'txtAttachYn': 'N'
    };

    Object.keys(exportData).forEach(key => setVal(key, exportData[key]));
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
				    title: '로그인 정보 조회 실패',
				    text: '로그인 정보를 확인할 수 없습니다.',
				    confirmButtonColor: '#3478f6',
				    confirmButtonText: '확인',
				    heightAuto: false // 사이드바 레이아웃 보호
				});
                return;
            }

            console.log("[수출] 내 정보 자동완성 API 호출 - memId:", memId);

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
						    heightAuto: false // 사이드바 레이아웃 짤림 방지 핵심 옵션
						});
                        return;
                    }

                    // ==========================================
                    // 3. 실제 수출신고서 JSP ID에 맞춰서 데이터 꽂아넣기
                    // ==========================================
                    
                    // 수출자 기업명 (txtExporterName)
                    const exporterName = document.getElementById('txtExporterName');
                    if(exporterName) {
                        exporterName.value = data.companyName || ''; 
                        exporterName.dispatchEvent(new Event('input', { bubbles: true }));
                        exporterName.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    // 수출자 대표자명 (txtExporterRep)
                    const repName = document.getElementById('txtExporterRep');
                    if(repName) repName.value = data.memName || '';

                    // 사업자등록번호 (txtBizRegNo) - 하이픈 제거
                    const bizRegNo = document.getElementById('txtBizRegNo');
                    if(bizRegNo) {
                        let rawBizNo = data.businessNo || data.bizRegNo || data.memBizNo || ''; 
                        bizRegNo.value = rawBizNo.replace(/-/g, ''); 
                        bizRegNo.dispatchEvent(new Event('input', { bubbles: true }));
                        bizRegNo.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    // 통관고유부호 (txtExporterCustomsCode)
                    const customsId = document.getElementById('txtExporterCustomsCode');
                    if(customsId) {
                        customsId.value = data.customsIdNo || ''; 
                        customsId.dispatchEvent(new Event('input', { bubbles: true }));
                        customsId.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    // 스윗얼럿 성공 알림
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'success',
                            title: '불러오기 완료',
                            text: '수출화주 기본정보 자동입력 완료.',
                            confirmButtonColor: '#0f4c81',
                            timer: 1500,
                            scrollbarPadding: false,
                            heightAuto: false
                        });
                    } else {
                        alert("수출화주 기본정보가 성공적으로 입력되었습니다");
                    }
                    
                })
                .catch(function(error) {
                    console.error("회원 정보 조회 실패:", error);
                    Swal.fire({
				        icon: 'error',
				        title: '오류 발생',
				        text: msg || '서버와 통신 중 오류가 발생했습니다.',
				        confirmButtonColor: '#3478f6',
				        heightAuto: false
				    });
                });
        });
    }
});