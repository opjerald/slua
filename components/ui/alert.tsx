
import { cn } from '@/lib/utils';
import React from 'react';
import { Alert as RNAlert, Text, View } from 'react-native';

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

// Visual Alert Component (existing functionality)
export function Alert({ children, variant = 'default', className }: AlertProps) {
  return (
    <View
      className={cn(
        "rounded-3xl p-6 border bg-card",
        variant === "destructive" ? "border-destructive" : "border-border",
        className
      )}
    >
      {children}
    </View>
  );
}

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertTitle({ children, className }: AlertTitleProps) {
  return (
    <Text className={cn("text-foreground text-2xl font-opensans-bold", className)}>
      {children}
    </Text>
  );
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <Text
      className={cn(
        'mt-2 text-muted-foreground text-base font-opensans',
        className,
      )}
    >
      {children}
    </Text>
  );
}

// Native Alert Functions
interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface NativeAlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
}

// Two-button native alert
export const createTwoButtonAlert = (options: NativeAlertOptions) => {
  const { title, message, buttons } = options;

  const defaultButtons: AlertButton[] = [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => console.log('OK Pressed'),
    },
  ];

  RNAlert.alert(title, message, buttons || defaultButtons);
};

// Three-button native alert
export const createThreeButtonAlert = (options: NativeAlertOptions) => {
  const { title, message, buttons } = options;

  const defaultButtons: AlertButton[] = [
    {
      text: 'Ask me later',
      onPress: () => console.log('Ask me later pressed'),
    },
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => console.log('OK Pressed'),
    },
  ];

  RNAlert.alert(title, message, buttons || defaultButtons);
};

// Generic native alert function
export const showNativeAlert = (options: NativeAlertOptions) => {
  const { title, message, buttons, cancelable = true } = options;

  if (!buttons || buttons.length === 0) {
    // Simple alert with just OK button
    RNAlert.alert(title, message, [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ]);
  } else {
    RNAlert.alert(title, message, buttons, { cancelable });
  }
};

// Convenience functions for common alert types
export const showSuccessAlert = (
  title: string,
  message?: string,
  onOk?: () => void
) => {
  showNativeAlert({
    title,
    message,
    buttons: [
      {
        text: 'OK',
        onPress: onOk || (() => console.log('Success acknowledged')),
      },
    ],
  });
};

export const showErrorAlert = (
  title: string,
  message?: string,
  onOk?: () => void
) => {
  showNativeAlert({
    title,
    message,
    buttons: [
      {
        text: 'OK',
        onPress: onOk || (() => console.log('Error acknowledged')),
        style: 'destructive',
      },
    ],
  });
};

export const showConfirmAlert = (
  title: string,
  message?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
showNativeAlert({
    title,
    message,
    buttons: [
      {
        text: 'Cancel',
        onPress: onCancel || (() => console.log('Cancelled')),
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: onConfirm || (() => console.log('Confirmed')),
      },
    ],
  });
};

// Export the React Native Alert for direct use
export { RNAlert as NativeAlert };
