import "../global.css";

import { DATABASE_NAME, expo_sqlite } from "@/db/client";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const hasMounted = useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  const [fontsLoaded, error] = useFonts({
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Light": require("../assets/fonts/OpenSans-Light.ttf"),
    "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
  });

  // const { success, error: migrationError } = useMigrations(db, migrations);

  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDrizzleStudio(expo_sqlite);
  }

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // useEffect(() => {
  //   if (!success && migrationError) throw migrationError;
  // }, [migrationError, success]);

  useLayoutEffect(() => {
    if (hasMounted.current) return;

    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!fontsLoaded || !isColorSchemeLoaded) return null;

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <GestureHandlerRootView className="flex-1">
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense
          >
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SQLiteProvider>
        </Suspense>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default RootLayout;
