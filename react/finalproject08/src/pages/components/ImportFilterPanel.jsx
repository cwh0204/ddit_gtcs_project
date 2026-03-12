import DeclarationFilterPanel from "./DeclarationFilterPanel";

// src/pages/components/ImportFilterPanel.jsx
// DeclarationFilterPanel의 Wrapper (수입용)

function ImportFilterPanel(props) {
  return <DeclarationFilterPanel {...props} type="import" />;
}

export default ImportFilterPanel;
