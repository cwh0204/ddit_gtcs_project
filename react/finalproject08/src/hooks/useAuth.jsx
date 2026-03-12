import { createContext, useContext, useEffect, useState } from "react";
import { ROLES, roleUtils } from "../constants/common/role";
import { jwtDecode } from "jwt-decode";
import apiClient from "../api/axios.instance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  console.log("AuthProvider rendered");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 📌 DB 권한 코드를 프론트엔드 상수로 변환
   */
  const mapBackendRoleToFrontend = (dbRole) => {
    if (!dbRole) return ROLES.CUSTOMS_OFFICER;

    const upperRole = dbRole.trim().toUpperCase();

    switch (upperRole) {
      case "OFFICER":
      case "CUSTOMS_OFFICER":
        return ROLES.CUSTOMS_OFFICER;

      case "WHMANAGER":
      case "WAREHOUSE":
      case "WAREHOUSE_MANAGER":
        return ROLES.WAREHOUSE_MANAGER;

      case "SUPERVISOR":
        return ROLES.SUPERVISOR;

      case "ADMIN":
        return ROLES.ADMIN;

      default:
        console.warn(`[Auth] 알 수 없는 권한 코드(${dbRole}) -> 세관원 권한으로 대체함`);
        return ROLES.CUSTOMS_OFFICER;
    }
  };

  /**
   * 토큰 해독 및 사용자 정보 설정
   */
  const processToken = (token) => {
    try {
      const decoded = jwtDecode(token);

      // 토큰 만료 체크
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      // 백엔드 JwtProvider에서 넣은 claim 이름은 "realUser" 입니다.
      const realUser = decoded.realUser;
      if (!realUser) throw new Error("Invalid Token Structure");

      // ✅ SHIPPER는 로그인 차단
      if (realUser.memRole?.toUpperCase() === "SHIPPER") {
        throw new Error("접근 권한이 없습니다.");
      }

      const userData = {
        id: realUser.loginId,
        name: realUser.memName,
        role: mapBackendRoleToFrontend(realUser.memRole), // ✅ 원래대로
        memId: realUser.memId,
        memRole: realUser.memRole,
      };

      console.log(`[Auth] 로그인 성공: ${userData.name} (${userData.role})`);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("[Auth] 토큰 처리 실패:", error);
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  // 1. 앱 실행 시 로그인 상태 복구
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          processToken(token);
        }
      } catch (error) {
        console.log("세션 만료");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // 2. 로그인 함수 (백엔드 연동)
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      let token;

      if (credentials.token) {
        // JSP 등 외부에서 토큰을 받은 경우
        token = credentials.token;
      } else {
        console.log("[Login] 서버 요청 시작:", credentials.loginId);

        const response = await apiClient.post("/rest/login", {
          loginId: credentials.loginId,
          password: credentials.password,
        });

        token = response.data.token;
      }

      if (!token) throw new Error("토큰이 존재하지 않습니다.");

      // 토큰 저장 및 처리
      localStorage.setItem("token", token);
      const userData = processToken(token);

      return userData;
    } catch (error) {
      console.error("[로그인 실패] : ", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 3. 로그아웃 (navigate 제거 - 호출하는 쪽에서 처리)
  const logout = () => {
    console.log("[Auth] 로그아웃 실행");
    setUser(null);
    localStorage.removeItem("token");
    // ✅ 페이지 이동은 호출하는 컴포넌트에서 처리
    // window.location.href = "/login"; 도 가능하지만 권장하지 않음
  };

  // 유틸리티
  const hasRole = (allowedRoles) => {
    if (!user) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
  };

  const hasMinimumRole = (minimumRole) => {
    if (!user) return false;
    return roleUtils.compareRoles(user.role, minimumRole) >= 0;
  };

  const getHomeRoute = () => {
    if (!user) return "/login";
    return roleUtils.getHomeRoute(user.role);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasMinimumRole,
    getHomeRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
