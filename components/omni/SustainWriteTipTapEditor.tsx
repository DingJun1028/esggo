import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';

// 定義暴露給父組件的 ref 類型
export interface SustainWriteEditorRef {
  getHTML: () => string;
  getText: () => string;
  getJSON: () => Record<string, any>;
  editorInstance: Editor | null; // 暴露編輯器實例以供進階操作
}

interface SustainWriteTipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
}

const SustainWriteTipTapEditor = forwardRef<SustainWriteEditorRef, SustainWriteTipTapEditorProps>(
  ({ value, onChange, editable = true }, ref) => {
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
          class:
            'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 border border-slate-200 rounded-lg',
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
      return <div className="min-h-[300px] p-4 flex items-center justify-center text-slate-400">載入編輯器中...</div>;
    }

    return <EditorContent editor={editor} />;
  }
);

SustainWriteTipTapEditor.displayName = 'SustainWriteTipTapEditor'; // 為了更好的調試

export default SustainWriteTipTapEditor;
