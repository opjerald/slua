import { db } from "@/db/client";
import { Schedule, schedules, schedulesSongs, Song, songs } from "@/db/schema";
import { SongLyrics } from "@/type";
import axios from "axios";
import { eq, inArray, like, or } from "drizzle-orm";

const URL = "https://lrclib.net/api/search";

interface GetSongsProps {
  query: string;
}

export const getSongs = async ({ query }: GetSongsProps) => {
  try {
    if (!query || query.trim() === "") {
      return await db.select().from(songs);
    }

    return await db
      .select()
      .from(songs)
      .where(
        or(like(songs.title, `%${query}%`), like(songs.artist, `%${query}%`)),
      );
  } catch (error) {
    throw new Error(error as string);
  }
};

interface GetSongsByIds {
  ids: number[];
}

export const getSongsByIds = async ({ ids }: GetSongsByIds) => {
  try {
    const rawSongs = await db
      .select()
      .from(songs)
      .where(inArray(songs.id, ids));
    const songMap = new Map(rawSongs.map((song) => [song.id, song]));
    const orderSongs = ids.map((id) => songMap.get(id)).filter(Boolean);

    return orderSongs;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const addSong = async (data: Omit<Song, "id">) => {
  try {
    return await db.insert(songs).values(data).returning();
  } catch (error) {
    throw new Error(`Failed to add song: ${(error as Error).message}`);
  }
};

export const updateSong = async (id: number, data: Omit<Song, "id">) => {
  try {
    return await db.update(songs).set(data).where(eq(songs.id, id)).returning();
  } catch (error) {
    throw new Error(`Failed to update song: ${(error as Error).message}`);
  }
};

export const deleteSong = async (id: number) => {
  try {
    return await db.delete(songs).where(eq(songs.id, id)).returning();
  } catch (error) {
    throw new Error(`Failed to delete song: ${(error as Error).message}`);
  }
};

export const getSchedules = async () => {
  try {
    const data = await db.query.schedules.findMany({
      with: {
        schedulesSongs: {
          with: {
            song: true,
          },
        },
      },
    });

    return data.map((d) => ({
      id: d.id,
      name: d.name,
      songs: d.schedulesSongs.map((ss) => ss.song),
    }));
  } catch (error) {
    throw new Error(error as string);
  }
};

export const addSchedule = async (
  data: Omit<Schedule, "id">,
  songs: number[],
) => {
  try {
    const [newSchedule] = await db.insert(schedules).values(data).returning();

    if (!newSchedule) throw new Error("Failed to create schedule.");

    const pivotData = songs.map((id) => ({
      schedule_id: newSchedule.id,
      song_id: id,
    }));

    await db.insert(schedulesSongs).values(pivotData);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updateSchedule = async ({
  id: scheduleId,
  name,
  songs,
}: Schedule & { songs: number[] }) => {
  try {
    await db
      .update(schedules)
      .set({ name })
      .where(eq(schedules.id, scheduleId))
      .returning();

    if (!updateSchedule) throw new Error("Failed to update schedule");

    await db
      .delete(schedulesSongs)
      .where(eq(schedulesSongs.schedule_id, scheduleId));

    const pivotTable = songs.map((id) => ({
      schedule_id: scheduleId,
      song_id: id,
    }));

    await db.insert(schedulesSongs).values(pivotTable);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const deleteSchedule = async (id: number) => {
  try {
    return await db.delete(schedules).where(eq(schedules.id, id)).returning();
  } catch (error) {
    throw new Error(error as string);
  }
};

interface SearchSongLyricsProps {
  query: string;
}

export const searchSongLyrics = async ({ query }: SearchSongLyricsProps) => {
  const transformedQuery = new URLSearchParams(query).toString();
  try {
    const res = await axios.get(`${URL}?q=${transformedQuery}`);
    const data = res.data as SongLyrics[];

    return data;
  } catch (error) {
    throw new Error(error as string);
  }
};
