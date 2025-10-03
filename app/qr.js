import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function QrScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.center}><Text>Requesting camera permission…</Text></View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}><Text>No access to camera</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={({ data }) => setScannedData(data)}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.result}>
        <Text style={styles.resultTitle}>Last scanned data:</Text>
        <Text selectable style={styles.resultText}>{scannedData ?? "(none)"}</Text>
        {scannedData && <Button title="Scan again" onPress={() => setScannedData(null)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  result: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", padding: 16, gap: 8 },
  resultTitle: { color: "#fff", fontWeight: "700" },
  resultText: { color: "#fff" }
});


