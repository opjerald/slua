import { Song } from "@/db/schema";
import { Text, View } from "react-native";

interface SongCardProps {
  item: Song;
}

const SongCard = ({ item }: SongCardProps) => {
  return (
    <View className="mb-2 h-[70px] w-full flex-row items-center gap-5 overflow-hidden rounded-xl bg-white p-3 shadow-lg">
      <View className="h-full w-1.5 rounded-full bg-primary" />
      <View className="flex-1">
        <Text className="base-bold text-dark-100" numberOfLines={1}>{item.title}</Text>
        <Text className="paragraph-semibold text-gray-100" numberOfLines={1}>{item.artist}</Text>
      </View>
      <Text className="h3-bold px-3 text-primary">{item.key}</Text>
    </View>
  );
};

export default SongCard;
