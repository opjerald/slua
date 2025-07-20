import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

export const DATABASE_NAME = "database.dev.db";

export const expo_sqlite = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
  useNewConnection: true,
});

expo_sqlite.execSync('PRAGMA foreign_keys = ON');

export const db = drizzle(expo_sqlite, { schema });
