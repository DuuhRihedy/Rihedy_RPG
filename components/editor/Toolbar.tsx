"use client";

import type { Editor } from "@tiptap/react";
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    Link as LinkIcon, List, ListOrdered, Quote, Undo, Redo, Palette, X,
} from "lucide-react";
import { useState, useCallback } from "react";

const TEXT_COLORS = [
    { name: "Padrão", value: "" },
    { name: "Branco", value: "#ffffff" },
    { name: "Cinza", value: "#a3a3a3" },
    { name: "Vermelho", value: "#ef4444" },
    { name: "Laranja", value: "#f97316" },
    { name: "Âmbar", value: "#f59e0b" },
    { name: "Amarelo", value: "#eab308" },
    { name: "Verde", value: "#22c55e" },
    { name: "Ciano", value: "#06b6d4" },
    { name: "Azul", value: "#3b82f6" },
    { name: "Rosa", value: "#ec4899" },
];

interface ToolbarProps {
    editor: Editor;
}

export function Toolbar({ editor }: ToolbarProps) {
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const setLink = useCallback(() => {
        if (linkUrl === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        setShowLinkInput(false);
        setLinkUrl("");
    }, [editor, linkUrl]);

    const setColor = useCallback(
        (color: string) => {
            if (color === "") {
                editor.chain().focus().unsetColor().run();
            } else {
                editor.chain().focus().setColor(color).run();
            }
            setShowColorPicker(false);
        },
        [editor]
    );

    const currentColor = editor.getAttributes("textStyle").color || "";

    const buttons = [
        { icon: <Bold size={16} />, title: "Negrito", action: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
        { icon: <Italic size={16} />, title: "Itálico", action: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
        { icon: <Strikethrough size={16} />, title: "Tachado", action: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
        { icon: <Code size={16} />, title: "Código", action: () => editor.chain().focus().toggleCode().run(), isActive: () => editor.isActive("code") },
        { icon: <Heading1 size={16} />, title: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
        { icon: <Heading2 size={16} />, title: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
        { icon: <Heading3 size={16} />, title: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
        { icon: <List size={16} />, title: "Lista", action: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
        { icon: <ListOrdered size={16} />, title: "Numerada", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
        { icon: <Quote size={16} />, title: "Citação", action: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote") },
        { icon: <LinkIcon size={16} />, title: "Link", action: () => { setShowColorPicker(false); setShowLinkInput(!showLinkInput); }, isActive: () => editor.isActive("link") },
    ];

    return (
        <div className="blocksmith-toolbar">
            <div className="blocksmith-toolbar-buttons">
                {buttons.map((btn) => (
                    <button key={btn.title} type="button" onClick={btn.action} className={`blocksmith-toolbar-btn ${btn.isActive() ? "is-active" : ""}`} title={btn.title}>
                        {btn.icon}
                    </button>
                ))}
                <div className="blocksmith-toolbar-divider" />
                <button type="button" onClick={() => { setShowLinkInput(false); setShowColorPicker(!showColorPicker); }} className={`blocksmith-toolbar-btn ${currentColor ? "is-active" : ""}`} title="Cor do texto" style={{ position: "relative" }}>
                    <Palette size={16} />
                    {currentColor && <span className="blocksmith-color-indicator" style={{ background: currentColor }} />}
                </button>
                <div className="blocksmith-toolbar-divider" />
                <button type="button" onClick={() => editor.chain().focus().undo().run()} className="blocksmith-toolbar-btn" title="Desfazer" disabled={!editor.can().undo()}>
                    <Undo size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} className="blocksmith-toolbar-btn" title="Refazer" disabled={!editor.can().redo()}>
                    <Redo size={16} />
                </button>
            </div>
            {showColorPicker && (
                <div className="blocksmith-color-picker">
                    {TEXT_COLORS.map((color) => (
                        <button key={color.name} type="button" className={`blocksmith-color-swatch ${currentColor === color.value ? "is-active" : ""}`} onClick={() => setColor(color.value)} title={color.name}>
                            {color.value === "" ? <X size={14} /> : <span className="blocksmith-color-dot" style={{ background: color.value }} />}
                            <span className="blocksmith-color-name">{color.name}</span>
                        </button>
                    ))}
                </div>
            )}
            {showLinkInput && (
                <div className="blocksmith-link-input">
                    <input type="url" placeholder="https://exemplo.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setLink(); if (e.key === "Escape") setShowLinkInput(false); }} autoFocus />
                    <button type="button" onClick={setLink}>OK</button>
                </div>
            )}
        </div>
    );
}
