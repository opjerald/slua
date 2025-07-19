import { Song } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Text, TouchableOpacity, View } from "react-native";

interface SongCardProps {
  item: Song;
  className?: string;
  onPress?: () => void;
}

const SongCard = ({ item, className, onPress }: SongCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "mb-2 h-[70px] w-full flex-row items-center gap-5 overflow-hidden rounded-xl bg-card p-3 shadow-lg",
        className
      )}
      activeOpacity={0.8}
    >
      <View className="h-full w-1.5 rounded-full bg-primary" />
      <View className="flex-1">
        <Text className="base-bold text-foreground" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="paragraph-semibold text-muted-foreground" numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text className="h3-bold px-3 text-primary">{item.key}</Text>
    </TouchableOpacity>
  );
};

export default SongCard;
