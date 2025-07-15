import { LucideIcon } from "lucide-react-native";

interface TabBarIconProps {
  focused: boolean;
  icon: LucideIcon;
  title: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
}