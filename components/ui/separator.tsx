import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  className,
}: SeparatorProps) {
  return (
    <View
      className={cn(
        "border border-border",
        orientation === "horizontal" ? "h-[1] w-full" : "h-full w-[1]",
        className,
      )}
    />
  );
}
