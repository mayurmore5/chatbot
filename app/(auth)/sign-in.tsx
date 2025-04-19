import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { getCurrentUser, signIn } from "../../lib/appwrite";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const windowHeight = Dimensions.get("window").height;

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      await getCurrentUser();
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.container, { minHeight: windowHeight - 100 }]}>
          <Image
            source={images.chatbot}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.title}>Log in to MyBot</Text>

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
            title="Sign In"
            handlePress={submit}
            containerStyles={styles.button}
            isLoading={isSubmitting}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Link href="/sign-up" style={styles.footerLink}>
              Sign up
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
  },
});

export default SignIn;
