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
        // Dynamically import the editor. This is necessary to prevent errors with Next.js SSR.
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

    return (
        <div className="prose max-w-full text-black">
            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={{
                    // The toolbar now includes the 'imageUpload' button
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|',
                        'imageUpload', // This button requires a correctly configured upload adapter
                        'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                    ],
                    // This section is crucial for enabling image uploads without a backend connector.
                    // It uses a Base64 adapter to embed images directly in the content.
                    extraPlugins: [
                        function (editor: any) {
                            // This function adds the Base64UploadAdapter to the editor's plugin registry.
                            editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                                return new Base64UploadAdapter(loader);
                            };
                        },
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

// The Base64UploadAdapter class handles the logic for converting an image file to a Base64 string.
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

export default CKEditorComponent;