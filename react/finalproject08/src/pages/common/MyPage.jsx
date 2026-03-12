// src/pages/common/MyPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import AlertModal from "../../style/components/AlertModal";
import { useAlertModal } from "../../hooks/useAlertModal";
import memberApi from "../../api/member/memberApi";
import Card from "../../style/components/Card";
import Button from "../../style/components/Button";
import Input from "../../style/components/Input";
import {
  User,
  Mail,
  Phone,
  Clock,
  Shield,
  MapPin,
  Building2,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  IdCard,
  Calendar,
  KeyRound,
  CheckCircle2,
  Loader2,
} from "lucide-react";

// ─── 역할 한글 매핑 ───
const ROLE_LABELS = {
  OFFICER: "세관원",
  SUPERVISOR: "상급자",
  WHMANAGER: "창고관리자",
  WAREHOUSE: "창고관리자",
  WAREHOUSE_MANAGER: "창고관리자",
  ADMIN: "관리자",
};

const ROLE_COLORS = {
  OFFICER: "from-blue-600 to-indigo-700",
  SENIOR: "from-purple-600 to-violet-700",
  WHMANAGER: "from-emerald-600 to-teal-700",
  ADMIN: "from-red-600 to-rose-700",
};

const getRoleLabel = (role) => ROLE_LABELS[role?.toUpperCase()] || role || "직원";
const getRoleGradient = (role) => {
  const upper = role?.toUpperCase() || "";
  if (upper.includes("SENIOR") || upper.includes("SUPERVISOR")) return ROLE_COLORS.SENIOR;
  if (upper.includes("WH") || upper.includes("WAREHOUSE")) return ROLE_COLORS.WHMANAGER;
  if (upper.includes("ADMIN")) return ROLE_COLORS.ADMIN;
  return ROLE_COLORS.OFFICER;
};

function MyPage() {
  const { user } = useAuth();
  const { alertModal, showWarning, showError } = useAlertModal();

  // ─── 상태 ───
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);

  // ─── 수정 폼 데이터 ───
  const [formData, setFormData] = useState({});

  // ─── 데이터 로드 ───
  useEffect(() => {
    if (!user?.memId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await memberApi.getDetail(user.memId);
        setMemberData(data);
        setFormData(data);
      } catch (err) {
        console.error("회원 정보 조회 실패:", err);
        setError("회원 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.memId]);

  // ─── 폼 핸들러 ───
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setFormData({ ...memberData, password: "" });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setFormData(memberData);
    setIsEditing(false);
    setShowPassword(false);
  };

  const handleSave = async () => {
    if (!formData.memName?.trim() || !formData.email?.trim() || !formData.hpNo?.trim()) {
      showWarning("입력 확인", "이름, 이메일, 휴대전화는 필수 항목입니다.");
      return;
    }

    try {
      setSaving(true);
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      const result = await memberApi.update(submitData);

      // 토큰 갱신
      if (result.newToken) {
        localStorage.setItem("token", result.newToken);
      }

      // 화면 갱신
      const refreshed = await memberApi.getDetail(user.memId);
      setMemberData(refreshed);
      setFormData(refreshed);
      setIsEditing(false);
      setShowPassword(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("회원 정보 수정 실패:", err);
      showError("수정 실패", "수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // ─── 로딩/에러 ───
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">회원 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!memberData) return null;

  const initials = (memberData.memName || "U").charAt(0);

  // ─── 읽기 전용 필드 ───
  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-medium text-gray-900 pl-5.5 border-b border-gray-100 pb-2.5">{value || <span className="text-gray-300">—</span>}</p>
    </div>
  );

  // ─── 수정 가능 필드 ───
  const EditField = ({ icon: Icon, label, field, type = "text", placeholder = "" }) => (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      {isEditing ? (
        <Input
          type={type}
          value={formData[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="text-sm"
        />
      ) : (
        <p className="text-sm font-medium text-gray-900 pl-5.5 border-b border-gray-100 pb-2.5">
          {memberData[field] || <span className="text-gray-300">—</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
        <p className="text-sm text-gray-500 mt-1">개인 정보를 확인하고 수정할 수 있습니다.</p>
      </div>

      {/* 성공 메시지 */}
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">정보가 성공적으로 수정되었습니다.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        {/* ═══════════ 좌측 프로필 카드 ═══════════ */}
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* 프로필 상단 */}
            <div className="text-center pt-10 pb-6 px-6">
              {/* 아바타 */}
              <div
                className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getRoleGradient(memberData.memRole)} flex items-center justify-center shadow-lg`}
              >
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>

              {/* 이름 */}
              <h2 className="text-xl font-bold text-gray-900 mt-4">{memberData.memName}</h2>

              {/* 역할 배지 */}
              <div className="inline-flex items-center gap-1.5 mt-2 px-4 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <Shield className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-semibold text-green-700">{getRoleLabel(memberData.memRole)}</span>
              </div>
            </div>

            {/* 연락처 요약 */}
            <div className="border-t border-gray-100 px-6 py-4 flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700 truncate">{memberData.email || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{memberData.hpNo || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{memberData.companyName || "관세청"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 text-xs">{memberData.modDate ? `최근 수정: ${memberData.modDate}` : "수정 이력 없음"}</span>
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="p-4 border-t border-gray-100">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 flex items-center justify-center gap-1.5" onClick={handleCancel} disabled={saving}>
                    <X className="h-4 w-4" /> 취소
                  </Button>
                  <Button
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 text-white hover:bg-gray-800"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "저장 중..." : "저장"}
                  </Button>
                </div>
              ) : (
                <Button className="w-full flex items-center justify-center gap-1.5 bg-gray-900 text-white hover:bg-gray-800" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4" /> 정보 수정
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* ═══════════ 우측 상세 정보 ═══════════ */}
        <Card className="p-0 overflow-hidden">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { key: "personal", label: "기본 정보" },
              { key: "work", label: "직무 정보" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.key ? "text-gray-900 bg-white border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* ─── 기본 정보 탭 ─── */}
            {activeTab === "personal" && (
              <>
                {/* 개인 정보 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 pb-3 border-b-2 border-gray-100">개인 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                    <InfoField icon={IdCard} label="로그인 아이디" value={memberData.loginId} />
                    {/* 비밀번호 (수정 모드에서만 입력) */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <KeyRound className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">비밀번호</span>
                      </div>
                      {isEditing ? (
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={formData.password || ""}
                            onChange={(e) => handleChange("password", e.target.value)}
                            placeholder="변경 시에만 입력"
                            className="text-sm pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-gray-900 pl-5.5 border-b border-gray-100 pb-2.5">••••••••</p>
                      )}
                    </div>
                    <EditField icon={User} label="이름" field="memName" placeholder="이름을 입력하세요" />
                    <EditField icon={Mail} label="이메일" field="email" type="email" placeholder="이메일을 입력하세요" />
                    <EditField icon={Phone} label="휴대전화" field="hpNo" placeholder="010-0000-0000" />
                    <EditField icon={Phone} label="내선 전화번호" field="repTelNo" placeholder="02-0000-0000" />
                  </div>
                </div>

                {/* 주소 정보 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 pb-3 border-b-2 border-gray-100">주소 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                    <EditField icon={MapPin} label="우편번호" field="zipCode" placeholder="12345" />
                  </div>
                  <EditField icon={MapPin} label="기본 주소" field="address" placeholder="기본 주소를 입력하세요" />
                  <EditField icon={MapPin} label="상세 주소" field="addressDetail" placeholder="상세 주소를 입력하세요" />
                </div>

                {/* 계정 정보 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 pb-3 border-b-2 border-gray-100">계정 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                    <InfoField icon={Calendar} label="회원가입일" value={memberData.regDate} />
                    <InfoField icon={Clock} label="최근 수정일" value={memberData.modDate || "—"} />
                  </div>
                </div>
              </>
            )}

            {/* ─── 직무 정보 탭 ─── */}
            {activeTab === "work" && (
              <>
                {/* 소속 정보 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 pb-3 border-b-2 border-gray-100">소속 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                    <EditField icon={Building2} label="소속 기관" field="companyName" placeholder="소속 기관을 입력하세요" />
                    <InfoField icon={Shield} label="직책/권한" value={getRoleLabel(memberData.memRole)} />
                    <EditField icon={User} label="대표자명" field="repName" placeholder="대표자명" />
                  </div>
                </div>

                {/* 식별 정보 */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 pb-3 border-b-2 border-gray-100">식별 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                    <InfoField icon={IdCard} label="통관고유부호" value={memberData.customsIdNo} />
                    <InfoField icon={IdCard} label="사업자등록번호" value={memberData.bizRegNo} />
                  </div>
                </div>

                {/* 비상 연락처 */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 pb-3 border-b-2 border-gray-100">비상 연락처</h3>
                  <div className="mt-4">
                    <EditField icon={Phone} label="비상 연락망" field="emergencyContact" placeholder="비상 연락처를 입력하세요" />
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default MyPage;
