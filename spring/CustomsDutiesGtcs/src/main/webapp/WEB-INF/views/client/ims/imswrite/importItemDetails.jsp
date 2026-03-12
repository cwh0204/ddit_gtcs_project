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
					<%-- id 추가 + 초기 숨김 (보완/정정 상태일 때만 표시됨) --%>
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
						<option value="PCS">PSC</option>
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
// [물품정보 자동 계산 및 이벤트 바인딩]
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
    var exchangeRate = 1300; // 고정 환율
    var usd = krw / exchangeRate;
    
    usdInput.value = usd > 0 ? usd.toFixed(2) : '';
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
        
        // 수량 입력 이벤트
        if (qtyInput) {
            qtyInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '');
                calculateAmount();
            });
            qtyInput.addEventListener('blur', calculateAmount);
        }
        
        // 단가 입력 이벤트
        if (unitPriceInput) {
            unitPriceInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '');
                calculateAmount();
            });
            unitPriceInput.addEventListener('blur', calculateAmount);
        }
        
        // 과세가격(KRW) 입력 이벤트
        var taxableKRW = document.getElementById('txtTaxableValueKRW');
        if (taxableKRW) {
            taxableKRW.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                calculateUSD();
            });
            taxableKRW.addEventListener('blur', calculateUSD);
        }
        
        // 숫자만 입력받는 항목들 포맷팅
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
        
        // HS코드 입력 제한 (숫자와 점만 허용)
        var hsCodeInput = document.getElementById('txtHsCode');
        if (hsCodeInput) {
            hsCodeInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '').substring(0, 12);
            });
        }
        
        // 원산지코드 대문자 및 영문만 허용
        var originCodeInput = document.getElementById('txtOriginCode');
        if (originCodeInput) {
            originCodeInput.addEventListener('input', function(e) {
                this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
            });
        }
        
        console.log('Section3(물품정보) 자동계산 및 이벤트 초기화 완료');
    }
})();
</script>
