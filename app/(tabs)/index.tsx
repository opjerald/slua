import SearchBar from "@/components/search-bar";
import SongCard from "@/components/song-card";
import { images } from "@/constant";
import { db } from "@/db/client";
import { songs } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { data } = useLiveQuery(db.select().from(songs));
  return (
    <SafeAreaView>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item }) => <SongCard item={item} />}
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
              <TouchableOpacity className="flex size-10 items-center justify-center rounded-full bg-primary">
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
      />
    </SafeAreaView>
  );
};

export default Index;
