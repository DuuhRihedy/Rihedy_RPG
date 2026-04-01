"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { common, createLowlight } from "lowlight";
import type { JSONContent } from "@tiptap/core";
import { useState, useCallback, useRef } from "react";

import { MenuBar } from "./MenuBar";
import { SlashMenu } from "./SlashMenu";
import { slashCommand } from "./extensions/slash-command";
import "./editor.css";

const lowlight = createLowlight(common);

export interface BlockEditorProps {
    content?: JSONContent | string | null;
    onChange?: (content: JSONContent) => void;
    editable?: boolean;
    placeholder?: string;
    className?: string;
    autofocus?: boolean;
    showMenuBar?: boolean;
    minHeight?: string;
}

function textToTiptapJson(text: string): JSONContent {
    if (!text) return { type: "doc", content: [{ type: "paragraph" }] };
    const paragraphs = text.split("\n").map((line) => ({
        type: "paragraph" as const,
        content: line ? [{ type: "text" as const, text: line }] : [],
    }));
    return { type: "doc", content: paragraphs };
}

function parseContent(content: BlockEditorProps["content"]): JSONContent | undefined {
    if (!content) return undefined;
    if (typeof content === "string") {
        try {
            const parsed = JSON.parse(content);
            if (parsed && parsed.type === "doc") return parsed;
            return textToTiptapJson(content);
        } catch {
            return textToTiptapJson(content);
        }
    }
    if (typeof content === "object" && content.type === "doc") return content;
    return undefined;
}

export function BlockEditor({
    content,
    onChange,
    editable = true,
    placeholder = "Digite '/' para comandos...",
    className = "",
    autofocus = false,
    showMenuBar = true,
    minHeight = "200px",
}: BlockEditorProps) {
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragover, setDragover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parsedContent = parseContent(content);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                dropcursor: { color: "#c8a84e", width: 2 },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") return `Heading ${node.attrs.level}`;
                    return placeholder;
                },
                showOnlyWhenEditable: true,
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: { class: "blocksmith-image" },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: { class: "blocksmith-code-block" },
            }),
            TaskList.configure({ HTMLAttributes: { class: "blocksmith-task-list" } }),
            TaskItem.configure({ nested: true }),
            Typography,
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "blocksmith-link" },
            }),
            slashCommand,
        ],
        content: parsedContent,
        editable,
        autofocus: autofocus ? "end" : false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: `blocksmith-editor ${className}`.trim(),
                style: `min-height: ${minHeight}`,
            },
        },
    });

    const insertImage = useCallback((url: string) => {
        if (editor && url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        setShowImageModal(false);
        setImageUrl("");
    }, [editor]);

    const handleFileUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (res.ok) {
                const data = await res.json();
                insertImage(data.url);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    }, [insertImage]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragover(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    }, [handleFileUpload]);

    const handleImageRequest = useCallback(() => {
        setShowImageModal(true);
        setImageTab("upload");
    }, []);

    if (!editor) return null;

    return (
        <div className="blocksmith-wrapper">
            {editable && showMenuBar && (
                <MenuBar editor={editor} onImageRequest={handleImageRequest} />
            )}

            <SlashMenu editor={editor} onImageRequest={handleImageRequest} />

            <EditorContent editor={editor} />

            {/* Image Upload Modal */}
            {showImageModal && (
                <div className="bs-image-modal-overlay" onClick={() => setShowImageModal(false)}>
                    <div className="bs-image-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="bs-image-modal-header">
                            <h3>📷 Inserir Imagem</h3>
                            <button className="bs-image-modal-close" onClick={() => setShowImageModal(false)}>✕</button>
                        </div>
                        <div className="bs-image-modal-tabs">
                            <button className={`bs-image-modal-tab ${imageTab === "upload" ? "active" : ""}`} onClick={() => setImageTab("upload")}>Upload</button>
                            <button className={`bs-image-modal-tab ${imageTab === "url" ? "active" : ""}`} onClick={() => setImageTab("url")}>URL</button>
                        </div>
                        <div className="bs-image-modal-body">
                            {uploading ? (
                                <div className="bs-image-uploading">⏳ Enviando imagem...</div>
                            ) : imageTab === "upload" ? (
                                <>
                                    <div
                                        className={`bs-image-dropzone ${dragover ? "dragover" : ""}`}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
                                        onDragLeave={() => setDragover(false)}
                                        onDrop={handleDrop}
                                    >
                                        <div className="bs-image-dropzone-icon">🖼️</div>
                                        <div>Clique ou arraste uma imagem aqui</div>
                                        <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.6 }}>PNG, JPG, GIF, WebP • Máx 4.5MB</div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                                    />
                                </>
                            ) : (
                                <div className="bs-image-url-form">
                                    <input
                                        type="url"
                                        placeholder="https://exemplo.com/imagem.png"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter" && imageUrl) insertImage(imageUrl); }}
                                        autoFocus
                                    />
                                    <button className="btn btn-primary" onClick={() => imageUrl && insertImage(imageUrl)} disabled={!imageUrl}>
                                        Inserir Imagem
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
