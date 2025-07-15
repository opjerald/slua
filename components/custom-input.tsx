import { NAV_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  labelClassName?: string;
}

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry,
  keyboardType = "default",
  labelClassName,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full gap-2">
      <Text
        className={cn(
          "w-full text-start font-opensans-semibold text-lg text-primary",
          labelClassName,
        )}
      >
        {label}
      </Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={NAV_THEME["light"].mutedForeground}
        className={cn(
          "w-full rounded-full border-2 bg-input p-5 font-opensans-semibold text-base text-foreground",
          isFocused ? "border-primary" : "border-border",
        )}
      />
    </View>
  );
};

export default CustomInput;
