import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";
import { schedules, schedulesSongs, songs } from "./schema";

export const addDummyData = async (db: ExpoSQLiteDatabase<typeof schema>) => {
  await db.insert(songs).values([
    {
      key: "D",
      title: "Lead me to the cross",
      artist: "Hillsong United",
    },
    {
      key: "C",
      title: "Joy",
      artist: "Planetshakers",
    },
    {
      key: "C",
      title: "I'm free",
      artist: "Planetshakers",
    },
    {
      key: "A#",
      title: "Thank you Jesus for the blood",
      artist: "Charity Gayle",
    },
    {
      key: "G",
      title: "Beautiful savior",
      artist: "Planetshakers",
    },
  ]);

  await db.insert(schedules).values([
    {
      name: "Sunday Service",
    },
  ]);

  await db.insert(schedulesSongs).values([
    {
      schedule_id: 1,
      song_id: 1,
    },
    {
      schedule_id: 1,
      song_id: 2,
    },
    {
      schedule_id: 1,
      song_id: 3,
    },
    {
      schedule_id: 1,
      song_id: 4,
    },
    {
      schedule_id: 1,
      song_id: 5,
    },
  ]);
};
