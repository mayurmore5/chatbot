import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { databases, ID, signOut } from "../../lib/appwrite"; // Import from appwrite.js
import { router } from "expo-router";

type ChatMessage = {
  from: "user" | "bot";
  text: string;
};

type ChatSession = {
  $id: string;
  messages: ChatMessage[];
  createdAt: string;
  $collectionId?: string;
  $databaseId?: string;
  $permissions?: string[];
};

const API_KEY = "AIzaSyDYeAC0xVA1lmBqRlq82J3sozBNiZBqEUA"; // <-- Replace with your Gemini API key!
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const STORAGE_KEY = "CHAT_HISTORY";

// Appwrite DB/Collection IDs
const DATABASE_ID = "68036409001fe206b88e";
const COLLECTION_ID = "68036420003a222645d6";

const Chatbot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pastChats, setPastChats] = useState<ChatSession[]>([]);
  const [showPastChats, setShowPastChats] = useState(false);

  // Load chat history from local storage on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setChatHistory(JSON.parse(saved));
    })();
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save chat session to Appwrite
  // Add to state
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  // Modified saveChatSession function
  const saveChatSession = async (messages: ChatMessage[]) => {
    try {
      if (currentSessionId) {
        // Update existing session document
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          currentSessionId,
          { messages: JSON.stringify(messages) }
        );
      } else {
        // Create new session document
        const newSessionId = ID.unique();
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          newSessionId,
          {
            messages: JSON.stringify(messages),
            createdAt: new Date().toISOString(),
          }
        );
        setCurrentSessionId(newSessionId);
      }
    } catch (error) {
      console.log("Error saving chat session:", error);
    }
  };

  // Send message to Gemini and update chat
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { from: "user", text: userInput };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setLoading(true);

    try {
      const response = await axios.post(GEMINI_URL, {
        contents: [{ parts: [{ text: userInput }] }],
      });

      const botReply: ChatMessage = {
        from: "bot",
        text:
          response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "No response",
      };

      const updatedHistory = [...newHistory, botReply];
      setChatHistory(updatedHistory);

      // Save session to Appwrite
      await saveChatSession(updatedHistory);
    } catch (e: any) {
      const errorMessage: ChatMessage = {
        from: "bot",
        text: "Error: " + (e?.message ?? "Unknown error"),
      };
      setChatHistory([...newHistory, errorMessage]);
    }

    setUserInput("");
    setLoading(false);
  };

  // Start new chat
  const startNewChat = async () => {
    setCurrentSessionId(""); // Reset session ID
    setChatHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  // Fetch past chats from Appwrite
  const fetchPastChats = async () => {
    try {
      const result = await databases.listDocuments(
        "68036409001fe206b88e",
        "68036420003a222645d6"
      );
      const parsedChats = result.documents.map((doc) => ({
        $id: doc.$id,
        messages: JSON.parse(doc.messages) as ChatMessage[],
        createdAt: doc.createdAt,
        // Explicitly include other fields if needed
        $collectionId: doc.$collectionId,
        $databaseId: doc.$databaseId,
        $permissions: doc.$permissions,
      }));
      setPastChats(parsedChats);
    } catch (error) {
      console.log("Error fetching past chats:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
  <View style={styles.leftButtons}>
    <TouchableOpacity
      style={styles.pastChatsButton}
      onPress={async () => {
        await fetchPastChats();
        setShowPastChats(true);
      }}
    >
      <Text style={styles.pastChatsButtonText}>See Past Chats</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.newChatButton} onPress={startNewChat}>
      <Text style={styles.newChatButtonText}>+ New Chat</Text>
    </TouchableOpacity>
  </View>
  <TouchableOpacity
    style={styles.signOutButton}
    onPress={async () => {
      try {
        await signOut();
        router.replace("/sign-in");
      } catch (error) {
        console.error("Sign out failed:", error);
      }
    }}
  >
    <Text style={styles.signOutText}>Sign Out</Text>
  </TouchableOpacity>
</View>

      {/* Past Chats Modal */}
      <Modal visible={showPastChats} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              paddingBottom: 5,
            }}
          >
            Past Chats
          </Text>
          <FlatList
            data={pastChats}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setChatHistory(item.messages);
                  setShowPastChats(false);
                }}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                }}
              >
                <Text>
                  Chat started: {new Date(item.createdAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setShowPastChats(false)}
            style={{ marginTop: 20 }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 15,
                textAlign: "center",
                backgroundColor: "gray",
                padding: 10,
                borderRadius: 8,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {chatHistory.length === 0 && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>What can I help you with?</Text>
        </View>
      )}
      <FlatList
        data={chatHistory}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.from === "user"
                ? styles.chatBubbleUser
                : styles.chatBubbleBot
            }
          >
            <Text
              style={
                item.from === "user" ? styles.chatTextUser : styles.chatTextBot
              }
            >
              {item.text}
            </Text>
          </View>
        )}
        style={styles.flatList}
      />
      <TextInput
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Type a message"
        style={styles.input}
        onSubmitEditing={sendMessage}
        editable={!loading}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        onPress={sendMessage}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#f0f4f8",
    justifyContent: "flex-end",
  },
  pastChatsButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderColor: "#007aff",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  pastChatsButtonText: {
    color: "#007aff",
    fontWeight: "bold",
    fontSize: 16,
  },
  newChatButton: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderColor: "#007aff",
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  newChatButtonText: {
    color: "#007aff",
    fontWeight: "bold",
    fontSize: 16,
  },
  welcomeContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  welcomeText: {
    fontSize: 20,
    color: "#555",
    fontWeight: "600",
    opacity: 0.7,
  },
  chatBubbleUser: {
    backgroundColor: "#007aff",
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  chatBubbleBot: {
    backgroundColor: "#e5e5ea",
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  chatTextUser: {
    color: "white",
    fontSize: 16,
  },
  chatTextBot: {
    color: "black",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 25,
    backgroundColor: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007aff",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  flatList: {
    flex: 1,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // Optionally, add marginTop if you want spacing from the very top
    marginBottom: 8,
    position: "relative",
    zIndex: 2,
  },
  leftButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Keep your existing styles for pastChatsButton, newChatButton, etc.
  signOutButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 10,
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Chatbot;
