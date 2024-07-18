import { StyleSheet } from "react-native";
import { ListItem } from "@rneui/themed";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Task } from "@/types";
import RightActions from "./RightActions";
import { convertDateString } from "@/utils/TimeUtils";

type TaskListItem = {
  task: Task;
  onLongPress: () => void;
  onItemPressed: () => void;
  onDelete: () => void;
};

const TaskListItem = ({
  task,
  onLongPress,
  onItemPressed,
  onDelete,
}: TaskListItem) => {
  const isOverdue =
    new Date(task.dueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0) && !task.isFinished;

  return (
    <Swipeable
      renderRightActions={(progressAnimatedValue, dragAnimatedValue) => (
        <RightActions
          dragAnimatedValue={dragAnimatedValue}
          onDelete={onDelete}
        />
      )}
    >
      <ListItem onPress={onItemPressed} onLongPress={onLongPress} bottomDivider>
        <MaterialCommunityIcons
          name={
            task.isFinished
              ? "checkbox-marked-circle-outline"
              : "checkbox-blank-circle-outline"
          }
          size={24}
          color={task.isFinished ? "green" : "dimgray"}
        />
        <ListItem.Content
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ListItem.Title
            numberOfLines={1}
            style={[
              styles.taskTitle,
              {
                textDecorationLine: task.isFinished ? "line-through" : "none",
                color: task.isFinished ? "lightgray" : "dimgray",
              },
            ]}
          >
            {task.title}
          </ListItem.Title>
          <ListItem.Subtitle
            style={[
              styles.taskSubtitle,
              {
                color: task.isFinished
                  ? "lightgray"
                  : isOverdue
                  ? "red"
                  : "dimgray",
              },
            ]}
          >
            {convertDateString(task.dueDate)}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  taskTitle: {
    fontSize: 16,
    marginLeft: 10,
  },
  taskSubtitle: {
    fontSize: 12,
    marginLeft: 10,
  },
});

export default TaskListItem;
