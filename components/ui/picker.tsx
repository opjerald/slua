import Icon from "@/components/ui/icon";
import { useBackHandler } from "@/hooks/use-backhandler";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Portal } from "@rn-primitives/portal";
import { ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  containerClassName?: string;

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
  containerClassName,
  modalTitle,
  searchable = false,
  searchPlaceholder = "Search options...",
}: PickerProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorScheme } = useColorScheme();

  useBackHandler(() => {
    if (!isOpen) return false;

    animateClose();
    return true;
  });

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(0, { damping: 50, stiffness: 400 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 50,
        stiffness: 400,
      });
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          animateClose();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pickerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const keyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

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

  const animateClose = () => {
    "worklet";

    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 50,
      stiffness: 400,
    });
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setIsOpen)(false);
      }
    });
  };

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      onValuesChange?.(newValues);
      return;
    }

    onValueChange?.(optionValue);
    animateClose();
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
        <Pressable
          onPress={() => {
            if (!disabled) setIsOpen(true);
            Keyboard.dismiss();
          }}
          disabled={disabled}
          className={cn(
            "w-full flex-row items-center rounded-2xl",
            variant === "group" ? "min-h-[auto] border-0 px-0" : "border p-5",
            variant === "outline" ? "border-border" : "border-card",
            variant === "filled"
              ? "border-2 border-border bg-input"
              : "bg-transparent",
            className,
          )}
        >
          <View className="flex-1 flex-row items-center justify-between">
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
        </Pressable>
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
      {isOpen && (
        <Portal name="picker">
          <View
            className={cn(
              "absolute inset-0 z-20 justify-end",
              containerClassName,
            )}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View
                className="flex-1 bg-black/50"
                style={backdropStyle}
              >
                <TouchableWithoutFeedback onPress={() => animateClose()}>
                  <Animated.View className="flex-1" />
                </TouchableWithoutFeedback>

                <Animated.View
                  className="max-h-[70%] w-full overflow-hidden rounded-t-2xl bg-card pb-8"
                  style={[pickerStyle, keyboardStyle]}
                >
                  {/* Header */}
                  {(modalTitle || multiple) && (
                    <View className="flex-row items-center justify-between border-b border-b-border p-4">
                      <Text className="font-opensans-bold text-2xl text-foreground">
                        {modalTitle || "Select Options"}
                      </Text>
                      {multiple && (
                        <TouchableOpacity onPress={() => animateClose()}>
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
                        placeholderTextColor={
                          NAV_THEME[colorScheme].mutedForeground
                        }
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                  )}
                  {/* Options - Updated to match date-picker styling */}
                  <View className={cn("mb-5 h-[300px]")}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      contentContainerClassName="px-4 py-5"
                    >
                      {filteredSections.map((section, sectionIndex) => (
                        <View key={sectionIndex}>
                          {section.title && (
                            <View className="mb-2 px-1 py-3">
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
                        <View className="items-center px-4 py-5">
                          <Text className="font-opensans text-base text-muted-foreground">
                            {searchQuery
                              ? "No results found"
                              : "No options available"}
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </Animated.View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </Portal>
      )}
    </>
  );
}
