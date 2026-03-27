"use client";

import { BlockEditor } from "@/components/editor";
import type { JSONContent } from "@tiptap/core";
import { useState } from "react";

interface RichTextFieldProps {
    name: string;
    label?: string;
    initialContent?: string | null;
    placeholder?: string;
    minHeight?: string;
    showMenuBar?: boolean;
}

export default function RichTextField({
    name,
    label,
    initialContent,
    placeholder = "Digite '/' para comandos...",
    minHeight = "200px",
    showMenuBar = true,
}: RichTextFieldProps) {
    const [value, setValue] = useState(initialContent || "");

    const handleChange = (content: JSONContent) => {
        setValue(JSON.stringify(content));
    };

    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input type="hidden" name={name} value={value} />
            <BlockEditor
                content={initialContent}
                onChange={handleChange}
                placeholder={placeholder}
                minHeight={minHeight}
                showMenuBar={showMenuBar}
            />
        </div>
    );
}
