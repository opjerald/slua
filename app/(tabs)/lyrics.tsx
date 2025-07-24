import SearchBar from "@/components/search-bar";
import { ActionSheet } from "@/components/ui/action-sheet";
import { BottomSheet, useBottomSheet } from "@/components/ui/bottom-sheet";
import Icon from "@/components/ui/icon";
import useDebounce from "@/hooks/use-debounced";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { searchSongLyrics } from "@/lib/action";
import useQuery from "@/lib/use-query";
import { cn } from "@/lib/utils";
import { SongLyrics } from "@/type";
import { Eye, Plus, PlusCircle, Wifi, WifiOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const Lyrics = () => {
  const networkStatus = useNetworkStatus();
  const { open, isVisible: bottomSheetVisible, close } = useBottomSheet();

  const [selectedSongLyrics, setSelectedSongLyrics] = useState<
    SongLyrics | undefined
  >(undefined);
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [isLyricsEdit, setIsLyricsEdit] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const { data, refetch, isLoading } = useQuery({
    fn: searchSongLyrics,
    params: {
      query: debouncedQuery,
    },
  });

  useEffect(() => {
    refetch({ query: debouncedQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <SafeAreaView className="h-full" edges={["top", "left", "right"]}>
      <View className="my-5 gap-5 px-5">
        <View className="flex-between w-full flex-row">
          <View className="flex-start">
            <Text className="paragraph-bold uppercase text-primary">Songs</Text>
            <View className="flex-start mt-0.5 flex-row gap-x-1">
              <Text className="paragraph-semibold text-foreground">
                Manage your songs
              </Text>
            </View>
          </View>
          <View className="flex size-10 items-center justify-center rounded-full bg-primary">
            <Icon
              icon={networkStatus ? Wifi : WifiOff}
              className="size-6 text-white"
            />
          </View>
        </View>
        <SearchBar
          placeholder="Search for songs, artists, etc..."
          value={query}
          onChangeText={setQuery}
          editable={networkStatus}
        />
      </View>
      {isLoading && (
        <View className="mb-5 w-full flex-row items-center justify-center gap-2">
          <ActivityIndicator size="small" />
          <Text className="font-opensans text-foreground">Searching...</Text>
        </View>
      )}
      {networkStatus ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id + ""}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-2 h-[70px] w-full flex-row items-center gap-5 overflow-hidden rounded-xl bg-card p-3 shadow-lg"
              activeOpacity={0.8}
              onPress={() => {
                setSelectedSongLyrics(item);
                setIsActionSheetVisible(true);
              }}
            >
              <View className="h-full w-1.5 rounded-full bg-primary" />
              <View className="flex-1">
                <Text className="base-bold text-foreground" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  className="paragraph-semibold text-muted-foreground"
                  numberOfLines={1}
                >
                  {item.artistName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerClassName="px-5"
          ListEmptyComponent={() => (
            <View className="flex-1 items-center justify-center">
              <Text className="font-opensans-semibold text-base text-muted-foreground">
                Search for song lyrics.
              </Text>
            </View>
          )}
        />
      ) : (
        <View className="w-full items-center justify-center">
          <Text className="text-base text-foreground">No internet connection.</Text>
        </View>
      )}
      <ActionSheet
        title="Choose an action"
        visible={isActionSheetVisible}
        onClose={() => setIsActionSheetVisible(false)}
        options={[
          {
            title: "View lyrics",
            onPress: () => open(),
            icon: <Icon icon={Eye} className="text-foreground" />,
          },
          {
            title: "Add lyrics to a song",
            onPress: () => console.log(),
            icon: <Icon icon={Plus} className="text-foreground" />,
          },
          {
            title: "Add to database",
            onPress: () => console.log(),
            icon: <Icon icon={PlusCircle} className="text-foreground" />,
          },
        ]}
        containerClassName="z-10"
      />
      <BottomSheet
        isVisible={bottomSheetVisible}
        onClose={close}
        containerClassName="z-10 mb-10"
        snapPoints={[1]}
        title={`${selectedSongLyrics?.name} Lyrics`}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className={cn(
            "mb-5",
            isLyricsEdit && "rounded-2xl border-2 border-primary bg-input",
          )}
        >
          {isLyricsEdit ? (
            <TextInput
              defaultValue={selectedSongLyrics?.plainLyrics ?? ""}
              className="p-4 font-opensans-medium text-xl text-foreground"
              multiline
            />
          ) : (
            <Text className="font-opensans-medium text-xl text-foreground">
              {selectedSongLyrics?.plainLyrics ?? ""}
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity
          className="rounded-2xl border border-primary bg-primary p-5"
          onPress={() => setIsLyricsEdit((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text className="text-center font-opensans-semibold text-base text-primary-foreground">
            {isLyricsEdit ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Lyrics;
