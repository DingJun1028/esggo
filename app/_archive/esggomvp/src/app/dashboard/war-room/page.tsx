"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    MessageSquare,
    Eye,
    Lock,
    ShieldAlert,
    Edit3,
    MousePointer2,
    FileCheck2,
    Share2
} from "lucide-react";

/**
 * Omni-Collaborative War Room
 * 核心視角：將報告撰寫體驗從「單機版」升級為「全域無邊界共做」。
 * 透過模擬的多彩光標與 RLS 權限分割，展示不同部門如何在同一份報告中安全協作。
 */
export default function WarRoomPage() {
    const [currentUserRole, setCurrentUserRole] = useState<'HR' | 'FACILITY' | 'CSO'>('CSO');

    // 模擬即時協作者與他們的光標位置
    const [collaborators, setCollaborators] = useState([
        { id: 'c1', name: '陳經理 (HR)', role: 'HR', color: 'bg-indigo-500', cursorY: 120 },
        { id: 'c2', name: '林廠長 (Facility)', role: 'FACILITY', color: 'bg-emerald-500', cursorY: 340 },
    ]);

    // 光標微動效 (讓畫面看起來像活的)
    useEffect(() => {
        const interval = setInterval(() => {
            setCollaborators(prev => prev.map(c => ({
                ...c,
                cursorY: c.cursorY + (Math.random() > 0.5 ? 2 : -2)
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* 頂部導航與協作工具列 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-[#63a6b0]" />
            全域共做戰情室
          </h1>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            30 人線上
          </span>
        </div>

        {/* 角色切換開關 (Demo 用途) */}
        <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-xl">
           <span className="text-xs text-slate-500 font-medium px-2">視角測試：</span>
           {['HR', 'FACILITY', 'CSO'].map(role => (
             <button 
               key={role}
               onClick={() => setCurrentUserRole(role as any)}
               className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${currentUserRole === role ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
             >
               {role}
             </button>
           ))}
        </div>

        <div className="flex items-center gap-4">
          {/* 線上頭像堆疊 */}
          <div className="flex -space-x-3">
            {collaborators.map(c => (
               <div key={c.id} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-sm ${c.color}`}>
                 {c.name.charAt(0)}
               </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">
              +28
            </div>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium">
            <Share2 className="w-4 h-4" /> 邀請協作
          </button>
        </div >
      </header >

        {/* 主體編輯區與側邊聊天 */ }
        < div className = "flex-1 flex overflow-hidden" >

            {/* 左側：報告文件擬真區 */ }
            < div className = "flex-1 bg-slate-100 overflow-y-auto p-8 relative" >
                <div className="max-w-4xl mx-auto bg-white min-h-[1000px] shadow-sm rounded-lg border border-slate-200 p-12 relative print:shadow-none print:border-none">

                    {/* Title */}
                    <h2 className="text-4xl font-bold text-slate-900 mb-8 border-b-4 border-[#63a6b0] pb-4 inline-block">2026 永續報告書草稿</h2>

                    {/* S-Zone: 社會責任區塊 (受 RLS 保護) */}
                    <RLSZone
                        name="S-Zone (社會責任)"
                        allowedRoles={['HR', 'CSO']}
                        currentRole={currentUserRole}
                        data={[
                            { label: "新進員工數", val: "142 人" },
                            { label: "離職率", val: "5.4%" },
                            { label: "平均訓練時數", val: "42.5 小時" }
                        ]}
                        collaborator={collaborators.find(c => c.role === 'HR')}
                    />

                    {/* E-Zone: 環境保護區塊 (受 RLS 保護) */}
                    <RLSZone
                        name="E-Zone (環境保護)"
                        allowedRoles={['FACILITY', 'CSO']}
                        currentRole={currentUserRole}
                        data={[
                            { label: "Scope 1 排放", val: "1,245 tCO2e" },
                            { label: "Scope 2 排放", val: "8,430 tCO2e" },
                            { label: "再生能源占比", val: "15.2%" }
                        ]}
                        collaborator={collaborators.find(c => c.role === 'FACILITY')}
                    />

                </div>
        </div >

        {/* 右側：側邊討論區 */ }
        < div className = "w-80 bg-white border-l border-slate-200 flex flex-col" >
          <div className="p-4 border-b border-slate-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-500" />
            <span className="font-semibold text-slate-700">對話與批註</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
             {/* 模擬聊天對話 */}
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">陳</div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200/60 shadow-sm text-sm text-slate-700">
                 社會責任章節的訓練時數已經根據上週最新的報表更新了。請永續長過目。
               </div>
             </div>
             
             <div className="flex gap-3 flex-row-reverse">
               <div className="w-8 h-8 rounded-full bg-[#63a6b0] flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">我</div>
               <div className="bg-[#63a6b0] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                 收到，數據跟 HR 系統串接驗算無誤。
               </div>
             </div>
             
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">林</div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200/60 shadow-sm text-sm text-slate-700">
                 <div className="flex items-center gap-1 text-rose-500 font-medium mb-1"><ShieldAlert className="w-4 h-4"/> RLS 權限擋下了</div>
                 我這邊沒辦法編輯 S-Zone 的內容，不過 E-Zone 的碳排數據已經校正完畢了。
               </div>
             </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
             <input type="text" placeholder="輸入訊息 @同事..." className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#63a6b0]" />
          </div>
        </div >

      </div >
    </div >
  );
}

// 模擬依據 RLS (Row-Level Security) 顯示/隱藏的區塊
function RLSZone({ name, allowedRoles, currentRole, data, collaborator }: { name: string, allowedRoles: string[], currentRole: string, data: any[], collaborator?: any }) {
    const hasAccess = allowedRoles.includes(currentRole);

    return (
        <div className="mb-12 relative group">
            {/* 模擬協作游標 */}
            {collaborator && (
                <div
                    className={`absolute -left-6 z-20 flex flex-col items-start transition-all duration-500 shadow-md`}
            style={{ top: `${collaborator.cursorY % 80}%` }}
         >
            <MousePointer2 className={`w-5 h-5 ${collaborator.color.replace('bg-', 'text-')} fill-current`} />
            <div className={`${collaborator.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-r-full rounded-bl-full ml-3 -mt-1`}>
            {collaborator.name}
        </div>
         </div >
       )
}

{/* 標題與權限標籤 */ }
<div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
    <h3 className="text-2xl font-bold text-slate-800">{name}</h3>
    {hasAccess ? (
        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-100">
            <Edit3 className="w-3.5 h-3.5" /> 已獲授權寫入 (RLS Checked)
        </span>
    ) : (
        <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-100">
            <Lock className="w-3.5 h-3.5" /> 權限受限 (RLS Denied)
        </span>
    )}
</div>

{/* 內容區塊 */ }
{
    hasAccess ? (
        <div className="grid grid-cols-3 gap-6">
            {data.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-[#63a6b0] transition-colors cursor-text">
                    <div className="text-sm font-medium text-slate-500 mb-1">{item.label}</div>
                    <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {item.val}
                        {idx === 0 && collaborator && (
                            <span className={`w-1 h-5 ${collaborator.color} animate-pulse`}></span>
                 )}
                </div>
             </div>
    ))
}
         </div >
       ) : (
    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400">
        <ShieldAlert className="w-12 h-12 mb-3 text-slate-300" />
        <p className="font-semibold text-slate-600">您目前的角色 ({currentRole}) 不具備此區塊的檢視或修改權限。</p>
        <p className="text-sm mt-1 text-slate-400">系統底層 Row-Level Security 已啟動防護。</p>
    </div>
)}

{
    hasAccess && (
        <p className="mt-4 text-slate-600 leading-relaxed text-justify">
            本報告內容係依據最新之 {name.split(' ')[0]} 準則所編製，所有對應指標均已透過系統核心校驗。團隊已全面審視供應鏈與內部實踐的關聯性，確認相關數據無重大遺漏或虛偽隱匿。在持續精進的道路上，本段落作為承先啟後的依據，將持續被追蹤與更新。
        </p>
    )
}
    </div >
  );
}
