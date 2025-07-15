import Icon from "@/components/icon";
import SearchBar from "@/components/search-bar";
import SongCard from "@/components/song-card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getSongs } from "@/lib/action";
import useQuery from "@/lib/use-query";
import { useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const { toggleColorScheme } = useColorScheme();

  const { data, refetch } = useQuery({
    fn: getSongs,
    params: {
      query,
    },
  });

  useEffect(() => {
    refetch({ query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <SafeAreaView className="h-full">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item }) => (
          <SongCard item={item} onLongPress={() => {}} />
        )}
        contentContainerClassName="pb-24 px-5"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5 ">
            <View className="flex-between w-full flex-row">
              <View className="flex-start">
                <Text className="paragraph-bold uppercase text-primary">
                  Songs
                </Text>
                <View className="flex-start mt-0.5 flex-row gap-x-1">
                  <Text className="paragraph-semibold text-foreground">
                    Find your songs&apos; key.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="flex size-10 items-center justify-center rounded-full bg-primary"
                onPress={() => toggleColorScheme()}
              >
                <Icon icon={Plus} className="size-6 text-white" />
              </TouchableOpacity>
            </View>
            <SearchBar />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="base-bold text-gray-200">No songs yet</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Index;
