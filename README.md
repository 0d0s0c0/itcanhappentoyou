# It Can Happen To You

A travel safety app that displays real crime and incident data on an interactive map. Built with React Native (Expo) and backed by a Node.js/Express server that pulls data from the SF Gov open data API and uses AI to categorize incidents.

## Features

- **Interactive incident map** — browse nearby crime/incident reports plotted on a map with category-based icons (theft, assault, fraud, scams, etc.)
- **Filter by category** — narrow the map to specific incident types using a dropdown filter
- **Report incidents** — submit your own incident reports, which are AI-categorized and stored in the database
- **Live location tracking** — uses device GPS to center the map on your current location
- **Multi-language support** — available in English, Spanish, French, Arabic, Hindi, Japanese, and Korean
- **Light/dark theme** — automatic theme switching based on system preferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile app | React Native 0.81, Expo SDK 54, React 19, TypeScript |
| Navigation | React Navigation v7 (native stack + bottom tabs) |
| Maps | react-native-maps |
| Backend | Express, Prisma (SQLite), TypeScript |
| AI categorization | Claude (Anthropic) or Gemini (Google) |
| Data source | [SF Gov Socrata API](https://data.sfgov.org) — last 30 days of crime data |
| Boilerplate | [Ignite 11.4.0](https://github.com/infinitered/ignite) by Infinite Red |

## Getting Started

### Prerequisites

- Node.js >= 20
- iOS Simulator / Android Emulator or a physical device
- [EAS CLI](https://docs.expo.dev/eas/) for building dev clients

### Mobile App

```bash
# Install dependencies (legacy peer deps flag is required)
npm install --legacy-peer-deps

# Start the Expo dev server
npm run start

# Run on a specific platform
npm run ios
npm run android
```

To run on a simulator or device you first need to build a dev client:

```bash
npm run build:ios:sim       # iOS simulator
npm run build:ios:device    # iOS device
npm run build:android:sim   # Android emulator
npm run build:android:device # Android device
```

### Backend Server

```bash
cd server

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start the dev server (port 3000)
npm run dev

# Start with data seeding from SF Gov API
npm run dev -- --seed
```

#### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `3000`) |
| `AI_PROVIDER` | `gemini` (default) or `claude` / `anthropic` |
| `GEMINI_API_KEY` | Google Gemini API key (used for incident categorization) |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Claude as AI provider) |

If no API key is set, the server falls back to keyword-based categorization.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/incidents?latitude=X&longitude=Y` | Fetch incidents within ~50 km² of the given coordinates |
| `POST` | `/api/incident` | Submit a user-reported incident (`{ latitude, longitude, description }`) |

## Project Structure

```
app/
├── components/       # Reusable UI components (Ignite library)
├── context/          # React context providers (Auth, Location, Incidents)
├── i18n/             # Internationalization files
├── navigators/       # React Navigation setup
├── screens/          # App screens
│   ├── IncidentMapScreen.tsx      # Main map view with incident markers
│   ├── ReportIncidentScreen.tsx   # User incident submission form
│   ├── LoginScreen.tsx            # Authentication
│   └── WelcomeScreen.tsx          # Landing screen
├── services/api/     # API client (apisauce)
└── theme/            # Light/dark theme tokens and utilities
server/
├── src/
│   ├── index.ts          # Express server, API routes, DB seeding
│   ├── fetchIncidents.ts # SF Gov API data fetcher
│   └── categorize.ts     # AI-powered incident categorization
└── prisma/
    └── schema.prisma     # Database schema (SQLite)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start Expo dev server |
| `npm run ios` / `npm run android` | Run on platform |
| `npm run compile` | TypeScript type check |
| `npm run lint` | ESLint with auto-fix |
| `npm test` | Run Jest tests |
| `npm run prebuild:clean` | Clean Expo prebuild |
