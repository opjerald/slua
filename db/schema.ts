import { relations } from "drizzle-orm";
import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";

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
      .references(() => schedules.id),
    song_id: integer("song_id")
      .notNull()
      .references(() => songs.id),
  },
  (t) => [primaryKey({ columns: [t.song_id, t.schedule_id] })]
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