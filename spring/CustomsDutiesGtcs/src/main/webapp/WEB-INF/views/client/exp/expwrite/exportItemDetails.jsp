<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<link rel="stylesheet" href="/css/shipper/hs/hscode/hscode.css">

<div id="section3" class="form-section tab-content">
<script src="/js/shipper/hs/hscode/hscode.js"></script>
    <table class="form-table">
   		 <tr>
            <th class="required">인보이스 번호</th>
            <td colspan="3">
                <input type="text" id="txtInvoiceNo" name="invoiceNo" class="flex-grow" placeholder="인보이스 번호를 입력하세요" />
            </td>
        </tr>
        <tr>
		    <th class="required">HS부호</th>
		    <td colspan="3">
		        <div class="flex-row">
		            <input type="text" id="txtHsCode" name="hsCode" class="flex-grow" style="max-width: 200px;" />
		            
		            <button type="button" class="btn-lookup edit-only-btn" onclick="openHsCodePopup('txtHsCode')">HS코드조회</button>
		        </div>
		    </td>
		</tr>

        <tr>
            <th class="required">수출물품명</th>
            <td colspan="3">
                <div class="flex-row">
                    <input type="text" id="txtGoodsDesc" name="itemNameDeclared" class="flex-grow" />
                    <button type="button" class="btn-lookup edit-only-btn" onclick="alert('준비중...')">거래품명조회</button>
                </div>
            </td>
        </tr>
        <tr>
            <th class="required">거래품명</th>
            <td><input type="text" id="txtTradeName" name="itemNameTrade" class="flex-grow" /></td>
            <th>상표명</th>
            <td><input type="text" id="txtBrandName" name="brandName" class="flex-grow" /></td>
        </tr>

        <tr>
            <th class="required">모델 (규격)</th>
            <td colspan="3">
                <input type="text" id="txtModelSpec" name="modelName" class="flex-grow" placeholder="모델명 및 상세 규격 입력" />
            </td>
        </tr>

        <tr>
            <th class="required">수량/단위</th>
            <td>
                <div class="flex-row">
                    <input type="text" id="txtQty" name="qty" class="flex-grow" style="text-align: right;" placeholder="수량" />
                    <select id="selQtyUnit" name="qtyUnit" class="w-fixed" style="width: 80px; margin-left: 5px;">
                        <option value="EA">EA</option>
                        <option value="KG">KG</option>
                    </select>
                </div>
            </td>
            <th class="required">단가</th>
            <td>
                <div class="flex-row">
                    <input type="text" id="txtUnitPrice" name="unitPrice" class="flex-grow" style="text-align: right;" placeholder="0.00" />
                </div>
            </td>
        </tr>

        <tr>
            <th class="required">총 금액</th>
            <td>
                <div class="flex-row">
                    <input type="text" id="txtAmount" name="totalDeclAmt" class="flex-grow" style="text-align: right;" placeholder="0.00" />
                </div>
            </td>
            <th class="required">총중량</th>
            <td>
                <div class="flex-row">
                    <input type="text" id="txtNetWeight" name="totalWeight" class="flex-grow" style="text-align: right;" /> 
                </div>
            </td>
        </tr>
        
        <tr>
            <th class="required">전체 포장 개수</th>
            <td>
                <div class="flex-row">
                    <input type="text" id="txtPackageQty" name="totalPackCnt" class="flex-grow" style="text-align: right;" placeholder="0" />
                </div>
            </td>
            <th></th> <td></td>
        </tr>
        
        <tr>
            <th class="required">원산지국가</th>
            <td>
                <div class="flex-row">
                    <input type="text" id="txtOriginCountry" name="originCountry" class="flex-grow" />
                    <button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </td>
            <th>원산지결정기준</th>
            <td>
                <select id="selOriginCriteria" name="originCriteria" class="flex-grow">
                    <option value="">-선택-</option>
                    <option value="X">X (비대상)</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>원산지표시여부</th>
            <td>
                <select id="selOriginMarkYn" name="originMarkYn" class="flex-grow">
                    <option value="Y">Y (표시)</option>
                    <option value="N">N (미표시)</option>
                    <option value="E">E (비대상)</option>
                </select>
            </td>
            <th class="required">원산지증명서발급구분</th>
            <td>
                <div class="flex-row">
                    <select id="selOriginCertType" name="originCertType" class="flex-grow">
                        <option value="N">N (미발급)</option>
                        <option value="Y">Y (발급)</option>
                    </select>
                    <button type="button" class="btn-lookup edit-only-btn" onclick="alert('준비중...')">인증수출자 조회</button>
                </div>
            </td>
        </tr>
        
        <tr>
            <th class="required">인보이스 서명여부</th>
            <td>
                <select id="selInvoiceSign" name="invoiceSign" class="flex-grow">
                    <option value="Y">Y (서명있음)</option>
                    <option value="N" selected>N (서명없음)</option>
                </select>
            </td>
            <th>첨부파일 여부</th>
            <td>
                <input type="text" id="txtAttachYn" name="attachYn" value="N" readonly style="background-color: #eee;" />
            </td>
        </tr>
    </table>
</div>