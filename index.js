const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const profileSchema = new mongoose.Schema({
  userId: String,
  legalName: String,
  businessType: String,
  CIN: String,
  PAN: String,
  TAN: String,
  GST: String,
  address: String,
  founders: Array,
  industry: String,
  createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('company_profiles', profileSchema);

// POST - Save profile
app.post('/api/profile', async (req, res) => {
  const { userId, ...fields } = req.body;
  await Profile.findOneAndUpdate(
    { userId },
    { userId, ...fields },
    { upsert: true, new: true }
  );
  res.json({ success: true });
});

// GET - Check profile exists
app.get('/api/profile/:userId', async (req, res) => {
  const profile = await Profile.findOne({ userId: req.params.userId });
  res.json({ exists: !!profile, profile });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`NitiBot API running on port ${PORT}`));

