import React from 'react';
import { cn } from '../../utils/cn';
import { Inbox } from 'lucide-react';

export function Table({
  columns = [],
  data = [],
  keyExtractor = (item, index) => item.id || index,
  onRowClick,
  emptyMessage = 'No banking records found',
  emptyIcon: EmptyIcon = Inbox,
  className,
  headerClassName,
  rowClassName,
  hoverable = true,
}) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={cn('bg-slate-50/80 dark:bg-[#0f1d33] border-b border-slate-200 dark:border-slate-800', headerClassName)}>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                scope="col"
                className={cn(
                  'py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none whitespace-nowrap',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.className
                )}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0c1626]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <EmptyIcon className="w-10 h-10 mb-2 stroke-[1.5]" />
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => {
              const isClickable = Boolean(onRowClick);
              return (
                <tr
                  key={keyExtractor(item, rowIndex)}
                  onClick={() => isClickable && onRowClick(item, rowIndex)}
                  className={cn(
                    'transition-colors duration-150',
                    hoverable && 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40',
                    isClickable && 'cursor-pointer',
                    rowClassName
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || colIndex}
                      className={cn(
                        'py-3.5 px-4 text-sm text-slate-700 dark:text-slate-200 whitespace-nowrap',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        col.cellClassName
                      )}
                    >
                      {col.render
                        ? col.render(item[col.key], item, rowIndex)
                        : item[col.key] !== undefined
                        ? String(item[col.key])
                        : '—'}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
