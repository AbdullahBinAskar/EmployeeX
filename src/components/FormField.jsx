import { colors } from '../theme.js';
import { input as inputStyle } from '../styles.js';

export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  error,
  options,
  placeholder,
  rows = 3,
}) {
  const id = `field-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  const hasError = !!error;

  const baseStyle = {
    ...inputStyle,
    borderColor: hasError ? colors.red : colors.border,
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} style={{ fontSize: 10, color: hasError ? colors.red : colors.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>
          {label}{required && <span style={{ color: colors.red }}> *</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={id}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          required={required}
          style={baseStyle}
          aria-invalid={hasError || undefined}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {(options || []).map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          required={required}
          rows={rows}
          placeholder={placeholder}
          style={{ ...baseStyle, resize: 'vertical', minHeight: rows * 20 }}
          aria-invalid={hasError || undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          style={baseStyle}
          aria-invalid={hasError || undefined}
        />
      )}

      {hasError && (
        <div role="alert" style={{ fontSize: 10, color: colors.red, marginTop: 3 }}>{error}</div>
      )}
    </div>
  );
}
