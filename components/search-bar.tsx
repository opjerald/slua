import Icon from "@/components/ui/icon";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { Search, XCircle } from "lucide-react-native";
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value?: string;
  onChangeText?: (value: string) => void;
}

const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="relative flex w-full flex-row items-center justify-center gap-1 rounded-full bg-input font-opensans-medium text-muted-foreground shadow-md shadow-black/10">
      <View className="pl-4">
        <Icon icon={Search} className="size-7 text-foreground" />
      </View>
      <TextInput
        className="flex-1 py-5 font-opensans text-base text-foreground"
        placeholder="Search for songs, artists, etc..."
        placeholderTextColor={NAV_THEME[colorScheme].mutedForeground}
        onChangeText={onChangeText}
        value={value}
        onSubmitEditing={(e) => onChangeText?.(e.nativeEvent.text)}
        returnKeyType="search"
      />
      {!!value && (
        <TouchableOpacity
          className="pr-4"
          activeOpacity={0.8}
          onPress={() => {
            onChangeText?.("");
            Keyboard.dismiss();
          }}
        >
          <Icon icon={XCircle} className="size-7 text-accent-foreground" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
