import { Song } from "@/db/schema";
import { Text, TouchableOpacity, View } from "react-native";

interface SongCardProps {
  item: Song;
  onLongPress: () => void;
}

const SongCard = ({ item, onLongPress }: SongCardProps) => {
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      className="mb-2 h-[70px] w-full flex-row items-center gap-5 overflow-hidden rounded-xl bg-white p-3 shadow-lg"
      activeOpacity={0.8}
    >
      <View className="h-full w-1.5 rounded-full bg-primary" />
      <View className="flex-1">
        <Text className="base-bold text-dark-100" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="paragraph-semibold text-gray-400" numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text className="h3-bold px-3 text-primary">{item.key}</Text>
    </TouchableOpacity>
  );
};

export default SongCard;
