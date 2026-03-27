import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const slashCommand = Extension.create({
    name: "slashCommand",

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey("slashCommand"),
                props: {
                    handleKeyDown(_view, event) {
                        if (event.key === "/") {
                            return false;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
