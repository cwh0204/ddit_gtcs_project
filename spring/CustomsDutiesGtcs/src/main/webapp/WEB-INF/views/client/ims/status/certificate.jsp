<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<%--
  수입신고필증 (Import Declaration Certificate)
  - 기존 사이트 메쉬(main-content, page-breadcrumb, detail-header 등) 적용
  - JSP FIELD_MAPPING에 존재하는 필드만 사용
  - 상세페이지(importStatusDetail.jsp)에서 인쇄 또는 별도 탭으로 호출
--%>

<link rel="stylesheet" href="/css/shipper/ims/importreport/importstatusdetail.css">

<style>
/* ===== 수입신고필증 전용 스타일 ===== */

/* 인쇄 설정 */
@page {
    size: A4 portrait;
    margin: 8mm;
}

@media print {
    body { background: #fff !important; }
    .no-print,
    .page-breadcrumb,
    .detail-header,
    .action-buttons { display: none !important; }
    .cert-wrapper { box-shadow: none !important; margin: 0 !important; padding: 10mm 12mm 8mm 12mm !important; }
}

/* 필증 래퍼 */
.cert-wrapper {
    max-width: 210mm;
    margin: 0 auto;
    padding: 20px 24px;
    background: #fff;
    border: 1px solid #ddd;
}

/* 헤더 영역 */
.cert-header-area {
    display: flex;
    align-items: flex-start;
    margin-bottom: 6px;
    position: relative;
}

.cert-logo {
    width: 60px;
    height: 60px;
    border: 2px solid #0f4c81;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 7px;
    color: #0f4c81;
    font-weight: 700;
    text-align: center;
    line-height: 1.15;
    flex-shrink: 0;
}

.cert-logo .logo-uni {
    font-size: 9px;
    font-weight: 900;
    color: #c0392b;
    letter-spacing: .5px;
}

.cert-title-center {
    flex: 1;
    text-align: center;
}

.cert-title-center h1 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 10px;
    color: #111;
    margin-top: 8px;
    margin-bottom: 2px;
}

.cert-title-center .cert-sub {
    font-size: 9px;
    color: #666;
}

.cert-header-right {
    text-align: right;
    font-size: 10px;
    color: #444;
    min-width: 90px;
}

.cert-type-badge {
    border: 1.5px solid #333;
    padding: 1px 10px;
    font-size: 11px;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 3px;
}

/* 테이블 공통 */
.cert-tbl {
    width: 100%;
    border-collapse: collapse;
    border: 1.5px solid #333;
    margin-bottom: 2px;
}

.cert-tbl th,
.cert-tbl td {
    border: .7px solid #888;
    padding: 3px 5px;
    vertical-align: middle;
    font-size: 10.5px;
    line-height: 1.3;
}

.cert-tbl th {
    background-color: #f4f6f7;
    font-weight: 700;
    text-align: center;
    color: #222;
    white-space: nowrap;
}

.cert-tbl td {
    background: #fff;
}

/* 값 표시 */
.cert-val {
    color: #0f4c81;
    font-weight: 600;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 10.5px;
}

/* 정렬 */
.t-r { text-align: right; }
.t-c { text-align: center; }
.t-l { text-align: left; }

/* 세로 쓰기 헤더 */
.th-vertical {
    writing-mode: vertical-rl;
    letter-spacing: 2px;
    font-size: 10px;
    padding: 6px 2px !important;
}

/* 섹션 바 */
.cert-section-bar {
    background: #0f4c81;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    margin: 3px 0 2px 0;
    letter-spacing: .5px;
    border-radius: 2px;
}

/* 원번호 */
.cn {
    font-weight: 900;
    margin-right: 2px;
    font-size: 10.5px;
}

/* 소글씨 */
.cert-sm {
    font-size: 9px;
    color: #666;
}

/* 총세액 강조 */
.cert-total-highlight {
    font-weight: 900;
    color: #c0392b;
    font-size: 12px;
}

/* 도장 고스트 */
.cert-stamp-ghost {
    position: absolute;
    bottom: 30px;
    right: 40px;
    width: 80px;
    height: 80px;
    border: 3px solid rgba(180, 40, 40, .15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7px;
    color: rgba(180, 40, 40, .2);
    font-weight: 700;
    text-align: center;
    transform: rotate(-15deg);
    line-height: 1.3;
}

/* 푸터 */
.cert-footer {
    margin-top: 6px;
    font-size: 8.5px;
    color: #666;
    line-height: 1.6;
}

.cert-footer-issue {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1.5px solid #333;
    font-size: 10px;
}
</style>


<div class="main-content">

    <div class="page-breadcrumb">
        <i class="fas fa-home"></i> 홈 > 수입통관 > 수입신고현황 > 수입신고필증
    </div>

    <div class="detail-header">
        <h2 class="page-title">
            수입신고필증
            <span id="certStatusBadge" class="badge wait" style="vertical-align: middle; margin-left: 10px;"></span>
        </h2>
        <div class="action-buttons">
            <button class="btn-print" onclick="printCertificate()">
                <i class="fas fa-print"></i> 인쇄
            </button>
            <button class="btn-secondary" onclick="history.back()">
                <i class="fas fa-arrow-left"></i> 돌아가기
            </button>
        </div>
    </div>

    <!-- ===== 필증 본문 ===== -->
    <div class="cert-wrapper" id="certPrintArea">

        <!-- HEADER -->
        <div class="cert-header-area">
            <div class="cert-logo">
                <span style="font-size:6.5px">사전확인필</span>
                <span style="font-size:7px;color:#c0392b;font-weight:900">미검증</span>
                <span class="logo-uni">UNI-PASS</span>
                <span style="font-size:6.5px">정부시점확인</span>
            </div>
            <div class="cert-title-center">
                <h1>수 입 신 고 필 증</h1>
            </div>
            <div class="cert-header-right">
                <div class="cert-type-badge">감 &nbsp; 지</div>
                <div style="font-size:9px;margin-top:2px">* 처리기간 : 3일</div>
            </div>
        </div>

        <!-- ① 신고번호 / ② 신고일 / ③ 세관·과 / ④ 입항일 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:11%"><col style="width:16%">
            <col style="width:8%"><col style="width:15%">
            <col style="width:8%"><col style="width:12%">
            <col style="width:8%"><col style="width:14%">
            <col style="width:8%">
        </colgroup>
        <tr>
            <th><span class="cn">①</span>신고번호</th>
            <td class="cert-val" id="c_importNumber"></td>
            <th><span class="cn">②</span>신고일</th>
            <td class="cert-val" id="c_submitDate"></td>
            <th><span class="cn">③</span>세관·과</th>
            <td class="cert-val" id="c_customsOffice"></td>
            <th><span class="cn">④</span>입항일</th>
            <td class="cert-val" id="c_arrivalDate"></td>
            <td></td>
        </tr>
        </table>

        <!-- ⑤ B/L번호 / ⑥ 화물관리번호 / 반입일 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:14%"><col style="width:28%">
            <col style="width:14%"><col style="width:28%">
            <col style="width:8%"><col style="width:8%">
        </colgroup>
        <tr>
            <th><span class="cn">⑤</span>B/L(AWB)번호</th>
            <td class="cert-val" id="c_blNo"></td>
            <th><span class="cn">⑥</span>화물관리번호</th>
            <td class="cert-val" id="c_cargoMgmtNo"></td>
            <th>반입일</th>
            <td class="cert-val" id="c_bondedInDate"></td>
        </tr>
        </table>

        <!-- ⑦ 수입자 / 납세의무자 / 운송정보 / 해외거래처 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:6%"><col style="width:6%"><col style="width:18%">
            <col style="width:9%"><col style="width:13%">
            <col style="width:9%"><col style="width:13%">
            <col style="width:9%"><col style="width:17%">
        </colgroup>

        <!-- 수입자 -->
        <tr>
            <th rowspan="4" class="th-vertical"><span class="cn">⑦</span>수입자</th>
            <th>(상호)</th>
            <td class="t-l cert-val" id="c_importerName"></td>
            <th>원산지증명서</th>
            <td class="t-c cert-val" id="c_originCertYn"></td>
            <th>총중량</th>
            <td class="t-r cert-val" id="c_totalWeight" colspan="3"></td>
        </tr>
        <tr>
            <th>(성명)</th>
            <td class="t-l cert-val" id="c_repName"></td>
            <th>수입종류</th>
            <td class="t-c cert-val" id="c_importType"></td>
            <th>컨테이너번호</th>
            <td class="cert-val" id="c_contNo" colspan="3"></td>
        </tr>
        <tr>
            <th>(주소)</th>
            <td class="t-l cert-val" id="c_address" colspan="7"></td>
        </tr>
        <tr>
            <th>(부호)</th>
            <td class="cert-val" id="c_customsId"></td>
            <th>사업자등록번호</th>
            <td class="cert-val" id="c_bizRegNo" colspan="5"></td>
        </tr>

        <!-- 운송정보 -->
        <tr>
            <th rowspan="2" class="th-vertical" style="font-size:9px">운송<br>정보</th>
            <th>선(기)명</th>
            <td class="cert-val" id="c_vesselName"></td>
            <th>선기국적</th>
            <td class="t-c cert-val" id="c_vesselNation"></td>
            <th>수입국</th>
            <td class="cert-val" id="c_originCountry" colspan="3"></td>
        </tr>
        <tr>
            <th>도착항</th>
            <td class="cert-val" id="c_arrivalPort"></td>
            <th>입항예정일</th>
            <td class="t-c cert-val" id="c_arrivalEstDate"></td>
            <th>보세반입일</th>
            <td class="t-c cert-val" id="c_bondedInDate2" colspan="3"></td>
        </tr>

        <!-- 해외거래처 -->
        <tr>
            <th colspan="2">해외거래처</th>
            <td class="cert-val" id="c_overseasBiz"></td>
            <th>해외거래처국적</th>
            <td class="cert-val" id="c_overseasCountry" colspan="5"></td>
        </tr>
        </table>

        <!-- ⑧ 품명·규격 + HS부호 + 관세구분 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:40%"><col style="width:10%"><col style="width:10%"><col style="width:10%"><col style="width:30%">
        </colgroup>
        <tr>
            <td class="t-l" style="font-weight:700;padding-left:6px;border-bottom:none">
                <span class="cn">⑧</span>품명·규격 <span class="cert-sm">(란번호/총란수 : <span class="cert-val" id="c_itemSeq">001/001</span>)</span>
            </td>
            <td colspan="4" style="border-bottom:none"></td>
        </tr>
        <tr>
            <td style="border-top:none" colspan="2">
                <strong>HS부호 : </strong><span class="cert-val" id="c_hsCode"></span>
            </td>
            <td colspan="3">
                <strong>관세구분 : </strong><span class="cert-val" id="c_taxType"></span>
            </td>
        </tr>
        </table>

        <!-- ⑨ 신고품명 / ⑩ 거래품명 -->
        <table class="cert-tbl">
        <colgroup><col style="width:12%"><col style="width:88%"></colgroup>
        <tr><th><span class="cn">⑨</span>신고품명</th><td class="cert-val" id="c_itemName"></td></tr>
        <tr><th><span class="cn">⑩</span>거래품명</th><td class="cert-val" id="c_tradeName"></td></tr>
        </table>

        <!-- ⑪ 모델규격 + ⑫수량 + ⑬단가 + ⑭금액 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:11%"><col style="width:21%">
            <col style="width:7%"><col style="width:14%">
            <col style="width:9%"><col style="width:14%">
            <col style="width:9%"><col style="width:15%">
        </colgroup>
        <tr>
            <th><span class="cn">⑪</span>모델·규격</th>
            <td class="cert-val" id="c_modelSpec"></td>
            <th><span class="cn">⑫</span>수량</th>
            <td class="t-r cert-val" id="c_qty"></td>
            <th><span class="cn">⑬</span>단가</th>
            <td class="t-r cert-val" id="c_unitPrice"></td>
            <th><span class="cn">⑭</span>금액</th>
            <td class="t-r cert-val" id="c_totalAmount"></td>
        </tr>
        </table>

        <!-- ⑮ 순중량 / ⑯ 원산지코드 / 원산지표시 / ⑰ 과세가격(란) -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:10%"><col style="width:14%"><col style="width:5%">
            <col style="width:10%"><col style="width:10%">
            <col style="width:10%"><col style="width:10%">
            <col style="width:11%"><col style="width:20%">
        </colgroup>
        <tr>
            <th><span class="cn">⑮</span>순중량</th>
            <td class="t-r cert-val" id="c_netWeight"></td>
            <td class="t-c cert-sm">KG</td>
            <th><span class="cn">⑯</span>원산지코드</th>
            <td class="t-c cert-val" id="c_originCode"></td>
            <th>원산지표시</th>
            <td class="t-c cert-val" id="c_originMarkYn"></td>
            <th><span class="cn">⑰</span>과세가격(란)</th>
            <td class="t-r cert-val" id="c_taxBaseAmtItem"></td>
        </tr>
        </table>

        <!-- ⑱ 세율 테이블 (관세/부가세) -->
        <div class="cert-section-bar"><span class="cn">⑱</span> 세율 정보</div>
        <table class="cert-tbl">
        <colgroup>
            <col style="width:10%"><col style="width:18%">
            <col style="width:18%"><col style="width:18%">
            <col style="width:18%"><col style="width:18%">
        </colgroup>
        <tr style="background:#f4f6f7">
            <th>세종</th><th>세율(구분)</th><th>세액</th>
            <th>감면액</th><th>가산/분납세액</th><th>처리기간</th>
        </tr>
        <tr>
            <td class="t-c" style="font-weight:700">관세</td>
            <td class="t-r cert-val" id="c_dutyRate"></td>
            <td class="t-r cert-val" id="c_dutyAmt">0</td>
            <td class="t-r cert-val">0</td>
            <td class="t-r cert-val">0</td>
            <td></td>
        </tr>
        <tr>
            <td class="t-c" style="font-weight:700">부가세</td>
            <td class="t-r cert-val" id="c_vatRate">10.00</td>
            <td class="t-r cert-val" id="c_vatAmt">0</td>
            <td class="t-r cert-val">0</td>
            <td class="t-r cert-val">0</td>
            <td></td>
        </tr>
        </table>

        <!-- ⑲ 결제금액 -->
        <div class="cert-section-bar"><span class="cn">⑲</span> 결제금액 (인도조건·통화·금액)</div>
        <table class="cert-tbl">
        <colgroup>
            <col style="width:12%"><col style="width:10%">
            <col style="width:10%"><col style="width:24%">
            <col style="width:8%"><col style="width:20%">
            <col style="width:16%">
        </colgroup>
        <tr>
            <th>인도조건</th>
            <td class="t-c cert-val" id="c_incoterms"></td>
            <th>통화</th>
            <td class="cert-val" id="c_paymentInfo"></td>
            <th>합 계</th>
            <td class="t-r cert-val" id="c_totalPayAmt"></td>
            <td></td>
        </tr>
        </table>

        <!-- ⑳ 과세가격 / 운임 / 보험 / 가산금액 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:12%"><col style="width:5%"><col style="width:18%">
            <col style="width:9%"><col style="width:18%">
            <col style="width:9%"><col style="width:18%">
            <col style="width:11%">
        </colgroup>
        <tr>
            <th><span class="cn">⑳</span>과세가격</th>
            <td class="t-c" style="font-weight:700">$</td>
            <td class="t-r cert-val" id="c_taxableUSD"></td>
            <th>운 임</th>
            <td class="t-r cert-val" id="c_freightAmt">0</td>
            <th>가산금액</th>
            <td class="t-r cert-val" id="c_addAmt">0</td>
            <td rowspan="2" style="vertical-align:top;padding:4px">
                <span class="cert-sm">납부번호</span><br>
                <span class="cert-val" id="c_payNo"></span>
            </td>
        </tr>
        <tr>
            <td></td>
            <td class="t-c" style="font-weight:700">W</td>
            <td class="t-r cert-val" id="c_taxableKRW"></td>
            <th>보험료</th>
            <td class="t-r cert-val" id="c_insuranceAmt">0</td>
            <td colspan="2"></td>
        </tr>
        </table>

        <!-- 세종/세액 합계 + 신고인기재란 + 세관기재란 -->
        <table class="cert-tbl">
        <colgroup>
            <col style="width:12%"><col style="width:15%">
            <col style="width:24%"><col style="width:49%">
        </colgroup>
        <tr style="background:#f4f6f7">
            <th>세종</th><th>세 액</th>
            <th>신고인기재란</th><th>세관기재란</th>
        </tr>
        <tr>
            <td class="t-c" style="font-weight:700">관 세</td>
            <td class="t-r cert-val" id="c_dutyTotal"></td>
            <td rowspan="4" style="vertical-align:top;padding:6px;font-size:9px;line-height:1.5;color:#444" id="c_declarantNote"></td>
            <td rowspan="4" style="vertical-align:top;padding:6px;font-size:8px;line-height:1.5;color:#555" id="c_customsNote">
                원산지표시대상 물품인 경우 원산지표시를 하여야 하며, 양도·양수할 경우 미표시를 통보하여야 합니다.<br><br>
                http://unipass.customs.go.kr
            </td>
        </tr>
        <tr>
            <td class="t-c" style="font-weight:700">부가가치세</td>
            <td class="t-r cert-val" id="c_vatTotal"></td>
        </tr>
        <tr>
            <th style="background:#fafafa;font-weight:900">총 세 액 합 계</th>
            <td class="t-r cert-total-highlight" id="c_totalTaxSum"></td>
        </tr>
        <tr>
            <td colspan="2" style="height:25px"></td>
        </tr>
        </table>

        <!-- 하단: 신고일 / 수리일 -->
        <table class="cert-tbl" style="margin-bottom:4px">
        <colgroup>
            <col style="width:10%"><col style="width:20%">
            <col style="width:10%"><col style="width:20%">
            <col style="width:40%">
        </colgroup>
        <tr>
            <th>신고일</th><td class="cert-val" id="c_footSubmitDate"></td>
            <th>수리일</th><td class="cert-val" id="c_acceptDate"></td>
            <td></td>
        </tr>
        </table>

        <!-- FOOTER -->
        <div class="cert-footer" style="position:relative">
            <div class="cert-footer-issue">
                <div>
                    <strong>발 행 번 호 :</strong><br>
                    <span style="margin-top:4px;display:inline-block">
                        <b>세관·과 :</b> <span class="cert-val" id="c_footOffice"></span>
                        &nbsp;&nbsp;&nbsp;
                        <b>신고번호 :</b> <span class="cert-val" id="c_footDeclNo"></span>
                    </span>
                </div>
                <div style="font-size:9px;color:#999">Page: 1/1</div>
            </div>
            <div style="margin-top:5px">
                ※ 본 신고필증은 발행 후 세관 심사시 등에 따라 정정, 수정할 수 있으므로 정확한 내용은 발행번호를 이용하여 관세청 인터넷통관포탈<br>
                &nbsp;&nbsp;&nbsp;(http://unipass.customs.go.kr) 에서 확인하시기 바랍니다.<br>
                ※ 본 수입신고필증은 세관에서 행정적 요건만을 심사하므로 신고물품이 사실과 다른 때에는 신고인 또는 수입화주가 책임져야 합니다.<br>
                ※ 본 신고필증은 전자문서(PDF파일)로 발행된 것이며 신고필증의 진위여부 확인이나 전자서명의 위·변조 여부 확인은<br>
                &nbsp;&nbsp;&nbsp;인터넷 통관포탈의 「시점확인 스탬프로 클릭」하여 확인할 수 있습니다.
            </div>

            <!-- 도장 고스트 -->
            <div class="cert-stamp-ghost">REPUBLIC<br>OF<br>KOREA</div>
        </div>

    </div><!-- /.cert-wrapper -->

    <div class="footer-mini">Copyright © 2026 Customs Service System. All rights reserved.</div>

</div><!-- /.main-content -->


<script>
/**
 * ============================================================
 * 수입신고필증 데이터 바인딩 & 제어
 * ============================================================
 *
 * [사용 가능 필드 - JSP FIELD_MAPPING 기준]
 *   importerName, repName, telNo, bizRegNo, customsId, address,
 *   overseasBizName, overseasCountry, importType,
 *   cargoMgmtNo, contNo, vesselName, vesselNation,
 *   arrivalEstDate, bondedInDate, originCountry, arrivalPort, blNo,
 *   submitDate, currencyCode, payAmount, invoiceNo, invoiceDate,
 *   contractNo, contractDate, poNo, poDate, incoterms,
 *   totalWeight, originCertYn,
 *   freightCurrency, freightAmt, insuranceCurrency, insuranceAmt,
 *   addAmtCurrency, addAmt,
 *   totalTaxBase, totalDuty, totalVat, totalTaxSum,
 *   hsCode, taxType, itemNameDeclared, itemNameTrade, modelName,
 *   qty, qtyUnit, unitPrice, totalAmount,
 *   originCode, originMarkYn, netWeight, taxBaseAmtItem
 */

var CERT_API_URL = '/rest/import';

document.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    var importId = urlParams.get('id');

    if (importId) {
        loadCertificateData(importId);
    } else {
        alert("조회할 데이터 ID가 없습니다.");
        history.back();
    }
});

// 데이터 로드
function loadCertificateData(id) {
    axios.get(CERT_API_URL + '/' + id, {
        params: { memRole: 'UA', t: new Date().getTime() }
    })
    .then(function(response) {
        var data = response.data;
        if (!data) return;
        bindCertificateData(data);
    })
    .catch(function(err) {
        console.error("필증 데이터 조회 오류:", err);
        alert("데이터 조회 중 오류가 발생했습니다.");
    });
}

// 데이터 바인딩
function bindCertificateData(data) {
    if (!data) return;

    function set(id, val, fb) {
        var el = document.getElementById(id);
        if (el) el.innerText = (val != null && val !== '') ? String(val) : (fb || '-');
    }

    function fmt(v) {
        if (!v && v !== 0) return '0';
        var n = Number(String(v).replace(/,/g, ''));
        return isNaN(n) ? v : n.toLocaleString();
    }

    var TAX_TYPE_MAP = { 'A': '기본세율', 'F': 'FTA 협정관세율' };
    var IMPORT_TYPE_MAP = { '11': '11 (신속)', '21': '21 (일반)' };

    // ① ~ ④ 기본
    set('c_importNumber', data.importNumber);
    set('c_submitDate', data.submitDate);
    set('c_customsOffice', data.customsOffice);
    set('c_arrivalDate', data.arrivalEstDate);

    // ⑤⑥ B/L, 화물관리
    set('c_blNo', data.blNo);
    set('c_cargoMgmtNo', data.cargoMgmtNo);
    set('c_bondedInDate', data.bondedInDate);

    // ⑦ 수입자
    set('c_importerName', data.importerName);
    set('c_repName', data.repName);
    set('c_address', data.address);
    set('c_customsId', data.customsId);
    set('c_bizRegNo', data.bizRegNo);
    set('c_originCertYn', data.originCertYn || 'N');
    set('c_totalWeight', data.totalWeight ? fmt(data.totalWeight) + ' KG' : '-');
    set('c_importType', IMPORT_TYPE_MAP[data.importType] || data.importType);
    set('c_contNo', data.contNo);

    // 운송정보
    set('c_vesselName', data.vesselName);
    set('c_vesselNation', data.vesselNation);
    set('c_originCountry', data.originCountry);
    set('c_arrivalPort', data.arrivalPort);
    set('c_arrivalEstDate', data.arrivalEstDate);
    set('c_bondedInDate2', data.bondedInDate);

    // 해외거래처
    set('c_overseasBiz', data.overseasBizName);
    set('c_overseasCountry', data.overseasCountry);

    // ⑧ 품명·규격
    set('c_hsCode', data.hsCode);
    set('c_taxType', TAX_TYPE_MAP[data.taxType] || data.taxType);

    // ⑨⑩ 품명
    set('c_itemName', data.itemNameDeclared);
    set('c_tradeName', data.itemNameTrade);

    // ⑪ 모델·규격
    set('c_modelSpec', data.modelName);

    // ⑫⑬⑭ 수량/단가/금액
    var qtyStr = data.qty ? fmt(data.qty) : '-';
    var unitStr = data.qtyUnit || '';
    set('c_qty', qtyStr + (unitStr ? ' ' + unitStr : ''));
    set('c_unitPrice', data.unitPrice);
    set('c_totalAmount', data.totalAmount);

    // ⑮ 순중량
    set('c_netWeight', data.netWeight ? fmt(data.netWeight) : '-');

    // ⑯⑰ 원산지/과세가격(란)
    set('c_originCode', data.originCode);
    set('c_originMarkYn', data.originMarkYn);
    set('c_taxBaseAmtItem', data.taxBaseAmtItem ? fmt(data.taxBaseAmtItem) + ' KRW' : '-');

    // ⑱ 세율 테이블
    set('c_dutyAmt', fmt(data.totalDuty));
    set('c_vatAmt', fmt(data.totalVat));

    // ⑲ 결제금액
    set('c_incoterms', data.incoterms);
    set('c_paymentInfo', [data.currencyCode, data.payAmount ? fmt(data.payAmount) : ''].filter(Boolean).join(' '));
    set('c_totalPayAmt', data.payAmount ? fmt(data.payAmount) : '-');

    // ⑳ 과세가격/운임/보험/가산
    set('c_taxableUSD', data.payAmount ? fmt(data.payAmount) : '-');
    set('c_taxableKRW', data.totalTaxBase ? fmt(data.totalTaxBase) : '-');
    set('c_freightAmt', fmt(data.freightAmt));
    set('c_insuranceAmt', fmt(data.insuranceAmt));
    set('c_addAmt', fmt(data.addAmt));

    // 세종/세액 합계
    set('c_dutyTotal', fmt(data.totalDuty));
    set('c_vatTotal', fmt(data.totalVat));
    set('c_totalTaxSum', fmt(data.totalTaxSum));

    // 하단
    set('c_footSubmitDate', data.submitDate);
    set('c_acceptDate', data.submitDate);
    set('c_footOffice', data.customsOffice);
    set('c_footDeclNo', data.importNumber);

    // 뱃지 업데이트
    updateCertBadge(data);

    console.log('✅ 수입신고필증 바인딩 완료');
}

// 상태 뱃지
function updateCertBadge(data) {
    var badge = document.getElementById("certStatusBadge");
    if (!badge || !data) return;

    var STATUS_MAP = {
        'BONDED_IN': '보세입고완료', 'WAITING': '심사대기',
        'REVIEWING': '심사중', 'PHYSICAL': '현품검사중',
        'SUPPLEMENT': '보완/정정', 'ACCEPTED': '수리',
        'REJECTED': '반려', 'PAY_WAITING': '납부 대기',
        'PAY_COMPLETED': '납부 완료', 'APPROVED': '통관승인',
        'RELEASE_APPROVED': '반출승인', 'DELIVERED': '출고 완료'
    };

    var s = (data.status || '').toUpperCase().trim();
    var label = STATUS_MAP[s] || s;
    var cls = 'wait';

    if (['REVIEWING', 'PHYSICAL', 'SUPPLEMENT'].indexOf(s) > -1) cls = 'ing';
    else if (['ACCEPTED', 'PAY_WAITING', 'RELEASE_APPROVED'].indexOf(s) > -1) cls = 'pay';
    else if (['PAY_COMPLETED', 'APPROVED', 'DELIVERED'].indexOf(s) > -1) cls = 'done';
    else if (['REJECTED'].indexOf(s) > -1) cls = 'err';

    badge.innerText = label;
    badge.className = 'badge ' + cls;
}

// 인쇄
function printCertificate() {
    window.print();
}
</script>
