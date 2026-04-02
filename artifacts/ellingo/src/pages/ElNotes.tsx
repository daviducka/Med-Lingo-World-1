import React, { useState, useEffect, useRef } from "react";
import { Plus, Lock, Unlock, Trash2, Save, BookOpen, X, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: number;
  title: string;
  topic: string;
  keywords: string;
  notes: string;
  diagramUrl: string;
  isLocked: boolean;
  pinHash: string;
  color: string;
  updatedAt: string;
}

const COLORS = ["#fce4ec", "#e3f2fd", "#e8f5e9", "#fff9c4", "#f3e5f5", "#e0f7fa"];
const COLOR_BORDERS = ["#f48fb1", "#90caf9", "#a5d6a7", "#fff176", "#ce93d8", "#80deea"];

function PinModal({ onConfirm, onCancel }: { onConfirm: (pin: string) => void; onCancel: () => void }) {
  const [pin, setPin] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <Key className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Note PIN</h2>
        <p className="text-muted-foreground font-medium mb-6">Enter a 4-digit PIN</p>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
          className="w-32 text-center text-3xl font-bold tracking-[0.5em] border-2 border-primary/30 rounded-2xl p-3 mb-6 bg-muted outline-none focus:border-primary mx-auto block"
          placeholder="····"
          autoFocus
        />
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl font-bold">Cancel</Button>
          <Button onClick={() => pin.length === 4 && onConfirm(pin)} disabled={pin.length !== 4} className="flex-1 rounded-xl font-bold">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

function NoteEditor({ note, onSave, onDelete, onClose }: {
  note: Note;
  onSave: (updated: Partial<Note>) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [topic, setTopic] = useState(note.topic);
  const [keywords, setKeywords] = useState(note.keywords);
  const [notes, setNotes] = useState(note.notes);
  const [saving, setSaving] = useState(false);
  const [pinModal, setPinModal] = useState<"lock" | "unlock" | null>(null);
  const [unlocked, setUnlocked] = useState(!note.isLocked);
  const [wrongPin, setWrongPin] = useState(false);
  const colorIdx = COLORS.indexOf(note.color) >= 0 ? COLORS.indexOf(note.color) : 0;

  const handleSave = async () => {
    setSaving(true);
    await onSave({ title, topic, keywords, notes });
    setSaving(false);
  };

  const handleLock = (pin: string) => {
    onSave({ isLocked: true, pinHash: pin });
    setPinModal(null);
  };

  const handleUnlock = async (pin: string) => {
    const res = await fetch(`/api/notes/${note.id}/verify-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const { valid } = await res.json();
    if (valid) {
      setUnlocked(true);
      setPinModal(null);
      setWrongPin(false);
    } else {
      setWrongPin(true);
    }
  };

  if (note.isLocked && !unlocked) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Locked Note</h2>
          <p className="text-muted-foreground font-medium mb-6">This note is PIN-protected</p>
          {wrongPin && <p className="text-red-500 text-sm font-bold mb-3">Incorrect PIN! Try again.</p>}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl font-bold">Back</Button>
            <Button onClick={() => { setWrongPin(false); setPinModal("unlock"); }} className="flex-1 rounded-xl font-bold gap-1">
              <Key className="w-4 h-4" /> Unlock
            </Button>
          </div>
        </div>
        {pinModal === "unlock" && (
          <PinModal onConfirm={handleUnlock} onCancel={() => setPinModal(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-40 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/95 backdrop-blur">
        <Button variant="ghost" size="sm" onClick={onClose} className="font-bold"><X className="w-4 h-4" /></Button>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 font-bold text-xl bg-transparent outline-none"
          style={{ fontFamily: 'Fredoka One, sans-serif' }}
          placeholder="Note title..."
        />
        <Button variant="ghost" size="sm" onClick={() => setPinModal(note.isLocked ? "unlock" : "lock")} className="text-muted-foreground">
          {note.isLocked ? <Lock className="w-4 h-4 text-primary" /> : <Unlock className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
        <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-xl font-bold gap-1">
          <Save className="w-4 h-4" /> {saving ? "..." : "Save"}
        </Button>
      </div>

      {/* Anatomy Notes Layout */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: note.color }}>
        <div className="max-w-4xl mx-auto p-4 h-full flex flex-col gap-3">

          {/* Top section: Keywords + Diagram */}
          <div className="flex gap-3" style={{ height: "35%" }}>
            {/* Keywords */}
            <div className="flex-1 bg-white/80 rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col" style={{ borderColor: COLOR_BORDERS[colorIdx] }}>
              <div className="px-4 py-2 border-b font-bold text-sm" style={{ borderColor: COLOR_BORDERS[colorIdx], color: COLOR_BORDERS[colorIdx] }}>
                🏷️ Topic & Keywords
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Topic..."
                  className="w-full font-bold text-base bg-transparent outline-none border-b border-dashed border-gray-200 pb-1"
                />
                <textarea
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="Keywords, terms, concepts..."
                  className="flex-1 resize-none bg-transparent outline-none text-sm font-medium text-gray-700 leading-relaxed"
                />
              </div>
            </div>

            {/* Diagram area */}
            <div className="flex-1 bg-white/80 rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col" style={{ borderColor: COLOR_BORDERS[colorIdx] }}>
              <div className="px-4 py-2 border-b font-bold text-sm" style={{ borderColor: COLOR_BORDERS[colorIdx], color: COLOR_BORDERS[colorIdx] }}>
                🖼️ Diagram
              </div>
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center p-4">
                  <div className="text-5xl mb-2 opacity-30">🫀</div>
                  <p className="text-xs font-semibold opacity-50">Diagram area</p>
                  <p className="text-xs opacity-40 mt-1">Anatomical sketch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes section */}
          <div className="flex-1 bg-white/80 rounded-2xl border-2 shadow-sm overflow-hidden flex flex-col relative" style={{ borderColor: COLOR_BORDERS[colorIdx] }}>
            <div className="px-4 py-2 border-b font-bold text-sm" style={{ borderColor: COLOR_BORDERS[colorIdx], color: COLOR_BORDERS[colorIdx] }}>
              📝 Notes
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '40px' }}>
              <span className="text-[140px] opacity-[0.04] select-none">🫀</span>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${COLOR_BORDERS[colorIdx]}40 31px, ${COLOR_BORDERS[colorIdx]}40 32px)`,
                backgroundSize: "100% 32px",
                backgroundPositionY: "8px",
              }} />
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Full notes, explanations, data..."
                className="relative z-10 w-full h-full resize-none bg-transparent outline-none px-5 py-2 text-sm font-medium leading-8 text-gray-700"
                style={{ lineHeight: "32px" }}
              />
            </div>
          </div>

          {/* Branding */}
          <div className="text-right text-xs font-bold opacity-40" style={{ color: COLOR_BORDERS[colorIdx] }}>
            EL Notes • AnatomyNotes by Elson
          </div>
        </div>
      </div>

      {pinModal === "lock" && (
        <PinModal onConfirm={handleLock} onCancel={() => setPinModal(null)} />
      )}
      {pinModal === "unlock" && (
        <PinModal onConfirm={handleUnlock} onCancel={() => setPinModal(null)} />
      )}
    </div>
  );
}

export default function ElNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, []);

  const createNote = async () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Note", color: randomColor }),
    });
    const note = await res.json();
    setNotes(prev => [note, ...prev]);
    setSelectedNote(note);
  };

  const updateNote = async (id: number, data: Partial<Note>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setNotes(prev => prev.map(n => n.id === id ? updated : n));
    setSelectedNote(updated);
  };

  const deleteNote = async (id: number) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(prev => prev.filter(n => n.id !== id));
    setSelectedNote(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold shimmer-text mb-1" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            EL Notes 📓
          </h1>
          <p className="text-muted-foreground font-semibold">Your medical notes with anatomy design</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 italic">Designed by Elson</p>
        </div>
        <Button onClick={createNote} className="gap-2 font-bold rounded-2xl shadow-lg">
          <Plus className="w-5 h-5" /> New Note
        </Button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 rounded-2xl animate-pulse bg-muted" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>No notes yet</h2>
          <p className="text-muted-foreground font-medium mb-6">Create your first medical note</p>
          <Button onClick={createNote} size="lg" className="gap-2 font-bold rounded-2xl">
            <Plus className="w-5 h-5" /> Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {notes.map(note => {
            const colorIdx = COLORS.indexOf(note.color) >= 0 ? COLORS.indexOf(note.color) : 0;
            return (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="text-left rounded-2xl p-4 border-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 relative overflow-hidden h-48 flex flex-col"
                style={{ backgroundColor: note.color, borderColor: COLOR_BORDERS[colorIdx] }}
              >
                <div className="absolute right-2 bottom-2 text-6xl opacity-10 pointer-events-none select-none">🫀</div>
                <div className="absolute inset-x-0 bottom-0 h-1/2" style={{
                  backgroundImage: `repeating-linear-gradient(transparent, transparent 19px, ${COLOR_BORDERS[colorIdx]}30 19px, ${COLOR_BORDERS[colorIdx]}30 20px)`,
                }} />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-base leading-tight" style={{ fontFamily: 'Fredoka One, sans-serif', color: COLOR_BORDERS[colorIdx] }}>
                      {note.title}
                    </h3>
                    {note.isLocked && <Lock className="w-4 h-4 flex-shrink-0 ml-1" style={{ color: COLOR_BORDERS[colorIdx] }} />}
                  </div>
                  {note.topic && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">{note.topic}</p>
                  )}
                  {note.keywords && (
                    <p className="text-xs text-gray-500 font-medium line-clamp-2">{note.keywords}</p>
                  )}
                </div>
                <p className="relative z-10 text-xs font-semibold mt-auto" style={{ color: COLOR_BORDERS[colorIdx] + "99" }}>
                  EL Notes • AnatomyNotes
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Note Editor Modal */}
      {selectedNote && (
        <NoteEditor
          note={selectedNote}
          onSave={async (data) => updateNote(selectedNote.id, data)}
          onDelete={async () => deleteNote(selectedNote.id)}
          onClose={() => { setSelectedNote(null); fetchNotes(); }}
        />
      )}
    </div>
  );
}
