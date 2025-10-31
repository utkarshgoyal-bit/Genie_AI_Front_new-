import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
export interface ProfileResponse {
  mobile: string;
}

export interface DeleteAccountResponse {
  message: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data: ProfileResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}/auth/delete_account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.statusText}`);
    }

    const data: DeleteAccountResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
