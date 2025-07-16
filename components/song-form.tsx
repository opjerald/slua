import { insertSongSchema, Song } from "@/db/schema";
import { addSong, updateSong } from "@/lib/action";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import CustomInput from "./custom-input";
import { Picker } from "./ui/picker";

interface SongFormProps {
  song?: Song;
  action?: "create" | "update";
  onClose?: (success?: boolean) => void;
}

const SongForm = ({ song, action, onClose }: SongFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<Song, "id">>({
    resolver: zodResolver(insertSongSchema),
    defaultValues: {
      title: song?.title || "",
      artist: song?.artist || "",
      key: song?.key || "",
    },
  });

  const onSubmit = async (data: Omit<Song, "id">) => {
    if(action === "create") {
      await addSong(data);
    } else {
      await updateSong(song?.id!, data);
    }
    onClose?.(true);
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Title"
            placeholder="Enter song title"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.title?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="artist"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Artist"
            placeholder="Enter song title"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.artist?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="key"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2">
            <Text
              className={cn(
                "w-full text-start font-opensans-semibold text-lg text-foreground",
              )}
            >
              Key
            </Text>
            <Picker
              options={[
                { label: "A", value: "A" },
                { label: "A# (Bb)", value: "A#" },
                { label: "B", value: "B" },
                { label: "C", value: "C" },
                { label: "C# (Db)", value: "C#" },
                { label: "D", value: "D" },
                { label: "D# (Eb)", value: "D#" },
                { label: "E", value: "E" },
                { label: "F", value: "F" },
                { label: "F# (Gb)", value: "F#" },
                { label: "G", value: "G" },
                { label: "G# (Ab)", value: "G#" },
              ]}
              modalTitle="Choose a key"
              value={value}
              onValueChange={onChange}
              placeholder="Select song key"
              error={errors.key?.message}
            />
          </View>
        )}
      />
      <View className="mt-5 justify-between gap-4">
        <TouchableOpacity
          className=" rounded-full border border-border bg-accent p-5"
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
        <TouchableOpacity
          className="rounded-full border border-primary bg-primary p-5"
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text className="text-center font-opensans-semibold text-base text-primary-foreground">
            {action === "create" ? "Create" : "Update"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SongForm;
