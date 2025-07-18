import { cn } from '@/lib/utils';
import { AlertCircle, Check, Info, X } from 'lucide-react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from './icon';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
  index: number;
}

const { width: screenWidth } = Dimensions.get('window');
const DYNAMIC_ISLAND_HEIGHT = 37;
const EXPANDED_HEIGHT = 85;
const TOAST_MARGIN = 8;
const DYNAMIC_ISLAND_WIDTH = 126;
const EXPANDED_WIDTH = screenWidth - 32;

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
  index,
  action,
  duration = 4000,
}: ToastProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setHasContent] = useState(false);

  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const width = useSharedValue(DYNAMIC_ISLAND_WIDTH);
  const height = useSharedValue(DYNAMIC_ISLAND_HEIGHT);
  const borderRadius = useSharedValue(18.5);
  const contentOpacity = useSharedValue(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTime = useRef(duration);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const hasContentToShow = Boolean(title || description || action);
    setHasContent(hasContentToShow);

    if (hasContentToShow) {
      width.value = EXPANDED_WIDTH;
      height.value = EXPANDED_HEIGHT;
      borderRadius.value = 20;
      setIsExpanded(true);

      translateY.value = withSpring(0);
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1);
      contentOpacity.value = withTiming(1, { duration: 300 })

    } else {
      setIsExpanded(false);

      translateY.value = withSpring(0);
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1);
    }

    if (duration && duration > 0) {
      startTimeout(duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      translateY.value = -100;
      opacity.value = 0;
      scale.value = 0.8;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, action]);

  const startTimeout = (time: number) => {
    timeoutRef.current = setTimeout(() => {
      runOnJS(dismiss)();
    }, time)
    startTime.current = Date.now();
  }

  const pauseTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      if (startTime.current) {
        const elapsed = Date.now() - startTime.current;
        remainingTime.current -= elapsed;
      }
    }
  }

  const resumeTimeout = () => {
    if (!timeoutRef.current && remainingTime.current > 0) {
      startTimeout(remainingTime.current);
    }
  }

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-primary';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <Icon icon={Check} className='size-6 text-green-500' />;
      case 'error':
        return <Icon icon={X} className='size-6 text-red-500' />;
      case 'warning':
        return <Icon icon={AlertCircle} className='size-6 text-yellow-500' />;
      case 'info':
        return <Icon icon={Info} className='size-6 text-blue-500' />;
      default:
        return null;
    }
  };

  const dismiss = () => {
    translateY.value = withSpring(-100);
    opacity.value = withTiming(0, { duration: 250 });
    scale.value = withSpring(0.8, {}, () => {
      runOnJS(onDismiss)(id);
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      runOnJS(pauseTimeout)();
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      if (
        Math.abs(translationX) > screenWidth * 0.25 ||
        Math.abs(velocityX) > 800
      ) {
        translateX.value = withTiming(
          translationX > 0 ? screenWidth : -screenWidth,
          { duration: 250 },
          () => runOnJS(onDismiss)(id)
        );
        opacity.value = withTiming(0, { duration: 250 });
      } else {
        translateX.value = withSpring(0);
      }
      runOnJS(resumeTimeout)();
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    top: 50 + index * (EXPANDED_HEIGHT + TOAST_MARGIN),
    zIndex: 1000 + index,
  }));

  const innerStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="absolute self-center shadow-2xl elevation-xl z"
        style={containerStyle}
      >
        <Pressable
          onPressIn={pauseTimeout}
          onPressOut={resumeTimeout}
        >
          <Animated.View
            className="bg-accent border border-border justify-center items-center overflow-hidden"
            style={innerStyle}
          >
            {!isExpanded && (
              <View className='justify-center items-center'>
                {getIcon()}
              </View>
            )}

            {isExpanded && (
              <Animated.View
                className="absolute inset-0 px-4 py-3 flex-row items-center"
                style={contentStyle}
              >
                {getIcon() && (
                  <View className='mr-3'>{getIcon()}</View>
                )}

                <View className='flex-1 min-w-0'>
                  {title && (
                    <Text
                      className={cn(
                        "text-foreground text-lg font-opensans-semibold",
                        description ? "mb-0.5" : "mb-0",
                      )}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {title}
                    </Text>
                  )}
                  {description && (
                    <Text
                      className='text-muted-foreground text-base font-opensans'
                      numberOfLines={2}
                      ellipsizeMode='tail'
                    >
                      {description}
                    </Text>
                  )}
                </View>

                {action && (
                  <TouchableOpacity
                    onPress={action.onPress}
                    className={cn(
                      'ml-3 px-3 py-1.5 rounded-full',
                      getVariantColor()
                    )}
                  >
                    <Text
                      className='text-sm font-opensans-semibold text-foreground'
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={dismiss}
                  className='ml-2 p-1 rounded-lg'
                >
                  <Icon icon={X} className='size-4 text-muted-foreground' />
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

interface ToastContextType {
  toast: (toast: Omit<ToastData, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToast = useCallback(
    (toastData: Omit<ToastData, 'id'>) => {
      const id = generateId();
      const newToast: ToastData = {
        ...toastData,
        id,
        duration: toastData.duration ?? 4000,
      };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      // Auto dismiss after duration
      // if (newToast.duration && newToast.duration > 0) {
      //   setTimeout(() => {
      //     dismissToast(id);
      //   }, newToast.duration);
      // }
    },
    [maxToasts]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createVariantToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      addToast({
        title,
        description,
        variant,
      });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) =>
      createVariantToast('success', title, description),
    error: (title, description) =>
      createVariantToast('error', title, description),
    warning: (title, description) =>
      createVariantToast('warning', title, description),
    info: (title, description) =>
      createVariantToast('info', title, description),
    dismiss: dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}
        <View className='absolute inset-0 z-[1000] pointer-events-box-none' pointerEvents='box-none'>
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              {...toast}
              index={index}
              onDismiss={dismissToast}
            />
          ))}
        </View>
      </GestureHandlerRootView>
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
