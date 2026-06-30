import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import { Lightbulb } from "lucide-react";

export default function Explainer() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("simple");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const explain = async () => {
    if (!topic.trim()) return;
    setLoading(true); setResult("");
    try {
      const { data } = await api.post(
        "/api/ai/explain",
        { topic, level },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data.result);
    } catch (error) {
      setResult(error.response?.data?.detail || "Failed to get explanation. Try again.");
    }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="text-yellow-500" size={20} />
        <h2 className="text-lg font-semibold">Topic Explainer</h2>
      </div>
      <input className="input" placeholder="Enter a topic (e.g. Photosynthesis, Neural Networks)"
        value={topic} onChange={e => setTopic(e.target.value)}
        onKeyDown={e => e.key === "Enter" && explain()} />
      <div className="flex gap-2">
        {["simple", "medium", "advanced"].map(l => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${level === l ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"}`}>
            {l}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={explain} disabled={loading || !topic.trim()}>
        {loading ? "Explaining..." : "Explain Topic"}
      </button>
      {result && (
        <div className="card mt-4 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
