/**
 * ESGss JunAiKey - 行政財務管理系統
 * Administrative & Finance Management System
 * 
 * 功能模組：
 * 1. 儀表板總覽
 * 2. 預算管理
 * 3. 費用報銷
 * 4. 收支管理
 * 5. 發票管理
 * 6. 薪資管理
 * 7. 帳戶管理
 * 8. 財務報告
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, CreditCard, 
  PieChart, Calendar, FileText, Users, 
  Building2, Calculator, Briefcase, DollarSignIcon,
  ChevronRight, Download, Upload, Plus, Search,
  Filter, MoreHorizontal, Eye, Edit, Trash2,
  CheckCircle, XCircle, Clock, AlertCircle,
  ArrowUpRight, ArrowDownRight, Wallet, Receipt,
  Banknote, Landmark, FileSpreadsheet, PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============== 類型定義 ==============

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: 'on_track' | 'warning' | 'over';
  department: string;
  period: string;
}

interface Expense {
  id: string;
  employee: string;
  department: string;
  category: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  description: string;
  receipt: boolean;
  project?: string;
}

interface Invoice {
  id: string;
  number: string;
  type: 'income' | 'expense';
  client: string;
  vendor?: string;
  amount: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  category: string;
}

interface Payroll {
  id: string;
  employee: string;
  department: string;
  position: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  paymentDate: string;
  status: 'pending' | 'processing' | 'paid';
  bankAccount: string;
}

interface Account {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'credit' | 'investment';
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber: string;
  lastUpdated: string;
}

interface FinancialMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

// ============== 模擬數據 ==============

const budgetData: Budget[] = [
  { id: 'B001', category: '人力成本', allocated: 12000000, spent: 8500000, remaining: 3500000, status: 'on_track', department: '全部門', period: '2025 Q1' },
  { id: 'B002', category: '行銷費用', allocated: 2000000, spent: 1800000, remaining: 200000, status: 'warning', department: '業務部', period: '2025 Q1' },
  { id: 'B003', category: '研發投入', allocated: 5000000, spent: 3200000, remaining: 1800000, status: 'on_track', department: '技術部', period: '2025 Q1' },
  { id: 'B004', category: '行政管理', allocated: 1500000, spent: 900000, remaining: 600000, status: 'on_track', department: '管理部', period: '2025 Q1' },
  { id: 'B005', category: '客戶服務', allocated: 800000, spent: 650000, remaining: 150000, status: 'warning', department: '客服部', period: '2025 Q1' },
  { id: 'B006', category: '設備投資', allocated: 2000000, spent: 2100000, remaining: -100000, status: 'over', department: '技術部', period: '2025 Q1' },
];

const expenseData: Expense[] = [
  { id: 'E001', employee: '陳建宏', department: '業務部', category: '差旅費', amount: 28000, date: '2025-02-05', status: 'approved', description: '台北出差客戶拜訪', receipt: true, project: '鼎新電子專案' },
  { id: 'E002', employee: '林曉萍', department: '永續部', category: '軟體授權', amount: 15000, date: '2025-02-04', status: 'pending', description: 'Adobe CC 訂閱', receipt: true },
  { id: 'E003', employee: '王大同', department: '技術部', category: '硬體設備', amount: 45000, date: '2025-02-03', status: 'approved', description: 'MacBook Pro 配件', receipt: true, project: '系統升級' },
  { id: 'E004', employee: '黃美玲', department: '管理部', category: '文具辦公', amount: 3500, date: '2025-02-02', status: 'paid', description: '辦公室用品採購', receipt: true },
  { id: 'E005', employee: '陳建宏', department: '業務部', category: '餐飲費', amount: 8500, date: '2025-02-01', status: 'rejected', description: '客戶餐敘', receipt: false, project: '綠色企業專案' },
  { id: 'E006', employee: '劉志明', department: '永續部', category: '培訓費', amount: 25000, date: '2025-01-30', status: 'approved', description: 'ISO 14064 課程', receipt: true },
  { id: 'E007', employee: '黃美玲', department: '管理部', category: '租金水電', amount: 85000, date: '2025-01-29', status: 'paid', description: '辦公室租金 Q1', receipt: true },
  { id: 'E008', employee: '林曉萍', department: '永續部', category: '專業服務', amount: 120000, date: '2025-01-28', status: 'pending', description: '外部顧問費用', receipt: true, project: '報告書專案' },
];

const invoiceData: Invoice[] = [
  { id: 'INV001', number: 'INV-2025-0001', type: 'income', client: '鼎新電子股份有限公司', amount: 350000, tax: 17500, total: 367500, date: '2025-02-01', dueDate: '2025-02-28', status: 'sent', category: '專業服務' },
  { id: 'INV002', number: 'INV-2025-0002', type: 'income', client: '綠色企業聯盟協會', amount: 150000, tax: 7500, total: 157500, date: '2025-01-25', dueDate: '2025-02-25', status: 'paid', category: '顧問服務' },
  { id: 'INV003', number: 'INV-2025-0003', type: 'expense', vendor: '台灣大哥大', amount: 8500, tax: 425, total: 8925, date: '2025-02-01', dueDate: '2025-02-15', status: 'sent', category: '通訊費' },
  { id: 'INV004', number: 'INV-2025-0004', type: 'expense', vendor: '台北富邦銀行', amount: 2500000, tax: 0, total: 2500000, date: '2025-01-15', dueDate: '2025-01-30', status: 'paid', category: '人事費用' },
  { id: 'INV005', number: 'INV-2025-0005', type: 'income', client: '永續管理顧問有限公司', amount: 500000, tax: 25000, total: 525000, date: '2025-01-10', dueDate: '2025-02-10', status: 'overdue', category: '培訓服務' },
  { id: 'INV006', number: 'INV-2025-0006', type: 'expense', vendor: 'SGS Taiwan', amount: 80000, tax: 4000, total: 84000, date: '2025-02-05', dueDate: '2025-02-20', status: 'draft', category: '認證費用' },
];

const payrollData: Payroll[] = [
  { id: 'P001', employee: '陳建宏', department: '業務部', position: '業務經理', baseSalary: 85000, bonus: 25000, deduction: 8500, netSalary: 101500, paymentDate: '2025-02-10', status: 'paid', bankAccount: '台北富邦 1234' },
  { id: 'P002', employee: '林曉萍', department: '永續部', position: '資深顧問', baseSalary: 75000, bonus: 15000, deduction: 7500, netSalary: 82500, paymentDate: '2025-02-10', status: 'paid', bankAccount: '中國信託 5678' },
  { id: 'P003', employee: '王大同', department: '技術部', position: '資深工程師', baseSalary: 70000, bonus: 12000, deduction: 7000, netSalary: 75000, paymentDate: '2025-02-10', status: 'processing', bankAccount: '玉山銀行 9012' },
  { id: 'P004', employee: '黃美玲', department: '管理部', position: '行政主管', baseSalary: 55000, bonus: 8000, deduction: 5500, netSalary: 57500, paymentDate: '2025-02-10', status: 'pending', bankAccount: '兆豐銀行 3456' },
  { id: 'P005', employee: '劉志明', department: '永續部', position: '初級顧問', baseSalary: 45000, bonus: 10000, deduction: 4500, netSalary: 50500, paymentDate: '2025-02-10', status: 'pending', bankAccount: '台新銀行 7890' },
  { id: 'P006', employee: '張淑芬', department: '業務部', position: '業務專員', baseSalary: 40000, bonus: 8000, deduction: 4000, netSalary: 44000, paymentDate: '2025-02-10', status: 'pending', bankAccount: '國泰世華 2345' },
];

const accountData: Account[] = [
  { id: 'A001', name: '營運帳戶', type: 'bank', balance: 2850000, currency: 'TWD', bankName: '台北富邦銀行', accountNumber: '****1234', lastUpdated: '2025-02-07' },
  { id: 'A002', name: '薪資帳戶', type: 'bank', balance: 850000, currency: 'TWD', bankName: '中國信託銀行', accountNumber: '****5678', lastUpdated: '2025-02-07' },
  { id: 'A003', name: '預備金帳戶', type: 'bank', balance: 1500000, currency: 'TWD', bankName: '玉山銀行', accountNumber: '****9012', lastUpdated: '2025-02-07' },
  { id: 'A004', name: '現金庫存', type: 'cash', balance: 125000, currency: 'TWD', lastUpdated: '2025-02-07' },
  { id: 'A005', name: '信用卡', type: 'credit', balance: -85000, currency: 'TWD', bankName: '台新銀行', accountNumber: '****4567', lastUpdated: '2025-02-07' },
];

// ============== 輔助元件 ==============

const StatCard: React.FC<{ metric: FinancialMetric }> = ({ metric }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`bg-gradient-to-br ${metric.color} rounded-xl p-6 text-white shadow-lg`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-lg">{metric.icon}</div>
      <div className={`flex items-center space-x-1 ${metric.trend === 'up' ? 'text-green-300' : metric.trend === 'down' ? 'text-red-300' : 'text-gray-300'}`}>
        {metric.trend === 'up' ? <ArrowUpRight size={16} /> : metric.trend === 'down' ? <ArrowDownRight size={16} /> : null}
        <span className="text-sm font-medium">{metric.change > 0 ? '+' : ''}{metric.change}%</span>
      </div>
    </div>
    <div className="text-3xl font-bold mb-1">{metric.value}</div>
    <div className="text-white/80 text-sm">{metric.label}</div>
  </motion.div>
);

const StatusBadge: React.FC<{ status: string; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const config: Record<string, { bg: string; text: string }> = {
    approved: { bg: 'bg-green-100', text: 'text-green-700' },
    paid: { bg: 'bg-green-100', text: 'text-green-700' },
    on_track: { bg: 'bg-green-100', text: 'text-green-700' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
    approved_paid: { bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700' },
    overdue: { bg: 'bg-red-100', text: 'text-red-700' },
    over: { bg: 'bg-red-100', text: 'text-red-700' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    sent: { bg: 'bg-blue-100', text: 'text-blue-700' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
  };
  
  const c = config[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  
  const statusLabels: Record<string, string> = {
    approved: '已核准',
    paid: '已付款',
    on_track: '正常',
    pending: '待審核',
    processing: '處理中',
    rejected: '已駁回',
    overdue: '逾期',
    over: '超支',
    warning: '警告',
    sent: '已送出',
    draft: '草稿',
    cancelled: '已取消',
    approved_paid: '核准付款',
  };
  
  return (
    <span className={`${c.bg} ${c.text} ${textSize} px-2 py-1 rounded-full font-medium`}>
      {statusLabels[status] || status}
    </span>
  );
};

const ProgressBar: React.FC<{ spent: number; allocated: number; status: string }> = ({ spent, allocated, status }) => {
  const percentage = Math.min((spent / allocated) * 100, 100);
  const colors: Record<string, string> = {
    on_track: 'bg-green-500',
    warning: 'bg-yellow-500',
    over: 'bg-red-500',
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">NT$ {spent.toLocaleString()}</span>
        <span className="text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${colors[status] || 'bg-blue-500'}`}
        />
      </div>
    </div>
  );
};

// ============== 主元件 ==============

const AdministrativeFinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budget' | 'expense' | 'invoice' | 'payroll' | 'account' | 'report'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('this_month');

  // 計算儀表板數據
  const dashboardMetrics: FinancialMetric[] = useMemo(() => [
    { 
      label: '本月營收', 
      value: 'NT$3,850,000', 
      change: 12.5, 
      trend: 'up', 
      icon: <DollarSign size={24} />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: '本月支出', 
      value: 'NT$2,150,000', 
      change: -5.2, 
      trend: 'down', 
      icon: <CreditCard size={24} />,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      label: '淨利潤', 
      value: 'NT$1,700,000', 
      change: 18.3, 
      trend: 'up', 
      icon: <TrendingUp size={24} />,
      color: 'from-green-500 to-green-600'
    },
    { 
      label: '預算執行率', 
      value: '78.5%', 
      change: 2.1, 
      trend: 'up', 
      icon: <PieChart size={24} />,
      color: 'from-purple-500 to-purple-600'
    },
  ], []);

  const totalRevenue = invoiceData.filter(i => i.type === 'income' && (i.status === 'sent' || i.status === 'paid')).reduce((sum, i) => sum + i.total, 0);
  const totalExpenses = invoiceData.filter(i => i.type === 'expense' && i.status !== 'draft').reduce((sum, i) => sum + i.total, 0);
  const pendingExpenses = expenseData.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const upcomingPayroll = payrollData.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netSalary, 0);

  const tabs = [
    { id: 'dashboard', label: '儀表板', icon: <BarChart3 size={20} /> },
    { id: 'budget', label: '預算管理', icon: <Calculator size={20} /> },
    { id: 'expense', label: '費用報銷', icon: <Receipt size={20} /> },
    { id: 'invoice', label: '收支發票', icon: <FileText size={20} /> },
    { id: 'payroll', label: '薪資管理', icon: <Users size={20} /> },
    { id: 'account', label: '帳戶管理', icon: <Landmark size={20} /> },
    { id: 'report', label: '財務報告', icon: <FileSpreadsheet size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 頂部標題 */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Briefcase className="text-blue-600" size={28} />
              行政財務管理中心
            </h1>
            <p className="text-gray-500 mt-1">整合預算、費用、發票、薪資與帳戶管理</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">今天</option>
              <option value="this_week">本週</option>
              <option value="this_month">本月</option>
              <option value="last_month">上月</option>
              <option value="this_quarter">本季</option>
              <option value="this_year">本年</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={18} />
              匯出報告
            </button>
          </div>
        </div>
      </div>

      {/* 分頁標籤 */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* 儀表板 */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* 統計卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StatCard metric={metric} />
                  </motion.div>
                ))}
              </div>

              {/* 快捷摘要 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 預算狀態 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">預算執行狀態</h3>
                    <button 
                      onClick={() => setActiveTab('budget')}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      查看全部 <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {budgetData.slice(0, 4).map((budget) => (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{budget.category}</span>
                          <span className="text-gray-500">{budget.department}</span>
                        </div>
                        <ProgressBar 
                          spent={budget.spent} 
                          allocated={budget.allocated} 
                          status={budget.status}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>已用：NT$ {budget.spent.toLocaleString()}</span>
                          <span>總預算：NT$ {budget.allocated.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 待處理事項 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">待處理事項</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="text-yellow-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-800">待審核費用</p>
                          <p className="text-sm text-gray-500">{expenseData.filter(e => e.status === 'pending').length} 筆待審核</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">NT$ {pendingExpenses.toLocaleString()}</p>
                        <button 
                          onClick={() => setActiveTab('expense')}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          前往處理
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="text-blue-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-800">待發放薪資</p>
                          <p className="text-sm text-gray-500">{payrollData.filter(p => p.status === 'pending').length} 人待發放</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">NT$ {upcomingPayroll.toLocaleString()}</p>
                        <button 
                          onClick={() => setActiveTab('payroll')}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          前往處理
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-800">逾期帳款</p>
                          <p className="text-sm text-gray-500">{invoiceData.filter(i => i.status === 'overdue').length} 筆逾期</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('invoice')}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        前往處理
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 帳戶總覽 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Landmark size={20} className="text-blue-600" />
                    帳戶總覽
                  </h3>
                  <button 
                    onClick={() => setActiveTab('account')}
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    帳戶管理 <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {accountData.map((account) => (
                    <div key={account.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        {account.type === 'bank' && <Building2 size={18} className="text-blue-600" />}
                        {account.type === 'cash' && <DollarSignIcon size={18} className="text-green-600" />}
                        {account.type === 'credit' && <CreditCard size={18} className="text-red-600" />}
                        {account.type === 'investment' && <TrendingUp size={18} className="text-purple-600" />}
                        <span className="text-sm font-medium text-gray-700">{account.name}</span>
                      </div>
                      <p className={`text-xl font-bold ${account.balance < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        NT$ {Math.abs(account.balance).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{account.bankName || '現金'}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-600">總資產淨額</span>
                  <span className="text-xl font-bold text-green-600">
                    NT$ {accountData.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 預算管理 */}
          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋預算..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部部門</option>
                    <option>業務部</option>
                    <option>技術部</option>
                    <option>永續部</option>
                    <option>管理部</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  新增預算
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">預算項目</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">部門</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">期間</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">預算金額</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">執行進度</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">狀態</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {budgetData.map((budget) => (
                      <tr key={budget.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{budget.category}</div>
                          <div className="text-sm text-gray-500">編號：{budget.id}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{budget.department}</td>
                        <td className="px-6 py-4 text-gray-700">{budget.period}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">NT$ {budget.allocated.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">已用：NT$ {budget.spent.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 w-48">
                          <ProgressBar 
                            spent={budget.spent} 
                            allocated={budget.allocated} 
                            status={budget.status}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={budget.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 預算統計摘要 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <p className="text-blue-100 text-sm mb-1">總預算</p>
                  <p className="text-3xl font-bold">NT$ {budgetData.reduce((sum, b) => sum + b.allocated, 0).toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <p className="text-orange-100 text-sm mb-1">已執行</p>
                  <p className="text-3xl font-bold">NT$ {budgetData.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <p className="text-green-100 text-sm mb-1">剩餘預算</p>
                  <p className="text-3xl font-bold">NT$ {budgetData.reduce((sum, b) => sum + b.remaining, 0).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 費用報銷 */}
          {activeTab === 'expense' && (
            <motion.div
              key="expense"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋費用..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部狀態</option>
                    <option>待審核</option>
                    <option>已核准</option>
                    <option>已付款</option>
                    <option>已駁回</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部類別</option>
                    <option>差旅費</option>
                    <option>餐飲費</option>
                    <option>軟體授權</option>
                    <option>硬體設備</option>
                    <option>專業服務</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  新增費用
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">申請人</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">部門</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">類別</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">金額</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">日期</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">說明</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">狀態</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenseData.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{expense.employee}</td>
                        <td className="px-6 py-4 text-gray-700">{expense.department}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{expense.category}</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">NT$ {expense.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-700">{expense.date}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{expense.description}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={expense.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {expense.status === 'pending' && (
                              <>
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                  <CheckCircle size={18} />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 費用統計 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm mb-1">本月總費用</p>
                  <p className="text-2xl font-bold text-gray-800">NT$ {expenseData.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-yellow-500 text-sm mb-1">待審核</p>
                  <p className="text-2xl font-bold text-yellow-600">NT$ {expenseData.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-green-500 text-sm mb-1">已核准</p>
                  <p className="text-2xl font-bold text-green-600">NT$ {expenseData.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-blue-500 text-sm mb-1">已付款</p>
                  <p className="text-2xl font-bold text-blue-600">NT$ {expenseData.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 收支發票 */}
          {activeTab === 'invoice' && (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋發票..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部類型</option>
                    <option>收入</option>
                    <option>支出</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部狀態</option>
                    <option>草稿</option>
                    <option>已送出</option>
                    <option>已付款</option>
                    <option>逾期</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  新增發票
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">發票編號</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">類型</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">對象</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">金額</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">稅額</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">總額</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">日期</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">到期日</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">狀態</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceData.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{invoice.number}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${invoice.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {invoice.type === 'income' ? '收入' : '支出'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{invoice.client || invoice.vendor}</td>
                        <td className="px-6 py-4 text-gray-700">NT$ {invoice.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-700">NT$ {invoice.tax.toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">NT$ {invoice.total.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-700">{invoice.date}</td>
                        <td className="px-6 py-4 text-gray-700">{invoice.dueDate}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            {invoice.status === 'sent' && (
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <CheckCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 發票統計 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} />
                    <span className="text-green-100">本月收入</span>
                  </div>
                  <p className="text-3xl font-bold">NT$ {invoiceData.filter(i => i.type === 'income').reduce((sum, i) => sum + i.total, 0).toLocaleString()}</p>
                  <p className="text-green-200 text-sm mt-2">{invoiceData.filter(i => i.type === 'income').length} 張發票</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={20} />
                    <span className="text-red-100">本月支出</span>
                  </div>
                  <p className="text-3xl font-bold">NT$ {invoiceData.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.total, 0).toLocaleString()}</p>
                  <p className="text-red-200 text-sm mt-2">{invoiceData.filter(i => i.type === 'expense').length} 張發票</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} />
                    <span className="text-blue-100">淨現金流</span>
                  </div>
                  <p className="text-3xl font-bold">NT$ {(invoiceData.filter(i => i.type === 'income').reduce((sum, i) => sum + i.total, 0) - invoiceData.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.total, 0)).toLocaleString()}</p>
                  <p className="text-blue-200 text-sm mt-2">收入 - 支出</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 薪資管理 */}
          {activeTab === 'payroll' && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋員工..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部狀態</option>
                    <option>待發放</option>
                    <option>處理中</option>
                    <option>已發放</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload size={18} />
                    匯入薪資
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={18} />
                    新增薪資
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">員工</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">部門</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">職位</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">本薪</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">獎金</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">扣款</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">實付金額</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">發薪日</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">狀態</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payrollData.map((payroll) => (
                      <tr key={payroll.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{payroll.employee}</td>
                        <td className="px-6 py-4 text-gray-700">{payroll.department}</td>
                        <td className="px-6 py-4 text-gray-700">{payroll.position}</td>
                        <td className="px-6 py-4 text-gray-700">NT$ {payroll.baseSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 text-green-600">+NT$ {payroll.bonus.toLocaleString()}</td>
                        <td className="px-6 py-4 text-red-600">-NT$ {payroll.deduction.toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">NT$ {payroll.netSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-700">{payroll.paymentDate}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={payroll.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <DollarSign size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 薪資統計 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm mb-1">總人數</p>
                  <p className="text-2xl font-bold text-gray-800">{payrollData.length} 人</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm mb-1">本月總薪資</p>
                  <p className="text-2xl font-bold text-blue-600">NT$ {payrollData.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm mb-1">待發放</p>
                  <p className="text-2xl font-bold text-yellow-600">NT$ {payrollData.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm mb-1">平均薪資</p>
                  <p className="text-2xl font-bold text-green-600">NT$ {Math.round(payrollData.reduce((sum, p) => sum + p.netSalary, 0) / payrollData.length).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 帳戶管理 */}
          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>全部類型</option>
                    <option>銀行帳戶</option>
                    <option>現金</option>
                    <option>信用卡</option>
                    <option>投資帳戶</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={18} />
                  新增帳戶
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accountData.map((account) => (
                  <motion.div
                    key={account.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                          account.type === 'bank' ? 'bg-blue-100' :
                          account.type === 'cash' ? 'bg-green-100' :
                          account.type === 'credit' ? 'bg-red-100' : 'bg-purple-100'
                        }`}>
                          {account.type === 'bank' && <Building2 size={24} className="text-blue-600" />}
                          {account.type === 'cash' && <DollarSignIcon size={24} className="text-green-600" />}
                          {account.type === 'credit' && <CreditCard size={24} className="text-red-600" />}
                          {account.type === 'investment' && <TrendingUp size={24} className="text-purple-600" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{account.name}</h4>
                          <p className="text-sm text-gray-500">{account.bankName || '內部帳戶'}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                    <div className="text-3xl font-bold mb-4">
                      <span className={account.balance < 0 ? 'text-red-600' : 'text-gray-800'}>
                        NT$ {Math.abs(account.balance).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">{account.accountNumber}</span>
                      <span className="text-sm text-gray-500">{account.lastUpdated}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        轉帳
                      </button>
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        歷史
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 帳戶總覽 */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-8 text-white">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <PieChartIcon size={20} />
                  資產配置總覽
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold">45%</span>
                    </div>
                    <p className="text-gray-300">銀行存款</p>
                    <p className="text-2xl font-bold">NT$ 4.3M</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-green-500 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold">25%</span>
                    </div>
                    <p className="text-gray-300">預備金</p>
                    <p className="text-2xl font-bold">NT$ 2.4M</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold">20%</span>
                    </div>
                    <p className="text-gray-300">薪資帳戶</p>
                    <p className="text-2xl font-bold">NT$ 1.9M</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-orange-500 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold">10%</span>
                    </div>
                    <p className="text-gray-300">現金庫存</p>
                    <p className="text-2xl font-bold">NT$ 0.96M</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 財務報告 */}
          {activeTab === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    損益表
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">每月營收、支出與利潤分析</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    下載 PDF
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PieChart size={20} className="text-green-600" />
                    資產負債表
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">資產、負債與淨值狀況</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    下載 PDF
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-purple-600" />
                    現金流量表
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">營運、投資與籌資現金流</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    下載 PDF
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-800 mb-6">自定義報告</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">報告類型</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>請選擇報告類型</option>
                      <option>預算執行報告</option>
                      <option>費用分析報告</option>
                      <option>應收帳款報告</option>
                      <option>應付帳款報告</option>
                      <option>薪資分析報告</option>
                      <option>自定義報告</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">時間範圍</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>請選擇時間範圍</option>
                      <option>本月</option>
                      <option>本季</option>
                      <option>本年</option>
                      <option>自定義區間</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">部門</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>全部部門</option>
                      <option>業務部</option>
                      <option>技術部</option>
                      <option>永續部</option>
                      <option>管理部</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">格式</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    預覽
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download size={18} />
                    產生報告
                  </button>
                </div>
              </div>

              {/* 近期報告 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-800 mb-6">近期產生的報告</h4>
                <div className="space-y-4">
                  {[
                    { name: '2025年1月損益表', date: '2025-02-01', size: '245 KB', status: 'completed' },
                    { name: 'Q4 2024 資產負債表', date: '2025-01-15', size: '312 KB', status: 'completed' },
                    { name: '2024年度費用分析', date: '2025-01-05', size: '1.2 MB', status: 'completed' },
                    { name: '12月現金流量表', date: '2025-01-01', size: '189 KB', status: 'completed' },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet size={24} className="text-green-600" />
                        <div>
                          <p className="font-medium text-gray-800">{report.name}</p>
                          <p className="text-sm text-gray-500">{report.date} • {report.size}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={16} />
                        下載
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdministrativeFinancePage;
