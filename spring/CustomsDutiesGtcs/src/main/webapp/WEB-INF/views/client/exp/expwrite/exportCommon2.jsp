<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<div id="section2" class="form-section tab-content">
    <table class="form-table" style="width: 100%; table-layout: fixed">
        <colgroup>
            <col style="width: 15%" />
            <col style="width: 35%" />
            <col style="width: 15%" />
            <col style="width: 35%" />
        </colgroup>
        <tbody>
            <tr>
                <th class="required">적용환율</th>
                <td>
                    <div class="flex-row" style="gap: 5px;">
                    	<select id="selExchangeCurr" style="width: 100px;">
                            <option value="USD">USD</option>
                            <option value="CNY">CNY</option>
                            <option value="TWD">TWD</option>
                        </select>
                        <input type="text" id="txtExchangeRate" name="exchangeRate" class="flex-grow text-right" placeholder="0.00" />
                        
                    </div>
                </td>
                <th class="required">통화코드 / 결제금액</th>
                <td>
                    <div class="flex-row" style="gap: 5px;">
                        <select id="selCurrencyCode" name="currencyCode" style="width: 80px;">
                            <option value="USD" selected>USD</option>
                            <option value="CNY">CNY</option>
                            <option value="TWD">TWD</option>
                        </select>
                        <input type="text" id="txtPaymentAmount" name="payAmount" class="flex-grow text-right" value="0" placeholder="0.00" />
                    </div>
                </td>
            </tr>

            <tr>
                <th>운임료</th>
                <td>
                    <div class="flex-row" style="gap: 5px;">
                        <input type="text" id="txtFreightUSD" class="flex-grow text-right" placeholder="USD" />
                        <span>/</span>
                        <input type="text" id="txtFreightKRW" name="freightAmt" class="flex-grow text-right" placeholder="KRW" />
                    </div>
                </td>
                <th>운송보험료</th>
                <td>
                    <div class="flex-row" style="gap: 5px;">
                        <input type="text" id="txtInsuranceUSD" class="flex-grow text-right" placeholder="USD" />
                        <span>/</span>
                        <input type="text" id="txtInsuranceKRW" name="insuranceAmt" class="flex-grow text-right" placeholder="KRW" />
                    </div>
                </td>
            </tr>

            <tr>
                <th>컨테이너적입여부</th>
                <td>
                    <select id="selContainerInd" name="containerInd" class="w-full">
                        <option value="N">N (미적입)</option>
                        <option value="Y">Y (적입)</option>
                    </select>
                </td>
                <th>화물관리번호</th>
                <td><input type="text" id="txtCargoMgmtNo" name="cargoMgmtNo" class="w-full" /></td>
            </tr>

            <tr>
                <th>보세운송신고인</th>
                <td>
                    <div class="flex-row" style="gap: 2px;">
                        <input type="text" id="txtBondedReporter" name="bondedRepName" class="flex-grow" />
                    </div>
                </td>
                <th>선박회사(항공사)</th>
                <td>
                    <div class="flex-row" style="gap: 2px;">
                        <input type="text" id="txtCarrierCode" name="carrierName" class="flex-grow" />
                    </div>
                </td>
            </tr>

            <tr>
                <th>선박명(편명)</th>
                <td><input type="text" id="txtVesselName" name="vesselName" class="w-full" /></td>
                <th>적재예정보세구역</th>
                <td><input type="text" id="txtLoadBondedArea" name="loadingLoc" class="w-full" /></td>
            </tr>
            
            <tr>
                <th>컨테이너 번호</th>
                <td colspan="3">
                    <input type="text" id="txtContNo" name="contNo" class="w-full" placeholder="컨테이너 번호를 입력하세요" />
                </td>
            </tr>
        </tbody>
    </table>
</div>