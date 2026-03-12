<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<link rel="stylesheet" href="/css/shipper/hs/hscode/hscode.css">

<div id="section3" class="form-section tab-content">
<script src="/js/shipper/hs/hscode/hscode.js"></script>
    <table class="form-table" style="width: 100%; table-layout: fixed;">
        <colgroup>
            <col style="width: 15%" />
            <col style="width: 35%" />
            <col style="width: 15%" />
            <col style="width: 35%" />
        </colgroup>

        <tr>
            <th class="required">인보이스 번호</th>
            <td colspan="3">
                <input type="text" id="txtInvoiceNo" name="invoiceNo" class="flex-grow" placeholder="인보이스 번호를 입력하세요" style="width: 100%;" />
            </td>
        </tr>
        <tr>
            <th class="required">HS부호</th>
            <td colspan="3">
                <div class="flex-row" style="gap: 5px;">
                    <input type="text" id="txtHsCode" name="hsCode" class="flex-grow" style="max-width: 200px;" placeholder="HS Code" />
                    <button type="button" class="btn-lookup edit-only-btn" onclick="openHsCodePopup('txtHsCode')">HS코드조회</button>
                </div>
            </td>
        </tr>

        <tr>
            <th class="required">수출물품명</th>
            <td colspan="3">
                <input type="text" id="txtGoodsDesc" name="itemNameDeclared" class="flex-grow" style="width: 100%;" />
            </td>
        </tr>
        <tr>
            <th class="required">거래품명</th>
            <td><input type="text" id="txtTradeName" name="itemNameTrade" class="flex-grow" style="width: 100%;" /></td>
            <th class="required">상표명</th>
            <td><input type="text" id="txtBrandName" name="brandName" class="flex-grow" style="width: 100%;" /></td>
        </tr>

        <tr>
            <th class="required">모델 (규격)</th>
            <td colspan="3">
                <input type="text" id="txtModelSpec" name="modelName" class="flex-grow" placeholder="모델명 및 상세 규격 입력" style="width: 100%;" />
            </td>
        </tr>

        <tr>
            <th class="required">수량/단위</th>
            <td>
                <div class="flex-row" style="gap: 5px;">
                    <input type="text" id="txtQty" name="qty" class="flex-grow" style="text-align: right; width: calc(100% - 85px);" placeholder="수량" />
                    <select id="selQtyUnit" name="qtyUnit" class="w-fixed" style="width: 80px;">
                        <option value="EA">EA</option>
                        <option value="KG">KG</option>
                    </select>
                </div>
            </td>
            <th class="required">단가</th>
            <td>
                <input type="text" id="txtUnitPrice" name="unitPrice" class="flex-grow" style="text-align: right; width: 100%;" placeholder="0.00" />
            </td>
        </tr>

        <tr>
            <th class="required">총 금액</th>
            <td>
                <input type="text" id="txtAmount" name="totalDeclAmt" class="flex-grow" style="text-align: right; width: 100%;" placeholder="0.00" />
            </td>
            <th class="required">총중량</th>
            <td>
                <input type="text" id="txtNetWeight" name="totalWeight" class="flex-grow" style="text-align: right; width: 100%;" /> 
            </td>
        </tr>
        
        <tr>
            <th class="required">전체 포장 개수</th>
            <td>
                <input type="text" id="txtPackageQty" name="totalPackCnt" class="flex-grow" style="text-align: right; width: 100%;" placeholder="0" />
            </td>
            <th></th> 
            <td></td>
        </tr>
        
        <tr>
            <th class="required">원산지국가</th>
            <td>
                <input type="text" id="txtOriginCountry" name="originCountry" class="flex-grow" style="width: 100%;" />
            </td>
            <th>원산지결정기준</th>
            <td>
                <select id="selOriginCriteria" name="originCriteria" class="flex-grow" style="width: 100%;">
                    <option value="">-선택-</option>
                    <option value="X">X (비대상)</option>
                    <option value="Y">Y (대상)</option>
                </select>
            </td>
        </tr>
        <tr>
            <th>원산지표시여부</th>
            <td>
                <select id="selOriginMarkYn" name="originMarkYn" class="flex-grow" style="width: 100%;">
                    <option value="Y">Y (표시)</option>
                    <option value="N">N (미표시)</option>
                    <option value="E">E (비대상)</option>
                </select>
            </td>
            <th class="required">원산지증명서발급구분</th>
            <td>
                <select id="selOriginCertType" name="originCertType" class="flex-grow" style="width: 100%;">
                    <option value="N">N (미발급)</option>
                    <option value="Y">Y (발급)</option>
                </select>
            </td>
        </tr>
        
        <tr>
            <th class="required">인보이스 서명여부</th>
            <td>
                <select id="selInvoiceSign" name="invoiceSign" class="flex-grow" style="width: 100%;">
                    <option value="Y">Y (서명있음)</option>
                    <option value="N" selected>N (서명없음)</option>
                </select>
            </td>
            <th>첨부파일 여부</th>
			<td>
			    <select id="selAttachYn" name="attachYn" class="flex-grow" style="width: 100%;">
			        <option value="N">N (없음)</option>
			        <option value="Y">Y (있음)</option>
			    </select>
			</td>
        </tr>
    </table>
</div>