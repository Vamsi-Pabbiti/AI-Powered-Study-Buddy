import { useEffect, useState } from "react";
import api from "../lib/api";
import { History as HistoryIcon, Trash2, RefreshCw } from "lucide-react";

const badges = {
  explain: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  summarize: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  quiz: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  flashcard: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function History({ toast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/history/");
      setHistory(data.history);
    } catch { toast("Failed to load history.", "error"); }
    finally { setLoading(false); }
  };

  const deleteItem = async (id) => {
    await api.delete(`/api/history/${id}`);
    setHistory(h => h.filter(i => i._id !== id));
    toast("Deleted.", "info");
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon className="text-gray-500" size={20} />
          <h2 className="text-lg font-semibold">Study History</h2>
        </div>
        <button onClick={fetch} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <HistoryIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No history yet. Start studying!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map(item => (
            <div key={item._id} className="card flex items-start justify-between gap-4 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${badges[item.feature]}`}>
                    {item.feature}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.input}</p>
              </div>
              <button onClick={() => deleteItem(item._id)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}