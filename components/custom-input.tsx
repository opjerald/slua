import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import cn from "clsx";
import { useState } from "react";
import { Text, View } from "react-native";

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
    <View className="w-full">
      <Text className={cn("text-base text-start w-full font-opensans-medium text-primary", labelClassName)}>{label}</Text>
      <BottomSheetTextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#888"
        className={cn(
          "py-3 w-full text-base font-opensans-semibold text-white border-b",
          isFocused ? "border-primary" : "border-gray-300",
        )}
      />
    </View>
  );
};

export default CustomInput;
