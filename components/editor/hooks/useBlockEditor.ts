"use client";

import { useEditor } from "@tiptap/react";
import { useCallback, useMemo } from "react";
import type { JSONContent, Editor } from "@tiptap/core";

interface UseBlockEditorOptions {
    content?: JSONContent;
    onChange?: (content: JSONContent) => void;
    editable?: boolean;
}

interface UseBlockEditorReturn {
    editor: Editor | null;
    getJSON: () => JSONContent | undefined;
    getHTML: () => string;
    getText: () => string;
    isEmpty: boolean;
    characterCount: number;
    wordCount: number;
    clearContent: () => void;
    setContent: (content: JSONContent) => void;
}

export function useBlockEditor({
    content,
    onChange,
    editable = true,
}: UseBlockEditorOptions = {}): UseBlockEditorReturn {
    const editor = useEditor({
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON());
        },
    });

    const getJSON = useCallback(() => editor?.getJSON(), [editor]);
    const getHTML = useCallback(() => editor?.getHTML() ?? "", [editor]);
    const getText = useCallback(() => editor?.getText() ?? "", [editor]);

    const clearContent = useCallback(() => {
        editor?.commands.clearContent(true);
    }, [editor]);

    const setContent = useCallback(
        (newContent: JSONContent) => {
            editor?.commands.setContent(newContent);
        },
        [editor]
    );

    const isEmpty = editor?.isEmpty ?? true;
    const text = editor?.getText() ?? "";
    const characterCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return useMemo(
        () => ({
            editor,
            getJSON,
            getHTML,
            getText,
            isEmpty,
            characterCount,
            wordCount,
            clearContent,
            setContent,
        }),
        [editor, getJSON, getHTML, getText, isEmpty, characterCount, wordCount, clearContent, setContent]
    );
}
