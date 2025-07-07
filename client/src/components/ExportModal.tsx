import React, { useState } from 'react';
import { X, Download, CheckSquare, Square } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (columns: string[]) => void;
  loading: boolean;
}

const availableColumns = [
  { key: 'id', label: 'Transaction ID', default: true },
  { key: 'date', label: 'Date', default: true },
  { key: 'amount', label: 'Amount', default: true },
  { key: 'category', label: 'Category', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'user_id', label: 'User ID', default: true },
  { key: 'user_profile', label: 'User Profile', default: false },
];

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  loading
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.filter(col => col.default).map(col => col.key)
  );

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns.map(col => col.key));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleExport = () => {
    if (selectedColumns.length > 0) {
      onExport(selectedColumns);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Configure Export</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-slate-300 text-sm mb-3">
            Select the columns you want to include in your CSV export:
          </p>
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Deselect All
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableColumns.map((column) => (
              <label
                key={column.key}
                className="flex items-center space-x-3 p-2 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleColumnToggle(column.key)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {selectedColumns.includes(column.key) ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <span className="text-slate-300 text-sm">{column.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">
            {selectedColumns.length} column{selectedColumns.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedColumns.length === 0 || loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{loading ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;