import SearchBar from "@/components/search-bar";
import SongCard from "@/components/song-card";
import SongForm from "@/components/song-form";
import { images } from "@/constant";
import { getSongs } from "@/lib/action";
import useQuery from "@/lib/use-query";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { query } = useLocalSearchParams<{ query: string }>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const btmSheetModalSongFormRef = useRef<BottomSheetModal>(null);

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
          <SongCard
            item={item}
            onLongPress={() => bottomSheetModalRef.current?.present()}
          />
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
                  <Text className="paragraph-semibold text-dark-100">
                    Find your songs&apos; key.
                  </Text>
                </View>
              </View>
              {/* <CartButton /> */}
              <TouchableOpacity className="flex size-10 items-center justify-center rounded-full bg-primary" onPress={() => btmSheetModalSongFormRef.current?.present()}>
                <Image
                  source={images.plus}
                  className="size-3"
                  resizeMode="contain"
                  tintColor="#fff"
                />
              </TouchableOpacity>
            </View>
            <SearchBar />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="base-bold text-gray-200">No songs yet</Text>
        )}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="song-settings"
        snapPoints={["25%"]}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        handleIndicatorStyle={{
          backgroundColor: "white",
        }}
        backgroundStyle={{
          backgroundColor: "#181C2E",
        }}
      >
        <BottomSheetView className="h-full flex-1 gap-2">
          <View>
            <Pressable
              className="flex-row items-center gap-6 px-5 py-4"
              android_ripple={{
                color: "#4b5563",
              }}
              onPress={() => btmSheetModalSongFormRef.current?.present()}
            >
              <Image
                source={images.pencil}
                className="size-[21px]"
                resizeMode="contain"
                tintColor="white"
              />
              <Text className="base-medium text-gra text-white">Edit</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center gap-6 px-5 py-4"
              android_ripple={{
                color: "#4b5563",
              }}
            >
              <Image
                source={images.trashBin}
                className="size-[21px]"
                resizeMode="contain"
                tintColor="#ef4444"
              />
              <Text className="base-medium text-red-500">Delete</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={btmSheetModalSongFormRef}
        name="song-form"
        snapPoints={useMemo(() => ["50%"], [])}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        handleIndicatorStyle={{
          backgroundColor: "white",
        }}
        backgroundStyle={{
          backgroundColor: "#181C2E",
        }}
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView className="h-full flex-1">
          <View className="flex-between flex-row mt-5 px-5">
            <Pressable
              onPress={() => btmSheetModalSongFormRef.current?.dismiss()}
            >
              <Image
                source={images.arrowLeft}
                className="size-5"
                resizeMode="contain"
                tintColor="white"
              />
            </Pressable>
            <Text className="h3-bold text-white">Song Form</Text>
            <View className="">
              <Image
                source={images.info}
                className="size-5"
                resizeMode="contain"
                tintColor="white"
              />
            </View>
          </View>
          <SongForm />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default Index;
