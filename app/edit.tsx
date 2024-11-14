import { useNoteContext } from '@/context/Note';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';

export default function NoteEditorScreen() {
    const { notes, addNote, removeNote } = useNoteContext();
    const { id } = useLocalSearchParams<{ id: string }>(); // Suponiendo que id se pasa al editar una nota existente

    // Encontrar la nota si estamos editando, de lo contrario, preparar para una nueva nota
    const existingNote = notes.find((note) => note.id === id);
    const [title, setTitle] = useState(existingNote ? existingNote.title : 'Nueva Nota');
    const [content, setContent] = useState(existingNote ? existingNote.content : '');

    const handleSave = () => {
        const noteId = existingNote ? existingNote.id : Date.now().toString();
        const newNote = {
            id: noteId,
            title,
            content,
            creationDate: existingNote ? existingNote.creationDate : new Date(),
        };

        if (existingNote) {
            // Eliminar la nota antigua y reemplazarla por la actualizada
            removeNote(noteId);
        }

        // Agregar la nueva o actualizada nota
        addNote(newNote);

        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Título de la nota"
                style={styles.titleInput}
            />
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Escribe tu nota aquí"
                style={styles.textInput}
                multiline
            />
            <Pressable onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Guardar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    titleInput: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    textInput: { flex: 1, fontSize: 18, textAlignVertical: 'top' },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        margin: 16,
    },

    saveButtonText: { color: 'white', fontSize: 18 },
});
