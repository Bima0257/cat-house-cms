import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconX,
  IconArrowUp,
  IconArrowDown,
  IconSelector,
  IconPlus,
} from '@tabler/icons-react';
import { Button } from './button';

const columnHelper = createColumnHelper();

const DataTable = ({
  data = [],
  loading = false,
  searchPlaceholder = 'Cari...',
  showSearch = true,
  showPagination = true,
  pageSize: defaultPageSize = 10,
  actions,
  columns: customColumns,
  onRowClick,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Build columns from customColumns prop or use default
  const columns = useMemo(() => {
    if (customColumns?.length > 0) {
      return customColumns.map((col, index) =>
        columnHelper.accessor(col.accessor || col.key, {
          id: col.key,
          header: col.header,
          cell: (info) =>
            col.render ? col.render(info.row.original) : info.getValue(),
          size: typeof col.width === 'number' ? col.width : 150,
          enableSorting: col.enableSorting !== false,
        })
      );
    }
    return [];
  }, [customColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater);
      setPageIndex(0);
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const totalRows = filteredRows.length;
  const pageCount = Math.ceil(totalRows / pageSize) || 1;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const paginatedRows = useMemo(
    () => filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [filteredRows, pageIndex, pageSize]
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-light overflow-hidden">
        <div className="animate-pulse p-8">
          <div className="flex justify-center items-center h-40">
            <div className="text-text-muted flex items-center gap-2">
              <span className="ti ti-loader-2 animate-spin"></span>
              Memuat data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { getHeaderGroups } = table;

  return (
    <div className="bg-white rounded-xl border border-border-light overflow-hidden">
      {/* Header with Search & Actions */}
      {(showSearch || actions) && (
        <div className="p-4 border-b border-border-light flex items-center justify-between gap-4 flex-wrap">
          {showSearch && (
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-10 py-2 border border-border-light rounded-xl text-sm bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
                >
                  <IconX size={16} />
                </button>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border-light">
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide text-left whitespace-nowrap"
                    style={{ width: header.getSize() || undefined }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none hover:text-primary' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === 'asc' ? (
                              <IconArrowUp size={14} className="text-primary" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <IconArrowDown size={14} className="text-primary" />
                            ) : (
                              <IconSelector size={14} className="opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border-light">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-12">
                  <div className="flex flex-col items-center gap-2">
                    <i className="ti ti-table text-4xl text-text-muted/30"></i>
                    <p className="text-text-muted">
                      {globalFilter ? 'Tidak ada data yang cocok' : 'Tidak ada data'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-5 py-4 text-sm text-text-dark whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="p-4 border-t border-border-light flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageIndex(0);
              }}
              className="px-2 py-1 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>of {totalRows} entries</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPageIndex(0)}
              disabled={!canPreviousPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <IconChevronsLeft size={18} />
            </button>
            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={!canPreviousPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <IconChevronLeft size={18} />
            </button>

            <span className="px-3 text-sm text-text-muted">
              Page {pageIndex + 1} of {pageCount}
            </span>

            <button
              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
              disabled={!canNextPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <IconChevronRight size={18} />
            </button>
            <button
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={!canNextPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <IconChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
