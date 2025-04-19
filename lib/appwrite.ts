import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('680361f3001916a45cce')
  .setPlatform('com.mmm.chatbot');

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

const appwriteConfig = {
  databaseId: "68036409001fe206b88e",
  userCollectionId: "68036420003a222645d6",
};

export { client, databases, ID };

export async function createUser(
  email: string,
  password: string,
  username: string
) {
  try {
    
    
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

    // Generate avatar URL
    const avatarUrl = avatars.getInitials(username);

    // Create user session
    await signIn(email, password);

    // Create user document
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl.toString(),
        messages: [],
      }
    );

    return newUser;
  } catch (error: any) {
    console.error("User creation error:", error);
    throw new Error(error?.message || "Failed to create user");
  }
}export async function signIn(email: string, password: string) {
  try {
    // Always attempt to clear any existing session first
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Ignore if no session exists to delete
      console.log("No session to delete");
    }
    
    // Wait a moment for the session deletion to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Now create a new session
    return await account.createEmailPasswordSession(email, password);
  } catch (error: any) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}


export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    return currentUser.documents[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOut() {
  try {
    // Clear all sessions, not just the current one
    await account.deleteSessions();
    
    // Clear any local state related to the user
    await AsyncStorage.removeItem('USER_SESSION');
    
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
