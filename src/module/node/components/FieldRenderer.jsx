export const FieldRenderer = ({ field, value, onChange }) => {
  const baseClasses = "w-full px-3 py-2 text-sm text-white bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg outline-none transition-all duration-200 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 shadow-inner";

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={`${baseClasses} cursor-pointer appearance-none bg-[length:12px_12px] bg-[right_10px_center] bg-no-repeat pr-8`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`
        }}
      >
        {(field.options || []).map((opt) => (
          <option key={opt} value={opt} className="bg-gray-900 text-white">
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'textarea' || field.name === 'text') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        ref={(el) => {
          if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }
        }}
        className={`${baseClasses} resize-none overflow-hidden min-h-[60px] leading-relaxed`}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        className={baseClasses}
      />
    );
  }

  return (
    <input
      type={field.type || 'text'}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value)}
      placeholder={field.placeholder}
      className={baseClasses}
    />
  );
};