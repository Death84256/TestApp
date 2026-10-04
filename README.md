# Esebial Codebase

A full-stack application consisting of an ASP.NET Core backend, React web application, and React Native mobile application built with Expo.

## Project Structure

```text
MobileApplication/
│
├── Esebial.Codebase.sln
│
├── Esebial.Codebase.WebApp/
│   └── ASP.NET Core backend
│
├── React-Side/
│   ├── Web/
│   │   └── React + Vite web application
│   │
│   └── Mobile/
│       └── React Native + Expo mobile application
│
├── .gitignore
└── README.md
```

## Technologies

### Backend

* C#
* ASP.NET Core
* Entity Framework Core
* SQL Server
* AutoMapper
* JWT Token Authentication

### React Web

* React
* Vite
* JavaScript / TypeScript
* npm

### React Native Mobile

* React Native
* Expo
* npm

## Requirements

Install the following before starting development:

* .NET SDK
* Visual Studio 2026
* Node.js
* npm
* SQL Server
* Git

For mobile development, install:

* Expo Go on a physical device, or
* Android Studio and an Android Emulator

## Backend Setup

### 1. Configure the database

Configure the database connection using your local configuration.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EsebialCodebase;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

Do not commit passwords, connection secrets, or other sensitive information to Git.

### 2. Configure authentication

The application requires the following `TokenAuthentication` configuration:

```json
{
  "TokenAuthentication": {
    "SecretKey": "YOUR_SECRET_KEY",
    "Audience": "Esebial.Codebase.WebApp",
    "TokenPath": "/api/token",
    "CookieName": "EsebialAuth",
    "ExpirationMinutes": 120
  }
}
```

For development, use .NET User Secrets for sensitive values.

Initialize User Secrets:

```powershell
dotnet user-secrets init
```

Set the secret key:

```powershell
dotnet user-secrets set "TokenAuthentication:SecretKey" "YOUR_SECRET_KEY"
```

Never commit the real secret key to the repository.

### 3. Restore .NET dependencies

From the solution directory:

```powershell
dotnet restore
```

### 4. Build the backend

```powershell
dotnet build
```

### 5. Run the backend

```powershell
dotnet run --project Esebial.Codebase.WebApp
```

Alternatively, open the solution in Visual Studio and run the `Esebial.Codebase.WebApp` project.

## React Web Setup

The React web application is located under:

```text
React-Side/Web
```

From the solution root:

```powershell
cd React-Side/Web
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The development server will normally be available at:

```text
http://localhost:5173
```

## React Native / Expo Setup

The mobile application is located under:

```text
React-Side/Mobile
```

From the solution root:

```powershell
cd React-Side/Mobile
```

Install dependencies:

```powershell
npm install
```

Start Expo:

```powershell
npx expo start
```

### Android Emulator

Start an Android emulator first, then run:

```powershell
npx expo start --android
```

### Physical Android Device

1. Install Expo Go on your Android device.
2. Connect your phone and development computer to the same network.
3. Run:

```powershell
npx expo start
```

4. Scan the QR code using Expo Go.

### Web Preview

To run the Expo application in a browser:

```powershell
npx expo start --web
```

## Running the Full Application

The backend, React Web application, and React Native application can be started separately.

### Terminal 1 - ASP.NET Core Backend

From the solution root:

```powershell
dotnet run --project Esebial.Codebase.WebApp
```

### Terminal 2 - React Web

```powershell
cd React-Side/Web
npm run dev
```

### Terminal 3 - React Native / Expo

```powershell
cd React-Side/Mobile
npx expo start
```

The React Web and React Native applications communicate with the ASP.NET Core backend through its configured API URL.

## Database

The backend uses Entity Framework Core with SQL Server.

To apply existing migrations:

```powershell
dotnet ef database update
```

To create a new migration:

```powershell
dotnet ef migrations add MigrationName
```

Make sure the connection string points to the correct SQL Server instance before running migrations.

## Git

The repository uses `.gitignore` to exclude generated and local development files.

The repository should not contain:

* `bin/`
* `obj/`
* `node_modules/`
* `.expo/`
* Vite build output
* Local database files
* User secrets
* Passwords
* API keys
* JWT signing keys
* Environment-specific secrets

## Development Workflow

### 1. Pull the latest changes

```powershell
git pull
```

### 2. Restore backend dependencies

```powershell
dotnet restore
```

### 3. Instal
