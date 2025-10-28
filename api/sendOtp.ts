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
    console.error(error);
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
    console.log("Sending verify request:", {
      mobile: String(cleanPhone),
      otp: String(verificationCode),
    });

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
    console.log("Verify OTP response:", response);
    return response;
  } catch (error: any) {
    console.error(error?.message);
    return error;
  }
};
export { handleResendCode, handleVerifyOtp };
