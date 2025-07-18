import ScheduleCard from "@/components/schedule-card";
import { ActionSheet } from "@/components/ui/action-sheet";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { ScheduleSong } from "@/db/schema";
import { getSchedules } from "@/lib/action";
import useQuery from "@/lib/use-query";
import * as Clipboard from "expo-clipboard";
import { Copy, Edit2, Eye, Plus, Trash } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Schedules = () => {
  const { toast } = useToast();

  const [isVisible, setIsVisible] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState<
    ScheduleSong | undefined
  >(undefined);

  const { data } = useQuery({
    fn: getSchedules,
  });

  const handleCopySchedule = async (data: ScheduleSong) => {
    const schedule = `${data.name}\n${data.songs.map((song) => `(${song.key}) ${song.title} - ${song.artist}\n`).join("")}`;
    await Clipboard.setStringAsync(schedule);
    toast({
      title: "Copied",
      description: "Schedule successfully copied to clipboard",
      variant: "info",
    });
  };

  return (
    <SafeAreaView className="h-full" edges={["top", "left", "right"]}>
      <View className="flex-between my-5 w-full flex-row px-5">
        <View className="flex-start">
          <Text className="paragraph-bold uppercase text-primary">
            Schedules
          </Text>
          <View className="flex-start mt-0.5 flex-row gap-x-1">
            <Text className="paragraph-semibold text-foreground">
              Manage your schedules
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="flex size-10 items-center justify-center rounded-full bg-primary"
          onPress={() => {}}
        >
          <Icon icon={Plus} className="size-6 text-white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item + ""}
        renderItem={({ item }) => (
          <ScheduleCard
            data={item}
            onPress={() => {
              setSelectedSchedule(item);
              setIsVisible(true);
            }}
            onCopy={() => handleCopySchedule(item)}
          />
        )}
        contentContainerClassName="px-5"
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="font-opensans-semibold text-xl text-muted-foreground">
              No schedules yet
            </Text>
          </View>
        )}
      />
      <ActionSheet
        title="Choose an action"
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        options={[
          {
            title: "View",
            onPress: () => console.log("View"),
            icon: <Icon icon={Eye} className="text-foreground" />,
          },
          {
            title: "Copy schedule",
            onPress: () => handleCopySchedule(selectedSchedule!),
            icon: <Icon icon={Copy} className="text-foreground" />,
          },
          {
            title: "Edit",
            onPress: () => {
              open();
            },
            icon: <Icon icon={Edit2} className="text-foreground" />,
          },
          {
            title: "Delete",
            onPress: () => console.log("asd"),
            icon: <Icon icon={Trash} className="text-destructive" />,
            destructive: true,
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default Schedules;
