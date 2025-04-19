import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  StyleSheet,
} from "react-native";

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const windowHeight = Dimensions.get("window").height;

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username);
      router.replace("/sign-in");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.container,
            { minHeight: windowHeight - 100 },
          ]}
        >
          <Image
            source={images.chatbot}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.title}>Sign Up to Aora</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.formFieldFirst}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.formField}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.formField}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Have an account already?
            </Text>
            <Link href="/sign-in" style={styles.footerLink}>
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622", // bg-primary
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 16, // px-4
    marginVertical: 24, // my-6
  },
  logo: {
    width: 115,
    height: 34,
  },
  title: {
    fontSize: 24, // text-2xl
    color: "#fff",
    fontWeight: "600", // font-semibold
    marginTop: 40, // mt-10
  },
  formFieldFirst: {
    marginTop: 40, // mt-10
  },
  formField: {
    marginTop: 28, // mt-7
  },
  button: {
    marginTop: 28, // mt-7
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8, // gap-2
    paddingTop: 20, // pt-5
  },
  footerText: {
    fontSize: 16, // text-lg
    color: "#d1d5db", // text-gray-100
  },
  footerLink: {
    fontSize: 16, // text-lg
    color: "#38bdf8", // text-secondary
    fontWeight: "600", // font-psemibold
    marginLeft: 8,
  },
});

export default SignUp;
