import { useState } from "react";
import api from "../api";

function VerifyOtp({ userId }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const res = await api.post("/verifyOtp", { userId, otp });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Verify OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify}>Verify</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyOtp;
