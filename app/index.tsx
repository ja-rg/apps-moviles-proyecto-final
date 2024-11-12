import { MAX_WIDTH } from '@/constants/Environment';
import { useNoteContext } from '@/context/Note';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

type Note = { id: string; title: string; content: string; creationDate: Date };

export default function NoteListScreen() {
    const { notes, addNote, removeNote, setCurrentNote } = useNoteContext();

    // This function creates a new note and adds it to the context
    const addNewNote = () => {
        setCurrentNote(null);
        router.replace('/edit');
    };

    // Function to handle editing an existing note
    const editNote = (note: Note) => {
        setCurrentNote(note);
        router.replace(`/edit`);
    };

    // Function to delete a note using the context's removeNote
    const deleteNote = (id: string) => {
        removeNote(id);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notes}
                keyExtractor={(note) => note.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.noteItem}
                        onPress={() => editNote(item)}
                    >
                        <Text style={styles.noteText}>{item.title}</Text>
                        <Text style={styles.noteContent}>
                            {item.content.length > MAX_WIDTH ? `${item.content.slice(0, MAX_WIDTH)}...` : item.content}
                        </Text>
                        <Text style={styles.noteDate}>
                            {new Date(item.creationDate).toLocaleDateString()}
                        </Text>
                        <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.deleteButton}>
                            Borrar
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <Pressable onPress={addNewNote} style={styles.addNoteButton}>
                <Text style={styles.addNoteButtonText}>Add Note</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    noteItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    noteContent: { fontSize: 14, color: '#666' },
    noteDate: { fontSize: 12, color: '#999' },
    noteText: { fontSize: 16 },
    addNoteButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },
    deleteButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    addNoteButtonText: { color: 'white', fontSize: 16 },
});