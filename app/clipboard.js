import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

export default function ClipboardScreen() {
  const [text, setText] = useState("");
  const [clipboard, setClipboard] = useState(null);

  async function copy() {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Text copied to clipboard");
  }

  async function paste() {
    const value = await Clipboard.getStringAsync();
    setClipboard(value);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clipboard</Text>
      <TextInput
        style={styles.input}
        placeholder="Type something to copy"
        value={text}
        onChangeText={setText}
      />
      <View style={styles.row}>
        <Button title="Copy" onPress={copy} />
        <Button title="Paste" onPress={paste} />
      </View>
      <Text style={styles.label}>Last pasted:</Text>
      <Text selectable style={styles.code}>{clipboard ?? "(none)"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12 },
  row: { flexDirection: "row", gap: 12 },
  label: { fontWeight: "600" },
  code: { fontFamily: "monospace", backgroundColor: "#f5f5f5", padding: 8, borderRadius: 6 }
});


