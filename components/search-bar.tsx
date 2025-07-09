import { images } from "@/constant";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = () => {
  return (
    <View className="font-opensans-medium relative flex w-full flex-row items-center justify-center gap-5 rounded-full bg-white text-dark-100 shadow-md shadow-black/10">
      <TextInput
        className="flex-1 p-5"
        placeholder="Search for songs, artists, etc..."
        placeholderTextColor="#878787"
        // value={query}
        // onChangeText={handleSearch}
        // onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity
        className="pr-5"
        // onPress={() => router.setParams({ query })}
      >
        <Image
          source={images.search}
          className="size-6"
          resizeMode="cover"
          tintColor="#181C2E"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
