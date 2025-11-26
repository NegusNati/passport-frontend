# Lexical Markdown Support Plan

## Phase 1: Context & research ✅
- [x] Review current rich-text files (LexicalEditor, ToolbarPlugin, markdown transformers, nodes).
- [x] Read Lexical markdown integration docs and plugin guidance.

## Phase 2: Design fixes ✅
- [x] Decide transformer set: keep a curated subset of Lexical transformers and add dependencies for custom image/video nodes to avoid missing-node errors.
- [x] Define import/export strategy: keep HTML as persisted format, add optional Markdown emit (`onMarkdownChange`) and opt-in Markdown initial load via `valueFormat="markdown"`, plus a paste handler that converts plain-text Markdown.
- [x] Outline code changes: extend transformers, add `MarkdownPastePlugin`, update `LexicalEditor` to accept Markdown I/O, and refresh the Markdown help tooltip to cover video.

### Design notes
- Use custom `PASSPORT_TRANSFORMERS` derived from Lexical primitives plus image/video transformers with explicit dependencies.
- Introduce `valueFormat` prop (default `html`) and optional `onMarkdownChange` callback so forms can consume Markdown when needed without breaking HTML persistence.
- Add `MarkdownPastePlugin` that converts plain-text clipboard Markdown when no HTML is present and the text matches common Markdown markers.
- Keep sanitized HTML output for storage; Markdown is a convenience layer for authoring and interoperability.

## Phase 3: Implementation
- [x] Update markdown-transformers with dependencies, normalized patterns, and aggregated transformer list.
- [x] Update LexicalEditor (config, value handling, MarkdownShortcutPlugin usage) to support Markdown import/export and paste/shortcut reliability.
- [x] Add/adjust tests for markdown shortcuts, import/export, and image/video transformers.

## Phase 4: Validation
- [x] Run unit tests for the rich-text area (Vitest) and note results. (vitest run src/shared/components/rich-text/__tests__/LexicalEditor.markdown.test.tsx)
- [ ] Manual smoke: confirm heading/list shortcuts plus image/video Markdown conversions in a dev build or headless editor.
