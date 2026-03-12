// src/pages/warehouse/cargo/components/form/FieldGroup.jsx

function FieldGroup({ label, required, error, touched, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {touched && error ? <p className="text-red-500 text-xs mt-1">{error}</p> : hint && <p className="text-gray-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export default FieldGroup;
