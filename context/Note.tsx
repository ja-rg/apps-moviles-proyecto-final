import React, { createContext, useState, useContext, ReactNode } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  creationDate: Date;
  favorite: boolean;
  style?: "bold" | "italic" | "strikethrough";
}

interface NoteContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  current_note: Note | null;
  setCurrentNote: (note: Note | null) => void;
  setNotes: (notes: Note[]) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [current_note, setCurrentNote] = useState<Note | null>(null);

  const addNote = (note: Note) => {
    const existingNote = notes.find((n) => n.id === note.id);

    if (existingNote) {
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
      return;
    }

    setNotes([...notes, note]);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        removeNote,
        current_note,
        setCurrentNote,
        setNotes,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = (): NoteContextType => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};
