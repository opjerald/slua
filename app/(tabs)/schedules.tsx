import ScheduleCard from "@/components/schedule-card";
import ScheduleForm from "@/components/schedule-form";
import { ActionSheet } from "@/components/ui/action-sheet";
import { showConfirmAlert } from "@/components/ui/alert";
import { BottomSheet, useBottomSheet } from "@/components/ui/bottom-sheet";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { ScheduleSong } from "@/db/schema";
import { deleteSchedule, getSchedules } from "@/lib/action";
import useQuery from "@/lib/use-query";
import * as Clipboard from "expo-clipboard";
import { Copy, Edit2, Eye, Plus, Trash } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Schedules = () => {
  const { toast } = useToast();

  const [isVisible, setIsVisible] = useState(false);
  const { close, isVisible: bottomSheetIsVisible, open } = useBottomSheet();
  const [formTitle, setFormTitle] = useState("Add Schedule");
  const [action, setAction] = useState<"create" | "update">("create");

  const [selectedSchedule, setSelectedSchedule] = useState<
    ScheduleSong | undefined
  >(undefined);

  const { data, refetch } = useQuery({
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

  const handleConfirmAlert = () => {
    showConfirmAlert(
      "Delete Song",
      "Are you sure you want to delete this schedule?",
      async () => {
        await deleteSchedule(selectedSchedule?.id!);
        refetch({});
        toast({
          title: "Success",
          description: "Schedule deleted successfully!",
          variant: "success",
        });
      },
    );
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
          onPress={() => {
            setFormTitle("Add Schedule");
            setAction("create");
            setSelectedSchedule(undefined);
            open();
          }}
        >
          <Icon icon={Plus} className="size-6 text-white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id + ""}
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
              setFormTitle("Edit Schedule");
              setAction("update");
              open();
            },
            icon: <Icon icon={Edit2} className="text-foreground" />,
          },
          {
            title: "Delete",
            onPress: () => handleConfirmAlert(),
            icon: <Icon icon={Trash} className="text-destructive" />,
            destructive: true,
          },
        ]}
      />
      <BottomSheet
        isVisible={bottomSheetIsVisible}
        onClose={close}
        title={formTitle}
        snapPoints={[0.95]}
      >
        <ScheduleForm
          data={selectedSchedule}
          action={action}
          onClose={(success) => {
            if (success) {
              refetch({});
            }
            setFormTitle("Add Song");
            setAction("create");
            setSelectedSchedule(undefined);
            close();
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Schedules;
