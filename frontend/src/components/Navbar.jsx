import { BookOpen, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <BookOpen className="text-white" size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">Study Buddy</span>
        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">AI</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden sm:block">Hi, <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name}</span> 👋</span>
        <button onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={() => { logout(); navigate("/login"); }}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}