import { Picker } from "@/components/ui/picker";
import { ScheduleSong } from "@/db/schema";
import {
  addSchedule,
  getSongs,
  getSongsByIds,
  updateSchedule,
} from "@/lib/action";
import useQuery from "@/lib/use-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { z } from "zod";
import CustomInput from "./custom-input";
import SongCard from "./song-card";
import Icon from "./ui/icon";
import { useToast } from "./ui/toast";

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is a required field."),
  songs: z.array(z.number()).min(1, "Select at least one song."),
});

type Schema = z.infer<typeof schema>;

interface ScheduleFormProps {
  data?: ScheduleSong;
  action: "create" | "update";
  onClose: (success?: boolean) => void;
}

const ScheduleForm = ({ action, data, onClose }: ScheduleFormProps) => {
  const { toast } = useToast();

  const { data: songs } = useQuery({
    fn: getSongs,
    params: {
      query: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: data?.id || undefined,
      name: data?.name || "",
      songs: data?.songs.map((s) => s.id) || [],
    },
  });

  watch("songs");

  const { data: selectedSong, refetch } = useQuery({
    fn: getSongsByIds,
    params: {
      ids: getValues("songs"),
    },
  });

  const onSubmit = async (data: Schema) => {
    if (action === "create") {
      await addSchedule({ name: data.name }, data.songs);
      toast({
        title: "Success",
        description: "Schedule created successfully!",
        variant: "success",
      });
    } else {
      await updateSchedule({ ...data, id: data.id! });
      toast({
        title: "Success",
        description: "Schedule updated successfully!",
        variant: "success",
      });
    }
    onClose?.(true);
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onBlur, onChange, value } }) => (
          <CustomInput
            label="Name"
            placeholder="Enter schedule name"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="songs"
        render={({ field: { value, onChange } }) => (
          <Picker
            options={songs?.map((s) => ({ label: s.title, value: s.id + "" }))}
            modalTitle="Choose songs"
            placeholder="Select songs"
            label="Songs"
            searchable
            searchPlaceholder="Search songs..."
            values={value.map((v) => String(v))}
            onValuesChange={(values) => {
              onChange(values.map((v) => Number(v)));
              refetch({ ids: getValues("songs") });
            }}
            error={errors.songs?.message}
            multiple
          />
        )}
      />
      {!!selectedSong && (
        <View className="relative max-h-[45%] gap-2">
          <Text className="w-full text-start font-opensans-semibold text-lg text-foreground">
            Selected Songs
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedSong?.map((song) => (
              <View
                key={song?.id}
                className="mb-2 flex-row items-center rounded-xl border-2 border-border bg-accent pr-2"
              >
                <SongCard item={song!} className="mb-0 flex-1 bg-transparent" />
                <TouchableOpacity
                  className="flex size-6 items-center justify-center rounded-full bg-destructive"
                  activeOpacity={0.8}
                  onPress={() => {
                    setValue(
                      "songs",
                      getValues("songs").filter((id) => id !== song?.id),
                    );
                    refetch({ ids: getValues("songs") });
                  }}
                >
                  <Icon
                    icon={X}
                    className="size-5 text-destructive-foreground"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <View className="justify-between gap-4">
        <TouchableOpacity
          className="rounded-2xl border border-primary bg-primary p-5"
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text className="text-center font-opensans-semibold text-base text-primary-foreground">
            {action === "create" ? "Create" : "Update"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className=" rounded-2xl border border-border bg-accent p-5"
          activeOpacity={0.8}
          onPress={() => {
            reset();
            onClose?.(false);
          }}
        >
          <Text className="text-center font-opensans-semibold text-base text-accent-foreground">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScheduleForm;
