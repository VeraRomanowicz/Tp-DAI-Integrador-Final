import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function MapsScreen() {
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const nextRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(nextRegion);
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Getting current location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="You are here" />
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Provider: Google ({Platform.OS})</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  overlay: { position: "absolute", top: 16, left: 16, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  overlayText: { color: "#fff" }
});


