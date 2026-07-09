import { useState } from "react";
import api from "../lib/api";
import { Trophy, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import Loader from "./Loader";

export default function QuizGenerator({ toast }) {
  const [topic, setTopic] = useState("");
  const [numQ, setNumQ] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setQuestions([]); setAnswers({}); setSubmitted(false);
    try {
      const { data } = await api.post("/api/ai/quiz", { topic, num_questions: numQ, difficulty });
      setQuestions(data.questions);
      toast("Quiz ready! Good luck 🎯", "success");
    } catch (err) {
      toast(err.response?.data?.detail || "Quiz generation failed.", "error");
    } finally { setLoading(false); }
  };

  const reset = () => { setQuestions([]); setAnswers({}); setSubmitted(false); setTopic(""); };
  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="text-amber-500" size={20} />
        <h2 className="text-lg font-semibold">Quiz Generator</h2>
      </div>
      <input className="input" placeholder="Quiz topic (e.g. World War II, Python Basics)"
        value={topic} onChange={e => setTopic(e.target.value)} />
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Questions:</label>
          <select className="input w-auto" value={numQ} onChange={e => setNumQ(Number(e.target.value))}>
            {[3, 5, 8, 10].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {["easy", "medium", "hard"].map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${difficulty === d ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <button className="btn-primary" onClick={generate} disabled={loading || !topic.trim()}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
      {loading && <Loader text="Generating quiz questions..." />}
      {questions.length > 0 && (
        <div className="space-y-4 mt-2">
          {questions.map((q, i) => (
            <div key={i} className="card">
              <p className="font-medium mb-3 text-sm">{i + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => {
                  let cls = "border px-4 py-2.5 rounded-xl cursor-pointer text-sm transition-all w-full text-left ";
                  if (submitted) {
                    if (opt === q.answer) cls += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                    else if (answers[i] === opt) cls += "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600";
                    else cls += "border-gray-200 dark:border-gray-700 opacity-50";
                  } else {
                    cls += answers[i] === opt
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-indigo-400";
                  }
                  return (
                    <button key={j} className={cls}
                      onClick={() => !submitted && setAnswers({ ...answers, [i]: opt })}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className={`mt-3 text-xs flex items-start gap-2 ${answers[i] === q.answer ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {answers[i] === q.answer ? <CheckCircle size={14} className="mt-0.5 shrink-0" /> : <XCircle size={14} className="mt-0.5 shrink-0" />}
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          ))}
          {!submitted ? (
            <button className="btn-primary" onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < questions.length}>
              Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
            </button>
          ) : (
            <div className="card text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
              <Trophy className="mx-auto text-amber-500 mb-2" size={36} />
              <p className="text-3xl font-bold">{score} / {questions.length}</p>
              <p className="text-gray-500 mt-1 text-sm">
                {score === questions.length ? "Perfect score! 🎉" : score >= questions.length / 2 ? "Good job! Keep it up 💪" : "Keep studying, you'll get there! 📚"}
              </p>
              <button onClick={reset} className="btn-secondary mt-4 flex items-center gap-2 mx-auto">
                <RotateCcw size={14} /> Try Another Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}