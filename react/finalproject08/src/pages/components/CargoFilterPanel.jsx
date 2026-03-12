import DeclarationFilterPanel from "../../pages/components/DeclarationFilterPanel";

// src/pages/warehouse/cargo/components/CargoFilterPanel.jsx
// ✅ DeclarationFilterPanel의 Wrapper (창고용)

function CargoFilterPanel(props) {
  return <DeclarationFilterPanel {...props} type="cargo" />;
}

export default CargoFilterPanel;
