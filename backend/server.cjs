const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------- Aadhaar Verification -------------------
app.post("/api/aadhaar-verify", (req, res) => {
  const { aadhaar, name } = req.body;

  // Basic validation
  if (!aadhaar || !/^\d{12}$/.test(aadhaar) || !name.trim()) {
    return res.json({ success: false, message: "Invalid Aadhaar or name" });
  }

  // Simulated: Aadhaar exists and OTP is sent
  const requestId = Math.random().toString(36).substring(2, 10); // random request ID
  console.log(`OTP sent for Aadhaar: ${aadhaar} | Request ID: ${requestId}`);

  res.json({
    success: true,
    message: "OTP sent successfully",
    data: { requestId },
  });
});

// ------------------- OTP Verification -------------------
app.post("/api/otp-verify", (req, res) => {
  const { aadhaar, otp, requestId } = req.body;

  // In real flow, validate OTP via provider
  if (!otp || otp !== "123456") {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  console.log(`OTP verified for Aadhaar: ${aadhaar} | Request ID: ${requestId}`);

  res.json({ success: true, message: "OTP verified successfully" });
});

// ------------------- PAN Verification -------------------
app.post("/api/pan-verify", (req, res) => {
  const { pan, panName } = req.body;

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan) || !panName.trim()) {
    return res.json({ success: false, message: "Invalid PAN details" });
  }

  console.log(`PAN verified: ${pan} | Name: ${panName}`);

  res.json({ success: true, message: "PAN verified successfully" });
});

// ------------------- Final Registration Submission -------------------
app.post("/api/complete-registration", (req, res) => {
  const { aadhaar, aadhaarName, pan, panName } = req.body;

  if (!aadhaar || !aadhaarName || !pan || !panName) {
    return res.json({ success: false, message: "Incomplete data" });
  }

  console.log(`Registration Completed:
    Aadhaar: ${aadhaar} (${aadhaarName})
    PAN: ${pan} (${panName})
  `);

  res.json({ success: true, message: "Registration completed successfully" });
});

// ------------------- Start Server -------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
