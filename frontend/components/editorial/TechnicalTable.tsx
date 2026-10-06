"use client";

import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface TechnicalTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  className?: string;
  onRowClick?: (row: T) => void;
}

export default function TechnicalTable<T>({
  columns,
  data,
  keyExtractor,
  className = "",
  onRowClick,
}: TechnicalTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#D9DAD6]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-3 px-4 font-mono text-[11px] uppercase tracking-wider text-[#5F625F] font-medium ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D9DAD6]">
          {data.map((row, rowIdx) => (
            <tr
              key={keyExtractor(row, rowIdx)}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors ${
                onRowClick ? "cursor-pointer hover:bg-[#F2F2EF]" : "hover:bg-[#F2F2EF]/60"
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-4 px-4 text-xs sm:text-sm text-[#111111] align-middle ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  {col.render ? col.render(row, rowIdx) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
