import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expo Feature Starters</Text>
      <View style={styles.links}>
        <Link href="/notifications" style={styles.link}>Push Notifications</Link>
        <Link href="/maps" style={styles.link}>Google Maps</Link>
        <Link href="/qr" style={styles.link}>QR Scanner</Link>
        <Link href="/clipboard" style={styles.link}>Clipboard</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  links: { gap: 12, width: "100%" },
  link: { fontSize: 18, color: "#2563eb" }
});


