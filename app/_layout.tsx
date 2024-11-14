import { NoteProvider, useNoteContext } from "@/context/Note";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <NoteProvider>
      <Stack>
        <Stack.Screen name="Notas" />
      </Stack>
    </NoteProvider>
  );
}
