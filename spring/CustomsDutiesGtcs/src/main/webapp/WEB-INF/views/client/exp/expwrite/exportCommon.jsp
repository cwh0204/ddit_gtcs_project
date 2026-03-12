<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<div id="section1" class="form-section tab-content active">
	<span class="section-title">수출화주 정보</span>
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
					<input type="text" id="txtExporterName" name="exporterName" class="flex-grow" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
			<th class="required">대표자명</th>
			<td><input type="text" id="txtExporterRep" name="repName" class="flex-grow" /></td>
		</tr>
		<tr>
			<th class="required">사업자등록번호</th>
			<td>
				<input type="text" id="txtBizRegNo" name="bizRegNo" class="flex-grow" />
			</td>
			<th class="required">거래 상대방 식별번호</th>
			<td><input type="text" id="txtExporterIdNo" name="buyerIdNo" class="flex-grow" /></td>
		</tr>
		<tr>
			<th>통관고유부호</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtExporterCustomsCode" name="customsId" class="flex-grow" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
			<th></th>
			<td></td>
		</tr>
		
	</table>

	<span class="section-title">구매자</span>
	<table class="form-table" style="width: 100%; table-layout: fixed">
		<colgroup>
			<col style="width: 15%" />
			<col style="width: 35%" />
			<col style="width: 15%" />
			<col style="width: 35%" />
		</colgroup>
		<tr>
			<th class="required">상호</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtBuyerName" name="buyerName" class="flex-grow" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
			<th>구매업체 주소</th>
			<td><input type="text" id="txtBuyerCode" name="buyerAddress" class="flex-grow" /></td>
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
			<th class="required">신고구분</th>
			<td>
				<select id="selDclType" name="dclType" class="flex-grow">
					<option value="H">서류제출</option>
					<option value="P">P/L</option>
				</select>
			</td>
			<th class="required">거래구분</th>
			<td>
				<select id="selTransMode" name="transMode" class="flex-grow">
					<option value="11">일반수출</option>
					<option value="15">위탁가공</option>
				</select>
			</td>
		</tr>
		<tr>
			<th>수출종류</th>
			<td>
				<select id="selExportKind" name="exportKind" class="flex-grow">
					<option value="A">일반</option>
					<option value="B">보세공장</option>
				</select>
			</td>
			<th class="required">결제방법</th>
			<td>
				<select id="selPaymentMethod" name="paymentMethod" class="flex-grow">
					<option value="TT">송금</option>
					<option value="LC">신용장</option>
				</select>
			</td>
		</tr>
		<tr>
			<th class="required">인도조건</th>
			<td>
				<select id="selIncoterms" name="incoterms" class="flex-grow">
					<option value="FOB">FOB</option>
					<option value="CIF">CIF</option>
					<option value="EXW">EXW</option>
				</select>
			</td>
			<th class="required">도착국</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtDestCountry" name="destCountry" class="flex-grow" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
		</tr>
		<tr>
			<th class="required">적재항</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtLoadPort" name="loadingPort" class="flex-grow" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
			<th>운송수단</th>
			<td>
				<select id="selTransportMode" name="transportMode" class="flex-grow">
					<option value="10">선박</option>
					<option value="40">항공</option>
				</select>
			</td>
		</tr>
		<tr>
			<th>운송용기</th>
			<td>
				<select id="selContainerMode" name="containerMode" class="flex-grow">
					<option value="FCL">컨테이너</option>
					<option value="LCL">소량화물</option>
					<option value="BULK">산적화물</option>
				</select>
			</td>
			<th class="required">물품소재지</th>
			<td>
				<div class="flex-row">
					<input type="text" id="txtGoodsLoc" name="goodsLoc" class="flex-grow" />
					<button type="button" class="btn-search"><i class="fa-solid fa-magnifying-glass"></i></button>
				</div>
			</td>
		</tr>
		<tr>
			<th>물품상태</th>
			<td>
				<select id="selGoodsType" name="goodsType" class="flex-grow">
					<option value="N">신품</option>
					<option value="O">중고품</option>
					<option value="D">손상물품</option>
				</select>
			</td>
			<th>환급신청인</th>
			<td>
				<select id="selRefundApplicant" name="refundApplicant" class="flex-grow">
					<option value="1">수출자</option>
					<option value="2">제조자</option>
					<option value="3">수출위탁자</option>
				</select>
			</td>
		</tr>
	</table>
</div>