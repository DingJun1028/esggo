import { Editor } from '@tiptap/react';
import React from 'react';
export interface SustainWriteEditorRef {
    getHTML: () => string;
    getText: () => string;
    getJSON: () => Record<string, any>;
    editorInstance: Editor | null;
}
interface SustainWriteTipTapEditorProps {
    value: string;
    onChange: (value: string) => void;
    editable?: boolean;
}
declare const SustainWriteTipTapEditor: React.ForwardRefExoticComponent<SustainWriteTipTapEditorProps & React.RefAttributes<SustainWriteEditorRef>>;
export default SustainWriteTipTapEditor;
//# sourceMappingURL=SustainWriteTipTapEditor.d.ts.map