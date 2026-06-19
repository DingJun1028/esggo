"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { FileDiff, AlertCircle } from "lucide-react";

interface DiffVisualizerProps {
  unifiedDiff: string;
  title?: string;
}

/**
 * ? Diff Visualizer UI (瘜?撌桃瘥?閬死??隞?
 * ?? diff-engine.ts ?Ｗ??Unified Diff ?澆?嚗蝝?擃漁憿舐內?憓???扎摰? */
export function DiffVisualizer({ unifiedDiff, title = "?霈瘥? (Diff Engine)" }: DiffVisualizerProps) {
  const parsedLines = useMemo(() => {
    if (!unifiedDiff) return [];
    const lines = unifiedDiff.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("+") && !line.startsWith("+++")) {
        return { type: "add", content: line.substring(1), id: index };
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        return { type: "remove", content: line.substring(1), id: index };
      } else if (line.startsWith("@@")) {
        return { type: "header", content: line, id: index };
      } else if (line.startsWith("---") || line.startsWith("+++")) {
        return { type: "meta", content: line, id: index };
      } else {
        return { type: "context", content: line.substring(1) || line, id: index };
      }
    });
  }, [unifiedDiff]);

  if (!unifiedDiff) {
    return (
      <div className="p-4 bg-stitch-shallow-gray rounded-lg border border-black/5 flex items-center gap-3 text-stitch-muted">
        <AlertCircle className="w-5 h-5" />
        <span>?桀?瘝??菜葫?啁??祈???(No diff available)</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/5 bg-white overflow-hidden font-mono text-sm shadow-minimal">
      {/* Header */}
      <div className="flex items-center gap-2 bg-stitch-shallow-gray px-4 py-3 border-b border-black/5">
        <FileDiff className="w-4 h-4 text-stitch-teal-start" />
        <span className="font-bold text-stitch-text">{title}</span>
        <div className="ml-auto flex gap-3 text-[10px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-stitch-optimal">
            <div className="w-2 h-2 rounded-full bg-stitch-optimal" />
            ?啣?
          </span>
          <span className="flex items-center gap-1 text-stitch-lethal">
            <div className="w-2 h-2 rounded-full bg-stitch-lethal" />
            ?芷
          </span>
        </div>
      </div>

      {/* Diff Content */}
      <div className="overflow-x-auto p-4 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
        {parsedLines.map((line) => {
          if (line.type === "add") {
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={line.id}
                className="flex rounded bg-stitch-optimal/10 border border-stitch-optimal/20 text-stitch-optimal px-2 py-1"
              >
                <span className="w-6 text-stitch-optimal/50 select-none">+</span>
                <span className="whitespace-pre-wrap break-words flex-1 font-medium">{line.content}</span>
              </motion.div>
            );
          }
          if (line.type === "remove") {
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={line.id}
                className="flex rounded bg-stitch-lethal/10 border border-stitch-lethal/20 text-stitch-lethal px-2 py-1 line-through decoration-stitch-lethal/50"
              >
                <span className="w-6 text-stitch-lethal/50 select-none">-</span>
                <span className="whitespace-pre-wrap break-words flex-1 font-medium">{line.content}</span>
              </motion.div>
            );
          }
          if (line.type === "header") {
            return (
              <div key={line.id} className="flex text-stitch-teal-start/70 px-2 py-2 mt-2 bg-stitch-teal-start/5 rounded text-[10px] font-bold uppercase tracking-widest">
                <span className="whitespace-pre-wrap">{line.content}</span>
              </div>
            );
          }
          if (line.type === "meta") {
            return (
              <div key={line.id} className="flex text-stitch-muted px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                <span className="whitespace-pre-wrap">{line.content}</span>
              </div>
            );
          }
          return (
            <div key={line.id} className="flex text-stitch-muted px-2 py-0.5 hover:bg-stitch-shallow-gray rounded transition-colors">
              <span className="w-6 text-stitch-muted/30 select-none"> </span>
              <span className="whitespace-pre-wrap break-words flex-1">{line.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

