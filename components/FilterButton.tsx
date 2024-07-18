import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";

type FilterButtonProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

const FilterButton = ({ title, isActive, onPress }: FilterButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          isActive && styles.filterButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  filterButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
});
