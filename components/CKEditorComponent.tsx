"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorComponentProps {
  value: string;
  onChange: (data: string) => void;
}

export default function CKEditorComponent({ value, onChange }: CKEditorComponentProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_: unknown, editor: any) => onChange(editor.getData())}
    />
  );
}
