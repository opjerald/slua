import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const songs = sqliteTable("songs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  key: text("key").notNull(),
});

export const songsRelations = relations(songs, ({ many }) => ({
  schedulesSongs: many(schedulesSongs),
}));

export const schedules = sqliteTable("schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const schedulesRelations = relations(schedules, ({ many }) => ({
  schedulesSongs: many(schedulesSongs),
}));

export const schedulesSongs = sqliteTable(
  "schedule_song",
  {
    schedule_id: integer("schedule_id")
      .notNull()
      .references(() => schedules.id, { onDelete: "cascade" }),
    song_id: integer("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.song_id, t.schedule_id] })],
);

export const scheduleSongRelations = relations(schedulesSongs, ({ one }) => ({
  song: one(songs, {
    fields: [schedulesSongs.song_id],
    references: [songs.id],
  }),
  schedule: one(schedules, {
    fields: [schedulesSongs.schedule_id],
    references: [schedules.id],
  }),
}));

export type Song = typeof songs.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;
export type ScheduleSong = Schedule & { songs: Song[] };

export const insertSongSchema = createInsertSchema(songs, {
  title: (schema) => schema.min(1, "Title is required"),
  artist: (schema) => schema.min(1, "Artist is required"),
  key: (schema) => schema.min(1, "Key is required"),
});
