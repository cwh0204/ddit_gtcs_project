import DeclarationFilterPanel from "./DeclarationFilterPanel";

// src/pages/components/ExportFilterPanel.jsx
// DeclarationFilterPanel의 Wrapper (수출용)

function ExportFilterPanel(props) {
  // props 그대로 전달
  return <DeclarationFilterPanel {...props} type="export" />;
}

export default ExportFilterPanel;
