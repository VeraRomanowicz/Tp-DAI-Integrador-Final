import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Feature Starters" }} />
      <Stack.Screen name="notifications" options={{ title: "Push Notifications" }} />
      <Stack.Screen name="maps" options={{ title: "Google Maps" }} />
      <Stack.Screen name="qr" options={{ title: "QR Scanner" }} />
      <Stack.Screen name="clipboard" options={{ title: "Clipboard" }} />
    </Stack>
  );
}


