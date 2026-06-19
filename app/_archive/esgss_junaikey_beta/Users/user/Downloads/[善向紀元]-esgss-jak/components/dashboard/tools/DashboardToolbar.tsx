// 儀表板工具欄組件
import React from 'react';
import {
  RefreshCw, Settings, Share, Download, Edit3, Eye,
  Plus, Grid, Layout, Maximize2, Minimize2, Filter, Calendar
} from 'lucide-react';

interface ToolbarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  submenu?: Array<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

interface DashboardToolbarProps {
  items: ToolbarItem[];
  className?: string;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map(item => (
        <ToolbarButton key={item.id} item={item} />
      ))}
    </div>
  );
};

const ToolbarButton: React.FC<{ item: ToolbarItem }> = ({ item }) => {
  const { icon: Icon, label, onClick, disabled, variant = 'secondary', submenu } = item;

  const [showSubmenu, setShowSubmenu] = React.useState(false);

  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };

  const handleClick = () => {
    if (submenu) {
      setShowSubmenu(!showSubmenu);
    } else {
      onClick();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
        }`}
        title={label}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
        {submenu && (
          <svg
            className={`w-4 h-4 transition-transform ${showSubmenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* 子菜單 */}
      {submenu && showSubmenu && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 min-w-[160px]">
          {submenu.map((subItem, index) => (
            <button
              key={index}
              onClick={() => {
                subItem.onClick();
                setShowSubmenu(false);
              }}
              disabled={subItem.disabled}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};