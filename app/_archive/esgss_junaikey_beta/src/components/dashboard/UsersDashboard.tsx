/**
 * Users Dashboard - 用戶儀表板
 * Anti-gravity Design System
 * 
 * 功能：
 * - 用戶列表
 * - 用戶管理
 * - 角色管理
 * - 權限設置
 * - 用戶統計
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravityCard, AntiGravityGrid } from '@/components/layout/AntiGravityLayout';

// 用戶角色類型
type UserRole = 'admin' | 'manager' | 'user' | 'guest';

// 用戶狀態類型
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// 用戶類型
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  lastLogin: Date;
  createdAt: Date;
}

// 用戶統計類型
interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  admins: number;
  managers: number;
  users: number;
  guests: number;
}

// 模擬用戶數據
const mockUsers: User[] = [
  {
    id: '1',
    name: '張三',
    email: 'zhangsan@example.com',
    avatar: '👨‍💼',
    role: 'admin',
    status: 'active',
    department: '技術部',
    lastLogin: new Date(Date.now() - 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    avatar: '👩‍💼',
    role: 'manager',
    status: 'active',
    department: '市場部',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    avatar: '👨‍💻',
    role: 'user',
    status: 'active',
    department: '技術部',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
  },
  {
    id: '4',
    name: '趙六',
    email: 'zhaoliu@example.com',
    avatar: '👩‍💻',
    role: 'user',
    status: 'inactive',
    department: '財務部',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
  {
    id: '5',
    name: '孫七',
    email: 'sunqi@example.com',
    avatar: '👨‍🔬',
    role: 'user',
    status: 'pending',
    department: '研發部',
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '6',
    name: '周八',
    email: 'zhouba@example.com',
    avatar: '👩‍🎨',
    role: 'guest',
    status: 'active',
    department: '設計部',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
];

// 用戶統計
const userStats: UserStats = {
  total: 6,
  active: 4,
  inactive: 1,
  pending: 1,
  suspended: 0,
  admins: 1,
  managers: 1,
  users: 3,
  guests: 1,
};

// 獲取角色顏色
const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'text-red-400 bg-red-400/10';
    case 'manager':
      return 'text-purple-400 bg-purple-400/10';
    case 'user':
      return 'text-blue-400 bg-blue-400/10';
    case 'guest':
      return 'text-gray-400 bg-gray-400/10';
    default:
      return 'text-white/60 bg-white/10';
  }
};

// 獲取角色文本
const getRoleText = (role: UserRole, language: 'zh-TW' | 'en') => {
  switch (role) {
    case 'admin':
      return language === 'zh-TW' ? '管理員' : 'Admin';
    case 'manager':
      return language === 'zh-TW' ? '經理' : 'Manager';
    case 'user':
      return language === 'zh-TW' ? '用戶' : 'User';
    case 'guest':
      return language === 'zh-TW' ? '訪客' : 'Guest';
    default:
      return language === 'zh-TW' ? '未知' : 'Unknown';
  }
};

// 獲取狀態顏色
const getStatusColor = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return 'text-green-400 bg-green-400/10';
    case 'inactive':
      return 'text-gray-400 bg-gray-400/10';
    case 'pending':
      return 'text-yellow-400 bg-yellow-400/10';
    case 'suspended':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-white/60 bg-white/10';
  }
};

// 獲取狀態文本
const getStatusText = (status: UserStatus, language: 'zh-TW' | 'en') => {
  switch (status) {
    case 'active':
      return language === 'zh-TW' ? '活躍' : 'Active';
    case 'inactive':
      return language === 'zh-TW' ? '非活躍' : 'Inactive';
    case 'pending':
      return language === 'zh-TW' ? '待審核' : 'Pending';
    case 'suspended':
      return language === 'zh-TW' ? '已暫停' : 'Suspended';
    default:
      return language === 'zh-TW' ? '未知' : 'Unknown';
  }
};

// 格式化時間
const formatTime = (date: Date, language: 'zh-TW' | 'en') => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return language === 'zh-TW' ? '剛剛' : 'Just now';
  if (minutes < 60) return language === 'zh-TW' ? `${minutes} 分鐘前` : `${minutes} min ago`;
  if (hours < 24) return language === 'zh-TW' ? `${hours} 小時前` : `${hours} hours ago`;
  return language === 'zh-TW' ? `${days} 天前` : `${days} days ago`;
};

// 主組件
const UsersDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');

  // 過濾用戶
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 添加用戶
  const handleAddUser = () => {
    alert(language === 'zh-TW' ? '打開添加用戶對話框' : 'Open add user dialog');
  };

  // 編輯用戶
  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      alert(language === 'zh-TW' ? `編輯用戶：${user.name}` : `Edit user: ${user.name}`);
    }
  };

  // 刪除用戶
  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user && confirm(language === 'zh-TW' ? `確定要刪除用戶 ${user.name} 嗎？` : `Are you sure you want to delete user ${user.name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // 更改用戶狀態
  const handleChangeStatus = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  // 更改用戶角色
  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/start')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {language === 'zh-TW' ? '用戶管理' : 'User Management'}
                </h1>
                <p className="text-sm text-white/60">
                  {language === 'zh-TW' ? '管理系統用戶和權限' : 'Manage system users and permissions'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-[#00BCD4] hover:bg-[#00BCD4]/80 text-white rounded-lg font-medium transition-all"
              >
                {language === 'zh-TW' ? '添加用戶' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* UUID Display */}
        <div className="mb-8">
          <UUIDDisplay
            uuid="550e8400-e29b-41d4-a716-446655440000"
            mode="full"
            showLabel={true}
            language={language}
          />
        </div>

        {/* Stats Grid */}
        <AntiGravityGrid columns={4} gap={4} className="mb-8">
          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '總用戶數' : 'Total Users'}</span>
            </div>
            <div className="text-3xl font-bold text-white">{userStats.total}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '活躍用戶' : 'Active Users'}</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{userStats.active}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '待審核' : 'Pending'}</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{userStats.pending}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '已暫停' : 'Suspended'}</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{userStats.suspended}</div>
          </div>
        </AntiGravityGrid>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder={language === 'zh-TW' ? '搜索用戶...' : 'Search users...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#00BCD4]/50 transition-all"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00BCD4]/50 transition-all"
          >
            <option value="all" className="bg-slate-900">
              {language === 'zh-TW' ? '所有角色' : 'All Roles'}
            </option>
            <option value="admin" className="bg-slate-900">
              {language === 'zh-TW' ? '管理員' : 'Admin'}
            </option>
            <option value="manager" className="bg-slate-900">
              {language === 'zh-TW' ? '經理' : 'Manager'}
            </option>
            <option value="user" className="bg-slate-900">
              {language === 'zh-TW' ? '用戶' : 'User'}
            </option>
            <option value="guest" className="bg-slate-900">
              {language === 'zh-TW' ? '訪客' : 'Guest'}
            </option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'all')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00BCD4]/50 transition-all"
          >
            <option value="all" className="bg-slate-900">
              {language === 'zh-TW' ? '所有狀態' : 'All Status'}
            </option>
            <option value="active" className="bg-slate-900">
              {language === 'zh-TW' ? '活躍' : 'Active'}
            </option>
            <option value="inactive" className="bg-slate-900">
              {language === 'zh-TW' ? '非活躍' : 'Inactive'}
            </option>
            <option value="pending" className="bg-slate-900">
              {language === 'zh-TW' ? '待審核' : 'Pending'}
            </option>
            <option value="suspended" className="bg-slate-900">
              {language === 'zh-TW' ? '已暫停' : 'Suspended'}
            </option>
          </select>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{user.avatar}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role, language)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status, language)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-1">{user.email}</p>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <span>{user.department}</span>
                      <span>{language === 'zh-TW' ? '最後登錄：' : 'Last login: '}{formatTime(user.lastLogin, language)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="p-2 hover:bg-white/10 text-white/80 rounded-lg transition-all"
                    title={language === 'zh-TW' ? '編輯' : 'Edit'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 hover:bg-red-400/20 text-red-400 rounded-lg transition-all"
                    title={language === 'zh-TW' ? '刪除' : 'Delete'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {language === 'zh-TW' ? '沒有找到用戶' : 'No users found'}
            </h3>
            <p className="text-white/60">
              {language === 'zh-TW' ? '請調整搜索條件或過濾器' : 'Please adjust your search or filters'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersDashboard;
