import CustomInput from "@/components/custom-input";
import { BottomSheet, useBottomSheet } from "@/components/ui/bottom-sheet";
import {
  Button,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Schedules = () => {
  const { isVisible, open, close } = useBottomSheet();

  return (
    <SafeAreaView>
      <Text>Schedules</Text>
      <Button title="Open" onPress={open} />
      <BottomSheet
        isVisible={isVisible}
        onClose={close}
        title="Add Song"
        snapPoints={[0.3]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="gap-4">
            <CustomInput
              label="Title"
              placeholder="Enter song title"
              onChangeText={console.log}
            />
          </View>
        </TouchableWithoutFeedback>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Schedules;
