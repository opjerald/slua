import { db } from "@/db/client";
import { songs } from "@/db/schema";
import { like, or } from "drizzle-orm";

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
