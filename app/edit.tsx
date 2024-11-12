import { useNoteContext } from '@/context/Note';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';

export default function NoteEditorScreen() {
    const { currentNote, addNote, removeNote, setCurrentNote } = useNoteContext();
    const [title, setTitle] = useState(currentNote ? currentNote.title : 'Nueva Nota');
    const [content, setContent] = useState(currentNote ? currentNote.content : '');

    useEffect(() => {
        return () => {
            // Clear currentNote when leaving the screen
            setCurrentNote(null);
        };
    }, []);

    const handleSave = () => {
        const noteId = currentNote ? currentNote.id : Date.now().toString();
        const newNote = {
            id: noteId,
            title,
            content,
            creationDate: currentNote ? currentNote.creationDate : new Date(),
        };

        if (currentNote) {
            // Remove the old note and replace with the updated one
            removeNote(noteId);
        }

        // Add the new or updated note
        addNote(newNote);

        router.replace('/');
    };

    const handleCancel = () => {
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
            <View style={styles.buttonContainer}>
                <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                </Pressable>
                <Pressable onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    titleInput: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    textInput: { flex: 1, fontSize: 18, textAlignVertical: 'top' },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 16,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginLeft: 8,
    },
    saveButtonText: { color: 'white', fontSize: 18 },
    cancelButtonText: { color: 'white', fontSize: 18 },
});