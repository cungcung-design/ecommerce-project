import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function AIConversationList({
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  error = "",
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");

  const startRename = (conversation) => {
    setEditingId(conversation.id);
    setTitle(conversation.title || "");
  };

  const saveRename = async (event) => {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle || !editingId) {
      setEditingId(null);
      return;
    }

    await onRename(editingId, nextTitle);
    setEditingId(null);
  };

  return (
    <aside className="flex h-full w-full flex-col border-slate-200 bg-slate-50 sm:w-52 sm:border-r">
      <div className="p-3">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-200"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>
      {error && (
        <p className="px-3 pb-2 text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {conversations.length === 0 && (
          <p className="px-2 text-xs text-slate-400">No previous chats</p>
        )}
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`mb-1 flex items-center gap-1 rounded-lg px-2 py-1 ${
              activeId === conversation.id ? "bg-orange-50" : "hover:bg-white"
            }`}
          >
            {editingId === conversation.id ? (
              <form onSubmit={saveRename} className="min-w-0 flex-1">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm"
                  autoFocus
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                className="min-w-0 flex-1 truncate px-1 py-1 text-left text-sm text-slate-700"
              >
                {conversation.title || "New conversation"}
              </button>
            )}
            <button
              type="button"
              aria-label="Rename conversation"
              onClick={() => startRename(conversation)}
              className="rounded p-1 text-slate-400 hover:text-slate-700"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Delete conversation"
              onClick={() => onDelete(conversation.id)}
              className="rounded p-1 text-slate-400 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
