# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"It Can Happen To You" is a React Native (Expo) travel safety app built on the Ignite 11.4.0 boilerplate. It displays crime/incident data from the SF Gov open data API on a map, categorized with icons (theft, assault, fraud, etc.). Uses Expo SDK 54, React Native 0.81, React 19, and TypeScript with strict mode.

## Common Commands

- `npm install --legacy-peer-deps` — install dependencies (legacy peer deps flag required)
- `npm run start` — start Expo dev server (`expo start --dev-client`)
- `npm run ios` / `npm run android` — run on platform
- `npm run compile` — TypeScript check (`tsc --noEmit`)
- `npm run lint` — ESLint with auto-fix
- `npm run lint:check` — ESLint without fix
- `npm test` — run Jest tests
- `npm run test:watch` — Jest in watch mode
- `npm run prebuild:clean` — clean Expo prebuild

## Architecture

### Navigation (React Navigation v7)
- **AppNavigator** (`app/navigators/AppNavigator.tsx`): Root native stack. Auth gate: unauthenticated users see `LoginScreen`, authenticated users get `WelcomeScreen` → `DemoNavigator`.
- **DemoNavigator** (`app/navigators/DemoNavigator.tsx`): Bottom tab navigator. The `IncidentMap` tab is the primary app screen. Wraps children in `UserLocationProvider` → `IncidentProvider` → `EpisodeProvider`.
- Navigation types in `app/navigators/navigationTypes.ts`. Add new screens to `AppStackParamList` or `DemoTabParamList`.

### Context Providers (app/context/)
- **AuthContext**: Authentication state, wraps entire app in `app.tsx`
- **LocationContext**: Expo Location with `watchPositionAsync`, provides live GPS coordinates. Default fallback is NYC coordinates.
- **IncidentContext**: Fetches and stores SF crime incidents from `api.getIncidents()`

Provider hierarchy: `SafeAreaProvider` → `KeyboardProvider` → `AuthProvider` → `ThemeProvider` → (navigation) → `UserLocationProvider` → `IncidentProvider`

### API Layer (app/services/api/)
- Uses **apisauce** (wrapper around axios). Singleton `api` instance exported from `index.ts`.
- `getIncidents()` queries SF Gov Socrata API (`data.sfgov.org`) for last 30 days of crime data, assigns category-based icons.
- API error handling uses `GeneralApiProblem` pattern from `apiProblem.ts`.

### i18n
- Uses `i18next` + `react-i18next` with `expo-localization`. Translations in `app/i18n/` (en, es, fr, ar, hi, ja, ko).
- Access translations via `translate()` from `@/i18n/translate` or the `useTranslation` hook.

### Path Aliases
- `@/*` → `./app/*`
- `@assets/*` → `./assets/*`

### Theme System
- Light/dark theme support via `app/theme/context.tsx`. Access with `useAppTheme()`.
- Themed styles use `ThemedStyle<T>` type — functions receiving theme tokens and returning style objects.

### Key Conventions
- Ignite component library in `app/components/` (Screen, Text, Button, Icon, Card, Header, TextField, Toggle, etc.)
- Storage via `react-native-mmkv` (see `app/utils/storage/`)
- Reactotron configured for dev debugging (`app/devtools/`)
- Font: Space Grotesk (loaded via `@expo-google-fonts/space-grotesk`)
