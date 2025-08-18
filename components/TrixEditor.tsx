import React, { useRef, useEffect } from "react";
import "trix";

interface TrixEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export const TrixEditor: React.FC<TrixEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("trix-change", (event) => {
        const trixEditor = event.target as any;
        if (trixEditor) {
          onChange(trixEditor.value);
        }
      });
      return () => {
        editor.removeEventListener("trix-change", () => {});
      };
    }
  }, [onChange]);

  return (
    <input type="hidden" id="trix" value={value} ref={editorRef} />
  );
};