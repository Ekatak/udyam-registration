import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // To parse JSON body

// POST endpoint to save registration data
app.post("/register", async (req, res) => {
  try {
    const { aadhaar, aadhaarName, pan, panName } = req.body;

    // Basic validation
    if (!aadhaar || !aadhaarName || !pan || !panName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save data in MySQL using Prisma
    const registration = await prisma.registration.create({
      data: {
        aadhaar,
        aadhaarName,
        pan,
        panName,
      },
    });

    res.status(201).json({ message: "Registration saved", registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
