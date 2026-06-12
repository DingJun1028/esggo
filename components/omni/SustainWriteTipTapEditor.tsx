import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, RemoveFormatting } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
        isActive ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400" : "text-slate-600 dark:text-slate-400"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={16} />
      </ToolbarButton>
      <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote size={16} />
      </ToolbarButton>
      <div className="flex-grow" />
      <ToolbarButton
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        <span className="flex items-center gap-1">
          <RemoveFormatting size={16} />
          <span className="text-[10px] hidden sm:inline-block font-bold">清除格式</span>
        </span>
      </ToolbarButton>
    </div>
  );
};

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
            'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] p-6',
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
      if (editor && editor.getHTML() !== value) {
        editor.commands.setContent(value, false); // false 表示不觸發 onUpdate
      }
    }, [value, editor]);

    if (!editor) {
      return <div className="min-h-[400px] p-4 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg">載入智能編撰器中...</div>;
    }

    return (
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-950/50 shadow-sm focus-within:border-cyan-500/50 transition-colors">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    );
  }
);

SustainWriteTipTapEditor.displayName = 'SustainWriteTipTapEditor'; // 為了更好的調試

export default SustainWriteTipTapEditor;
