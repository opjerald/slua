import Icon from "@/components/ui/icon";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TabBarIconProps } from "@/type";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Calendar, Music, Music2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const TabBarIcon = ({ focused, icon: LucideIcon, title }: TabBarIconProps) => (
  <View className="mt-12 flex h-[80px] min-h-full min-w-20 items-center justify-center gap-1">
    <Icon
      icon={LucideIcon}
      className={cn(
        "size-8",
        focused ? "text-primary" : "text-muted-foreground",
      )}
      strokeWidth={2.3}
    />
    <Text
      className={cn(
        "font-opensans-bold text-sm",
        focused ? "text-primary" : "text-muted-foreground",
      )}
    >
      {title}
    </Text>
  </View>
);

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
  const { colorScheme } = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 110,
          backgroundColor: NAV_THEME[colorScheme].card,
          borderWidth: 1,
          borderColor: NAV_THEME[colorScheme].border,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Songs",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Songs" icon={Music} focused={focused} />
          ),
          tabBarButton: TabBarButton,
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: "Schedules",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Schedules" icon={Calendar} focused={focused} />
          ),
          tabBarButton: TabBarButton,
        }}
      />
      <Tabs.Screen
        name="lyrics"
        options={{
          title: "Lyrics",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Lyrics" icon={Music2} focused={focused} />
          ),
          tabBarButton: TabBarButton,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
