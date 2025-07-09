import { images } from "@/constant";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import cn from "clsx";
import { Tabs } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="flex min-w-20 items-center justify-center min-h-full gap-1 mt-12 h-[80px]">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#c27aff" : "#fff"}
    />
    <Text className={cn("text-sm font-opensans-bold", focused ? "text-primary" : "text-white")}>
      {title}
    </Text>
  </View>
)

const TabBarButton = ({
  children,
  style,
  onPress,
}: BottomTabBarButtonProps) => (
  <Pressable
    onPress={onPress}
    style={style}
    className="items-center justify-center"
    android_ripple={{
      foreground: true,
    }}
  >
    {children}
  </Pressable>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          height: 110,
          position: "absolute",
          backgroundColor: "#181C2E",
          shadowColor: "#1A1A1A",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Songs",
          tabBarIcon: ({focused}) => <TabBarIcon title="Songs" icon={images.songs} focused={focused} />,
          tabBarButton: TabBarButton
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: "Schedules",
          tabBarIcon: ({focused}) => <TabBarIcon title="Schedules" icon={images.calendar} focused={focused} />,
          tabBarButton: TabBarButton
        }}
      />
      <Tabs.Screen
        name="lyrics"
        options={{
          title: "Lyrics",
          tabBarIcon: ({focused}) => <TabBarIcon title="Lyrics" icon={images.lyrics} focused={focused} />,
          tabBarButton: TabBarButton
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
