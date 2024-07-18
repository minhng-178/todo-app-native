import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Reanimated, { CurvedTransition } from "react-native-reanimated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Task } from "@/types";
import { Stack } from "expo-router";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "@/api/task";
import Colors from "@/constants/Colors";
import TaskListItem from "@/components/TaskListItem";
import DialogAddTask from "@/components/DialogAddTask";
import EmptyState from "@/components/EmptyState";
import FilterButton from "@/components/FilterButton";

export default function TabOneScreen() {
  const queryClient = useQueryClient();
  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [tab, setTab] = useState<"All" | "Todo" | "Finished">("All");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const headerHeight = useHeaderHeight();

  const filteredTasks = tasks
    ?.filter((task) => {
      if (task.isFinished && tab === "Todo") {
        return false;
      }
      if (!task.isFinished && tab === "Finished") {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return task.title
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim());
    })
    ?.sort((a, b) => {
      return a.dueDate > b.dueDate ? 1 : -1;
    });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      itemId,
      title,
      dueDate,
    }: {
      itemId: string;
      title: string;
      dueDate: Date;
    }) => updateTask(itemId, title, dueDate),
    onSuccess: () => {
      Toast.show({ text1: "Task updated.", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({
      itemId,
      isFinished,
    }: {
      itemId: string;
      isFinished: boolean;
    }) => updateTaskStatus(itemId, isFinished),
    onMutate: async ({ itemId, isFinished }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      if (previousTasks) {
        queryClient.setQueryData(
          ["tasks"],
          previousTasks.map((task) =>
            task.id === itemId ? { ...task, isFinished } : task
          )
        );
      }
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      console.error("Mutation Error:", err);
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
      Toast.show({ text1: "Failed to update task status", type: "error" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  const deleteTaskMutation = useMutation({
    mutationFn: (itemId: string) => deleteTask(itemId),
    onSuccess: () => {
      Toast.show({ text1: "Task deleted.", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ title, dueDate }: { title: string; dueDate: Date }) =>
      createTask(title, dueDate),
    onSuccess: () => {
      Toast.show({ text1: "Task added.", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onItemPressed = (itemId: string) => {
    if (!tasks) {
      return;
    }

    const task = filteredTasks?.find((task) => task.id === itemId);
    if (!task) {
      console.error(`Task with id ${itemId} not found in tasks array.`);
      return;
    }
    const isFinished = task.isFinished;

    updateTaskStatusMutation.mutate({
      itemId,
      isFinished: !isFinished,
    });
  };

  const handleDeleteTask = (itemId: string) => {
    if (tasks === undefined) {
      return;
    }
    deleteTaskMutation.mutate(itemId);
  };

  const toggleDialog = (task: Task | null = null) => {
    if (task?.isFinished === true) {
      return;
    }

    setSelectedTask(task);
    setDialogVisible(!isDialogVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => toggleDialog(null)}>
              {({ pressed }) => (
                <FontAwesome
                  name='plus-circle'
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />

      <SearchBar
        containerStyle={{ backgroundColor: "transparent" }}
        placeholder='Search tasks...'
        value={searchQuery}
        onChangeText={(e) => setSearchQuery(e)}
        round={true}
        lightTheme={true}
        showCancel={true}
        showLoading={false}
      />

      <SafeAreaView
        edges={["bottom"]}
        style={{ flex: 1, paddingTop: headerHeight - 75 }}
      >
        <View style={styles.filterBar}>
          <FilterButton
            title='All'
            isActive={tab === "All"}
            onPress={() => setTab("All")}
          />
          <FilterButton
            title='Todo'
            isActive={tab === "Todo"}
            onPress={() => setTab("Todo")}
          />
          <FilterButton
            title='Finished'
            isActive={tab === "Finished"}
            onPress={() => setTab("Finished")}
          />
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(index) => index.id.toString()}
          renderItem={({ item, index }) => (
            <Reanimated.View layout={CurvedTransition}>
              <TaskListItem
                task={item}
                onItemPressed={() => onItemPressed(item.id)}
                onLongPress={() => toggleDialog(item)}
                onDelete={() => handleDeleteTask(item.id)}
              />
            </Reanimated.View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title='No task found'
              subtitle='Please add your new task'
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        <DialogAddTask
          isVisible={isDialogVisible}
          onClose={() => toggleDialog(null)}
          task={selectedTask}
          createTaskMutation={createTaskMutation}
          editTaskMutation={updateTaskMutation}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});
