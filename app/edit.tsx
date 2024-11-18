import { Ionicons } from "@expo/vector-icons";
import { useNoteContext } from "@/context/Note";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";

import { printAsync } from "expo-print";

export default function NoteEditorScreen() {
  const { current_note, addNote, setCurrentNote } = useNoteContext();
  const [title, setTitle] = useState(
    current_note ? current_note.title : "Nueva Nota"
  );
  const [content, setContent] = useState(
    current_note ? current_note.content : ""
  );

  const [style, setStyle] = useState<
    "bold" | "italic" | "strikethrough" | null
  >(current_note ? current_note.style : null);

  useEffect(() => {
    setTitle(current_note ? current_note.title : "Nueva Nota");
    setContent(current_note ? current_note.content : "");
  }, [current_note]);

  const toggleStyle = (selectedStyle: "bold" | "italic" | "strikethrough") => {
    setStyle(style === selectedStyle ? null : selectedStyle);
  };

  const handleSave = () => {
    const noteId = current_note ? current_note.id : Date.now().toString();
    const newNote = {
      id: noteId,
      title,
      content,
      creationDate: current_note ? current_note.creationDate : new Date(),
      favorite: current_note ? current_note.favorite : false,
      style,
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
        style={[
          styles.textInput,
          style === "bold" && { fontWeight: "bold" },
          style === "italic" && { fontStyle: "italic" },
          style === "strikethrough" && { textDecorationLine: "line-through" },
        ]}
        multiline
      />
      <View style={styles.styleButtons}>
        <Pressable
          onPress={() => toggleStyle("bold")}
          style={styles.styleButton}
        >
          <Text style={{ fontWeight: "bold" }}>B</Text>
        </Pressable>
        <Pressable
          onPress={() => toggleStyle("italic")}
          style={styles.styleButton}
        >
          <Text style={{ fontStyle: "italic" }}>I</Text>
        </Pressable>
        <Pressable
          onPress={() => toggleStyle("strikethrough")}
          style={styles.styleButton}
        >
          <Text style={{ textDecorationLine: "line-through" }}>S</Text>
        </Pressable>
      </View>
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
    backgroundColor: "#c0c0c0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  styleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  styleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: { color: "white", fontSize: 18, marginLeft: 8 },
});
