import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Note {
    id: string;
    title: string;
    content: string;
    creationDate: Date;
}

interface NoteContextType {
    notes: Note[];
    addNote: (note: Note) => void;
    removeNote: (id: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<Note[]>([]);

    const addNote = (note: Note) => {
        setNotes([...notes, note]);
    };

    const removeNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <NoteContext.Provider value={{ notes, addNote, removeNote }}>
            {children}
        </NoteContext.Provider>
    );
};

export const useNoteContext = (): NoteContextType => {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error('useNoteContext must be used within a NoteProvider');
    }
    return context;
};