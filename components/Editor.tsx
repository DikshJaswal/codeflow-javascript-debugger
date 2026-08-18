"use client";

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useRef, useEffect } from "react";

type Props = {
  code: string;
  setCode: (value: string) => void;
  currentLine?: number;
  breakpoints?: number[];
  toggleBreakpoint: (line: number) => void;
};

export default function CodeEditor({
  code,
  setCode,
  currentLine,
  breakpoints = [],
  toggleBreakpoint,
}: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (instance: editor.IStandaloneCodeEditor) => {
    editorRef.current = instance;

    // 🔴 Click gutter → toggle breakpoint
    instance.onMouseDown((event) => {
      if (event.target.type === 2 && event.target.position) {
        const line = event.target.position.lineNumber - 1;
        toggleBreakpoint(line);
      }
    });
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const decorations: editor.IModelDeltaDecoration[] = [];

    // 🟡 Current line
    if (currentLine !== undefined) {
      decorations.push({
        range: {
          startLineNumber: currentLine + 1,
          startColumn: 1,
          endLineNumber: currentLine + 1,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "bg-yellow-400/20 border-l-4 border-yellow-400",
        },
      });
    }

    // 🔴 Breakpoints (with red dot)
    breakpoints.forEach((line) => {
      decorations.push({
        range: {
          startLineNumber: line + 1,
          startColumn: 1,
          endLineNumber: line + 1,
          endColumn: 1,
        },
        options: {
          glyphMarginClassName: "breakpoint-dot",
          isWholeLine: true,
          className: "bg-red-500/10",
        },
      });
    });

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      decorations
    );

    const model = editor.getModel();
    if (currentLine !== undefined && model && currentLine < model.getLineCount()) {
      editor.revealLineInCenter(currentLine + 1);
    }
  }, [currentLine, breakpoints]);

  return (
    <div className="h-full rounded-lg overflow-hidden border border-gray-700">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={handleEditorDidMount}
        options={{
          glyphMargin: true,
        }}
      />

      {/* 🔴 Custom red dot style */}
      <style jsx>{`
        .breakpoint-dot {
          background: red;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
