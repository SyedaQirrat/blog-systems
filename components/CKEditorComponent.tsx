"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import CKEditor for SSR safety
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor), {
  ssr: false,
});
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CKEditorComponent({ value, onChange }: Props) {
  return (
    <div style={{ marginTop: "10px" }}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: [
            "heading", "|",
            "bold", "italic", "link", "|",
            "bulletedList", "numberedList", "|",
            "blockQuote", "insertTable", "undo", "redo"
          ],
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}
