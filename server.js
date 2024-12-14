// Import required modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Mongoose Schema
const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  maritalStatus: { type: String, required: true },
  panCardNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  correspondenceAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  emergencyContact: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  educationalInformation: [
    {
      qualification: { type: String, required: true },
      institution: { type: String, required: true },
      fromYear: { type: Number, required: true },
      toYear: { type: Number, required: true },
      percentage: { type: Number, required: true },
      fieldOfStudy: { type: String, required: true },
    },
  ],
  employmentDetails: [
    {
      previousOrganization: { type: String, required: true },
      designation: { type: String, required: true },
      fromDate: { type: Date, required: true },
      toDate: { type: Date, required: true },
      annualCTC: { type: Number, required: true },
      reasonToLeave: { type: String, required: true },
    },
  ],
  references: [
    {
      name: { type: String, required: true },
      organization: { type: String, required: true },
      designation: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  familyDetails: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      occupation: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
    },
  ],
  bankDetails: {
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    branchName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    providentFundNumber: { type: String, required: true },
    uanNumber: { type: String, required: true },
  },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

// API Endpoints

// Create Candidate
app.post("/api/candidates", async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).send(candidate);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get All Candidates
app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).send(candidates);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get Candidate by ID
app.get("/api/candidates/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate)
      return res.status(404).send({ message: "Candidate not found" });
    res.status(200).send(candidate);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Candidate
app.put("/api/candidates/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!candidate)
      return res.status(404).send({ message: "Candidate not found" });
    res.status(200).send(candidate);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Candidate
app.delete("/api/candidates/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate)
      return res.status(404).send({ message: "Candidate not found" });
    res.status(200).send({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
