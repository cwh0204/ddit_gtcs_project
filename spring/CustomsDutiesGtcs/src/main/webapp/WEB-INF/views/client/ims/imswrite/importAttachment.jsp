<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%-- 
    [수정사항] 인라인 <style> 태그 전체 제거
    → 모든 스타일은 외부 unified-form-style.css에서 통합 관리
    → 인라인 스타일이 외부 CSS를 덮어쓰는 문제 해결
--%>
<div id="section5" class="form-section tab-content" style="display: none;">
    <%-- [수정] "4. 첨부파일" group-title은 CSS에서 display:none 처리됨 --%>

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
	                   accept=".pdf,.jpg,.jpeg,.png" onchange="FileManager.updateEssentialFile(this, 'nameInvoice')">
	            <button type="button" class="btn-file-select" onclick="document.getElementById('fileInvoice').click()">
	                <i class="fas fa-folder-open"></i> 파일 선택
	            </button>
	            <button type="button" id="preview-fileInvoice" class="btn-preview" style="display:none;">
	                <i class="fas fa-eye"></i> 미리보기
	            </button>
	            <span id="nameInvoice" class="file-name-display">선택된 파일 없음</span>
	        </td>
	    </tr>
	    <tr>
	        <th>2. 패킹리스트 (Packing List) <span style="color:red">*</span></th>
	        <td>
	            <input type="file" id="filePackingList" name="packinglistFile" style="display:none;" 
	                   accept=".pdf,.jpg,.jpeg,.png" onchange="FileManager.updateEssentialFile(this, 'namePacking')">
	            <button type="button" class="btn-file-select" onclick="document.getElementById('filePackingList').click()">
	                <i class="fas fa-folder-open"></i> 파일 선택
	            </button>
	            <button type="button" id="preview-filePackingList" class="btn-preview" style="display:none;">
	                <i class="fas fa-eye"></i> 미리보기
	            </button>
	            <span id="namePacking" class="file-name-display">선택된 파일 없음</span>
	        </td>
	    </tr>
	    <tr>
	        <th>3. 선하증권 (B/L) <span style="color:red">*</span></th>
	        <td>
	            <input type="file" id="fileBL" name="blFile" style="display:none;" 
	                   accept=".pdf,.jpg,.jpeg,.png" onchange="FileManager.updateEssentialFile(this, 'nameBL')">
	            <button type="button" class="btn-file-select" onclick="document.getElementById('fileBL').click()">
	                <i class="fas fa-folder-open"></i> 파일 선택
	            </button>
	            <button type="button" id="preview-fileBL" class="btn-preview" style="display:none;">
	                <i class="fas fa-eye"></i> 미리보기
	            </button>
	            <span id="nameBL" class="file-name-display">선택된 파일 없음</span>
	        </td>
	    </tr>
	</table>

    <span class="section-subtitle">
        기타 첨부파일 (단일 업로드 가능)
        <span style="font-size: 12px; color: #666; font-weight: normal; margin-left: 10px;">
            (총 <span id="otherFileCount">0</span>개)
        </span>
    </span>
    
    <div class="drop-zone" id="dropZone">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>이곳에 기타 증빙 파일을 드래그하거나 클릭하여 업로드하세요.</p>
        <p style="font-size: 12px; color: #999; margin-top: 5px;">
            지원 형식: PDF, JPG, PNG, Excel, Word (최대 32MB)
        </p>
        <input type="file" id="fileInput" name="otherFile" multiple style="display:none;" 
               accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx">
    </div>

    <div style="text-align: right; margin-bottom: 5px;">
        <button type="button" class="btn file-add" onclick="FileManager.addOtherFiles()">
            <i class="fas fa-plus"></i> 파일추가
        </button>
        <button type="button" class="btn file-delete" onclick="FileManager.deleteOtherFiles()">
            <i class="fas fa-minus"></i> 파일삭제
        </button>
    </div>

    <table class="file-list-table data-grid-table" id="fileTable" style="width:100%;">
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
                <th><input type="checkbox" id="chkAllFiles" onclick="FileManager.toggleAll(this)"></th>
                <th>No</th>
                <th>란번호</th>
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

<script>
// ===================================================================
// [파일 관리 네임스페이스]
// ===================================================================
var FileManager = (function() {
    'use strict';
    
    console.log('FileManager 초기화');
    
    var otherFilesList = [];
    var MAX_FILE_SIZE = 32 * 1024 * 1024;
    var sequenceCounter = 1;
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    function getFileExtension(filename) {
        return filename.split('.').pop().toUpperCase();
    }
    
    function generateRanNo(index) {
        var num = String(index).padStart(3, '0');
        return num;
    }
    
    function updateFileCount() {
        var countSpan = document.getElementById('otherFileCount');
        if (countSpan) {
            countSpan.textContent = otherFilesList.length;
        }
    }
    
    function removeEmptyRow() {
        var emptyRow = document.getElementById('emptyFileRow');
        if (emptyRow) {
            emptyRow.remove();
        }
    }
    
    function showEmptyRow() {
        var tbody = document.getElementById('fileTableBody');
        if (!tbody) return;
        
        if (otherFilesList.length === 0) {
            tbody.innerHTML = '<tr id="emptyFileRow"><td colspan="6" style="padding: 30px; color: #999;">등록된 기타 첨부파일이 없습니다.</td></tr>';
        }
    }
    
    function reindexTable() {
        var tbody = document.getElementById('fileTableBody');
        if (!tbody) return;
        
        var rows = tbody.querySelectorAll('tr:not(#emptyFileRow)');
        
        rows.forEach(function(row, index) {
            var newIndex = index + 1;
            
            var noCell = row.cells[1];
            if (noCell) {
                noCell.textContent = newIndex;
            }
            
            var ranNoCell = row.cells[2];
            if (ranNoCell) {
                ranNoCell.textContent = generateRanNo(newIndex);
            }
            
            row.setAttribute('data-index', newIndex - 1);
        });
    }
    
    function addFileToTable(file, index) {
        var tbody = document.getElementById('fileTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        var rowIndex = 1;
        var ranNo = "001";
        var fileExt = getFileExtension(file.name);
        var fileSize = formatFileSize(file.size);
        
        var tr = document.createElement('tr');
        tr.setAttribute('data-index', 0);
        tr.setAttribute('data-filename', file.name);
        
        var html = '';
        html += '<td><input type="checkbox" name="fileRowCheck" onchange="FileManager.updateRowSelection(this)"></td>';
        html += '<td>' + rowIndex + '</td>';
        html += '<td>' + ranNo + '</td>';
        html += '<td><span style="color: #0f4c81; font-weight: 600;">' + fileExt + '</span></td>';
        html += '<td style="text-align: left; padding-left: 15px;">' + file.name + '</td>';
        html += '<td>' + fileSize + '</td>';
        
        tr.innerHTML = html;
        tbody.appendChild(tr);
    }
    
    function validateFile(file) {
        if (file.size > MAX_FILE_SIZE) {
            alert('파일 크기는 32MB를 초과할 수 없습니다: ' + file.name);
            return false;
        }
        
        var isDuplicate = otherFilesList.some(function(f) {
            return f.name === file.name && f.size === file.size;
        });
        
        if (isDuplicate) {
            console.log('중복 파일 무시: ' + file.name);
            return false;
        }
        
        return true;
    }
    
    return {
        updateEssentialFile: function(input, displayId) {
            var displaySpan = document.getElementById(displayId);
            if (!displaySpan) return;
            
            if (input.files && input.files[0]) {
                var file = input.files[0];
                
                if (file.size > MAX_FILE_SIZE) {
                    alert('파일 크기는 32MB를 초과할 수 없습니다.');
                    input.value = '';
                    displaySpan.textContent = '선택된 파일 없음';
                    displaySpan.classList.remove('selected');
                    return;
                }
                
                displaySpan.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
                displaySpan.classList.add('selected');
                console.log('필수 파일 선택: ' + file.name);
            } else {
                displaySpan.textContent = '선택된 파일 없음';
                displaySpan.classList.remove('selected');
            }
        },
        
        addOtherFiles: function() {
            var fileInput = document.getElementById('fileInput');
            if (fileInput) {
                fileInput.click();
            }
        },
        
     	// 1. 기타 파일 핸들링 (중복/개수 제한 알림 Swal 적용)
        handleFiles: function(files) {
            if (files.length === 0) return;

            var file = files[0]; 

            if (file.size > MAX_FILE_SIZE) {
                Swal.fire({
                    icon: 'error',
                    title: '용량 초과',
                    text: '파일 크기는 32MB를 초과할 수 없습니다: ' + file.name,
                    confirmButtonColor: '#dc3545',
                    scrollbarPadding: false,
                    heightAuto: false
                });
                return;
            }

            // 파일이 이미 하나 있는데 또 추가하려 할 때 알림
            if (otherFilesList.length > 0) {
                console.log('새 파일로 교체: ' + file.name);
                
                // 기존 사용자 경험을 위해 살짝 알림을 주고 교체
                Swal.fire({
                    icon: 'info',
                    title: '파일 교체',
                    text: '기타 첨부파일은 1개만 등록 가능합니다. 새 파일로 교체되었습니다.',
                    confirmButtonColor: '#0f4c81',
                    timer: 1500,
                    scrollbarPadding: false,
                    heightAuto: false
                });
            }
            
            otherFilesList = [file];
            addFileToTable(file, 0);
            updateFileCount();
            
            var fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.value = '';
        },
        
     // 2. 파일 삭제 (삭제 확인창 Swal 적용)
        deleteOtherFiles: function() {
            var checkboxes = document.querySelectorAll('input[name="fileRowCheck"]:checked');
            
            if (checkboxes.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: '선택된 파일 없음',
                    text: '삭제할 파일을 선택해주세요.',
                    confirmButtonColor: '#0f4c81',
                    scrollbarPadding: false,
                    heightAuto: false
                });
                return;
            }
            
            // confirm 대신 Swal.fire 사용
            Swal.fire({
                title: '파일 삭제',
                text: '선택된 ' + checkboxes.length + '개의 파일을 삭제하시겠습니까?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                scrollbarPadding: false,
                heightAuto: false
            }).then((result) => {
                if (result.isConfirmed) {
                    var filesToDelete = [];
                    
                    checkboxes.forEach(function(checkbox) {
                        var row = checkbox.closest('tr');
                        if (row) {
                            var filename = row.getAttribute('data-filename');
                            filesToDelete.push(filename);
                            row.remove();
                        }
                    });
                    
                    otherFilesList = otherFilesList.filter(function(file) {
                        return !filesToDelete.includes(file.name);
                    });
                    
                    reindexTable();
                    updateFileCount();
                    showEmptyRow();
                    
                    var masterCheckbox = document.getElementById('chkAllFiles');
                    if (masterCheckbox) masterCheckbox.checked = false;

                    Swal.fire({
                        icon: 'success',
                        title: '삭제 완료',
                        text: '파일이 성공적으로 삭제되었습니다.',
                        confirmButtonColor: '#0f4c81',
                        timer: 1500,
                        scrollbarPadding: false,
                        heightAuto: false
                    });
                }
            });
        },
        
        toggleAll: function(masterCheckbox) {
            var checkboxes = document.querySelectorAll('input[name="fileRowCheck"]');
            
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = masterCheckbox.checked;
                FileManager.updateRowSelection(checkbox);
            });
            
            console.log('전체 선택: ' + masterCheckbox.checked);
        },
        
        updateRowSelection: function(checkbox) {
            var row = checkbox.closest('tr');
            if (!row) return;
            
            if (checkbox.checked) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
                
                var masterCheckbox = document.getElementById('chkAllFiles');
                if (masterCheckbox) {
                    masterCheckbox.checked = false;
                }
            }
        },
        
        getOtherFiles: function() {
            return otherFilesList;
        },
        
        validate: function() {
            var errors = [];
            
            var invoiceInput = document.getElementById('fileInvoice');
            var packingInput = document.getElementById('filePackingList');
            var blInput = document.getElementById('fileBL');
            
            if (!invoiceInput || invoiceInput.files.length === 0) {
                errors.push('1. 인보이스 (Invoice) 파일을 선택해주세요.');
            }
            if (!packingInput || packingInput.files.length === 0) {
                errors.push('2. 패킹리스트 (Packing List) 파일을 선택해주세요.');
            }
            if (!blInput || blInput.files.length === 0) {
                errors.push('3. 선하증권 (B/L) 파일을 선택해주세요.');
            }
            
            if (errors.length > 0) {
                alert('필수 증빙 서류가 누락되었습니다:\n\n' + errors.join('\n'));
                
                if(typeof switchTab === 'function') {
                    switchTab('tab4', document.querySelector('.tab-btn:nth-child(4)'));
                }
                
                return false;
            }
            
            return true;
        },
        
        init: function() {
            console.log('FileManager 초기화 시작');
            
            var dropZone = document.getElementById('dropZone');
            var fileInput = document.getElementById('fileInput');
            
            if (!dropZone || !fileInput) {
                console.error('필수 요소를 찾을 수 없습니다');
                return;
            }
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
                dropZone.addEventListener(eventName, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            dropZone.addEventListener('dragover', function() {
                this.classList.add('drag-over');
            });
            
            ['dragleave', 'drop'].forEach(function(eventName) {
                dropZone.addEventListener(eventName, function() {
                    this.classList.remove('drag-over');
                });
            });
            
            dropZone.addEventListener('drop', function(e) {
                var files = e.dataTransfer.files;
                if (files.length > 0) {
                    FileManager.handleFiles(files);
                }
            });
            
            dropZone.addEventListener('click', function() {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    FileManager.handleFiles(this.files);
                }
            });
            
            updateFileCount();
            
            console.log('FileManager 초기화 완료');
        }
    };
})();

function validateSection4() {
    return FileManager.validate();
}

(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSection4);
    } else {
        initSection4();
    }
    
    function initSection4() {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Section4 (첨부파일) 페이지 초기화');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        FileManager.init();
        
        console.log('Section4 초기화 완료');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
})();

window.updateFileName = function(input, displayId) {
    FileManager.updateEssentialFile(input, displayId);
};
window.handleFiles = function(files) {
    FileManager.handleFiles(files);
};
window.deleteOtherFiles = function() {
    FileManager.deleteOtherFiles();
};
</script>
