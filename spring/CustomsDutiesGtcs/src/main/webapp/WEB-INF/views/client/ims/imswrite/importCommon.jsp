<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="section1" class="form-section tab-content active">

	<span class="section-title">거래당사자 정보</span>
	<table class="form-table" style="width: 100%; table-layout: fixed">
		<colgroup>
			<col style="width: 15%" />
			<col style="width: 35%" />
			<col style="width: 15%" />
			<col style="width: 35%" />
		</colgroup>
		<tr>
			<th class="required">기업명</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtImporterTradeName" name="importerName" class="flex-grow" />
				</div>
			</td>
			<th class="required">성명</th>
			<td>
				<input type="text" id="txtTaxpayerName" name="repName" class="flex-grow" />
			</td>
		</tr>
		<tr>
			<th class="required">전화번호(내선)</th>
			<td>
				<div class="flex-row">
                    <input type="text" id="txtRepTel" name="telNo" class="flex-grow" placeholder="번호" /> 
					<input type="text" id="txtRepTelExt" class="flex-grow" style="width: 60px" placeholder="내선" />
				</div>
			</td>
			<th class="required">이메일</th>
			<td>
			    <input type="hidden" id="hiddenEmail" name="email" />
			    
			    <div class="flex-row" style="align-items: center; gap: 5px; width: 100%;">
			        
			        <input type="text" id="txtTaxpayerEmailId" class="flex-grow" placeholder="아이디" 
			               style="flex: 1; width: 100px; min-width: 100px;" />
			        
			        <span>@</span>
			        
			        <input type="text" id="txtTaxpayerEmailDomain" class="flex-grow" placeholder="도메인" 
			               style="flex: 1; width: 100px; min-width: 100px;" />
			        
			        <select id="selTaxpayerEmailDomain" class="w-fixed" onchange="changeEmailDomain()" style="width: 120px;">
			            <option value="">-선택-</option>
			            <option value="naver.com">naver.com</option>
			            <option value="gmail.com">gmail.com</option>
			            <option value="hanmail.net">hanmail.net</option>
			            <option value="direct">직접입력</option>
			        </select>
			    </div>
			</td>
		</tr>
		<tr>
			<th class="required">사업자등록번호</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtBizRegNo" name="bizRegNo" class="flex-grow" placeholder="'-' 없이 입력" />
				</div>
			</td>
			<th class="required">통관고유부호</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtTaxpayerCode" name="customsId" class="flex-grow" />
				</div>
			</td>
		</tr>
		<tr>
			<th class="required">주소</th>
			<td colspan="3">
				<div class="flex-row">
					<input type="text" id="txtAddress" name="address" class="flex-grow" />
				</div>
			</td>
		</tr>
		<tr>
			<th class="required">해외거래처명</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtOverseasBiz" name="overseasBizName" class="flex-grow" />
				</div>
			</td>
			<th class="required">해외거래처국적</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtOverseasNation" name="overseasCountry" class="flex-grow" />
				</div>
			</td>
		</tr>
	</table>

	<span class="section-title">기본신고사항</span>
	<table class="form-table" style="width: 100%; table-layout: fixed">
		<colgroup>
			<col style="width: 15%" />
			<col style="width: 35%" />
			<col style="width: 15%" />
			<col style="width: 35%" />
		</colgroup>
		<tr>
			<th class="required">수입종류</th>
			<td>
				<select id="selImportType" name="importType" class="flex-grow">
					<option value="">-선택-</option>
					<option value="11">신속</option> 
					<option value="21">일반</option>
				</select>
			</td>
			<th class="required">화물관리번호</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtCargoManageNo" name="cargoMgmtNo" class="flex-grow" />
				</div>
			</td>
		</tr>
		<tr>
			<th class="required">운송수단</th>
			<td>
				<div class="flex-row">
					<label><input type="radio" name="transMode" value="sea" checked> 선박(Sea)</label>
					<label style="margin-left: 10px"><input type="radio" name="transMode" value="air"> 항공(Air)</label>
				</div>
			</td>
			<th class="required">선기명</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtVesselName" name="vesselName" class="flex-grow" placeholder="선기명 입력" />
				</div>
			</td>
		</tr>
		<tr>
			<th>선기국적</th>
			<td>
				<select id="selVesselNation" name="vesselNation" class="flex-grow">
					<option value="">-선택-</option>
					<option value="KR">KR</option>
					<option value="US">US</option>
					<option value="CN">CN</option>
					<option value="JP">JP</option>
				</select>
			</td>
			<th class="required">입항(예정)일</th>
			<td><input type="date" id="dateArrival" name="arrivalEstDate" class="flex-grow" /></td>
		</tr>
		<tr>
			<th class="required">보세구역 반입일자</th>
			<td><input type="date" id="dateCarryIn" name="bondedInDate" class="flex-grow" /></td>
			<th class="required">원산지</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtImportNation" name="originCountry" class="flex-grow" />
				</div>
			</td>
		</tr>
		<tr>
			<th>도착항</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtArrivalPort" name="arrivalPort" class="flex-grow" />
				</div>
			</td>
			<th>B/L 또는 AWB</th>
			<td>
				<!-- B/L과 AWB 분리 입력 (DTO 매칭) -->
				<div class="flex-row" style="gap: 5px;">
					<input type="text" id="txtBLNo" name="blNo" class="flex-grow" placeholder="B/L 번호" />
					<input type="text" id="txtAwbNo" name="awbNo" class="flex-grow" placeholder="AWB 번호" />
				</div>
			</td>
		</tr>
	</table>
</div>

<script>
// ===================================================================
// [이메일 통합 처리 함수]
// ===================================================================
function changeEmailDomain() {
    const select = document.getElementById('selTaxpayerEmailDomain');
    const domainInput = document.getElementById('txtTaxpayerEmailDomain');
    
    if (select.value === 'direct') {
        domainInput.value = '';
        domainInput.readOnly = false;
        domainInput.focus();
    } else if (select.value) {
        domainInput.value = select.value;
        domainInput.readOnly = true;
    } else {
        domainInput.value = '';
        domainInput.readOnly = false;
    }
    
    // 이메일 통합
    updateEmailField();
}

// 이메일 아이디나 도메인 변경 시 호출
function updateEmailField() {
    const emailId = document.getElementById('txtTaxpayerEmailId').value.trim();
    const emailDomain = document.getElementById('txtTaxpayerEmailDomain').value.trim();
    const hiddenEmail = document.getElementById('hiddenEmail');
    
    if (emailId && emailDomain) {
        hiddenEmail.value = emailId + '@' + emailDomain;
    } else {
        hiddenEmail.value = '';
    }
}

// 이메일 입력 필드에 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const emailIdInput = document.getElementById('txtTaxpayerEmailId');
    const emailDomainInput = document.getElementById('txtTaxpayerEmailDomain');
    
    if (emailIdInput) {
        emailIdInput.addEventListener('input', updateEmailField);
        emailIdInput.addEventListener('blur', updateEmailField);
    }
    
    if (emailDomainInput) {
        emailDomainInput.addEventListener('input', updateEmailField);
        emailDomainInput.addEventListener('blur', updateEmailField);
    }
});
</script>
