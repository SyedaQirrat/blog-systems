"use client";

import React, { useEffect, useRef, useState } from 'react';

// Define a type for the editor modules to avoid TypeScript errors
interface EditorModules {
    CKEditor: any;
    ClassicEditor: any;
}

interface CKEditorComponentProps {
    value: string;
    onChange: (data: string) => void;
}

function CKEditorComponent({ value, onChange }: CKEditorComponentProps) {
    const editorRef = useRef<EditorModules>();
    const [editorLoaded, setEditorLoaded] = useState(false);

    useEffect(() => {
        // Dynamically import the editor.
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        };
        setEditorLoaded(true);
    }, []);

    if (!editorLoaded || !editorRef.current) {
        return <div>Loading Editor...</div>;
    }

    const { CKEditor, ClassicEditor } = editorRef.current;

    // The Base64UploadAdapter class handles converting image files to Base64 strings.
    class Base64UploadAdapter {
        private loader: any;
        constructor(loader: any) {
            this.loader = loader;
        }
        upload() {
            return this.loader.file.then(
                (file: File) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve({ default: reader.result });
                        };
                        reader.onerror = (error) => {
                            reject(error);
                        };
                        reader.readAsDataURL(file);
                    })
            );
        }
    }

    function MyCustomUploadAdapterPlugin(editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            return new Base64UploadAdapter(loader);
        };
    }

    return (
        <div className="prose max-w-full text-black">
            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={{
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|',
                        'imageUpload',
                        'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                    ],
                }}
                onChange={(event: any, editor: any) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </div>
    );
}

export default CKEditorComponent;