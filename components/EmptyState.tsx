import React from "react";
import { Image, Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

import { Images } from "@/constants/Images";

type EmptyStateProps = {
  title: string;
  subtitle: string;
};
const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={Images.EmptyState}
        resizeMode='contain'
        style={styles.image}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
});
