import { BookOpen, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg"><BookOpen className="text-white" size={20} /></div>
        <span className="font-bold text-lg">Study Buddy</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Hi, {user?.name} 👋</span>
        <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={() => { logout(); navigate("/login"); }}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}