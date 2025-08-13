import React, { useState } from "react";

export default function OtpTest() {
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("Sending OTP...");
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaar, mobile }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    setMessage("Verifying OTP...");
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error verifying OTP");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>OTP Test Page</h2>

      <input
        type="text"
        placeholder="Aadhaar Number"
        value={aadhaar}
        onChange={(e) => setAadhaar(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <br /><br />

      <button onClick={sendOtp}>Send OTP</button>
      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <br /><br />

      <button onClick={verifyOtp}>Verify OTP</button>

      <p>{message}</p>
    </div>
  );
}
