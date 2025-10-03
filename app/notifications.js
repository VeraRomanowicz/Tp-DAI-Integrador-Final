import { useEffect, useRef, useState } from "react";
import { View, Text, Button, StyleSheet, Platform, ScrollView } from "react-native";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../lib/notifications/registerForPushNotificationsAsync";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [lastNotification, setLastNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token ?? null));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setLastNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification response:", response);
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function sendLocalNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Demo local notification",
        body: "This is a local notification",
        data: { feature: "local-demo" },
      },
      trigger: { seconds: 1 },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>
      <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
      <View style={styles.section}>
        <Button title="Send local notification" onPress={sendLocalNotification} />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Expo Push Token:</Text>
        <Text selectable style={styles.code}>{expoPushToken ?? "(not granted yet)"}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Last notification payload:</Text>
        <Text selectable style={styles.code}>{lastNotification ? JSON.stringify(lastNotification.request.content, null, 2) : "(none)"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#555" },
  section: { gap: 8 },
  label: { fontWeight: "600" },
  code: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }), backgroundColor: "#f5f5f5", padding: 8, borderRadius: 6 }
});


