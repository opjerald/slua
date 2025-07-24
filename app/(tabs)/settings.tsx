import { ActionSheet } from "@/components/ui/action-sheet";
import Icon from "@/components/ui/icon";
import { Edit2, Eye, Trash } from "lucide-react-native";
import { useState } from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const [visible, setVisible] = useState(false);
  return (
    <SafeAreaView>
      <Button title="Open Action Sheet" onPress={() => setVisible(true)} />
      <ActionSheet
        title="Choose an action"
        visible={visible}
        onClose={() => setVisible(false)}
        options={[
          {
            title: "View",
            onPress: () => console.log("View"),
            icon: <Icon icon={Eye} className="text-foreground" />,
          },
          {
            title: "Edit",
            onPress: () => console.log("Edit"),
            icon: <Icon icon={Edit2} className="text-foreground" />,
          },
          {
            title: "Delete",
            onPress: () => console.log("delete"),
            icon: <Icon icon={Trash} className="text-destructive" />,
            destructive: true,
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default Settings;
