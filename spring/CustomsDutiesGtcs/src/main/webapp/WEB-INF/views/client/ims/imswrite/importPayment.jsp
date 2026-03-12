<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<style>
/* ─── importPayment 전용: flex-row / w-fixed 보정 ─── */
#section3 .flex-row {
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}
#section3 .flex-row select.w-fixed {
    flex: 0 0 80px !important;
    width: 80px !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
}
#section3 .flex-row input.flex-grow {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    width: 0 !important; /* flex 컨텍스트에서 줄어들 수 있도록 */
    box-sizing: border-box !important;
}
</style>

<div id="section3" class="form-section tab-content" style="display: none;">

	<span class="section-title">가격신고 기본정보</span>
	<table class="form-table" style="width: 100%; table-layout: fixed; margin-bottom: 20px;">
		<colgroup>
			<col style="width: 15%" /> <col style="width: 35%" />
			<col style="width: 15%" /> <col style="width: 35%" />
		</colgroup>
		<tr>
			<th class="required">작성일자</th>
			<td><input type="date" id="dateWrite" name="writeDate" class="flex-grow" /></td>
			<th class="required">결제금액</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtCurrency" name="currencyCode" placeholder="통화" style="flex:0 0 60px; width:60px; min-width:0; text-transform:uppercase; box-sizing:border-box;" maxlength="3" /> 
					<input type="text" id="txtPayAmt" name="payAmount" class="flex-grow" style="text-align: right;" placeholder="0.00" />
				</div>
			</td>
		</tr>
		<tr>
			<th class="required">인보이스 번호</th>
			<td><input type="text" id="txtInvNo" name="invoiceNo" class="flex-grow" maxlength="20" /></td>
			<th class="required">인보이스 발행일</th>
			<td><input type="date" id="dateInv" name="invoiceDate" class="flex-grow" /></td>
		</tr>
		<tr>
			<th class="required">계약번호</th>
			<td><input type="text" id="txtContractNo" name="contractNo" class="flex-grow" maxlength="15" /></td>
			<th class="required">계약일자</th>
			<td><input type="date" id="dateCont" name="contractDate" class="flex-grow" /></td>
		</tr>
		<tr>
			<th class="required">구매주문서번호</th>
			<td><input type="text" id="txtPoNo" name="poNo" class="flex-grow" maxlength="15" /></td>
			<th class="required">구매주문일</th>
			<td><input type="date" id="datePo" name="poDate" class="flex-grow" /></td>
		</tr>
	</table>

	<span class="section-title">결제 및 세액 정보</span>
	<table class="form-table" style="width: 100%; table-layout: fixed; margin-bottom: 20px;">
		<colgroup>
			<col style="width: 15%" /> <col style="width: 35%" />
			<col style="width: 15%" /> <col style="width: 35%" />
		</colgroup>
		<tr>
			<th class="required">인도조건</th>
			<td>
				<select id="selIncoterms" name="incoterms" class="w-fixed">
					<option value="">-선택-</option>
					<option value="CIF">CIF</option>
					<option value="FOB">FOB</option>
					<option value="EXW">EXW</option>
				</select>
			</td>
			<th class="required">총중량</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtTotalWeight" name="totalWeight" class="flex-grow" style="text-align: right" value="0" /> 
					<span style="flex:0 0 auto; white-space:nowrap;">KG</span>
				</div>
			</td>
		</tr>
		<tr>
			<th>원산지증명서유무</th>
			<td>
				<select id="selOriginCertYn" name="originCertYn" class="flex-grow">
					<option value="">-선택-</option>
					<option value="Y">Y (유)</option>
					<option value="N">N (무)</option>
				</select>
			</td>
			<th>운임료</th>
			<td>
				<div class="flex-row">
					<select id="selFreightCurr" name="freightCurrency" class="w-fixed">
						<option value="">통화</option>
						<option value="KRW">KRW</option>
						<option value="USD">USD</option>
					</select> 
					<input type="text" id="txtFreightAmt" name="freightAmt" class="flex-grow" style="text-align: right" placeholder="0" />
				</div>
			</td>
		</tr>
		<tr>
			<th>보험료</th>
			<td>
				<div class="flex-row">
					<select id="selInsurCurr" name="insuranceCurrency" class="w-fixed">
						<option value="">통화</option>
						<option value="KRW">KRW</option>
						<option value="USD">USD</option>
					</select> 
					<input type="text" id="txtInsurAmt" name="insuranceAmt" class="flex-grow" style="text-align: right" placeholder="0" />
				</div>
			</td>
			<th>가산금액</th>
			<td>
				<div class="flex-row">
					<select id="selAddCurr" name="addAmtCurrency" class="w-fixed">
						<option value="">통화</option>
						<option value="KRW">KRW</option>
					</select> 
					<input type="text" id="txtAddAmt" name="addAmt" class="flex-grow" style="text-align: right" placeholder="0" />
				</div>
			</td>
		</tr>
		<tr>
			<th>총과세가격</th>
			<td><input type="text" id="txtTotalTaxable" name="totalTaxBase" class="readonly-input flex-grow" value="0" /></td>
			<th>총관세</th>
			<td><input type="text" id="txtTotalDuty" name="totalDuty" class="readonly-input flex-grow" value="0" /></td>
		</tr>
		<tr>
			<th>총부가세</th>
			<td><input type="text" id="txtTotalVat" name="totalVat" class="readonly-input flex-grow" value="0"  /></td>
			<th>총세액합계</th>
			<td><input type="text" id="txtTotalTaxSum" name="totalTaxSum" class="readonly-input flex-grow" value="0" style="font-weight: bold; color: #0f4c81;" /></td>
		</tr>
	</table>

    <span class="section-title">컨테이너 정보</span>
    <table class="form-table" style="width: 100%;">
        <colgroup>
            <col style="width: 15%">
            <col style="width: 85%">
        </colgroup>
        <tr>
            <th class="required">컨테이너 번호</th>
            <td>
                <input type="text" id="txtContainerNo" name="containerNumbers" class="flex-grow" 
                       placeholder="컨테이너 번호 1개를 입력하세요 (예: ABCD1234567)" maxlength="20" 
                       style="text-transform: uppercase;" />
            </td>
        </tr>
    </table>
</div>

<script>
// ===================================================================
// [Section2 유효성 검사]
// ===================================================================
function validateSection2() {
    var errors = [];
    
    var writeDate = document.getElementById('dateWrite').value;
    var currencyCode = document.getElementById('txtCurrency').value.trim();
    var payAmount = document.getElementById('txtPayAmt').value.trim();
    var invoiceNo = document.getElementById('txtInvNo').value.trim();
    var invoiceDate = document.getElementById('dateInv').value;
    var contractNo = document.getElementById('txtContractNo').value.trim();
    var contractDate = document.getElementById('dateCont').value;
    var poNo = document.getElementById('txtPoNo').value.trim();
    var poDate = document.getElementById('datePo').value;
    var incoterms = document.getElementById('selIncoterms').value;
    var totalWeight = document.getElementById('txtTotalWeight').value.trim();
    var containerNo = document.getElementById('txtContainerNo').value.trim();
    
    if (!writeDate) errors.push('작성일자는 필수입니다.');
    if (!currencyCode) errors.push('통화 코드는 필수입니다.');
    if (!payAmount) errors.push('결제금액은 필수입니다.');
    if (!invoiceNo) errors.push('인보이스 번호는 필수입니다.');
    if (!invoiceDate) errors.push('인보이스 발행일은 필수입니다.');
    if (!contractNo) errors.push('계약번호는 필수입니다.');
    if (!contractDate) errors.push('계약일자는 필수입니다.');
    if (!poNo) errors.push('구매주문서번호는 필수입니다.');
    if (!poDate) errors.push('구매주문일은 필수입니다.');
    if (!incoterms) errors.push('인도조건은 필수입니다.');
    
    if (!totalWeight || parseFloat(totalWeight) <= 0) {
        errors.push('총중량은 필수이며 0보다 커야 합니다.');
    }
    
    if (!containerNo) {
        errors.push('컨테이너 번호는 필수입니다.');
    } else if (containerNo.length > 20) {
        errors.push('컨테이너 번호는 12자리를 넘을 수 없습니다.');
    }
    
    if (payAmount && isNaN(parseFloat(payAmount.replace(/,/g, '')))) {
        errors.push('결제금액은 숫자여야 합니다.');
    }
    
    if (errors.length > 0) {
        alert('다음 항목을 확인해주세요:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// ===================================================================
// [페이지 로드 시 초기화]
// ===================================================================
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSection2);
    } else {
        initSection2();
    }
    
    function initSection2() {
        console.log('📄 Section2 페이지 초기화 (심플 버전)');
        
        var numberInputs = [
            'txtPayAmt', 'txtTotalWeight', 'txtFreightAmt', 
            'txtInsurAmt', 'txtAddAmt'
        ];
        
        numberInputs.forEach(function(id) {
            var input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9.]/g, '');
                });
            }
        });
        
        var upperInputs = ['txtCurrency', 'txtContainerNo'];
        upperInputs.forEach(function(id) {
            var input = document.getElementById(id);
            if(input) {
                input.addEventListener('input', function(e) {
                    this.value = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                });
            }
        });
        
        console.log('✅ Section2 초기화 완료');
    }
})();
</script>
