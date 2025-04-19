import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

type CustomButtonProps = {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: ViewStyle | ViewStyle[];
  textStyles?: TextStyle | TextStyle[];
  isLoading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = {},
  textStyles = {},
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        containerStyles,
        isLoading && styles.disabledButton,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#38bdf8", // bg-secondary
    borderRadius: 16, // rounded-xl
    minHeight: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#161622", // text-primary
    fontWeight: "600",
    fontSize: 18, // text-lg
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CustomButton;
