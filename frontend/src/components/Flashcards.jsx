import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Layers, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function Flashcards() {
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(8);
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setCards([]); setCurrent(0); setFlipped(false);
    try {
      const { data } = await api.post(
        "/api/ai/flashcards",
        { topic, num_cards: numCards },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCards(data.flashcards);
    } catch (error) {
      alert(error.response?.data?.detail || "Flashcard generation failed.");
    }
    finally { setLoading(false); }
  };

  const prev = () => { setCurrent(c => Math.max(0, c - 1)); setFlipped(false); };
  const next = () => { setCurrent(c => Math.min(cards.length - 1, c + 1)); setFlipped(false); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="text-purple-500" size={20} />
        <h2 className="text-lg font-semibold">Flashcard Generator</h2>
      </div>
      <input className="input" placeholder="Topic for flashcards (e.g. Human Anatomy, SQL Commands)"
        value={topic} onChange={e => setTopic(e.target.value)} />
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Cards:</label>
        {[5, 8, 10, 15].map(n => (
          <button key={n} onClick={() => setNumCards(n)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${numCards === n ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
            {n}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
        {loading ? "Generating Cards..." : "Generate Flashcards"}
      </button>

      {cards.length > 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-500 text-center">{current + 1} / {cards.length}</p>
          <div onClick={() => setFlipped(!flipped)}
            className="cursor-pointer min-h-[200px] card flex items-center justify-center text-center relative select-none hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-500 mb-3 font-semibold">
                {flipped ? "Answer" : "Question"}
              </p>
              <p className="text-lg font-medium">{flipped ? cards[current].back : cards[current].front}</p>
              <p className="text-xs text-gray-400 mt-4">Click to {flipped ? "see question" : "reveal answer"}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev} disabled={current === 0}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => { setCurrent(0); setFlipped(false); }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <RotateCcw size={16} />
            </button>
            <button onClick={next} disabled={current === cards.length - 1}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
