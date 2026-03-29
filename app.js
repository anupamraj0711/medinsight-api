/*
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// MAIN ANALYZE ROUTE
app.post("/analyze", async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ error: "Report text is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a clinical assistant AI.

Analyze the following input. It may be symptoms, report, or prescription.

Return ONLY valid JSON. No explanation. No markdown.

Format:
{
  "summary": "",
  "possible_condition": "",
  "risk_level": "",
  "recommendations": []
}

Input:
${report}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let aiText = response.data.choices[0].message.content;

    // 🔥 CLEAN AI RESPONSE
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = { ai_response: aiText };
    }

    res.json(parsed);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

*/

/*
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed
    });

    await user.save();

    res.json({ message: "User registered" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// MAIN ANALYZE ROUTE
app.post("/analyze", async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ error: "Report text is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a clinical assistant AI.

Analyze the following input. It may be symptoms, report, or prescription.

Return ONLY valid JSON. No explanation. No markdown.

Format:
{
  "summary": "",
  "possible_condition": "",
  "risk_level": "",
  "recommendations": []
}

Input:
${report}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let aiText = response.data.choices[0].message.content;

    // 🔥 CLEAN AI RESPONSE
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = { ai_response: aiText };
    }

    res.json(parsed);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
*/

/*
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
  try {
    //const { name, email, password } = req.body;
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role // 🔥 SAVE ROLE
    });


    await user.save();

    res.json({ message: "User registered" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //res.json({ token });
    res.json({
        token,
        role: user.role // 🔥 IMPORTANT
});

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// MAIN ANALYZE ROUTE
app.post("/analyze", async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ error: "Report text is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a clinical assistant AI.

Analyze the following input. It may be symptoms, report, or prescription.

Return ONLY valid JSON. No explanation. No markdown.

Format:
{
  "summary": "",
  "possible_condition": "",
  "risk_level": "",
  "recommendations": []
}

Input:
${report}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let aiText = response.data.choices[0].message.content;

    // 🔥 CLEAN AI RESPONSE
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = { ai_response: aiText };
    }

    res.json(parsed);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

*/
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ STRONG VALIDATION
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: role === "doctor" ? "doctor" : "patient" // 🔥 FIXED
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Enter email & password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // 🔥 role added inside token
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// ================= ANALYZE =================
app.post("/analyze", async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ error: "Report text is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a clinical assistant AI.

Return ONLY JSON:
{
  "summary": "",
  "possible_condition": "",
  "risk_level": "",
  "recommendations": []
}

Input:
${report}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let aiText = response.data.choices[0].message.content;

    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = { ai_response: aiText };
    }

    res.json(parsed);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});