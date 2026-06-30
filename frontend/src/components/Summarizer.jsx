import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import { FileText, Upload, X, FileUp } from "lucide-react";

export default function Summarizer() {
  const [notes, setNotes] = useState("");
  const [style, setStyle] = useState("bullets");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const { token } = useAuth();

  const handleFile = (f) => {
  const allowed = ["pdf", "docx", "txt", "pptx"];
  const ext = f.name.split(".").pop().toLowerCase();
  if (!allowed.includes(ext)) {
    alert("Only PDF, DOCX, PPTX, and TXT files are supported.");
    return;
  }
  setFile(f);
  setNotes("");
};

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const summarize = async () => {
    if (!notes.trim() && !file) return;
    setLoading(true); setResult("");
    try {
      const formData = new FormData();
      formData.append("style", style);
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("notes", notes);
      }
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/summarize`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(data.result);
    } catch (err) {
      setResult(`❌ ${err.response?.data?.detail || "Summarization failed. Try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => { setFile(null); fileRef.current.value = ""; };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="text-blue-500" size={20} />
        <h2 className="text-lg font-semibold">Notes Summarizer</h2>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
          ${dragOver ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-300 dark:border-gray-700 hover:border-indigo-400"}
          ${file ? "cursor-default" : ""}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.txt,.pptx"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileUp className="text-indigo-500" size={22} />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload className="mx-auto text-gray-400" size={28} />
            <p className="text-sm font-medium text-gray-500">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400">Supports PDF, DOCX, TXT, PPTX</p>
          </div>
        )}
      </div>

      {/* Divider */}
      {!file && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 font-medium">OR TYPE NOTES</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <textarea
            className="input min-h-[160px] resize-y"
            placeholder="Paste your notes here..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </>
      )}

      {/* Style Selector */}
      <div className="flex gap-2 flex-wrap">
        {[["bullets", "Bullet Points"], ["paragraph", "Paragraph"], ["key_points", "Key Points"]].map(([val, label]) => (
          <button key={val} onClick={() => setStyle(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${style === val ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={summarize}
        disabled={loading || (!notes.trim() && !file)}>
        {loading ? "Summarizing..." : "Summarize Notes"}
      </button>

      {result && (
        <div className="card mt-4 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}