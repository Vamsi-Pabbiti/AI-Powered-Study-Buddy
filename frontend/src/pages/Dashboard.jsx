import { useState } from "react";
import Navbar from "../components/Navbar";
import Explainer from "../components/Explainer";
import Summarizer from "../components/Summarizer";
import QuizGenerator from "../components/QuizGenerator";
import Flashcards from "../components/Flashcards";
import History from "../components/History";
import { Lightbulb, FileText, Trophy, Layers, History as HistoryIcon } from "lucide-react";

const tabs = [
  { id: "explain", label: "Explainer", icon: Lightbulb },
  { id: "summarize", label: "Summarizer", icon: FileText },
  { id: "quiz", label: "Quiz", icon: Trophy },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "history", label: "History", icon: HistoryIcon },
];

const components = {
  explain: Explainer,
  summarize: Summarizer,
  quiz: QuizGenerator,
  flashcards: Flashcards,
  history: History,
};

export default function Dashboard() {
  const [active, setActive] = useState("explain");
  const ActiveComponent = components[active];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab Bar */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                active === id
                  ? "bg-white dark:bg-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        {/* Active Panel */}
        <div className="card">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}