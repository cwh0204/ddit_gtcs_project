<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/shipper/hs/hscode/hscode.css">
<div id="section4" class="form-section tab-content" style="display: none;">

<script src="/js/shipper/hs/hscode/hscode.js"></script>

	<table class="form-table" style="width: 100%; table-layout: fixed">
		<colgroup>
			<col style="width: 15%" />
			<col style="width: 35%" />
			<col style="width: 15%" />
			<col style="width: 35%" />
		</colgroup>

		<tr>
			<th class="required">HS부호</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtHsCode" name="hsCode" class="flex-grow" maxlength="12" placeholder="12자리" />
					<%-- ✅ id 추가 + 초기 숨김 (보완/정정 상태일 때만 표시됨) --%>
					<button type="button" class="btn-lookup edit-only-btn"
					        onclick="openHsCodePopup('txtHsCode')">HS코드조회</button>
				</div>
			</td>
			<th class="required">관세구분</th>
			<td>
				<select id="selTaxKind" name="taxType" class="flex-grow">
					<option value="">-선택-</option>
					<option value="A">기본세율</option>
					<option value="F">FTA 협정관세율</option>
				</select>
			</td>
		</tr>

		<tr>
			<th class="required">관세액기준</th>
			<td>
				<label><input type="radio" name="taxBaseType" value="PRICE" checked /> 종가</label>
				<label style="margin-left: 10px;"><input type="radio" name="taxBaseType" value="QUANTITY" /> 종량</label>
			</td>
			<th class="required">신고품명</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtItemName" name="itemNameDeclared" class="flex-grow" maxlength="50" />
					<%-- ✅ id 추가 + 초기 숨김 (보완/정정 상태일 때만 표시됨) --%>
					<button type="button" class="btn-lookup edit-only-btn">거래품명조회</button>
				</div>
			</td>
		</tr>

		<tr>
			<th class="required">거래품명</th>
			<td><input type="text" id="txtTradeName" name="itemNameTrade" class="flex-grow" maxlength="50" /></td>
			<th>모델 (규격)</th>
			<td><input type="text" id="txtModelSpec" name="modelName" class="flex-grow" maxlength="150" /></td>
		</tr>

		<tr>
			<th class="required">수량</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtQty" name="qty" class="flex-grow" style="text-align: right;" placeholder="0" />
					<select id="selQtyUnit" name="qtyUnit" style="width: 80px; margin-left: 5px;">
						<option value="">-단위-</option>
						<option value="EA">EA</option>
						<option value="KG">KG</option>
						<option value="M">M</option>
						<option value="SET">SET</option>
						<option value="BOX">BOX</option>
					</select>
				</div>
			</td>
			<th class="required">단가</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtUnitPrice" name="unitPrice" class="flex-grow" style="text-align: right;" placeholder="0.00" />
					<span style="font-size: 11px; color:#888; margin-left:5px;">(단위당)</span>
				</div>
			</td>
		</tr>

		<tr>
			<th class="required">금액</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtAmount" name="totalAmount" class="flex-grow" style="text-align: right;" placeholder="0.00" readonly />
					<span style="font-size: 11px; color:#888; margin-left:5px;">(자동계산)</span>
				</div>
			</td>
			<th class="required">순중량</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtNetWeight" name="netWeight" class="flex-grow" style="text-align: right;" placeholder="0" />
					<span>KG</span>
				</div>
			</td>
		</tr>

		<tr>
			<th class="required">과세가격</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtTaxableValueKRW" name="taxBaseAmtItem" style="text-align: right" class="flex-grow" placeholder="0" />
					<span>KRW</span>
				</div>
			</td>
			<th>환율 참고용 (USD)</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtTaxableValueUSD" style="text-align: right" class="flex-grow" placeholder="0.00" readonly />
					<span>USD</span>
				</div>
			</td>
		</tr>

		<tr>
			<th class="required">원산지코드</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtOriginCode" name="originCode" class="flex-grow" maxlength="2" placeholder="예: KR, CN, US" style="text-transform: uppercase;" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
			<th class="required">원산지표시유무</th>
			<td>
				<select id="selOriginMarkYN" name="originMarkYn" class="flex-grow">
					<option value="">-선택-</option>
					<option value="Y">Y (표시)</option>
					<option value="N">N (미표시)</option>
				</select>
			</td>
		</tr>
	</table>
</div>

<script>
// ===================================================================
// [물품정보 자동 계산 및 유효성 검사]
// ===================================================================

function calculateAmount() {
    var qtyInput = document.getElementById('txtQty');
    var unitPriceInput = document.getElementById('txtUnitPrice');
    var amountInput = document.getElementById('txtAmount');
    
    if (!qtyInput || !unitPriceInput || !amountInput) return;
    
    var qty = parseFloat(qtyInput.value) || 0;
    var unitPrice = parseFloat(unitPriceInput.value) || 0;
    var amount = qty * unitPrice;
    
    amountInput.value = amount > 0 ? amount.toFixed(2) : '';
}

function calculateUSD() {
    var krwInput = document.getElementById('txtTaxableValueKRW');
    var usdInput = document.getElementById('txtTaxableValueUSD');
    
    if (!krwInput || !usdInput) return;
    
    var krw = parseFloat(krwInput.value) || 0;
    var exchangeRate = 1300;
    var usd = krw / exchangeRate;
    
    usdInput.value = usd > 0 ? usd.toFixed(2) : '';
}

function validateSection3() {
    var errors = [];
    
    var hsCode = document.getElementById('txtHsCode').value.trim();
    var taxType = document.getElementById('selTaxKind').value;
    var taxBaseType = document.querySelector('input[name="taxBaseType"]:checked') ? 
                      document.querySelector('input[name="taxBaseType"]:checked').value : '';
    var itemNameDeclared = document.getElementById('txtItemName').value.trim();
    var itemNameTrade = document.getElementById('txtTradeName').value.trim();
    var qty = document.getElementById('txtQty').value.trim();
    var qtyUnit = document.getElementById('selQtyUnit').value;
    var unitPrice = document.getElementById('txtUnitPrice').value.trim();
    var totalAmount = document.getElementById('txtAmount').value.trim();
    var netWeight = document.getElementById('txtNetWeight').value.trim();
    var taxBaseAmtItem = document.getElementById('txtTaxableValueKRW').value.trim();
    var originCode = document.getElementById('txtOriginCode').value.trim();
    var originMarkYn = document.getElementById('selOriginMarkYN').value;
    
    if (!hsCode) errors.push('HS부호는 필수입니다.');
    if (!taxType) errors.push('관세구분은 필수입니다.');
    if (!taxBaseType) errors.push('관세액기준은 필수입니다.');
    if (!itemNameDeclared) errors.push('신고품명은 필수입니다.');
    if (!itemNameTrade) errors.push('거래품명은 필수입니다.');
    if (!qty) errors.push('수량은 필수입니다.');
    if (!qtyUnit) errors.push('수량 단위는 필수입니다.');
    if (!unitPrice) errors.push('단가는 필수입니다.');
    if (!totalAmount) errors.push('금액이 계산되지 않았습니다.');
    if (!netWeight) errors.push('순중량은 필수입니다.');
    if (!taxBaseAmtItem) errors.push('과세가격(란별)은 필수입니다.');
    if (!originCode) errors.push('원산지코드는 필수입니다.');
    if (!originMarkYn) errors.push('원산지표시유무는 필수입니다.');
    
    if (hsCode && hsCode.length !== 12) errors.push('HS부호는 12자리여야 합니다.');
    if (originCode && originCode.length !== 2) errors.push('원산지코드는 2자리 국가코드여야 합니다 (예: KR, CN, US).');
    
    if (qty && isNaN(parseFloat(qty))) errors.push('수량은 숫자여야 합니다.');
    else if (qty && parseFloat(qty) <= 0) errors.push('수량은 0보다 커야 합니다.');
    
    if (unitPrice && isNaN(parseFloat(unitPrice))) errors.push('단가는 숫자여야 합니다.');
    else if (unitPrice && parseFloat(unitPrice) <= 0) errors.push('단가는 0보다 커야 합니다.');
    
    if (netWeight && isNaN(parseFloat(netWeight))) errors.push('순중량은 숫자여야 합니다.');
    else if (netWeight && parseFloat(netWeight) <= 0) errors.push('순중량은 0보다 커야 합니다.');
    
    if (taxBaseAmtItem && isNaN(parseFloat(taxBaseAmtItem))) errors.push('과세가격은 숫자여야 합니다.');
    
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
        document.addEventListener('DOMContentLoaded', initSection3);
    } else {
        initSection3();
    }
    
    function initSection3() {
        var qtyInput = document.getElementById('txtQty');
        var unitPriceInput = document.getElementById('txtUnitPrice');
        
        if (qtyInput) {
            qtyInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '');
                calculateAmount();
            });
            qtyInput.addEventListener('blur', calculateAmount);
        }
        
        if (unitPriceInput) {
            unitPriceInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '');
                calculateAmount();
            });
            unitPriceInput.addEventListener('blur', calculateAmount);
        }
        
        var taxableKRW = document.getElementById('txtTaxableValueKRW');
        if (taxableKRW) {
            taxableKRW.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                calculateUSD();
            });
            taxableKRW.addEventListener('blur', calculateUSD);
        }
        
        var numberInputs = ['txtNetWeight'];
        numberInputs.forEach(function(id) {
            var input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function(e) {
                    this.value = this.value.replace(/[^0-9.]/g, '');
                });
                input.addEventListener('blur', function(e) {
                    if (this.value) {
                        var num = parseFloat(this.value);
                        if (!isNaN(num)) this.value = num.toFixed(2);
                    }
                });
            }
        });
        
        var hsCodeInput = document.getElementById('txtHsCode');
        if (hsCodeInput) {
            hsCodeInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '').substring(0, 12);
            });
        }
        
        var originCodeInput = document.getElementById('txtOriginCode');
        if (originCodeInput) {
            originCodeInput.addEventListener('input', function(e) {
                this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
            });
        }
        
        console.log('✅ Section3 초기화 완료');
    }
})();
</script>
