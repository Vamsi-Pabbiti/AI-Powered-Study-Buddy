import { useState, useRef } from "react";
import api from "../lib/api";
import ReactMarkdown from "react-markdown";
import { FileText, Upload, X, FileUp } from "lucide-react";
import Loader from "./Loader";

export default function Summarizer({ toast }) {
  const [notes, setNotes] = useState("");
  const [style, setStyle] = useState("bullets");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    const allowed = ["pdf", "docx", "pptx", "txt"];
    const ext = f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      toast("Only PDF, DOCX, PPTX, and TXT files are supported.", "error");
      return;
    }
    setFile(f); setNotes("");
  };

  const summarize = async () => {
    if (!notes.trim() && !file) return;
    setLoading(true); setResult("");
    try {
      const formData = new FormData();
      formData.append("style", style);
      if (file) formData.append("file", file);
      else formData.append("notes", notes);
      const { data } = await api.post("/api/ai/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(data.result);
      toast("Summary ready!", "success");
    } catch (err) {
      toast(err.response?.data?.detail || "Summarization failed.", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="text-blue-500" size={20} />
        <h2 className="text-lg font-semibold">Notes Summarizer</h2>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => !file && fileRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
          ${dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-300 dark:border-gray-700 hover:border-indigo-400"}
          ${file ? "cursor-default" : ""}`}>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.txt" className="hidden"
          onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileUp className="text-indigo-500" size={20} />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{file.name}</span>
            <button onClick={e => { e.stopPropagation(); setFile(null); fileRef.current.value = ""; }}
              className="text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload className="mx-auto text-gray-400" size={26} />
            <p className="text-sm font-medium text-gray-500">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400">PDF, DOCX, PPTX, TXT</p>
          </div>
        )}
      </div>
      {!file && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 font-medium">OR TYPE NOTES</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <textarea className="input min-h-[150px] resize-y" placeholder="Paste your notes here..."
            value={notes} onChange={e => setNotes(e.target.value)} />
        </>
      )}
      <div className="flex gap-2 flex-wrap">
        {[["bullets", "Bullet Points"], ["paragraph", "Paragraph"], ["key_points", "Key Points"]].map(([val, label]) => (
          <button key={val} onClick={() => setStyle(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${style === val ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={summarize} disabled={loading || (!notes.trim() && !file)}>
        {loading ? "Summarizing..." : "Summarize Notes"}
      </button>
      {loading && <Loader text="Reading and summarizing..." />}
      {result && (
        <div className="card prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}