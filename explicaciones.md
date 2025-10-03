# Explicaciones y guía de reuso (Expo + React Native, JavaScript)

Este proyecto incluye 4 features listas para copiar y pegar:
- Notificaciones Push (local + token Expo)
- Google Maps (ubicación actual + marcador)
- Escaneo de QR (expo-barcode-scanner)
- Portapapeles (expo-clipboard)

Hecho en JavaScript (sin TS/TSX) con `expo-router`.

## Instalar y correr
```bash
npm install
npm run start
```
Abrir con Expo Go o usar `npm run android` / `npm run ios`.

## Estructura
```
app/
  _layout.js
  index.js
  notifications.js
  maps.js
  qr.js
  clipboard.js
lib/
  notifications/
    registerForPushNotificationsAsync.js
```

## 1) Notificaciones Push
Deps: `expo-notifications`, `expo-device`.
- `app.json` plugin:
```json
{
  "expo": {
    "plugins": [["expo-notifications", { "icon": "./assets/notification-icon.png" }]]
  }
}
```
- Helper (copiar a tu proyecto si lo reutilizas):
```javascript
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;
  if (!Device.isDevice) return undefined;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return undefined;
  token = (await Notifications.getExpoPushTokenAsync()).data;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", { name: "default", importance: Notifications.AndroidImportance.MAX });
  }
  return token;
}
```
- Uso básico:
```javascript
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../lib/notifications/registerForPushNotificationsAsync";

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }) });
const token = await registerForPushNotificationsAsync();
await Notifications.scheduleNotificationAsync({ content: { title: "Demo", body: "Mensaje local" }, trigger: { seconds: 1 } });
```
- Envío remoto: POST a `https://exp.host/--/api/v2/push/send` con `{ to, title, body }`.

## 2) Google Maps + ubicación
Deps: `react-native-maps`, `expo-location`.
- `app.json` (Android):
```json
{
  "expo": {
    "plugins": [["react-native-maps", { "config": { "googleMaps": { "apiKey": "YOUR_ANDROID_GOOGLE_MAPS_API_KEY" } } }]]
  }
}
```
- Flujo: pedir permisos `Location.requestForegroundPermissionsAsync()`, leer `getCurrentPositionAsync()`, renderizar `<MapView provider={PROVIDER_GOOGLE}>` y `<Marker />`.

## 3) Escaneo de QR
Dep: `expo-barcode-scanner`.
- Permiso: `BarCodeScanner.requestPermissionsAsync()`.
- Render: `onBarCodeScanned={({ data }) => setScannedData(data)}` y botón "Scan again" para reset.

## 4) Portapapeles
Dep: `expo-clipboard`.
```javascript
import * as Clipboard from "expo-clipboard";
await Clipboard.setStringAsync("texto");
const value = await Clipboard.getStringAsync();
```

## Navegación (expo-router)
- En `package.json`: `"main": "expo-router/entry"`
- Babel: plugin `expo-router/babel`
- Rutas = archivos dentro de `app/`. `_layout.js` define un `Stack`.

## Consejos
- Reemplaza `YOUR_ANDROID_GOOGLE_MAPS_API_KEY`.
- Prueba push y cámara en dispositivo físico.
- Maneja estados de permisos, errores y loading.
