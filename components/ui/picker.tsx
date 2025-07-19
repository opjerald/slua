import Icon from "@/components/ui/icon";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}
export interface PickerSection {
  title?: string;
  options: PickerOption[];
}
interface PickerProps {
  options?: PickerOption[];
  sections?: PickerSection[];
  value?: string;
  placeholder?: string;
  error?: string;
  variant?: "outline" | "filled" | "group";
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  values?: string[];
  onValuesChange?: (values: string[]) => void;

  // Styling props
  label?: string;
  rightComponent?: React.ReactNode | (() => React.ReactNode);
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;

  // Modal props
  modalTitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function Picker({
  options = [],
  sections = [],
  value,
  values = [],
  error,
  variant = "filled",
  placeholder = "Select an option...",
  onValueChange,
  onValuesChange,
  disabled = false,
  className,
  multiple = false,
  label,
  rightComponent,
  inputClassName,
  labelClassName,
  errorClassName,
  modalTitle,
  searchable = false,
  searchPlaceholder = "Search options...",
}: PickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorScheme } = useColorScheme();

  const normalizedSections: PickerSection[] =
    sections.length > 0 ? sections : [{ options }];

  const filteredSections =
    searchable && searchQuery
      ? normalizedSections
          .map((section) => ({
            ...section,
            options: section.options.filter((option) =>
              option.label
                .toLocaleLowerCase()
                .includes(searchQuery.toLowerCase()),
            ),
          }))
          .filter((section) => section.options.length > 0)
      : normalizedSections;

  const getSelectedOptions = () => {
    const allOptions = normalizedSections.flatMap((section) => section.options);

    if (multiple) {
      return allOptions.filter((option) => values.includes(option.value));
    }

    return allOptions.filter((option) => option.value === value);
  };

  const selectedOptions = getSelectedOptions();

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      onValuesChange?.(newValues);
      return;
    }

    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;

    if (multiple) {
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} selected`;
    }

    return selectedOptions[0]?.label || placeholder;
  };

  const renderOption = (option: PickerOption, sectionIndex: number) => {
    const isSelected = multiple
      ? values.includes(option.value)
      : value === option.value;

    return (
      <TouchableOpacity
        key={`${sectionIndex}-${option.value}`}
        onPress={() => !option.disabled && handleSelect(option.value)}
        className={cn(
          "my-0.5 items-center rounded-2xl px-5 py-4",
          isSelected ? "bg-accent" : "bg-transparent",
          option.disabled ? "opacity-30" : "opacity-100",
        )}
        disabled={option.disabled}
      >
        <View className="w-full items-center">
          <Text
            className={cn(
              "text-center text-lg",
              isSelected
                ? "font-opensans-semibold text-primary"
                : "font-opensans-medium text-foreground",
            )}
          >
            {option.label}
          </Text>
          {option.description && (
            <Text
              className={cn(
                "mt-1 text-center text-xs",
                isSelected
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {option.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View className="w-full gap-2">
        {label && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className={cn(
              "w-full text-start font-opensans-semibold text-lg text-foreground",
              labelClassName,
            )}
          >
            {label}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          activeOpacity={1}
          className={cn(
            "w-full flex-row items-center rounded-full",
            variant === "group" ? "min-h-[auto] border-0 px-0" : "border p-5",
            variant === "outline" ? "border-border" : "border-card",
            variant === "filled"
              ? "border-2 border-border bg-input"
              : "bg-transparent",
            className,
          )}
        >
          <View className="flex-1 flex-row items-center justify-between bg-input">
            <Text
              className={cn(
                "font-opensans-semibold text-base text-muted-foreground",
                selectedOptions.length > 0 && "text-foreground",
                disabled && "text-muted-foreground",
                inputClassName,
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {getDisplayText()}
            </Text>
            {rightComponent ? (
              typeof rightComponent === "function" ? (
                rightComponent()
              ) : (
                rightComponent
              )
            ) : (
              <Icon
                icon={ChevronDown}
                className="text-muted-foreground"
                style={{
                  transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        {error && (
          <Text
            className={cn(
              "font-opensans-semibold text-base text-destructive",
              errorClassName,
            )}
          >
            {error}
          </Text>
        )}
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-end bg-black/50"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="max-h-[70%] w-full overflow-hidden rounded-t-2xl bg-card pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(modalTitle || multiple) && (
              <View className="flex-row items-center justify-between border-b border-b-border p-4">
                <Text className="font-opensans-bold text-2xl text-foreground">
                  {modalTitle || "Select Options"}
                </Text>
                {multiple && (
                  <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <Text className="font-opensans-medium text-primary">
                      Done
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {/* Search */}
            {searchable && (
              <View className="border-b border-b-border px-4 py-2">
                <TextInput
                  className="rounded-lg py-3 text-base text-foreground"
                  placeholder={searchPlaceholder}
                  placeholderTextColor={NAV_THEME[colorScheme].mutedForeground}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}
            {/* Options - Updated to match date-picker styling */}
            <View className="h-[300px]">
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 20,
                  paddingHorizontal: 16,
                }}
              >
                {filteredSections.map((section, sectionIndex) => (
                  <View key={sectionIndex}>
                    {section.title && (
                      <View
                        style={{
                          paddingHorizontal: 4,
                          paddingVertical: 12,
                          marginBottom: 8,
                        }}
                      >
                        <Text className="font-opensans-semibold text-xs tracking-[0.5] text-muted-foreground">
                          {section.title}
                        </Text>
                      </View>
                    )}
                    {section.options.map((option) =>
                      renderOption(option, sectionIndex),
                    )}
                  </View>
                ))}
                {filteredSections.every(
                  (section) => section.options.length === 0,
                ) && (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 24,
                      alignItems: "center",
                    }}
                  >
                    <Text className="text-base text-muted-foreground">
                      {searchQuery
                        ? "No results found"
                        : "No options available"}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
