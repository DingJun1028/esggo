import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function ReportBuilder() {
    const [blocks, setBlocks] = useState([]);
    const [reportStatus, setReportStatus] = useState('draft');
    // 新增區塊
    const addBlock = (type) => {
        setBlocks([...blocks, { id: Date.now().toString(), type, content: '' }]);
    };
    // 封印報告，觸發 OmniNexus API
    const sealReport = async () => {
        try {
            const res = await fetch('/api/nexus/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'seal_5t_proof',
                    arguments: { blocks },
                    userId: 'current-user-uuid' // 實際中從 Auth 取得
                })
            });
            const data = await res.json();
            if (data.success) {
                setReportStatus('sealed');
                alert(`報告已成功封印！\n5T 信任分數: ${data.metadata.trustScore}\nTransaction ID: ${data.metadata.transactionId}`);
            }
        }
        catch (e) {
            console.error(e);
            alert('無法觸發 Proof Center 封印，請確認 API 服務。');
        }
    };
    return (_jsxs("div", { className: "p-6 bg-white rounded-xl shadow-md border border-gray-200", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "\u6C38\u7E8C\u64B0\u5BEB (Report Builder \u842C\u80FD\u5143\u4EF6)" }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${reportStatus === 'sealed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`, children: reportStatus === 'sealed' ? '🔒 已封印 (Trustworthy)' : '📝 草稿 (Draft)' })] }), _jsxs("div", { className: "space-y-4 mb-6", children: [blocks.map((block) => (_jsxs("div", { className: "p-4 border rounded-lg bg-gray-50 flex flex-col gap-2", children: [_jsx("span", { className: "text-xs font-bold text-gray-500 uppercase", children: block.type.replace('_', ' ') }), block.type === 'narrative' && (_jsx("textarea", { className: "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "AI \u8F14\u52A9\u6558\u8FF0\u751F\u6210\u5340\u584A\uFF08\u53EF\u81EA\u52D5\u751F\u6210 GRI \u61C9\u7B54\uFF09...", disabled: reportStatus === 'sealed' })), block.type === 'data_table' && (_jsxs("div", { className: "p-4 bg-white border border-gray-200 rounded text-sm text-gray-600", children: ["\uD83D\uDCCA \u52D5\u614B\u6578\u64DA\u8868\uFF1A\u5DF2\u5373\u6642\u9023\u7D50 ", _jsx("b", { children: "Vault Omni" }), " \u7684\u4F86\u6E90\u6578\u64DA\uFF08\u4E0D\u53EF\u624B\u52D5\u4FEE\u6539\uFF09"] })), block.type === 'compliance_statement' && (_jsxs("div", { className: "p-4 bg-green-50 border border-green-200 text-green-800 rounded text-sm", children: ["\u2705 \u5408\u898F\u8072\u660E\uFF1A\u672C\u5340\u584A\u5DF2\u901A\u904E ", _jsx("b", { children: "Compliance Check" }), " \u5BE9\u6838\uFF0C\u78BA\u8A8D\u5C0D\u9F4A GRI \u6E96\u5247"] }))] }, block.id))), blocks.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-400 border-2 border-dashed rounded-xl", children: "\u9EDE\u64CA\u4E0B\u65B9\u6309\u9215\uFF0C\u958B\u59CB\u5F9E\u842C\u80FD\u5143\u4EF6\u5EAB\u65B0\u589E\u5831\u544A\u5340\u584A" }))] }), reportStatus === 'draft' && (_jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: () => addBlock('narrative'), className: "px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors", children: "+ \u6558\u8FF0\u5340\u584A (Narrative)" }), _jsx("button", { onClick: () => addBlock('data_table'), className: "px-4 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors", children: "+ \u9023\u7D50\u6578\u64DA (Vault Omni)" }), _jsx("button", { onClick: () => addBlock('compliance_statement'), className: "px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors", children: "+ \u63D2\u5165\u5408\u898F\u8072\u660E (GRI)" })] })), _jsx("div", { className: "mt-8 pt-6 border-t flex justify-end", children: reportStatus === 'draft' ? (_jsx("button", { onClick: sealReport, className: "px-6 py-2 bg-gray-900 text-white font-semibold rounded shadow hover:bg-gray-800 transition-all active:scale-95", children: "\u555F\u52D5 Proof Center \u5C01\u5370" })) : (_jsx("button", { disabled: true, className: "px-6 py-2 bg-gray-200 text-gray-500 font-semibold rounded cursor-not-allowed", children: "\u5831\u544A\u5177\u5099\u9632\u7AC4\u6539\u8B49\u660E (Immutable)" })) })] }));
}
//# sourceMappingURL=ReportBuilder.js.map