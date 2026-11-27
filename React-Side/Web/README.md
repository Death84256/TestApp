# Esebial Web

The React + Vite client provides account registration, sign in, and a signed-in workspace screen. Account data is served by the ASP.NET Core API.

## Run locally

Start the backend in Visual Studio with the IIS Express profile. The HTTPS URL shown by the browser is `https://localhost:44301`; IIS Express also listens at `http://localhost:64872`, which is the Vite proxy target.

Alternatively, start the backend from the repository root:

```powershell
dotnet run --project Esebial.Codebase.WebApp --launch-profile http
```

In another terminal:

```powershell
cd React-Side/Web
npm install
npm run dev
```

Vite proxies `/api` requests to `http://localhost:64872` by default, matching IIS Express. Start the backend before registering or signing in. If you use the `http` launch profile from the command line instead, set `VITE_API_PROXY_TARGET=http://localhost:5187` in `.env.local`. Restart Vite after changing the target.
