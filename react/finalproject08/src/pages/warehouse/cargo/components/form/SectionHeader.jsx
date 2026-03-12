// src/pages/warehouse/cargo/components/form/SectionHeader.jsx

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-4 bg-[#0f4c81] rounded-full" />
      <h3 className="text-sm font-bold text-gray-700">{title}</h3>
    </div>
  );
}

export default SectionHeader;
