"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// load CKEditor only on client
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then(mod => mod.CKEditor),
  { ssr: false }
);

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Editor() {
  const [data, setData] = useState("");

  return (
    <div>
      <h2>My Editor</h2>

      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={(event, editor) => {
          const value = editor.getData();
          setData(value);
        }}
      />

      <h3>Output:</h3>
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
}