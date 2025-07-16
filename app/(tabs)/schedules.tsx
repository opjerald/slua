import CustomInput from "@/components/custom-input";
import { BottomSheet, useBottomSheet } from "@/components/ui/bottom-sheet";
import { Picker } from "@/components/ui/picker";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Schedules = () => {
  const { isVisible, open, close } = useBottomSheet();

  const [selectedValue, setSelectedValue] = useState("");

  return (
    <SafeAreaView>
      <Text>Schedules</Text>
      <Button title="Open" onPress={open} />
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title="Add Song"
        snapPoints={[0.95]}
      >
        <View className="gap-4">
          <CustomInput
            label="Title"
            placeholder="Enter song title"
            onChangeText={console.log}
          />
          <CustomInput
            label="Artist"
            placeholder="Enter song artist"
            onChangeText={console.log}
          />
          <View className="gap-2">
            <Text
              className={cn(
                "w-full text-start font-opensans-semibold text-lg text-primary",
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
              // label="Key"
              modalTitle="Choose a key"
              value={selectedValue}
              onValueChange={setSelectedValue}
              placeholder="Select song key"
            />
          </View>
          <View className="mt-5 justify-between gap-4">
            <TouchableOpacity
              className=" rounded-full border border-border bg-accent p-5"
              activeOpacity={0.8}
              onPress={() => close()}
            >
              <Text className="text-center font-opensans-semibold text-accent-foreground text-base">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full border border-primary bg-primary p-5"
              activeOpacity={0.8}
            >
              <Text className="text-center font-opensans-semibold text-primary-foreground text-base">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Schedules;
