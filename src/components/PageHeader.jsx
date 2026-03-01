import { colors } from '../theme.js';
import { pageTitle } from '../styles.js';

export default function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={pageTitle}>{title}</h1>
        {subtitle && <div style={{ fontSize: 12, color: colors.textDim, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {children && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>}
    </div>
  );
}
