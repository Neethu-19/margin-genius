const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const path = require('path');
const dashboardData = require(path.join(__dirname, '../routes/dashboard.js'));

// Helper to get top 10 margin loss products from mock data
function getTopMarginLossProducts() {
  // Use mockProducts from dashboard.js
  const products = dashboardData.mockProducts || [];
  return products
    .filter(p => typeof p.margin === 'number')
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 10)
    .map((p, i) => `${i + 1}. ${p.name} (Current margin: ${p.margin}%, Change: ${p.marginDelta}%)`)
    .join('\n');
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Mock AI responses for different query types
const generateAIResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('top') && lowerQuery.includes('lost margin')) {
    return {
      response: "Here are the top 10 items that lost margin this month:\n\n1. Fresh Strawberries (-6.5% margin)\n2. Organic Milk (-2.1% margin)\n3. Imported Cheese (-1.8% margin)\n4. Avocados (-1.5% margin)\n5. Bell Peppers (-1.2% margin)\n\nPrimary causes: Increased COGS due to supply chain issues and higher shrink rates in produce. I recommend reviewing pricing strategies and supplier contracts for these items.",
      suggestions: [
        { type: 'price_adjustment', product: 'Fresh Strawberries', impact: 0.15 },
        { type: 'supplier_change', product: 'Organic Milk', impact: 0.08 }
      ]
    };
  }
  
  if (lowerQuery.includes('tariff') && lowerQuery.includes('affected')) {
    return {
      response: "Categories most affected by tariffs:\n\n• **Beverages** (2.1% tariff impact) - Coffee beans, tea imports\n• **Pantry** (1.8% tariff impact) - Olive oil, pasta, canned goods\n• **Electronics** (1.5% tariff impact) - Small appliances\n\nTotal tariff impact across all categories: $2.3M monthly. Consider sourcing alternatives or adjusting prices to offset these costs.",
      suggestions: [
        { type: 'supplier_change', category: 'Beverages', impact: 0.25 },
        { type: 'price_adjustment', category: 'Pantry', impact: 0.18 }
      ]
    };
  }
  
  if (lowerQuery.includes('beverage') && lowerQuery.includes('florida')) {
    return {
      response: "Beverage margins in Florida are falling due to:\n\n• **Increased transportation costs** (+15% fuel surcharges)\n• **Higher shrink rates** (3.2% vs 1.8% national average)\n• **Competitive pricing pressure** from local competitors\n• **Supply chain delays** affecting freshness\n\nRecommendations:\n- Review pricing strategy for Florida market\n- Optimize delivery routes to reduce fuel costs\n- Implement better inventory management to reduce shrink",
      suggestions: [
        { type: 'price_adjustment', region: 'Florida', impact: 0.12 },
        { type: 'logistics_optimization', region: 'Florida', impact: 0.08 }
      ]
    };
  }
  
  if (lowerQuery.includes('negative margin')) {
    return {
      response: "Products currently with negative margins:\n\n🚨 **Critical Issues:**\n• Fresh Strawberries (-6.5% margin)\n• Organic Milk (-2.1% margin)\n• Imported Cheese (-1.8% margin)\n\n**Immediate Actions Needed:**\n1. Review pricing strategy\n2. Negotiate with suppliers\n3. Consider product discontinuation\n4. Implement shrink reduction measures\n\nTotal potential loss: $45K monthly if not addressed.",
      suggestions: [
        { type: 'urgent_review', products: ['Fresh Strawberries', 'Organic Milk'] },
        { type: 'supplier_negotiation', products: ['Imported Cheese'] }
      ]
    };
  }
  
  if (lowerQuery.includes('supplier') && lowerQuery.includes('cost increase')) {
    return {
      response: "Suppliers with highest cost increases:\n\n🏭 **Top Increases:**\n1. Mediterranean Imports (+12% - olive oil)\n2. Global Coffee Inc (+8% - coffee beans)\n3. Berry Farms LLC (+6% - fresh produce)\n4. Local Dairy Co (+5% - dairy products)\n\n**Root Causes:**\n• Raw material cost inflation\n• Transportation cost increases\n• Labor cost pressures\n• Currency fluctuations\n\n**Actions:**\n• Renegotiate contracts\n• Explore alternative suppliers\n• Consider bulk purchasing discounts",
      suggestions: [
        { type: 'contract_negotiation', suppliers: ['Mediterranean Imports'] },
        { type: 'alternative_sourcing', suppliers: ['Global Coffee Inc'] }
      ]
    };
  }
  
  return {
    response: "I understand you're asking about margin analysis. I can help you with:\n\n• Product margin trends and analysis\n• Identifying at-risk items\n• Tariff impact assessment\n• Supplier cost analysis\n• Pricing recommendations\n• Shrink rate analysis\n\nPlease try asking a more specific question about margins, products, or categories.",
    suggestions: []
  };
};

// POST /api/chat/message - Send a message to the AI assistant
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const userMessage = message.toLowerCase();
    let dataContext = "";
    if (
      userMessage.includes("top") &&
      userMessage.includes("margin") &&
      (userMessage.includes("lost") || userMessage.includes("loss"))
    ) {
      dataContext =
        "Here are the top 10 items that lost margin this month:\n" +
        getTopMarginLossProducts();
    }

    // Build a single prompt with user question and data as context
    const prompt = `You are MarginIQ, Walmart's margin intelligence assistant. Use the following data to answer the user's question.\n\nUser question: ${message}\n\nRelevant data:\n${dataContext}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const aiContent = result.response.text();

    const response = {
      id: Date.now().toString(),
      type: 'assistant',
      content: aiContent,
      timestamp: new Date().toISOString(),
      metadata: { queryType: 'margin_analysis', suggestions: [] }
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

// GET /api/chat/history - Get chat history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Mock chat history
    const history = [
      {
        id: '1',
        type: 'assistant',
        content: "Hello! I'm MarginIQ, your AI assistant for margin analysis. I can help you understand margin trends, identify at-risk products, and suggest improvements. What would you like to know?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        type: 'user',
        content: 'Which products have negative margins?',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: '3',
        type: 'assistant',
        content: "Products currently with negative margins:\n\n🚨 **Critical Issues:**\n• Fresh Strawberries (-6.5% margin)\n• Organic Milk (-2.1% margin)\n• Imported Cheese (-1.8% margin)\n\n**Immediate Actions Needed:**\n1. Review pricing strategy\n2. Negotiate with suppliers\n3. Consider product discontinuation\n4. Implement shrink reduction measures",
        timestamp: new Date(Date.now() - 900000).toISOString(),
      }
    ];

    const paginatedHistory = history.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: {
        messages: paginatedHistory,
        total: history.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history'
    });
  }
});

// GET /api/chat/suggestions - Get suggested questions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      "Which top 10 items lost margin this month?",
      "What categories are most affected by tariffs?",
      "Why are beverage margins falling in Florida?",
      "Show me products with negative margins",
      "What's the impact of recent tariff changes?",
      "Which suppliers have the highest cost increases?",
      "How are dairy margins trending?",
      "What's causing shrink in produce?",
      "Which regions have the best margins?",
      "How can we improve coffee bean margins?"
    ];

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions'
    });
  }
});

module.exports = router; 