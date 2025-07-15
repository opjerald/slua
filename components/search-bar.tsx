import { router, useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Icon from "./ui/icon";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text) router.setParams({ query: undefined });
  };

  const handleSubmit = () => {
    if (query?.trim()) router.setParams({ query });
  };

  return (
    <View className="relative flex w-full flex-row items-center justify-center gap-5 rounded-full bg-input font-opensans-medium text-dark-100 shadow-md shadow-black/10">
      <TextInput
        className="flex-1 p-5 text-foreground"
        placeholder="Search for songs, artists, etc..."
        placeholderTextColor="#878787"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity
        className="pr-5"
        onPress={() => router.setParams({ query })}
      >
        <Icon icon={Search} className="size-8 text-foreground" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
