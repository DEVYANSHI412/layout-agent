const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  const { message, layout, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `You are a layout transformation agent for a design tool.
You will receive a design JSON and a user instruction. You must update the JSON based on the instruction.

IMPORTANT RULES:
1. Always return ONLY a valid JSON object, nothing else, no extra text
2. The JSON must have this exact structure: { "updatedLayout": {...}, "message": "what you did" }
3. When moving elements UP, decrease the y value and ny value
4. When moving elements DOWN, increase the y value and ny value  
5. When making text SMALLER, decrease fontSize in style.visual
6. When making text BIGGER, increase fontSize in style.visual
7. When converting to 9:16, change artboard height to 1920, keep width 1080, then recompute ALL children x,y,width,height using their nx,ny,nw,nh values multiplied by new dimensions
8. nx,ny,nw,nh are normalized values (0 to 1) - always update both absolute AND normalized values together

SEMANTIC ROLES:
- "Background.png" = background image
- "Product.png" = main product image  
- "Luxury Comfort..." text = headline
- "Comfort that defines..." text = subheadline
- "20% OFF" text = discount badge
- "Limited time offer" text = offer text
- circle shape = badge background
- "Over 8,000 happy homes" = social proof
- Small vector images = star/rating icons

Always keep the full original JSON structure intact, only modify what is needed.
Return ONLY raw JSON, no markdown, no backticks, no explanation outside JSON.`;

    const fullPrompt = `${systemPrompt}

Current layout JSON:
${JSON.stringify(layout, null, 2)}

User instruction: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const rawText = result.response.text();

    // JSON nikalo response se
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/```json\n?([\s\S]*?)\n?```/) ||
                    rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[1] || match[0]);
      } else {
        throw new Error('Valid JSON nahi mila response mein');
      }
    }

    res.json({
      updatedLayout: parsed.updatedLayout,
      assistantMessage: parsed.message || 'Layout update ho gaya!'
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} pe`);
});