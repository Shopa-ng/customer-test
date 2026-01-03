# Shopa Mobile App

A React Native mobile application for Shopa - a marketplace platform with the tagline "Buy. Sell. Connect."

## Features

- **Splash Screen**: Welcoming screen with animated logo and tagline
- **Login Screen**: Authentication with email/phone and 4-digit PIN
- **Forgot PIN Screen**: Password recovery via email
- **Success Modal**: Confirmation modal for PIN reset

## Tech Stack

- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **React Navigation** for routing
- **react-native-svg** for custom graphics
- **@expo/vector-icons** for icons

## Project Structure

```
shopa-mobile/
├── App.tsx                     # Main app entry point
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── BackgroundPattern.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Logo.tsx
│   │   ├── SuccessModal.tsx
│   │   └── index.ts
│   ├── constants/              # Theme and styling constants
│   │   ├── theme.ts
│   │   └── index.ts
│   ├── navigation/             # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── index.ts
│   ├── screens/                # App screens
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ForgotPinScreen.tsx
│   │   └── index.ts
│   └── types/                  # TypeScript type definitions
│       ├── navigation.ts
│       └── index.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Studio (for Android emulator)

### Installation

1. Clone the repository:

   ```bash
   cd shopa-mobile
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Scan QR code with Expo Go app on your physical device

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Theme Colors

| Color         | Hex       | Usage                 |
| ------------- | --------- | --------------------- |
| Primary       | `#1B5E20` | Main green background |
| Primary Light | `#2E7D32` | Pattern elements      |
| Accent        | `#F9A825` | Logo and highlights   |
| Success       | `#388E3C` | Success indicators    |
| Error         | `#D32F2F` | Error messages        |

## Screens

### 1. Splash Screen

The welcome screen featuring:

- Animated abstract green background pattern
- Shopa logo with tagline
- "Welcome" button with chevron animation

### 2. Login Screen

Authentication screen with:

- Email/Phone input field
- 4-digit PIN input (masked)
- "Remember Me" checkbox
- "Forgot PIN?" link
- Login button
- Biometric authentication button
- Sign up link

### 3. Forgot PIN Screen

PIN recovery screen with:

- Email input field
- Continue button
- Success modal on submission

## Customization

### Modifying Colors

Edit `src/constants/theme.ts` to update the color scheme.

### Adding New Screens

1. Create screen component in `src/screens/`
2. Export from `src/screens/index.ts`
3. Add route in `src/navigation/AppNavigator.tsx`
4. Update types in `src/types/navigation.ts`

## License

MIT
