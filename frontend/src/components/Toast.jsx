import { CheckCircle, XCircle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-indigo-500" />,
};

export default function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id}
          className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl px-4 py-3 text-sm font-medium animate-fade-in min-w-[260px]">
          {icons[t.type]}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}