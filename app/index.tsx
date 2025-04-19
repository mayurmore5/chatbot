import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { router, SplashScreen } from "expo-router";
import { View, Text, Image, ScrollView, Button, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Images from '../constants/images';

const { width } = Dimensions.get('window');

const index = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Image
            source={Images.chatbot}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text style={styles.highlightText}>MyBot</Text>
            </Text>
          </View>

          <Text style={styles.subtitle}>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with MyBot
          </Text>

          <View style={styles.buttonContainer}>
            <Button 
              title="Continue with Email"
              onPress={() => router.push("/sign-in")}
              color="#38bdf8"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#161622", // bg-primary
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    height: "100%",
  },
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 130,
    height: 84,
    marginBottom: 16,
  },
  heroImage: {
    width: width > 380 ? 380 : width - 32, // max-w-[380px] w-full
    height: 298,
    marginBottom: 16,
  },
  titleContainer: {
    marginTop: 20,
    position: "relative",
  },
  titleText: {
    fontSize: 30, // text-3xl
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  highlightText: {
    color: "#38bdf8", // text-secondary-200
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "System", // fallback for font-pregular
    color: "#d1d5db", // text-gray-100
    marginTop: 28,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
    width: "100%",
    maxWidth: 380,
    borderRadius:"20%",
  },
});

export default index;
