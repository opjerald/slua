import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NativeSyntheticEvent, Text, TextInput, TextInputFocusEventData, View } from "react-native";

interface CustomInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  labelClassName?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  onBlur,
  label,
  secureTextEntry,
  keyboardType = "default",
  labelClassName,
  error,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const {colorScheme} = useColorScheme();

  return (
    <View className="w-full gap-2">
      <Text
        className={cn(
          "w-full text-start font-opensans-semibold text-lg text-foreground",
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
        onBlur={(e) => {
          onBlur?.(e);
          setIsFocused(false)
        }}
        placeholderTextColor={NAV_THEME[colorScheme].mutedForeground}
        className={cn(
          "w-full rounded-2xl border-2 bg-input p-5 font-opensans-semibold text-base text-foreground",
          isFocused ? "border-primary" : "border-border",
        )}
      />
      {error && (
        <Text className="text-destructive text-base font-opensans-semibold">
          {error}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;
