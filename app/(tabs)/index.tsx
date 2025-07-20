import SearchBar from "@/components/search-bar";
import SongCard from "@/components/song-card";
import SongForm from "@/components/song-form";
import { ActionSheet } from "@/components/ui/action-sheet";
import { showConfirmAlert } from "@/components/ui/alert";
import { BottomSheet, useBottomSheet } from "@/components/ui/bottom-sheet";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { Song } from "@/db/schema";
import useDebounce from "@/hooks/use-debounced";
import { deleteSong, getSongs } from "@/lib/action";
import useQuery from "@/lib/use-query";
import { Edit2, Eye, Plus, Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { toast } = useToast();
  const { isVisible: bottomSheetIsVisible, open, close } = useBottomSheet();
  
  const [isVisible, setIsVisible] = useState(false);
  const [formTitle, setFormTitle] = useState("Add Song");
  const [action, setAction] = useState<"create" | "update">("create");
  const [selectedSong, setSelectedSong] = useState<Song | undefined>(undefined);
  
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const { data, refetch } = useQuery({
    fn: getSongs,
    params: {
      query: debouncedQuery,
    },
  });

  useEffect(() => {
    refetch({ query: debouncedQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleConfirmAlert = () => {
    showConfirmAlert(
      'Delete Song',
      'Are you sure you want to delete this song?',
      async () => {
        await deleteSong(selectedSong?.id!);
        refetch({ query });
        toast({
          title: "Deleted",
          description: "Song deleted successfully!",
          variant: "info"
        });
      }
    )
  }

  return (
    <SafeAreaView className="h-full" edges={["top", "left", "right"]}>
      <View className="my-5 gap-5 px-5">
        <View className="flex-between w-full flex-row">
          <View className="flex-start">
            <Text className="paragraph-bold uppercase text-primary">
              Songs
            </Text>
            <View className="flex-start mt-0.5 flex-row gap-x-1">
              <Text className="paragraph-semibold text-foreground">
                Manage your songs
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="flex size-10 items-center justify-center rounded-full bg-primary"
            onPress={() => {
              setFormTitle("Add Song");
              setAction("create");
              setSelectedSong(undefined);
              open();
            }}
          >
            <Icon icon={Plus} className="size-6 text-white" />
          </TouchableOpacity>
        </View>
        <SearchBar value={query} onChangeText={setQuery}/>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item }) => (
          <SongCard
            item={item}
            onPress={() => {
              setSelectedSong(item);
              setIsVisible(true);
            }}
          />
        )}
        contentContainerClassName="px-5"
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-xl font-opensans-semibold text-muted-foreground">No songs found</Text>
          </View>
        )}
      />
      <ActionSheet
        title="Choose an action"
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        options={[
          {
            title: "View",
            onPress: () => console.log("View"),
            icon: <Icon icon={Eye} className="text-foreground" />,
          },
          {
            title: "Edit",
            onPress: () => {
              setFormTitle("Edit Song");
              setAction("update");
              open();
            },
            icon: <Icon icon={Edit2} className="text-foreground" />,
          },
          {
            title: "Delete",
            onPress: () => handleConfirmAlert(),
            icon: <Icon icon={Trash} className="text-destructive" />,
            destructive: true,
          },
        ]}
      />
      <BottomSheet
        isVisible={bottomSheetIsVisible}
        onClose={close}
        title={formTitle}
        snapPoints={[1]}
      >
        <SongForm
          song={selectedSong}
          action={action}
          onClose={(success) => {
            if (success) {
              refetch({ query: debouncedQuery });
            }
            setFormTitle("Add Song");
            setAction("create");
            setSelectedSong(undefined);
            close();
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Index;
