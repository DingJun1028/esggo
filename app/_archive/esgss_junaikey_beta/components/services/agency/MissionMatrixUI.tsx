'use client';

import React, { useState, useMemo } from 'react';
import {
  GlassContainer,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
} from '../../ui/GlassComponents';
import {
  MissionMatrix,
  Mission,
  TaskList,
  Task,
  MissionAnalytics,
} from '../../../types/services-part3';

interface MissionMatrixUIProps {
  data?: MissionMatrix;
  language?: 'zh-TW' | 'en';
  theme?: 'light' | 'dark';
}

export const MissionMatrixUI: React.FC<MissionMatrixUIProps> = ({
  data,
  language = 'zh-TW',
  theme = 'light',
}) => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'missions' | 'tasks' | 'executions' | 'analytics'>(
    'missions'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const isZh = language === 'zh-TW';

  const texts = {
    title: isZh ? '任務矩陣' : 'Mission Matrix',
    subtitle: isZh
      ? '管理與執行複雜任務與自動化流程'
      : 'Manage & Execute Complex Missions & Automated Processes',
    missions: isZh ? '任務' : 'Missions',
    tasks: isZh ? '任務清單' : 'Task Lists',
    executions: isZh ? '執行' : 'Executions',
    analytics: isZh ? '分析' : 'Analytics',
    searchMissions: isZh ? '搜尋任務...' : 'Search missions...',
    filterAll: isZh ? '全部' : 'All',
    createMission: isZh ? '創建任務' : 'Create Mission',
    executeMission: isZh ? '執行任務' : 'Execute Mission',
    viewDetails: isZh ? '查看詳情' : 'View Details',
    editMission: isZh ? '編輯任務' : 'Edit Mission',
    totalMissions: isZh ? '總任務數' : 'Total Missions',
    activeMissions: isZh ? '活躍任務' : 'Active Missions',
    completedMissions: isZh ? '已完成' : 'Completed',
    successRate: isZh ? '成功率' : 'Success Rate',
    missionTitle: isZh ? '任務標題' : 'Mission Title',
    missionCategory: isZh ? '任務類別' : 'Mission Category',
    priority: isZh ? '優先級' : 'Priority',
    progress: isZh ? '進度' : 'Progress',
    assignedTo: isZh ? '指派給' : 'Assigned To',
    startDate: isZh ? '開始日期' : 'Start Date',
    dueDate: isZh ? '截止日期' : 'Due Date',
    completedAt: isZh ? '完成日期' : 'Completed At',
    taskTitle: isZh ? '任務標題' : 'Task Title',
    taskStatus: isZh ? '任務狀態' : 'Task Status',
    estimatedHours: isZh ? '預估時數' : 'Est. Hours',
    actualHours: isZh ? '實際時數' : 'Actual Hours',
    executor: isZh ? '執行者' : 'Executor',
    executionStatus: isZh ? '執行狀態' : 'Execution Status',
    startTime: isZh ? '開始時間' : 'Start Time',
    endTime: isZh ? '結束時間' : 'End Time',
    results: isZh ? '結果' : 'Results',
    averageCompletionTime: isZh ? '平均完成時間' : 'Avg Completion Time',
    byCategory: isZh ? '按類別' : 'By Category',
    byAssignee: isZh ? '按指派人' : 'By Assignee',
    planning: isZh ? '規劃中' : 'Planning',
    active: isZh ? '活躍' : 'Active',
    paused: isZh ? '暫停' : 'Paused',
    completed: isZh ? '已完成' : 'Completed',
    cancelled: isZh ? '已取消' : 'Cancelled',
    critical: isZh ? '嚴重' : 'Critical',
    high: isZh ? '高' : 'High',
    medium: isZh ? '中' : 'Medium',
    low: isZh ? '低' : 'Low',
    todo: isZh ? '待辦' : 'To Do',
    inProgress: isZh ? '進行中' : 'In Progress',
    review: isZh ? '審查中' : 'Review',
    blocked: isZh ? '阻塞' : 'Blocked',
    running: isZh ? '運行中' : 'Running',
    failed: isZh ? '失敗' : 'Failed',
    success: isZh ? '成功' : 'Success',
    partial: isZh ? '部分' : 'Partial',
    totalTasks: isZh ? '總任務數' : 'Total Tasks',
    completedTasks: isZh ? '已完成任務' : 'Completed Tasks',
    status: isZh ? '狀態' : 'Status',
  };

  const filteredMissions = useMemo(() => {
    if (!data?.missions) return [];

    return data.missions.filter(mission => {
      const matchesSearch =
        mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || mission.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || mission.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data?.missions, searchQuery, filterStatus, filterPriority]);

  const activeExecutions = useMemo(() => {
    if (!data?.executions) return [];
    return data.executions.filter(execution => execution.status === 'running');
  }, [data?.executions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'active':
        return 'text-blue-600 dark:text-blue-400';
      case 'paused':
        return 'text-orange-600 dark:text-orange-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400';
      case 'todo':
        return 'text-gray-600 dark:text-gray-400';
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'review':
        return 'text-purple-600 dark:text-purple-400';
      case 'blocked':
        return 'text-red-600 dark:text-red-400';
      case 'running':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'partial':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning':
        return texts.planning;
      case 'active':
        return texts.active;
      case 'paused':
        return texts.paused;
      case 'completed':
        return texts.completed;
      case 'cancelled':
        return texts.cancelled;
      case 'todo':
        return texts.todo;
      case 'in_progress':
        return texts.inProgress;
      case 'review':
        return texts.review;
      case 'blocked':
        return texts.blocked;
      case 'running':
        return texts.running;
      case 'failed':
        return texts.failed;
      case 'success':
        return texts.success;
      case 'partial':
        return texts.partial;
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical':
        return texts.critical;
      case 'high':
        return texts.high;
      case 'medium':
        return texts.medium;
      case 'low':
        return texts.low;
      default:
        return priority;
    }
  };

  const getAllTasks = useMemo(() => {
    if (!data?.taskLists) return [];
    return data.taskLists.flatMap(taskList => taskList.tasks);
  }, [data?.taskLists]);

  return (
    <GlassContainer theme={theme} className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{texts.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{texts.subtitle}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data?.missions?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.totalMissions}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data?.missions?.filter(m => m.status === 'active').length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.activeMissions}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data?.missions?.filter(m => m.status === 'completed').length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {texts.completedMissions}
            </div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data?.analytics?.successRate ? (data.analytics.successRate * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.successRate}</div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'missions'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.missions} ({data?.missions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.tasks} ({getAllTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('executions')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'executions'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.executions} ({activeExecutions.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {texts.analytics}
          </button>
        </div>

        {/* Controls for missions */}
        {activeTab === 'missions' && (
          <GlassCard theme={theme} className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <GlassInput
                  type="text"
                  placeholder={texts.searchMissions}
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  theme={theme}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e: any) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">
                    {texts.filterAll} {texts.status}
                  </option>
                  <option value="planning">{texts.planning}</option>
                  <option value="active">{texts.active}</option>
                  <option value="paused">{texts.paused}</option>
                  <option value="completed">{texts.completed}</option>
                  <option value="cancelled">{texts.cancelled}</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e: any) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">
                    {texts.filterAll} {texts.priority}
                  </option>
                  <option value="critical">{texts.critical}</option>
                  <option value="high">{texts.high}</option>
                  <option value="medium">{texts.medium}</option>
                  <option value="low">{texts.low}</option>
                </select>
                <GlassButton
                  onClick={() => console.log('Creating new mission...')}
                  theme={theme}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {texts.createMission}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Missions Tab */}
        {activeTab === 'missions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMissions.map(mission => (
              <GlassCard key={mission.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {mission.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {mission.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(mission.priority)}`}
                      >
                        {getPriorityText(mission.priority)}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(mission.status)}`}>
                        {getStatusText(mission.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">{texts.progress}</span>
                        <span className="text-gray-900 dark:text-white">{mission.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.assignedTo}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {mission.assignedTo.length > 0
                          ? mission.assignedTo.join(', ')
                          : isZh
                            ? '未指派'
                            : 'Unassigned'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.startDate}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {mission.startDate
                          ? new Date(mission.startDate).toLocaleDateString()
                          : '--'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.dueDate}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {mission.dueDate ? new Date(mission.dueDate).toLocaleDateString() : '--'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.completedAt}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {mission.completedAt
                          ? new Date(mission.completedAt).toLocaleDateString()
                          : '--'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <GlassButton
                      onClick={() => setSelectedMission(mission.id)}
                      theme={theme}
                      className="flex-1"
                    >
                      {texts.viewDetails}
                    </GlassButton>
                    {mission.status === 'active' && (
                      <GlassButton
                        onClick={() => console.log(`Executing mission: ${mission.id}`)}
                        theme={theme}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {texts.executeMission}
                      </GlassButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.taskLists?.map(taskList => (
              <GlassCard key={taskList.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{taskList.name}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {taskList.tasks.length} {isZh ? '個任務' : 'tasks'}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {taskList.tasks.map(task => (
                      <div
                        key={task.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h4>
                          <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {task.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              {texts.assignedTo}:
                            </span>
                            <div className="text-gray-900 dark:text-white">
                              {task.assignedTo || isZh ? '未指派' : 'Unassigned'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              {texts.dueDate}:
                            </span>
                            <div className="text-gray-900 dark:text-white">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '--'}
                            </div>
                          </div>
                          {task.estimatedHours && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                {texts.estimatedHours}:
                              </span>
                              <div className="text-gray-900 dark:text-white">
                                {task.estimatedHours}h
                              </div>
                            </div>
                          )}
                          {task.actualHours && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                {texts.actualHours}:
                              </span>
                              <div className="text-gray-900 dark:text-white">
                                {task.actualHours}h
                              </div>
                            </div>
                          )}
                        </div>

                        <GlassButton
                          onClick={() => setSelectedTask(task.id)}
                          theme={theme}
                          className="w-full"
                        >
                          {texts.viewDetails}
                        </GlassButton>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Executions Tab */}
        {activeTab === 'executions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeExecutions.map(execution => (
              <GlassCard key={execution.id} theme={theme} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {texts.executionStatus} - Mission {execution.missionId}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {texts.executor}: {execution.executor}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(execution.status)}`}>
                      {getStatusText(execution.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.startTime}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {new Date(execution.startTime).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">{texts.endTime}:</span>
                      <div className="text-gray-900 dark:text-white">
                        {execution.endTime
                          ? new Date(execution.endTime).toLocaleString()
                          : 'Running'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {texts.results} ({execution.results.length})
                    </h4>
                    <div className="max-h-48 overflow-y-auto">
                      {execution.results.map((result, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded mb-1"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{result.taskName}</span>
                            <span className={getStatusColor(result.outcome)}>
                              {getStatusText(result.outcome)}
                            </span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 mt-1">
                            {result.details}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <GlassButton
                    onClick={() => console.log(`Viewing execution: ${execution.id}`)}
                    theme={theme}
                    className="w-full"
                  >
                    {texts.viewDetails}
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && data?.analytics && (
          <div className="space-y-4">
            <GlassCard theme={theme} className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                📊 {isZh ? '總體分析' : 'Overall Analytics'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data.analytics.totalMissions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {texts.totalMissions}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.analytics.completedMissions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {texts.completedMissions}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {(data.analytics.successRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {texts.successRate}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {data.analytics.averageCompletionTime.toFixed(1)}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {texts.averageCompletionTime}
                  </div>
                </div>
              </div>
            </GlassCard>

            {data.analytics.byCategory && (
              <GlassCard theme={theme} className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  📂 {texts.byCategory}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.analytics.byCategory.map((category, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {category.category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {isZh ? '總數' : 'Total'}:
                          </span>
                          <div className="text-gray-900 dark:text-white">{category.total}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {texts.completed}:
                          </span>
                          <div className="text-gray-900 dark:text-white">{category.completed}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {texts.successRate}:
                          </span>
                          <div className="text-gray-900 dark:text-white">
                            {(category.successRate * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {isZh ? '平均時間' : 'Avg Time'}:
                          </span>
                          <div className="text-gray-900 dark:text-white">
                            {category.averageTime.toFixed(1)}h
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {data.analytics.byAssignee && (
              <GlassCard theme={theme} className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  👥 {texts.byAssignee}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.analytics.byAssignee.map((assignee, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {assignee.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {isZh ? '已指派' : 'Assigned'}:
                          </span>
                          <div className="text-gray-900 dark:text-white">{assignee.assigned}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {texts.completed}:
                          </span>
                          <div className="text-gray-900 dark:text-white">{assignee.completed}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {texts.successRate}:
                          </span>
                          <div className="text-gray-900 dark:text-white">
                            {(assignee.successRate * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {isZh ? '平均時間' : 'Avg Time'}:
                          </span>
                          <div className="text-gray-900 dark:text-white">
                            {assignee.averageTime.toFixed(1)}h
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </div>
    </GlassContainer>
  );
};
