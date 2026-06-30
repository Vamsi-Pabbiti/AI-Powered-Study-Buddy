import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { History as HistoryIcon, Trash2 } from "lucide-react";

const featureColors = {
  explain: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  summarize: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  quiz: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  flashcard: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/api/history/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data.history);
    } catch {} finally { setLoading(false); }
  };

  const deleteItem = async (id) => {
    await api.delete(`/api/history/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHistory(h => h.filter(i => i._id !== id));
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <HistoryIcon className="text-gray-500" size={20} />
        <h2 className="text-lg font-semibold">Study History</h2>
      </div>
      {loading ? <p className="text-gray-400 text-sm">Loading...</p>
        : history.length === 0 ? <p className="text-gray-400 text-sm">No history yet. Start studying!</p>
        : (
          <div className="space-y-3">
            {history.map(item => (
              <div key={item._id} className="card flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${featureColors[item.feature]}`}>
                      {item.feature}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{item.input}</p>
                </div>
                <button onClick={() => deleteItem(item._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
