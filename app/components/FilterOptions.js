import React, { useContext, useEffect, useState } from "react";
import { View, Text, Switch } from "react-native";

import { MapContext } from "../MapContext";
import { StyleSheet } from "react-native";

export default function FilterOptions() {
  const { selectedFilter, handle1, handle2, handle3 } = useContext(MapContext);

  const [option1Selected, setOption1Selected] = useState(true);
  const [option2Selected, setOption2Selected] = useState(false);
  const [option3Selected, setOption3Selected] = useState(false);

  const handleToggle1 = () => {
    setOption1Selected(!option1Selected);
    setOption2Selected(false);
    setOption3Selected(false);
  };
  const handleToggle2 = () => {
    setOption1Selected(false);
    setOption2Selected(!option2Selected);
    setOption3Selected(false);
  };
  const handleToggle3 = () => {
    setOption1Selected(false);
    setOption2Selected(false);
    setOption3Selected(!option3Selected);
  };

  useEffect(() => {
    if (!option1Selected && !option2Selected && !option3Selected) {
      setOption1Selected(true);
    }
    if (option1Selected) handle1();
    else if (option2Selected) handle2();
    else handle3();
  }, [option1Selected, option2Selected, option3Selected]);

  const styles = StyleSheet.create({
    filterWrapper: {
      // flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
    },
    filterOptionContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
  });
  return (
    <View style={styles.filterWrapper}>
      <View style={styles.filterOptionContainer}>
        <Text>Option-1</Text>
        <Switch
          trackColor={{ false: "#81b0ff", true: "#D4E6FF" }}
          thumbColor={option1Selected ? "#8AB9FF" : "#E5EFFE"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggle1}
          value={option1Selected}
        />
      </View>
      <View style={styles.filterOptionContainer}>
        <Text>Option-2</Text>
        <Switch
          trackColor={{ false: "#81b0ff", true: "#D4E6FF" }}
          thumbColor={option2Selected ? "#8AB9FF" : "#E5EFFE"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggle2}
          value={option2Selected}
        />
      </View>
      <View style={styles.filterOptionContainer}>
        <Text>Option-3</Text>
        <Switch
          trackColor={{ false: "#81b0ff", true: "#D4E6FF" }}
          thumbColor={option3Selected ? "#8AB9FF" : "#E5EFFE"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggle3}
          value={option3Selected}
        />
      </View>
    </View>
  );
}
