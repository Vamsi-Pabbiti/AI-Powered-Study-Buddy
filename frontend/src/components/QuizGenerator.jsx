import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Trophy, CheckCircle, XCircle } from "lucide-react";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [numQ, setNumQ] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true); setQuestions([]); setAnswers({}); setSubmitted(false);
    try {
      const { data } = await api.post(
        "/api/ai/quiz",
        { topic, num_questions: numQ, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(data.questions);
    } catch (error) {
      alert(error.response?.data?.detail || "Quiz generation failed. Try again.");
    }
    finally { setLoading(false); }
  };

  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="text-amber-500" size={20} />
        <h2 className="text-lg font-semibold">Quiz Generator</h2>
      </div>
      <input className="input" placeholder="Quiz topic (e.g. World War II, Python Basics)"
        value={topic} onChange={e => setTopic(e.target.value)} />
      <div className="flex gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Questions:</label>
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
        {loading ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {questions.length > 0 && (
        <div className="space-y-4 mt-4">
          {questions.map((q, i) => (
            <div key={i} className="card">
              <p className="font-medium mb-3">{i + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => {
                  let cls = "border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl cursor-pointer text-sm transition-all hover:border-indigo-400 w-full text-left";
                  if (answers[i] === opt) cls += " border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
                  if (submitted) {
                    if (opt === q.answer) cls += " border-green-500 bg-green-50 dark:bg-green-900/20";
                    else if (answers[i] === opt) cls += " border-red-500 bg-red-50 dark:bg-red-900/20";
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
                <div className={`mt-3 text-sm flex items-start gap-2 ${answers[i] === q.answer ? "text-green-600" : "text-red-500"}`}>
                  {answers[i] === q.answer ? <CheckCircle size={16} className="mt-0.5" /> : <XCircle size={16} className="mt-0.5" />}
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          ))}
          {!submitted ? (
            <button className="btn-primary" onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < questions.length}>
              Submit Quiz
            </button>
          ) : (
            <div className="card bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-center">
              <Trophy className="mx-auto text-amber-500 mb-2" size={32} />
              <p className="text-2xl font-bold">{score} / {questions.length}</p>
              <p className="text-gray-500 mt-1">{score === questions.length ? "Perfect score!" : score >= questions.length / 2 ? "Good job! Keep practicing." : "Keep studying, you'll get there!"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
