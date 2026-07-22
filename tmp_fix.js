const fs = require('fs');

// 1. Fix reconnaissance-view.tsx
try {
  let content = fs.readFileSync('c:\\Project\\esggo\\components\\views\\reconnaissance-view.tsx', 'utf8');
  content = content.replace(/protocol_5T: \{\s+truth: string;\s+thankful: string;\s+tasteful: boolean;\s+trust: string;\s+transcend: string;\s+\};/g, 
  `protocol_5T: {
      tangible: boolean;
      traceable: string;
      trackable: string[];
      transparent: string;
      trustworthy: string;
    };
    principles_5T: {
      truth: string;
      thankful: string;
      tasteful: boolean;
      trust: string;
      transcend: string;
    };`);

  content = content.replace(/protocol_5T: \{\s+tasteful: true,\s+truth: (.*?),\s+transcend: (.*?),\s+thankful: (.*?),\s+trust: (.*?),?\s+\}/g,
  `protocol_5T: {
        tangible: true,
        traceable: $1,
        trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"],
        transparent: $3,
        trustworthy: $4,
      },
      principles_5T: {
        truth: $1,
        thankful: $3,
        tasteful: true,
        trust: $4,
        transcend: $2,
      }`);

  content = content.replace(/<div className="flex gap-2 bg-\[#F8F9FA\] px-3 py-1\.5 rounded-full border border-black\/5">[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-3 bg-[#F8F9FA] px-3 py-1.5 rounded-full border border-black/5">
            <div className="flex gap-1.5 border-r border-black/10 pr-3">
              <span className="text-[8px] font-bold text-[#333333]/50 mr-1">PROTOCOL</span>
              <div className="w-2 h-2 rounded-full bg-[#219EBC]" title="Tangible (可感知)" />
              <div className="w-2 h-2 rounded-full bg-[#219EBC]" title="Traceable (可溯源)" />
              <div className="w-2 h-2 rounded-full bg-[#009E9D]" title="Trackable (可追蹤)" />
              <div className="w-2 h-2 rounded-full bg-[#FFB703]" title="Transparent (可透明)" />
              <div className="w-2 h-2 rounded-full bg-[#FF4D6D]" title="Trustworthy (不可篡改 LOCKED)" />
            </div>
            <div className="flex gap-1.5">
              <span className="text-[8px] font-bold text-[#333333]/50 mr-1">PRINCIPLES</span>
              <div className="w-2 h-2 rounded-full bg-[#219EBC]" title="Truth (真)" />
              <div className="w-2 h-2 rounded-full bg-[#219EBC]" title="Thankful (善)" />
              <div className="w-2 h-2 rounded-full bg-[#009E9D]" title="Tasteful (美)" />
              <div className="w-2 h-2 rounded-full bg-[#FFB703]" title="Trust (信)" />
              <div className="w-2 h-2 rounded-full bg-[#FF4D6D]" title="Transcend (通)" />
            </div>
          </div>`);

  content = content.replace(/<div className="text-\[10px\] text-\[#333333\]\/70 font-mono space-y-1\.5">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="text-[10px] text-[#333333]/70 font-mono space-y-1.5">
            <div className="flex items-center gap-1.5 hover:text-[#009E9D] transition-colors cursor-pointer">
              <LinkIcon className="w-3 h-3" />
              <span className="truncate max-w-[200px]">TRACE: {intel.protocol_5T.traceable}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>CALC: {intel.protocol_5T.transparent}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex flex-col items-end gap-1.5">
               <div className="flex items-center gap-1 text-[10px] text-[#FF4D6D] font-mono bg-[#FF4D6D]/10 px-2 py-1 rounded border border-[#FF4D6D]/20">
                 <Lock className="w-3 h-3" />
                 <span>HASH: {intel.protocol_5T.trustworthy.substring(0, 12)}...</span>
               </div>
               <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                 <span>真善美信通 ALIGNED</span>
               </div>
            </div>
          </div>
        </div>`);
  fs.writeFileSync('c:\\Project\\esggo\\components\\views\\reconnaissance-view.tsx', content);
  console.log('Fixed reconnaissance-view.tsx');
} catch (e) { console.error(e); }

// 2. Fix route.ts
try {
  let content = fs.readFileSync('c:\\Project\\esggo\\app\\api\\reconnaissance\\gateway\\route.ts', 'utf8');
  content = content.replace(/protocol_5T: \{\s*tasteful: true,[\s\S]*?trust: generateHash\(JSON\.stringify\(rawData\)\),\s*\}/,
  `// 1. 5T 協議 (Data Governance)
      protocol_5T: {
        tangible: true,
        traceable: rawData.source_url || "UNKNOWN_ORIGIN",
        trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"],
        transparent: rawData.calculation_method || "SROI_Impact_Model_v2 [ISO-14064-1]",
        trustworthy: generateHash(JSON.stringify(rawData)),
      },
      // 2. 5T 原則 (Core Philosophy)
      principles_5T: {
        tasteful: true,
        truth: rawData.source_url || "UNKNOWN_ORIGIN",
        transcend: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"].join(","),
        thankful: rawData.calculation_method || "SROI_Impact_Model_v2 [ISO-14064-1]",
        trust: generateHash(JSON.stringify(rawData)),
      }`);
  content = content.replace("hash: processedIntel.protocol_5T.trust,", "hash: processedIntel.protocol_5T.trustworthy,");
  fs.writeFileSync('c:\\Project\\esggo\\app\\api\\reconnaissance\\gateway\\route.ts', content);
  console.log('Fixed route.ts');
} catch (e) { console.error(e); }

// 3. Fix 5t-protocol.ts
try {
  let content = fs.readFileSync('c:\\Project\\esggo\\lib\\core\\5t-protocol.ts', 'utf8');
  content = content.replace(/protocol_5T: \{\s*truth: string;[\s\S]*?transcend: string;\s*\};/,
  `// 1. 5T 協議 (Data Governance Protocol) - 確保數據的物理層面規格
    protocol_5T: {
      tangible: boolean; // 🟢 可感知 (UI Rendering Ready)
      traceable: string; // 🟢 可溯源 (source_origin URL)
      trackable: string[]; // 🔵 可追蹤 (Lifecycle Hooks)
      transparent: string; // 🟠 可透明 (Formula / ISO Tag)
      trustworthy: string; // 🔴 不可篡改 (Hash Lock)
    };
    // 2. 5T 原則 (Core Philosophy) - 系統的精神與哲學表現
    principles_5T: {
      truth: string;     // 真 (Truth): 可溯源追蹤的真實數據
      thankful: string;  // 善 (Thankful): 可透明驗算的公正審計
      tasteful: boolean; // 美 (Tasteful): 可感知的卓越藝術
      trust: string;     // 信 (Trust): 不可篡改的信任
      transcend: string; // 通 (Transcend): 超越一切的無礙圓通
    };`);
  fs.writeFileSync('c:\\Project\\esggo\\lib\\core\\5t-protocol.ts', content);
  console.log('Fixed 5t-protocol.ts');
} catch (e) { console.error(e); }

// 4. Fix digital-certificate.tsx
try {
  let content = fs.readFileSync('c:\\Project\\esggo\\components\\ui\\digital-certificate.tsx', 'utf8');
  content = content.replace(/<div className="grid grid-cols-5 gap-2">/,
  `{/* 5T Protocol Status */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-between w-full max-w-sm bg-slate-50 px-6 py-3 rounded-full border border-slate-100 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">5T PROTOCOL (Governance)</span>
                <div className="flex items-center gap-2">
                  {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map(p => (
                    <div key={p} className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100" title={\`\${p} Verified\`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-5 mb-1 text-center text-xs font-bold text-slate-400 tracking-widest uppercase">
                5T Principles (Core Philosophy)
              </div>`);
  fs.writeFileSync('c:\\Project\\esggo\\components\\ui\\digital-certificate.tsx', content);
  console.log('Fixed digital-certificate.tsx');
} catch (e) { console.error(e); }

console.log('All done');
