import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import AsyncStorage from "expo-sqlite/kv-store";
import * as schema from "./schema";

export const hardResetDatabase = async (db: ExpoSQLiteDatabase<typeof schema>) => {
    AsyncStorage.removeItem("dbInitialized");

    db.run(`DROP TABLE IF EXISTS __drizzle_migrations`);
    db.run(`DROP TABLE IF EXISTS schedule_song`);
    db.run(`DROP TABLE IF EXISTS songs`);
    db.run(`DROP TABLE IF EXISTS schedules`);

    console.log("Database reset successfully");
}