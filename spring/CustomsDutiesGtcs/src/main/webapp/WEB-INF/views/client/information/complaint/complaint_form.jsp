<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec"%>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<link rel="stylesheet" href="/css/shipper/listdetail/listdetail/listdetailall.css">
<link rel="stylesheet" href="/css/shipper/information/complaint/complaint_form.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<div class="container">

    <div class="local-header">
        <h2>
            민원사항
            <c:out value="${empty complaint ? '등록' : '수정'}" />
        </h2>
        <div class="breadcrumb">Home > 정보센터 > 민원사항</div>
    </div>

    <form id="writeForm">

        <sec:csrfInput/>

        <c:if test="${not empty complaint}">
            <input type="hidden" name="bdId" value="${complaint.bdId}">
        </c:if>

        <input type="hidden" name="bdType" value="민원사항">
        <input type="hidden" name="bdSecyn" id="bdSecyn" value="N">

        <div class="write-box">

            <!-- 제목 -->
<div class="write-row">
    <div class="write-label required">제목</div>
    <div class="write-content">
        <input type="text" name="bdTitle" class="input-text"
            placeholder="제목을 입력해 주세요" value="${complaint.bdTitle}" required>
    </div>
</div>

<!-- 작성자 -->
<div class="write-row">
    <div class="write-label">작성자</div>
    <div class="write-content">
        <input type="text" name="bdWriter" id="bdWriter" class="input-text"
            value="${complaint.bdWriter}" readonly>
    </div>
</div>

<!-- 비밀글 | 비밀번호 -->
<div class="write-row">
    <div class="write-label">비밀글</div>
    <div class="write-content write-content-half">
        <label class="radio-label">
            <input type="radio" name="secOption" value="N"
                checked onchange="toggleSecret(this)"> 공개글
        </label>
        <label class="radio-label">
            <input type="radio" name="secOption" value="Y"
                onchange="toggleSecret(this)"> 비밀글
        </label>
    </div>
    <div class="write-label-pwd">비밀번호</div>
    <div class="write-content write-content-pwd">
        <input type="password" id="bdPwd" name="bdPwd"
            class="input-pwd-inline" maxlength="4"
            oninput="this.value=this.value.replace(/[^0-9]/g,'').slice(0,4)"
            disabled>
    </div>
</div>

            <!-- 내용 -->
            <div class="write-row">
                <div class="write-label required">내용</div>
                <div class="write-content">
                    <textarea name="bdCont" class="textarea-field" rows="15"
                        placeholder="내용을 입력해 주세요" required>${complaint.bdCont}</textarea>
                </div>
            </div>

            <!-- 첨부파일 -->
            <div class="write-row">
                <div class="write-label">첨부파일</div>
                <div class="write-content">
                    <div class="file-input-box">

                        <input type="file" name="uploadFile" id="fileInput" multiple
                            style="display: none;" onchange="handleFileSelect(this)">

                        <div style="margin-bottom: 10px;">
                            <button type="button" class="btn-file-add"
                                onclick="document.getElementById('fileInput').click()">
                                <i class="fas fa-plus"></i> 파일 추가
                            </button>
                            <span style="font-size: 12px; color: #999; margin-left: 10px;">
                                버튼을 눌러 파일을 추가할 수 있습니다
                            </span>
                        </div>

                        <div id="newFileList"></div>

                        <c:if test="${not empty complaint.fileList}">
                            <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
                                <strong style="font-size: 12px; color: #666;">[저장된 파일]</strong>
                                <div style="margin-top: 5px;">
                                    <c:forEach var="file" items="${complaint.fileList}">
                                        <div class="current-file" style="margin-bottom: 5px;">
                                            <i class="fas fa-file"></i> ${file.fileName}
                                            <label style="margin-left: 10px; color: #e74c3c; cursor: pointer;">
                                                <input type="checkbox" name="deleteFileId" value="${file.id}"> 삭제
                                            </label>
                                        </div>
                                    </c:forEach>
                                </div>
                            </div>
                        </c:if>

                    </div>
                </div>
            </div>

        </div>

        <div class="btn-groups">
            <button type="submit" class="btn-lookups">
                <i class="fas fa-check"></i>
                <c:out value="${empty complaint ? '등록하기' : '수정하기'}" />
            </button>
            <button type="button" class="btn-grays" onclick="history.back()">
                <i class="fas fa-times"></i> 취소
            </button>
        </div>

    </form>

</div>

<script src="/js/shipper/information/complaint/complaint_form.js"></script>