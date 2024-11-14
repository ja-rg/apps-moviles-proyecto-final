import { Ionicons } from '@expo/vector-icons';
    import { useNoteContext } from '@/context/Note';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';

import { printAsync } from 'expo-print';

export default function NoteEditorScreen() {
    const { current_note, addNote, setCurrentNote } = useNoteContext();
    const [title, setTitle] = useState(current_note ? current_note.title : 'Nueva Nota');
    const [content, setContent] = useState(current_note ? current_note.content : '');

    useEffect(() => {
        setTitle(current_note ? current_note.title : 'Nueva Nota');
        setContent(current_note ? current_note.content : '');
    }, [current_note]);

    const handleSave = () => {
        const noteId = current_note ? current_note.id : Date.now().toString();
        const newNote = {
            id: noteId,
            title,
            content,
            creationDate: current_note ? current_note.creationDate : new Date(),
            favorite: current_note ? current_note.favorite : false,
        };

        addNote(newNote);
        setCurrentNote(null);
        router.back();
    };

    const handlePrint = async () => {
        if (!current_note) return;

        const html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h1 { color: #333; }
                        p { color: #666; }
                    </style>
                </head>
                <body>
                    <h1>${current_note.title}</h1>
                    <p>${current_note.content}</p>
                </body>
            </html>
        `;

        const result = await printAsync({ html });
        console.log(result);
    }

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
            <Pressable onPress={handlePrint} style={styles.printButton}>
                <Ionicons name="print-outline" size={20} color="white" />
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveButton}>
                <Ionicons name="save-outline" size={20} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textInput: { flex: 1, fontSize: 18, textAlignVertical: "top" },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  printButton: {
    flexDirection: "row",
    // grey pastel
    backgroundColor: "#c0c0c0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  saveButtonText: { color: "white", fontSize: 18, marginLeft: 8 },
});
