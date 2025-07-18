import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Schedules = () => {
  return (
    <SafeAreaView>
      <Text>Schedules</Text>
      <Alert variant="destructive" className="mx-5">
        <AlertTitle>This is a title</AlertTitle>
        <AlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur autem nisi odio libero. Tempora non facilis ad vitae porro vel!</AlertDescription>
      </Alert>
    </SafeAreaView>
  );
};

export default Schedules;
