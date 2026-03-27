"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";
import {
    Heading1, Heading2, Heading3, List, ListOrdered, ListChecks,
    Quote, Code, ImageIcon, Minus, MessageSquare, Type,
} from "lucide-react";

interface SlashMenuItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: (editor: Editor) => void;
}

interface SlashMenuProps {
    editor: Editor;
    onImageRequest?: () => void;
}

export function SlashMenu({ editor, onImageRequest }: SlashMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const menuItems: SlashMenuItem[] = [
        { title: "Texto", description: "Parágrafo normal", icon: <Type size={18} />, command: (e) => e.chain().focus().setParagraph().run() },
        { title: "Título 1", description: "Título grande", icon: <Heading1 size={18} />, command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
        { title: "Título 2", description: "Título médio", icon: <Heading2 size={18} />, command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
        { title: "Título 3", description: "Título pequeno", icon: <Heading3 size={18} />, command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
        { title: "Lista", description: "Lista com marcadores", icon: <List size={18} />, command: (e) => e.chain().focus().toggleBulletList().run() },
        { title: "Lista Numerada", description: "Lista com números", icon: <ListOrdered size={18} />, command: (e) => e.chain().focus().toggleOrderedList().run() },
        { title: "Lista de Tarefas", description: "Lista com checkboxes", icon: <ListChecks size={18} />, command: (e) => e.chain().focus().toggleTaskList().run() },
        { title: "Citação", description: "Bloco de citação", icon: <Quote size={18} />, command: (e) => e.chain().focus().toggleBlockquote().run() },
        { title: "Código", description: "Bloco de código", icon: <Code size={18} />, command: (e) => e.chain().focus().toggleCodeBlock().run() },
        {
            title: "Imagem", description: "Upload ou URL de imagem", icon: <ImageIcon size={18} />,
            command: () => {
                if (onImageRequest) {
                    onImageRequest();
                } else {
                    const url = window.prompt("URL da imagem:");
                    if (url) editor.chain().focus().setImage({ src: url }).run();
                }
            },
        },
        { title: "Divisor", description: "Linha separadora", icon: <Minus size={18} />, command: (e) => e.chain().focus().setHorizontalRule().run() },
        { title: "Callout", description: "Bloco de destaque", icon: <MessageSquare size={18} />, command: (e) => e.chain().focus().toggleBlockquote().run() },
    ];

    const filteredItems = menuItems.filter(
        (item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
    );

    const executeCommand = useCallback(
        (item: SlashMenuItem) => {
            const { state } = editor;
            const { from } = state.selection;
            const textBefore = state.doc.textBetween(Math.max(0, from - query.length - 1), from, "\n");
            const slashPos = textBefore.lastIndexOf("/");
            if (slashPos !== -1) {
                const deleteFrom = from - query.length - 1;
                editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
            }
            item.command(editor);
            setIsOpen(false);
            setQuery("");
            setSelectedIndex(0);
        },
        [editor, query]
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;
            if (event.key === "ArrowDown") { event.preventDefault(); setSelectedIndex((prev) => prev < filteredItems.length - 1 ? prev + 1 : 0); }
            else if (event.key === "ArrowUp") { event.preventDefault(); setSelectedIndex((prev) => prev > 0 ? prev - 1 : filteredItems.length - 1); }
            else if (event.key === "Enter") { event.preventDefault(); if (filteredItems[selectedIndex]) executeCommand(filteredItems[selectedIndex]); }
            else if (event.key === "Escape") { setIsOpen(false); setQuery(""); setSelectedIndex(0); }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, filteredItems, executeCommand]);

    useEffect(() => {
        if (!editor) return;
        const handleUpdate = () => {
            const { state } = editor;
            const { from } = state.selection;
            const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, "\n");
            const slashMatch = textBefore.match(/\/([^/\s]*)$/);
            if (slashMatch) {
                setQuery(slashMatch[1]);
                setIsOpen(true);
                setSelectedIndex(0);
                const coords = editor.view.coordsAtPos(from);
                const editorRect = editor.view.dom.getBoundingClientRect();
                setPosition({ top: coords.bottom - editorRect.top + 8, left: coords.left - editorRect.left });
            } else {
                setIsOpen(false);
                setQuery("");
            }
        };
        editor.on("update", handleUpdate);
        editor.on("selectionUpdate", handleUpdate);
        return () => { editor.off("update", handleUpdate); editor.off("selectionUpdate", handleUpdate); };
    }, [editor]);

    useEffect(() => {
        if (!menuRef.current || !isOpen) return;
        const selectedEl = menuRef.current.children[selectedIndex] as HTMLElement;
        if (selectedEl) selectedEl.scrollIntoView({ block: "nearest" });
    }, [selectedIndex, isOpen]);

    if (!isOpen || filteredItems.length === 0) return null;

    return (
        <div ref={menuRef} className="blocksmith-slash-menu" style={{ top: `${position.top}px`, left: `${position.left}px` }}>
            {filteredItems.map((item, index) => (
                <button key={item.title} type="button" className={`blocksmith-slash-menu-item ${index === selectedIndex ? "is-selected" : ""}`} onClick={() => executeCommand(item)} onMouseEnter={() => setSelectedIndex(index)}>
                    <span className="blocksmith-slash-menu-icon">{item.icon}</span>
                    <div className="blocksmith-slash-menu-text">
                        <span className="blocksmith-slash-menu-title">{item.title}</span>
                        <span className="blocksmith-slash-menu-desc">{item.description}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}
