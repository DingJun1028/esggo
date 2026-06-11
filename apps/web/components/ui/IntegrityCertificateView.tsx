'use client';

import React from 'react';
import { Shield, CheckCircle2, Download, ExternalLink, Award, FileCheck, Map, Landmark } from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandT5Strip } from '../brand';
import { IntegrityCertificate } from '../../lib/proof-export';
import { motion } from 'framer-motion';

interface Props {
  certificate: IntegrityCertificate;
  onClose?: () => void;
}

export function IntegrityCertificateView({ certificate, onClose }: Props) {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-extreme border border-slate-100 max-w-2xl w-full">
      {/* Certificate Header */}
      <div className="bg-berkeley-blue p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between items-start">
            <BrandBadge variant="gold" className="px-3 py-1 font-black">5T INTEGRITY CERTIFIED</BrandBadge>
            <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">{certificate.certificateId}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase mt-4">ESG 誠信憑證</h2>
          <p className="text-primary-200 text-sm font-medium">Immutable Evidence of Regulatory Compliance</p>
        </div>
        <Landmark size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
      </div>

      <div className="p-8 space-y-8">
        {/* Recipient & Date */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-50 pb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issued To / 持有人</p>
            <p className="text-sm font-bold text-berkeley-blue">{certificate.issuedTo}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date / 簽發日期</p>
            <p className="text-sm font-bold text-berkeley-blue">{new Date(certificate.issuedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Data Summary */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <FileCheck size={14} className="text-berkeley-blue" />
            數據摘要 (Data Payload)
          </h4>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Metric Value</p>
                <p className="text-lg font-black text-berkeley-blue">{certificate.dataSummary.metric}</p>
              </div>
              <BrandBadge variant="info" size="xs">v{certificate.dataSummary.version}</BrandBadge>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Original Source</p>
              <p className="text-xs font-mono text-slate-600 truncate">{certificate.dataSummary.source}</p>
            </div>
          </div>
        </div>

        {/* 5T Integrity Matrix */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Map size={14} className="text-berkeley-blue" />
            5T 誠信矩陣 (Integrity Matrix)
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(certificate.integrityMatrix).map(([key, hash]) => (
              <div key={key} className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-blue-200 transition-colors group">
                <p className="text-[9px] font-black text-berkeley-blue/40 group-hover:text-berkeley-blue uppercase">{key.split('_')[0].toUpperCase()}</p>
                <CheckCircle2 size={16} className="text-verified" />
                <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-verified/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Seal */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
              <Shield size={14} /> MasterSeal v1.1.0 Hash
            </p>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </div>
          <p className="text-[10px] font-mono text-emerald-700 break-all leading-tight">
            {certificate.masterSeal}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-4">
          <BrandButton variant="ghost" fullWidth onClick={onClose} className="rounded-2xl text-xs font-black uppercase">
            關閉
          </BrandButton>
          <BrandButton variant="primary" fullWidth className="rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-900/10">
            <Download size={14} className="mr-2" /> 下載憑證
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
