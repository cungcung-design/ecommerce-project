export default function AISources({ sources }) {
  if (!sources?.length) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {sources.map((source) => (
        <div key={`${source.source}-${source.title}`} className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-700">{source.title}</p>
          <p className="mt-1 break-words text-xs leading-5 text-slate-500 [overflow-wrap:anywhere]">{source.content}</p>
        </div>
      ))}
    </div>
  );
}
