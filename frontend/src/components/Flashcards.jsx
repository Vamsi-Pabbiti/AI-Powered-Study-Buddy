import { useState } from "react";
import api from "../lib/api";
import { Layers, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import Loader from "./Loader";

export default function Flashcards({ toast }) {
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(8);
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [known, setKnown] = useState(new Set());

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setCards([]); setCurrent(0); setFlipped(false); setKnown(new Set());
    try {
      const { data } = await api.post("/api/ai/flashcards", { topic, num_cards: numCards });
      setCards(data.flashcards);
      toast(`${data.flashcards.length} flashcards ready!`, "success");
    } catch (err) {
      toast(err.response?.data?.detail || "Flashcard generation failed.", "error");
    } finally { setLoading(false); }
  };

  const shuffle = () => {
    setCards(c => [...c].sort(() => Math.random() - 0.5));
    setCurrent(0); setFlipped(false);
  };

  const markKnown = () => {
    setKnown(prev => new Set([...prev, current]));
    if (current < cards.length - 1) { setCurrent(c => c + 1); setFlipped(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="text-purple-500" size={20} />
        <h2 className="text-lg font-semibold">Flashcard Generator</h2>
      </div>
      <input className="input" placeholder="Topic (e.g. Human Anatomy, SQL Commands)"
        value={topic} onChange={e => setTopic(e.target.value)} />
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cards:</span>
        {[5, 8, 10, 15].map(n => (
          <button key={n} onClick={() => setNumCards(n)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${numCards === n ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
            {n}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>
      {loading && <Loader text="Creating flashcards..." />}
      {cards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{current + 1} / {cards.length}</span>
            <span className="text-green-600 font-medium">{known.size} known ✓</span>
            <button onClick={shuffle} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <Shuffle size={14} /> Shuffle
            </button>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{ width: `${((current + 1) / cards.length) * 100}%` }} />
          </div>
          {/* Card */}
          <div onClick={() => setFlipped(!flipped)}
            className={`cursor-pointer min-h-[200px] card flex flex-col items-center justify-center text-center select-none transition-all hover:shadow-md border-2 ${known.has(current) ? "border-green-400 dark:border-green-700" : "border-gray-200 dark:border-gray-800"}`}>
            <p className="text-xs uppercase tracking-wider font-semibold mb-3 text-indigo-500">
              {flipped ? "Answer" : "Question"}
            </p>
            <p className="text-lg font-medium leading-relaxed px-4">
              {flipped ? cards[current].back : cards[current].front}
            </p>
            <p className="text-xs text-gray-400 mt-4">Click to {flipped ? "see question" : "reveal answer"}</p>
          </div>
          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => { setCurrent(c => Math.max(0, c - 1)); setFlipped(false); }}
              disabled={current === 0}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={markKnown}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 transition-colors">
              ✓ Got it
            </button>
            <button onClick={() => { setCurrent(0); setFlipped(false); setKnown(new Set()); }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <RotateCcw size={16} />
            </button>
            <button onClick={() => { setCurrent(c => Math.min(cards.length - 1, c + 1)); setFlipped(false); }}
              disabled={current === cards.length - 1}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}