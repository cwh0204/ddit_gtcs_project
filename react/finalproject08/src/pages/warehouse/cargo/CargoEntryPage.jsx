import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Card from "../../../style/components/Card";
import CargoEntryForm from "./components/CargoEntryForm";
import { useWarehouseMutations } from "../../../controller/warehouse/useWarehouseMutations";
import { useAuth } from "../../../hooks/useAuth";
import AlertModal from "../../../style/components/AlertModal";
import { useAlertModal } from "../../../hooks/useAlertModal";

// src/pages/warehouse/cargo/CargoEntryPage.jsx

const WAREHOUSE_TABS = [
  { id: "bonded", label: "보세구역" },
  { id: "local", label: "국내창고" },
];

function CargoEntryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createCargoEntry } = useWarehouseMutations();
  const [activeTab, setActiveTab] = useState("bonded");
  const { alertModal, showSuccess, showError, showConfirm } = useAlertModal();

  const handleSubmit = async (formData, file) => {
    try {
      await createCargoEntry.mutateAsync({
        data: {
          ...formData,
          memId: user?.id,
        },
        file: file || null,
      });

      const warehouseName = activeTab === "bonded" ? "보세구역" : "국내창고";
      showSuccess("입고 완료", `${warehouseName} 입고 등록이 완료되었습니다.`, () => {
        navigate("/warehouse/cargo");
      });
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.message || "";
      const isDuplicate =
        status === 500 ||
        msg.includes("duplicate") ||
        msg.includes("Duplicate") ||
        msg.includes("중복") ||
        msg.includes("already") ||
        msg.includes("exists") ||
        msg.includes("위치");

      if (isDuplicate) {
        showError("중복 위치", "이미 화물이 등록된 위치입니다.\n다른 위치를 입력해 주세요.");
      } else {
        showError("입고 실패", "입고 등록에 실패했습니다.\n" + msg);
      }
    }
  };

  const handleCancel = () => {
    showConfirm("입고 등록 취소", "입고 등록을 취소하시겠습니까?\n입력한 내용이 저장되지 않습니다.", () => {
      navigate(-1);
    });
  };

  return (
    <div className="space-y-4 p-8 bg-gray-50 min-h-screen">
      <Card>
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="뒤로가기">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">화물 입고 등록</h1>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {WAREHOUSE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id ? "text-primary border-primary" : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 폼 영역 */}
        <div className="p-6">
          <CargoEntryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createCargoEntry.isPending}
            warehouseType={activeTab === "bonded" ? "BONDED" : "LOCAL"}
          />
        </div>
      </Card>
      <AlertModal {...alertModal} />
    </div>
  );
}

export default CargoEntryPage;
