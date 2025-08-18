// components/CKEditorComponent.tsx
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorComponentProps {
    value: string;
    onChange: (data: string) => void;
}

const editorConfiguration = {
    toolbar: {
        items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'code',
            'removeFormat',
            '|',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            '|',
            'imageUpload',
            'blockQuote'
        ],
    },
    image: {
        toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side'
        ]
    },
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true
        }
    },
    placeholder: 'Type or paste your content here!'
};

export const CKEditorComponent: React.FC<CKEditorComponentProps> = ({ value, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};