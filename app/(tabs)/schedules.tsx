import { db } from "@/db/client";
import { addDummyData } from "@/db/dummy";
import { hardResetDatabase } from "@/db/reset";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Schedules = () => {
    return ( 
        <SafeAreaView>
            <Text>Schedules</Text>
            <Button title="reset database" onPress={() => hardResetDatabase(db)} />
            <Button title="Seed" onPress={() => addDummyData(db)} />
        </SafeAreaView>
     );
}
 
export default Schedules;