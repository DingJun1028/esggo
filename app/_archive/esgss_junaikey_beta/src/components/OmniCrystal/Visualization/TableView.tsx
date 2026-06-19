/**
 * 📋 Table View Component
 * --------------------------------------------------
 * [核心] 表格視圖
 * [功能] 響應式表格 + 排序功能
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { TableData } from './types';

interface TableViewProps {
  data: TableData;
}

export const TableView: React.FC<TableViewProps> = ({ data }) => {
  const { headers, rows, sortable = false, highlightRow } = data;
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 排序邏輯
  const sortedRows = React.useMemo(() => {
    if (!sortable || sortColumn === null) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      // 數字排序
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // 字串排序
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [rows, sortColumn, sortDirection, sortable]);

  const handleSort = (columnIndex: number) => {
    if (!sortable) return;

    if (sortColumn === columnIndex) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  return (
    <div className="table-container overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-700/50">
            {headers.map((header, index) => (
              <th
                key={index}
                onClick={() => handleSort(index)}
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-300 ${
                  sortable ? 'cursor-pointer hover:text-purple-400 transition-colors' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {header}
                  {sortable && sortColumn === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {sortDirection === 'asc' ? (
                        <ArrowUp size={14} className="text-purple-400" />
                      ) : (
                        <ArrowDown size={14} className="text-purple-400" />
                      )}
                    </motion.div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className={`border-b border-slate-700/30 ${
                rowIndex % 2 === 0 ? 'bg-slate-800/20' : 'bg-transparent'
              } ${
                highlightRow === rowIndex ? 'bg-purple-500/10' : ''
              } hover:bg-slate-700/30 transition-colors`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-slate-200">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
