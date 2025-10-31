import Constants from "expo-constants";
const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
const handleResendCode = async ({ phoneNumber }: { phoneNumber: number }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/send_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: phoneNumber,
      }),
    });
    const data = response.json();
    return data;
  } catch (error) {
    return null;
  }
};
const handleVerifyOtp = async ({
  cleanPhone,
  verificationCode,
}: {
  cleanPhone: string;
  verificationCode: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/verify_otp`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: String(cleanPhone),
        otp: String(verificationCode),
      }),
    });
    return response;
  } catch (error: any) {
    return error;
  }
};
export { handleResendCode, handleVerifyOtp };
