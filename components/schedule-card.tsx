import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { ScheduleSong } from "@/db/schema";
import { Copy } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface ScheduleCardProps {
  data: ScheduleSong;
  onPress?: () => void;
  onCopy?: () => void;
}

const ScheduleCard = ({ data, onPress, onCopy }: ScheduleCardProps) => {
  return (
    <TouchableOpacity
      className="mb-4 flex-row gap-5 rounded-xl border border-border bg-card p-4"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="h-full w-1.5 rounded-full bg-primary" />
      <View className="flex-1 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-opensans-bold text-2xl text-foreground">
            {data.name}
          </Text>
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            onPress={() => onCopy?.()}
          >
            <Icon icon={Copy} className="size-5 text-accent-foreground" />
          </TouchableOpacity>
        </View>
        <Separator />
        <View className="gap-0.5">
          {data.songs.map((song) => (
            <View
              key={song.id}
              className="flex-row items-center justify-between gap-2"
            >
              <Text className="font-opensans-medium text-lg text-foreground">
                {song.title}
              </Text>
              <Text className="font-opensans-semibold text-lg text-accent-foreground">
                {song.key}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ScheduleCard;
