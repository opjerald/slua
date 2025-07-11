import { View } from "react-native";
import CustomInput from "./custom-input";

const SongForm = () => {
  return (
    <View className="mt-10 gap-4 px-5">
      <CustomInput
        label="Title"
        onChangeText={() => {}}
        placeholder="Enter song title"
      />
      <CustomInput
        label="Artist"
        onChangeText={() => {}}
        placeholder="Enter song artist"
      />
    </View>
  );
};

export default SongForm;
