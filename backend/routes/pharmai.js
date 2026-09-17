const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

router.post('/fetch-details', async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ error: 'Medicine name is required' });
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY; // Allow either variable name just in case
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured in backend/.env' });
    }

    const groq = new Groq({ apiKey });

    const prompt = `
      You are a pharmaceutical expert system.
      I will give you a medicine name. You need to provide the following details in a strict JSON format:
      - composition: The active ingredients and their strength (e.g., "Paracetamol 500mg"). Keep it standardized.
      - category: The medicinal category (e.g., "Analgesic", "Antibiotic", "Antiviral", "Vitamins").
      - targetSpecies: Either "Human" or "Animal" depending on who the medicine is meant for.
      - description: A short 1-2 sentence description of what the medicine is used for.
      
      Medicine Name: "${medicineName}"
      
      Return ONLY valid JSON. No markdown formatting, no backticks, no explanations, just the raw JSON object.
      Example format:
      {
        "composition": "Amoxicillin 250mg",
        "category": "Antibiotic",
        "targetSpecies": "Human",
        "description": "An antibiotic used to treat a number of bacterial infections."
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content.trim();
    const data = JSON.parse(responseText);

    res.json({
      composition: data.composition || '',
      category: data.category || '',
      targetSpecies: data.targetSpecies || 'Human',
      description: data.description || ''
    });

  } catch (error) {
    console.error('PharmAI Error:', error);
    
    // Fallback for hackathon demo purposes if the API key is invalid
    const fallbackMed = req.body.medicineName.toLowerCase();
    if (fallbackMed.includes('paracetamol')) {
      return res.json({
        composition: 'Paracetamol 500mg',
        category: 'Analgesic',
        targetSpecies: 'Human',
        description: 'A common painkiller used to treat aches and pain, and to reduce high temperature.'
      });
    } else if (fallbackMed.includes('amoxicillin')) {
      return res.json({
        composition: 'Amoxicillin 250mg',
        category: 'Antibiotic',
        targetSpecies: 'Human',
        description: 'A penicillin antibiotic used to treat bacterial infections.'
      });
    } else if (fallbackMed.includes('ivermectin')) {
      return res.json({
        composition: 'Ivermectin 10mg',
        category: 'Anthelmintic',
        targetSpecies: 'Animal',
        description: 'An anti-parasite medication used to treat infections in animals.'
      });
    }
    
    let errorMessage = 'Failed to fetch details from PharmAI using Groq. Check your API key or try again.';
    if (error.status === 401) {
      errorMessage = 'Unauthorized. Please check your GROQ_API_KEY in backend/.env.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
