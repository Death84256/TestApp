# Esebial Mobile

React Native account client built with Expo SDK 58. It supports account registration, sign-in, sign-out, and a connection check for the C# API.

## Requirements

- Node.js 22.13 or newer
- Expo Go compatible with SDK 58
- Phone and development PC on the same Wi-Fi network

## Run the full mobile stack

Open three terminals from the repository root.

1. Start the C# API. In Visual Studio, run the **IIS Express** profile (the browser may open at `https://localhost:44301`). The Express gateway uses this local HTTPS endpoint and accepts its self-signed development certificate only for localhost.

   If you prefer to start the C# project from a terminal instead, use the `http` profile:

   ```powershell
   dotnet run --project Esebial.Codebase.WebApp --launch-profile http
   ```

   This profile serves the API at `http://localhost:5187`. Set `BACKEND_API_URL=http://localhost:5187` in `api/.env` when using this profile. The sample `.env` defaults to IIS Express at `https://localhost:44301`.

2. Start the Express gateway:

   ```powershell
   cd React-Side/Mobile/api
   Copy-Item .env.example .env
   npm install
   npm start
   ```

   Express listens on `0.0.0.0:3001` and forwards `/api/...` requests to the C# API on the same PC.

3. Start Expo:

   ```powershell
   cd React-Side/Mobile
   npm install
   npx expo start --lan
   ```

   Scan the QR code with Expo Go. If Windows Firewall asks, allow Node.js on the private network.

The mobile app reads the Expo development host address and calls the Express gateway on port `3001`. It must not call the C# port `64872` or Expo's bundler port `8081` directly. To set the gateway address manually, copy `.env.example` to `.env.local`, replace the sample PC address if needed, and restart Expo. The phone's browser can check `http://<PC-IPv4-address>:3001/health`; a successful response includes `"backendReachable": true`.

The Account screen offers registration and sign-in. The Workspace screen's **Check connection** action checks the Express gateway and its C# API connection. The sign-in token is held in memory and sent as a bearer token to authenticated endpoints.

## Development

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

Expo Router screens live in `src/app/`. The API gateway source is in `api/server.js`.
