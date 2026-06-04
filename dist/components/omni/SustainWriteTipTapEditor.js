import { jsx as _jsx } from "react/jsx-runtime";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useImperativeHandle, forwardRef } from 'react';
const SustainWriteTipTapEditor = forwardRef(({ value, onChange, editable = true }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML()); // 當編輯器內容更新時，將 HTML 格式的內容傳遞給 onChange
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 border border-slate-200 rounded-lg',
            },
        },
    });
    // 暴露 editor 實例的方法給父組件
    useImperativeHandle(ref, () => ({
        getHTML: () => editor?.getHTML() || '',
        getText: () => editor?.getText() || '',
        getJSON: () => editor?.getJSON() || {},
        editorInstance: editor,
    }));
    useEffect(() => {
        // 檢查 editor 是否存在，並且外部 value 與編輯器當前內容不同才更新
        // 這裡假設 value 總是 HTML 格式或純文本
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value, false); // false 表示不觸發 onUpdate
        }
    }, [value, editor]);
    if (!editor) {
        return _jsx("div", { className: "min-h-[300px] p-4 flex items-center justify-center text-slate-400", children: "\u8F09\u5165\u7DE8\u8F2F\u5668\u4E2D..." });
    }
    return _jsx(EditorContent, { editor: editor });
});
SustainWriteTipTapEditor.displayName = 'SustainWriteTipTapEditor'; // 為了更好的調試
export default SustainWriteTipTapEditor;
//# sourceMappingURL=SustainWriteTipTapEditor.js.map