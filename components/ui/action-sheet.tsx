import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionSheetIOS,
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export interface ActionSheetOption {
  title: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelButtonTitle?: string;
  style?: ViewStyle;
}

export function ActionSheet({
  visible,
  onClose,
  title,
  message,
  options,
  cancelButtonTitle = "Cancel",
  style,
}: ActionSheetProps) {
  if (Platform.OS === "ios") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (visible) {
        const optionTitles = options.map((option) => option.title);
        const destructiveButtonIndex = options.findIndex(
          (option) => option.destructive,
        );
        const disabledButtonIndices = options
          .map((option, index) => (option.disabled ? index : -1))
          .filter((index) => index !== -1);
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title,
            message,
            options: [...optionTitles, cancelButtonTitle],
            cancelButtonIndex: optionTitles.length,
            destructiveButtonIndex:
              destructiveButtonIndex !== -1
                ? destructiveButtonIndex
                : undefined,
            disabledButtonIndices:
              disabledButtonIndices.length > 0
                ? disabledButtonIndices
                : undefined,
          },
          (buttonIndex) => {
            if (buttonIndex < optionTitles.length) {
              options[buttonIndex].onPress();
            }
            onClose();
          },
        );
      }
    }, [visible, title, message, options, cancelButtonTitle, onClose]);
    // Return null for iOS as we use the native ActionSheet
    return null;
  }

  return (
    <AndroidActionSheet
      {...{
        visible,
        onClose,
        title,
        message,
        options,
        cancelButtonTitle,
        style,
      }}
    />
  );
}

function AndroidActionSheet({
  visible,
  onClose,
  title,
  message,
  options,
  cancelButtonTitle,
}: ActionSheetProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useAnimatedValue(0);
  const backgroundOpacity = useAnimatedValue(0);

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setModalVisible(false));
    }
  }, [visible, slideAnim, backgroundOpacity]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const handleOptionPress = (option: ActionSheetOption) => {
    if (!option.disabled) {
      option.onPress();
      onClose();
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View
          style={{
            opacity: backgroundOpacity,
          }}
          className={"absolute inset-0 bg-black/50"}
        >
          <Pressable className="flex-1" onPress={handleBackdropPress} />
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
          className="elevation-xl max-h-[80%] rounded-t-2xl bg-card pb-8 shadow-xl"
        >
          {/* Header */}
          {(title || message) && (
            <View className="items-center px-5 pb-4 pt-5">
              {title && (
                <Text
                  className="mb-1 text-center font-opensans-semibold text-lg text-foreground"
                  numberOfLines={2}
                >
                  {title}
                </Text>
              )}
              {message && (
                <Text
                  className="text-center text-base text-muted-foreground"
                  numberOfLines={3}
                >
                  {message}
                </Text>
              )}
            </View>
          )}

          {/* Options */}
          <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={cn(
                  "border-b border-border px-5 py-4",
                  index === options.length - 1 && "border-b-0",
                  option.disabled && "opacity-50",
                )}
                onPress={() => handleOptionPress(option)}
                disabled={option.disabled}
                activeOpacity={0.6}
              >
                <View className="flex-row items-center gap-2">
                  {option.icon && (
                    <View className="mr-3 size-6 items-center justify-center">
                      {option.icon}
                    </View>
                  )}
                  <Text
                    className={cn(
                      "flex-1 font-opensans-medium text-[17px]",
                      option.destructive
                        ? "text-destructive"
                        : option.disabled
                          ? "text-muted-foreground"
                          : "text-foreground",
                    )}
                    numberOfLines={1}
                  >
                    {option.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="mt-2 border-t border-border">
            <TouchableOpacity
              className="items-center px-5 py-4 text-foreground"
              onPress={onClose}
              activeOpacity={0.6}
            >
              <Text className="font-opensans-semibold text-[17px] text-foreground">
                {cancelButtonTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function useActionSheet() {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<
    Omit<ActionSheetProps, "visible" | "onClose">
  >({
    options: [],
  });
  const show = useCallback(
    (actionSheetConfig: Omit<ActionSheetProps, "visible" | "onClose">) => {
      setConfig(actionSheetConfig);
      setIsVisible(true);
    },
    [],
  );
  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);
  const ActionSheetComponent = useMemo(
    () => <ActionSheet visible={isVisible} onClose={hide} {...config} />,
    [isVisible, hide, config],
  );
  return {
    show,
    hide,
    ActionSheet: ActionSheetComponent,
    isVisible,
  };
}
