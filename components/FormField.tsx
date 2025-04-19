import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import Images from '../constants/images';

type FormFieldProps = {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: ViewStyle | ViewStyle[];
} & TextInputProps;

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = title.toLowerCase() === "password";

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? Images.eye.eye : Images.eye.eyeHide}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#d1d5db", // text-gray-100
    fontWeight: "500",
    marginBottom: 6,
  },
  inputWrapper: {
    width: "100%",
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: "#1a1a1a", // bg-black-100
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: "#232533", // border-black-200
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
});

export default FormField;
