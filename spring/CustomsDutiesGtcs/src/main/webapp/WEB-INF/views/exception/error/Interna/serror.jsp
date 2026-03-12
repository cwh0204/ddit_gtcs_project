<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>

<link rel="stylesheet" href="/css/excep/error/error/error.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div class="error-card" style="border-top-color: #e74c3c;">
        
        <div class="icon-area">
            <div class="icon-circle" style="background-color: #fdf2f2;"> <i class="fa-solid fa-server main-icon" style="color: #e74c3c;"></i>
            </div>
        </div>

        <h2 class="error-title">시스템에 일시적인 오류가 발생했습니다.</h2>
        
        <p class="error-desc">
            현재 시스템 점검 중이거나 일시적인 통신 장애가 발생했습니다.<br>
            잠시 후 다시 시도해 주시기 바라며, 문제가 지속될 경우
            관리자에게 문의하여 주시기 바랍니다.
        </p>

        <div class="btn-group">
            <a href="javascript:location.reload()" class="btn btn-outline">새로고침</a>
            <a href="/shipper/dashboard" class="btn btn-primary" style="background-color: #e74c3c; border-color: #e74c3c;">메인으로 이동</a>
        </div>
    </div>