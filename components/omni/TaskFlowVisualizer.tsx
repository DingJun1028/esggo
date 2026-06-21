// components/omni/TaskFlowVisualizer.tsx
// 萬能中心 — 任務流程視覺化

'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import type { AgentTask, AgentRegistration } from '@/lib/omni-hub/types';

interface TaskFlowVisualizerProps {
  tasks: AgentTask[];
  facilities: AgentRegistration[];
  onTaskClick?: (task: AgentTask) => void;
}

interface FlowNode {
  id: string;
  type: 'facility' | 'task';
  label: string;
  status: string;
  x: number;
  y: number;
  data: AgentTask | AgentRegistration;
}

interface FlowEdge {
  from: string;
  to: string;
  type: 'assignment' | 'dependency' | 'subtask';
  label?: string;
}

export function TaskFlowVisualizer({ tasks, facilities, onTaskClick }: TaskFlowVisualizerProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];
    const facilityMap = new Map(facilities.map((f) => [f.id, f]));

    // 建立設施節點
    facilities.forEach((facility, idx) => {
      nodes.push({
        id: `facility_${facility.id}`,
        type: 'facility',
        label: facility.displayName,
        status: facility.status,
        x: 100 + (idx % 4) * 200,
        y: 60 + Math.floor(idx / 4) * 120,
        data: facility,
      });
    });

    // 建立任務節點
    tasks.forEach((task, idx) => {
      const assignedFacility = facilityMap.get(task.assignedTo);
      const facilityNode = nodes.find((n) => n.id === `facility_${task.assignedTo}`);

      nodes.push({
        id: `task_${task.id}`,
        type: 'task',
        label: task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title,
        status: task.status,
        x: facilityNode ? facilityNode.x + (idx % 3) * 150 - 75 : 100 + idx * 150,
        y: facilityNode ? facilityNode.y + 100 : 300 + idx * 80,
        data: task,
      });

      // 分派邊
      if (assignedFacility) {
        edges.push({
          from: `facility_${task.assignedTo}`,
          to: `task_${task.id}`,
          type: 'assignment',
          label: '分派',
        });
      }

      // 子任務邊
      if (task.parentTaskId) {
        edges.push({
          from: `task_${task.parentTaskId}`,
          to: `task_${task.id}`,
          type: 'subtask',
          label: '子任務',
        });
      }
    });

    return { nodes, edges };
  }, [tasks, facilities]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'completed':
      case 'success':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'pending':
      case 'idle':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'failed':
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'paused':
      case 'deregistered':
        return 'bg-neutral-100 border-neutral-300 text-neutral-600';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-600';
    }
  };

  if (nodes.length === 0) {
    return (
      <Card variant="outlined" padding="lg" className="text-center py-12">
        <p className="text-sm text-neutral-400">目前無任務或設施可視覺化</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 流程圖 */}
      <div
        className="relative bg-neutral-50 rounded-xl border border-neutral-200 overflow-auto"
        style={{ minHeight: 400 }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ minWidth: 800, minHeight: 400 }}>
          {/* 繪製邊 */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + 60;
            const fromY = fromNode.y + 25;
            const toX = toNode.x + 60;
            const toY = toNode.y + 25;

            return (
              <g key={`edge_${i}`}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={
                    edge.type === 'assignment'
                      ? '#3B82F6'
                      : edge.type === 'subtask'
                      ? '#8B5CF6'
                      : '#94A3B8'
                  }
                  strokeWidth={2}
                  strokeDasharray={edge.type === 'subtask' ? '4,4' : undefined}
                  markerEnd="url(#arrowhead)"
                />
                {edge.label && (
                  <text
                    x={(fromX + toX) / 2}
                    y={(fromY + toY) / 2 - 5}
                    textAnchor="middle"
                    className="fill-neutral-400 text-[9px]"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* 箭頭標記 */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
            </marker>
          </defs>
        </svg>

        {/* 節點 */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute cursor-pointer transition-transform hover:scale-105`}
            style={{ left: node.x, top: node.y, width: 120 }}
            onClick={() => {
              if (node.type === 'task' && onTaskClick) {
                onTaskClick(node.data as AgentTask);
              }
            }}
          >
            <div className={`rounded-lg border-2 p-2 text-center ${getStatusColor(node.status)}`}>
              <p className="text-[10px] font-bold truncate">{node.label}</p>
              <p className="text-[8px] opacity-70 mt-0.5">
                {node.type === 'facility' ? '設施' : '任務'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 圖例 */}
      <div className="flex flex-wrap gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
          <span className="text-neutral-500">運行中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
          <span className="text-neutral-500">已完成</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
          <span className="text-neutral-500">等待中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          <span className="text-neutral-500">失敗</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-0.5 bg-blue-400" />
          <span className="text-neutral-500">分派</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-6 h-0.5 bg-purple-400 border-dashed"
            style={{ borderTop: '2px dashed #8B5CF6', height: 0 }}
          />
          <span className="text-neutral-500">子任務</span>
        </div>
      </div>
    </div>
  );
}

export default TaskFlowVisualizer;
