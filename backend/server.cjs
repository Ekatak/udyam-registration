const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const twilio = require("twilio");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio client (optional - we are logging OTP in dev)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: 3307,
  database: "udyam_registration",
});

// ------------------- Send OTP -------------------
app.post("/api/send-otp", async (req, res) => {
  const { aadhaar, mobile } = req.body;

  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
    return res.json({ success: false, message: "Invalid Aadhaar number" });
  }

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.json({ success: false, message: "Invalid mobile number" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await db.query(
      `INSERT INTO otps (aadhaar, mobile, otp, expires_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?, aadhaar = ?`,
      [aadhaar, mobile, otp, expiresAt, otp, expiresAt, aadhaar]
    );

    console.log(`✅ OTP ${otp} generated for ${mobile}`);
    res.json({ success: true, message: "OTP generated successfully", otp });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
});

// ------------------- Verify OTP -------------------
app.post("/api/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM otps WHERE mobile = ?", [mobile]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "No OTP request found" });
    }

    const record = rows[0];

    if (new Date() > record.expires_at) {
      return res.json({ success: false, message: "OTP expired" });
    }

    if (otp !== record.otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Store Aadhaar in aadhaar_details1 after OTP verification
    await db.query(
      `INSERT INTO aadhaar_details1 (aadhaar, mobile)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE mobile = ?`,
      [record.aadhaar, mobile, mobile]
    );

    // Delete OTP after successful verification
    await db.query("DELETE FROM otps WHERE mobile = ?", [mobile]);

    res.json({ success: true, message: "OTP verified and Aadhaar stored successfully" });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.json({ success: false, message: "OTP verification failed" });
  }
});

// ------------------- Verify PAN -------------------
app.post("/api/verify-pan", async (req, res) => {
  const { mobile, pan, panName } = req.body;

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
    return res.json({ success: false, message: "Invalid PAN format" });
  }

  try {
    // Get Aadhaar linked to mobile from aadhaar_details1
    const [aadhaarRows] = await db.query(
      "SELECT aadhaar FROM aadhaar_details1 WHERE mobile = ?",
      [mobile]
    );

    if (aadhaarRows.length === 0) {
      return res.json({ success: false, message: "Aadhaar not found for this mobile" });
    }

    const aadhaar = aadhaarRows[0].aadhaar;

    // Check if PAN already exists in pan_details1
    const [existing] = await db.query("SELECT * FROM pan_details1 WHERE pan = ?", [pan]);
    if (existing.length > 0) {
      return res.json({ success: false, message: "PAN already registered" });
    }

    // Simulate PAN verification (replace with real API if needed)
    const isPanValid = true;
    if (!isPanValid) {
      return res.json({ success: false, message: "PAN not found or inactive" });
    }

    // Store PAN details linked to Aadhaar
    await db.query(
      "INSERT INTO pan_details1 (aadhaar, pan, pan_name) VALUES (?, ?, ?)",
      [aadhaar, pan, panName]
    );

    res.json({ success: true, message: "PAN verified and stored successfully" });
  } catch (error) {
    console.error("❌ Error verifying PAN:", error);
    res.json({ success: false, message: "PAN verification failed" });
  }
});

// ------------------- Start Server -------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
