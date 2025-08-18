
import React, { useRef, useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorComponentProps {
    value: string;
    onChange: (data: string) => void;
}

const editorConfiguration = {
    toolbar: [ 'bold', 'italic', '|', 'undo', 'redo' ]
};

export const CKEditorComponent: React.FC<CKEditorComponentProps> = ({ value, onChange }) => {
    return (
        <CKEditor
            editor={ ClassicEditor }
            config={ editorConfiguration }
            data={ value }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                onChange(data);
            } }
        />
    );
};