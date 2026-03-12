<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<style>
    /* 필수 증빙 서류 테이블 */
    .essential-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    .essential-table th {
        background: #f8f9fa;
        padding: 12px;
        text-align: left;
        border: 1px solid #ddd;
        width: 30%;
        font-weight: 400;
        color: #333;
    }
    .essential-table td {
        padding: 12px;
        border: 1px solid #ddd;
    }
    
    /* 파일 선택 버튼 (네이비색) */
    .btn-file-select {
        padding: 8px 16px;
        background: #0f4c81;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        margin-right: 10px;
        transition: all 0.2s;
    }
    .btn-file-select:hover {
        background: #09345a;
        transform: translateY(-2px);
    }
    
    /* 파일명 표시 */
    .file-name-display {
        color: #666;
        font-size: 13px;
    }
    .file-name-display.selected {
        color: #0f4c81;
        font-weight: 600;
    }
    
    /* 섹션 서브타이틀 */
    .section-subtitle {
        display: block;
        font-size: 15px;
        font-weight: 600;
        color: #333;
        margin: 10px 0 10px 0;
        padding-left: 10px;
        border-left: 4px solid #0f4c81;
    }
    
    /* 드롭존 스타일 */
    .drop-zone {
        border: 2px dashed #0f4c81;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        background: #f8fbff;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 10px;
    }
    .drop-zone:hover {
        background: #e8f4ff;
        border-color: #09345a;
    }
    .drop-zone.drag-over {
        background: #d0e8ff;
        border-color: #0066cc;
        transform: scale(1.02);
    }
    .drop-zone i {
        font-size: 48px;
        color: #0f4c81;
        margin-bottom: 15px;
    }
    .drop-zone p {
        margin: 10px 0 0 0;
        color: #666;
        font-size: 14px;
    }
    
    /* 파일 리스트 테이블 */
    .file-list-table {
        width: 100%;
        border-collapse: collapse;
    }
    .file-list-table th,
    .file-list-table td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: center;
    }
    .file-list-table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
    }
    .file-list-table tbody tr:hover:not(#emptyFileRow) {
        background: #f0f8ff;
    }
    
    /* 마이크로 버튼 (파일추가/삭제용) */
    .btn.micro {
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 3px;
        cursor: pointer;
        border: 1px solid #ccc;
        background: #fff;
    }
    .btn.micro:hover {
        background: #eee;
    }
    /* 미리보기 버튼 스타일 */
	.btn-preview {
	    padding: 7px 12px;
	    background: #fff;
	    color: #0f4c81;
	    border: 1px solid #0f4c81;
	    border-radius: 4px;
	    cursor: pointer;
	    font-weight: 600;
	    font-size: 13px;
	    margin-right: 10px;
	    transition: all 0.2s;
	}
	.btn-preview:hover {
	    background: #f0f8ff;
	}
	/* 파일이 선택되지 않았을 때는 숨김 처리 하거나 흐리게 처리 */
	.btn-preview:disabled {
	    border-color: #ccc;
	    color: #ccc;
	    cursor: not-allowed;
	}
</style>

<div id="section4" class="form-section tab-content">

    <span class="section-subtitle">필수 증빙 서류 (각 1개 파일)</span>
    <table class="essential-table">
	    <colgroup>
	        <col style="width: 30%">
	        <col style="width: 70%">
	    </colgroup>
	    <tr>
	        <th>1. 인보이스 (Invoice) <span style="color:red">*</span></th>
	        <td>
	            <input type="file" id="fileInvoice" name="invoiceFile" style="display:none;" 
	                   accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
	                   onchange="FileManager.updateEssentialFile(this, 'invoiceFileName')">
	            <button type="button" class="btn-file-select" onclick="document.getElementById('fileInvoice').click()">
	                <i class="fas fa-folder-open"></i> 파일 선택
	            </button>
	            <button type="button" id="preview-fileInvoice" class="btn-preview" style="display:none;">
	                <i class="fas fa-eye"></i> 미리보기
	            </button>
	            <span id="invoiceFileName" class="file-name-display">선택된 파일 없음</span>
	        </td>
	    </tr>
	    <tr>
	        <th>2. 패킹리스트 (Packing List) <span style="color:red">*</span></th>
	        <td>
	            <input type="file" id="filePackingList" name="packinglistFile" style="display:none;" 
	                   accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
	                   onchange="FileManager.updateEssentialFile(this, 'packingListFileName')">
	            <button type="button" class="btn-file-select" onclick="document.getElementById('filePackingList').click()">
	                <i class="fas fa-folder-open"></i> 파일 선택
	            </button>
	            <button type="button" id="preview-filePackingList" class="btn-preview" style="display:none;">
	                <i class="fas fa-eye"></i> 미리보기
	            </button>
	            <span id="packingListFileName" class="file-name-display">선택된 파일 없음</span>
	        </td>
	    </tr>
	    <tr>
	        <th>3. 선하증권 (B/L) <span style="color:red">*</span></th>
	        <td>
	            <input type="file" id="fileBL" name="blFile" style="display:none;" 
	                   accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
	                   onchange="FileManager.updateEssentialFile(this, 'blFileName')">
	            <button type="button" class="btn-file-select" onclick="document.getElementById('fileBL').click()">
	                <i class="fas fa-folder-open"></i> 파일 선택
	            </button>
	            <button type="button" id="preview-fileBL" class="btn-preview" style="display:none;">
	                <i class="fas fa-eye"></i> 미리보기
	            </button>
	            <span id="blFileName" class="file-name-display">선택된 파일 없음</span>
	        </td>
	    </tr>
	</table>

    <span class="section-subtitle">
        기타 첨부파일 (단일 업로드)
    </span>
    
    <div class="drop-zone" id="dropZone">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>이곳에 기타 증빙 파일을 드래그하거나 클릭하여 업로드하세요.</p>
        <p style="font-size: 12px; color: #999; margin-top: 5px;">
            지원 형식: PDF, JPG, PNG, Excel (최대 10MB)
        </p>
        <input type="file" id="fileInput" multiple style="display:none;" 
               accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx">
    </div>

    <div style="text-align: right; margin-bottom: 5px;">
        <button type="button" class="file-action-btn btn-add" onclick="document.getElementById('fileInput').click()">
            <i class="fas fa-plus"></i> 파일추가
        </button>
        <button type="button" class="file-action-btn btn-del" onclick="FileManager.deleteSelected()">
            <i class="fas fa-minus"></i> 파일삭제
        </button>
    </div>

    <table class="file-list-table" id="fileTable">
        <colgroup>
            <col style="width: 40px">
            <col style="width: 60px">
            <col style="width: 100px">
            <col style="width: 100px">
            <col style="width: *">
            <col style="width: 100px">
        </colgroup>
        <thead>
            <tr>
                <th><input type="checkbox" onclick="FileManager.toggleAll(this)"></th>
                <th>No</th>
                <th>구분</th>
                <th>파일형식</th>
                <th>첨부파일</th>
                <th>파일크기</th>
            </tr>
        </thead>
        <tbody id="fileTableBody">
            <tr id="emptyFileRow">
                <td colspan="6" style="padding: 10px; color: #999;">
                    등록된 기타 첨부파일이 없습니다.
                </td>
            </tr>
        </tbody>
    </table>
</div>