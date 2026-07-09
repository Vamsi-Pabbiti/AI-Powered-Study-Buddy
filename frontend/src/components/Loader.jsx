export default function Loader({ text = "Thinking..." }) {
  return (
    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 py-4">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}