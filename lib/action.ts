import { db } from "@/db/client";
import { Song, songs } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";

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

export const addSong = async (data: Omit<Song, "id">) => {
  try {
    return await db.insert(songs).values(data).returning();
  } catch (error) {
    throw new Error(`Failed to add song: ${(error as Error).message}`);
  }
};

export const updateSong = async (id: number, data: Omit<Song, "id">) => {
  try {
    return await db
      .update(songs)
      .set(data)
      .where(eq(songs.id, id))
      .returning();
  } catch (error) {
    throw new Error(`Failed to update song: ${(error as Error).message}`);
  }
};

export const deleteSong = async (id: number) => {
  try {
    return await db
      .delete(songs)
      .where(eq(songs.id, id))
      .returning();
  } catch (error) {
    throw new Error(`Failed to delete song: ${(error as Error).message}`);
  }
};