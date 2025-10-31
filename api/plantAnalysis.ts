import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosProgressEvent } from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;

const plantAnalysisApi = async ({
  formData,
  token,
  onUploadProgress,
}: {
  formData: any;
  token?: string;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
}) => {
  try {
    const token = await AsyncStorage.getItem("access_token");

    if (!token) {
      router.navigate("/phoneVerification");
      alert("You are not logged in. Please login first.");
      return null;
    }

    const response = await axios.post(`${BASE_URL}/analyze/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress,
    });
    return response?.data?.data;
  } catch (err: any) {
    throw err;
  }
};

export { plantAnalysisApi };
