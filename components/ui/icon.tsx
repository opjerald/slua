import { cn, iconWithClassName } from "@/lib/utils";
import { LucideIcon, LucideProps } from "lucide-react-native";
import { Platform } from "react-native";

interface IconProps extends LucideProps {
    icon: LucideIcon
}

const Icon = ({ icon: LucideIcon, className, ...props }: IconProps) => {
    iconWithClassName(LucideIcon);

    const iconClassName = Platform.select({
        native: className,
    })

    return <LucideIcon className={cn(iconClassName)} {...props} />
}

export default Icon;