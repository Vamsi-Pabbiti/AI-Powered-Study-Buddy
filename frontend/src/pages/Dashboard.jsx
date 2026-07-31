import { useState } from "react";
import Navbar from "../components/Navbar";
import Explainer from "../components/Explainer";
import Summarizer from "../components/Summarizer";
import QuizGenerator from "../components/QuizGenerator";
import Flashcards from "../components/Flashcards";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { Lightbulb, FileText, Trophy, Layers } from "lucide-react";

const tabs = [
  { id: "explain", label: "Explainer", icon: Lightbulb, color: "text-yellow-500" },
  { id: "summarize", label: "Summarizer", icon: FileText, color: "text-blue-500" },
  { id: "quiz", label: "Quiz", icon: Trophy, color: "text-amber-500" },
  { id: "flashcards", label: "Flashcards", icon: Layers, color: "text-purple-500" },
];

const components = {
  explain: Explainer,
  summarize: Summarizer,
  quiz: QuizGenerator,
  flashcards: Flashcards,
};

export default function Dashboard() {
  const [active, setActive] = useState("explain");
  const { toasts, toast } = useToast();
  const ActiveComponent = components[active];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-6 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, color }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-1 justify-center
                ${active === id ? "bg-white dark:bg-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              <Icon size={15} className={active === id ? color : ""} />
              <span className={active === id ? "text-gray-800 dark:text-gray-100" : ""}>{label}</span>
            </button>
          ))}
        </div>
        <div className="card">
          <ActiveComponent toast={toast} />
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}