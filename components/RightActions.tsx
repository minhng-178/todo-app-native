import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, Animated } from "react-native";
const AnimatedView = Animated.createAnimatedComponent(View);

type RightActionsProps = {
  dragAnimatedValue: Animated.AnimatedInterpolation<string | number>;
  onDelete: () => void;
};

const RightActions = ({ dragAnimatedValue, onDelete }: RightActionsProps) => {
  const animatedStyles = {
    transform: [
      {
        translateX: dragAnimatedValue.interpolate({
          inputRange: [-40, 0],
          outputRange: [0, 40],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  return (
    <AnimatedView style={[styles.animatedView, animatedStyles]}>
      <MaterialCommunityIcons
        onPress={onDelete}
        name='delete'
        size={20}
        color='white'
      />
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: "crimson",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});

export default RightActions;
