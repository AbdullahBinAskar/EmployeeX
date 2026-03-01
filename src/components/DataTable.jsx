import { useState } from 'react';
import { colors } from '../theme.js';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export function DataTable({ columns, data, onRowClick, emptyMessage = 'No data', pageSize = 0 }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);

  const handleSort = (key) => {
    if (sortCol === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  let sorted = [...(data || [])];
  if (sortCol) {
    sorted.sort((a, b) => {
      const va = a[sortCol], vb = b[sortCol];
      if (va == null) return 1;
      if (vb == null) return -1;
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  if (!sorted.length) {
    return <div style={{ padding: 30, textAlign: 'center', color: colors.textDim, fontSize: 13 }}>{emptyMessage}</div>;
  }

  // Pagination
  const usePagination = pageSize > 0;
  const totalPages = usePagination ? Math.ceil(sorted.length / pageSize) : 1;
  const paged = usePagination ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;
  const start = usePagination ? page * pageSize + 1 : 1;
  const end = usePagination ? Math.min((page + 1) * pageSize, sorted.length) : sorted.length;

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {columns.map(col => {
                const isSorted = sortCol === col.key;
                const sortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => sortable && handleSort(col.key)}
                    onKeyDown={e => { if (sortable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleSort(col.key); } }}
                    tabIndex={sortable ? 0 : undefined}
                    aria-sort={isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.textDim,
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      cursor: sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: col.width,
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      {col.label}
                      {sortable && (
                        isSorted
                          ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
                          : <ChevronsUpDown size={10} style={{ opacity: 0.3 }} />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={e => { if (onRowClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onRowClick(row); } }}
                style={{ cursor: onRowClick ? 'pointer' : 'default', borderBottom: `1px solid ${colors.border}08` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '10px 12px', color: colors.text, verticalAlign: 'middle' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {usePagination && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', fontSize: 12, color: colors.textDim }}>
          <span>Showing {start}–{end} of {sorted.length}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              style={{
                padding: '4px 10px', borderRadius: 6, border: `1px solid ${colors.border}`,
                background: 'transparent', color: page === 0 ? colors.textDim : colors.text,
                cursor: page === 0 ? 'default' : 'pointer', fontSize: 11,
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              Prev
            </button>
            <span style={{ padding: '4px 8px', fontSize: 11 }}>{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
              style={{
                padding: '4px 10px', borderRadius: 6, border: `1px solid ${colors.border}`,
                background: 'transparent', color: page >= totalPages - 1 ? colors.textDim : colors.text,
                cursor: page >= totalPages - 1 ? 'default' : 'pointer', fontSize: 11,
                opacity: page >= totalPages - 1 ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
