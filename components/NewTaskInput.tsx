import { useState } from "react";
import * as Crypto from "expo-crypto";
import { View, TextInput, StyleSheet } from "react-native";

import { Task } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type NewTaskInput = {};

const NewTaskInput = ({}: NewTaskInput) => {
  const [newTask, setNewTask] = useState("");
  const crypto = Crypto.getRandomValues(new Uint32Array(1))[0];
  return (
    <View style={styles.taskContainer}>
      <MaterialCommunityIcons
        name='checkbox-blank-circle-outline'
        size={24}
        color='dimgray'
      />
      <TextInput
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
        placeholder='Todo...'
        onEndEditing={() => {
          if (!newTask) {
            return;
          }
          setNewTask("");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    fontFamily: "InterSemi",
    color: "dimgray",
    fontSize: 15,
    flex: 1,
  },
});

export default NewTaskInput;
