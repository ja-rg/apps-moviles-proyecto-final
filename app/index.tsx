import { Ionicons } from "@expo/vector-icons";
import { MAX_WIDTH } from "@/constants/Environment";
import { useNoteContext } from "@/context/Note";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

interface Note {
  id: string;
  title: string;
  content: string;
  creationDate: Date;
  favorite: boolean;
}

export default function NoteListScreen() {
  const { notes, removeNote, setCurrentNote, setNotes } = useNoteContext();
  const [searchText, setSearchText] = useState("");

  const addNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Nueva nota",
      content: "",
      creationDate: new Date(),
      favorite: false,
    };
    setCurrentNote(newNote);
    router.push("/edit");
  };

  const editNote = (note: Note) => {
    setCurrentNote(note);
    router.push("/edit");
  };

  const deleteNote = (id: string) => {
    removeNote(id);
  };

  const toggleFavorite = (note: Note) => {
    note.favorite = !note.favorite;
    setNotes([...notes]);
  };

  const filteredNotes: Note[] = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderRightActions = (id: string) => (
    <Pressable onPress={() => deleteNote(id)} style={styles.actionButton}>
      <Ionicons name="trash-outline" size={24} color="white" />
    </Pressable>
  );

  const renderLeftActions = (note: Note) => (
    <Pressable onPress={() => toggleFavorite(note)} style={styles.actionButton}>
      <Ionicons
        name={note.favorite ? "star" : "star-outline"}
        size={24}
        color="white"
      />
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Campo de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar notas..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Lista de notas con funcionalidad de swipe */}
        <FlatList
          data={filteredNotes}
          keyExtractor={(note) => note.id}
          renderItem={({ item }: { item: Note }) => (
            <Swipeable
              renderLeftActions={() => renderLeftActions(item)}
              renderRightActions={() => renderRightActions(item.id)}
            >
              <Pressable onPress={() => editNote(item)} style={styles.noteItem}>
                <Ionicons
                  name={item.favorite ? "star" : "star-outline"}
                  size={20}
                  color={item.favorite ? "#FFD700" : "#666"}
                  style={styles.favoriteIcon}
                />
                <View style={styles.noteContentContainer}>
                  <Text style={styles.noteText}>{item.title}</Text>
                  <Text style={styles.noteContent}>
                    {item.content.length > MAX_WIDTH
                      ? `${item.content.slice(0, MAX_WIDTH)}...`
                      : item.content}
                  </Text>
                  <Text style={styles.noteDate}>
                    {new Date(item.creationDate).toLocaleDateString()}
                  </Text>
                </View>
              </Pressable>
            </Swipeable>
          )}
        />
        <Pressable onPress={addNewNote} style={styles.addNoteButton}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
  },
  favoriteIcon: {
    marginRight: 8,
  },
  noteContentContainer: {
    flex: 1,
  },
  noteText: { fontSize: 16, fontWeight: "bold" },
  noteContent: { fontSize: 14, color: "#666" },
  noteDate: { fontSize: 12, color: "#999" },
  addNoteButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    backgroundColor: "#007AFF",
  },
  addNoteButtonText: { color: "white", fontSize: 16, marginLeft: 8 },
});
