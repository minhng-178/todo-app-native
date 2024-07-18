import { Dialog, Text } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Task } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { convertDateString } from "@/utils/TimeUtils";

type DialogAddTaskProps = {
  isVisible: boolean;
  onClose: () => void;
  task: Task | null;
  createTaskMutation: any;
  editTaskMutation: any;
};

const DialogAddTask = ({
  isVisible,
  onClose,
  task,
  createTaskMutation,
  editTaskMutation,
}: DialogAddTaskProps) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDueDate(new Date(task.dueDate));
    } else {
      setTitle("");
      setDueDate(new Date());
    }
  }, [task]);

  const handleSave = () => {
    if (!validateInput()) {
      return;
    }

    const taskData = {
      title,
      dueDate: dueDate.toISOString(),
    };

    if (task) {
      editTaskMutation.mutate({
        itemId: task.id,
        ...taskData,
      });
    } else {
      createTaskMutation.mutate(taskData);
    }
    handleReset();
  };

  const validateInput = () => {
    setError("");
    if (!title) {
      setError("Title is required");
      return false;
    } else if (title.length > 30) {
      setError("Title must be less than 30 characters");
      return false;
    } else if (dueDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      setError("Due date cannot be in the past");
      return false;
    }
    return true;
  };

  const handleReset = () => {
    onClose();
    setTitle("");
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  return (
    <Dialog isVisible={isVisible} onBackdropPress={handleReset}>
      <Dialog.Title title={task ? "Edit task" : "Add new task"} />
      <TextInput
        style={styles.textInput}
        placeholder='Todo...'
        value={title}
        onChangeText={setTitle}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text onPress={() => setShowDatePicker(true)} style={styles.textButton}>
          <FontAwesome name='calendar-times-o' size={18} /> Due date
        </Text>
        <Text style={styles.label}>
          {convertDateString(dueDate?.toISOString())}
        </Text>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode='date'
          display='default'
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      <Text style={{ color: "red" }}>{error}</Text>
      <Dialog.Actions>
        <Button title={task ? "Save" : "Add"} onPress={handleSave} />
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogAddTask;

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 10,
    padding: 5,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
});
