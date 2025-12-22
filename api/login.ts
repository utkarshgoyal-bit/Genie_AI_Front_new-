import Constants from "expo-constants";
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
const loginApi = async ({ phoneNumber }: { phoneNumber: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/send_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phoneNumber }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to send OTP");

    return data;
  } catch (error) {
    return error;
  }
};
export default loginApi;
