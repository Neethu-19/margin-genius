const express = require('express');
const router = express.Router();

// Mock analysis data
const mockAnalysis = {
  summary: "Margin fell due to 12% increase in import duty from Italy and higher shrink in refrigerated storage at 243 locations.",
  suggestions: [
    {
      id: '1',
      type: 'price_adjustment',
      title: 'Raise price from $3.98 → $4.28',
      description: 'Increase price by 7.5% to maintain target margin',
      impact: 0.30,
      confidence: 0.85,
      action: 'price_adjustment',
      status: 'pending'
    },
    {
      id: '2',
      type: 'supplier_change',
      title: 'Use domestic supplier (save $0.40/unit)',
      description: 'Switch to US-based supplier to avoid tariff impact',
      impact: 0.40,
      confidence: 0.92,
      action: 'supplier_change',
      status: 'pending'
    },
    {
      id: '3',
      type: 'promotion_adjustment',
      title: 'Remove current promotion',
      description: 'Current promotion is hurting margin by 2.1%',
      impact: 0.08,
      confidence: 0.78,
      action: 'promotion_removal',
      status: 'pending'
    }
  ],
  rootCauses: [
    {
      factor: 'Import Tariffs',
      impact: 0.8,
      description: '12% increase in olive oil import duties from Italy',
      trend: 'increasing'
    },
    {
      factor: 'Shrink Rate',
      impact: 1.2,
      description: 'Higher than average shrink in refrigerated storage',
      trend: 'stable'
    },
    {
      factor: 'Supplier Costs',
      impact: 0.5,
      description: 'Supplier increased base cost by 3.2%',
      trend: 'increasing'
    }
  ]
};

// GET /api/analysis/:productId - Get analysis for specific product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // In production, this would fetch from database and call AI service
    const analysis = {
      productId,
      analysis: mockAnalysis.summary,
      suggestions: mockAnalysis.suggestions,
      rootCauses: mockAnalysis.rootCauses,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analysis'
    });
  }
});

// POST /api/analysis/generate - Generate new analysis
router.post('/generate', async (req, res) => {
  try {
    const { productId, analysisType = 'comprehensive' } = req.body;

    // In production, this would:
    // 1. Fetch product data from database
    // 2. Call AI service for analysis
    // 3. Store results in database
    // 4. Return analysis

    const analysis = {
      productId,
      analysisType,
      analysis: mockAnalysis.summary,
      suggestions: mockAnalysis.suggestions,
      rootCauses: mockAnalysis.rootCauses,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analysis generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analysis'
    });
  }
});

// GET /api/analysis/trends - Get margin trends analysis
router.get('/trends', async (req, res) => {
  try {
    const { category, region, timeframe = '30d' } = req.query;

    const trends = {
      overall: {
        trend: 'declining',
        change: -0.8,
        period: '30 days'
      },
      byCategory: {
        'Dairy': { trend: 'declining', change: -2.1 },
        'Produce': { trend: 'declining', change: -1.8 },
        'Beverages': { trend: 'stable', change: 0.2 },
        'Pantry': { trend: 'improving', change: 0.5 }
      },
      byRegion: {
        'Northeast': { trend: 'declining', change: -1.2 },
        'Southeast': { trend: 'declining', change: -0.9 },
        'West': { trend: 'stable', change: 0.1 },
        'Southwest': { trend: 'improving', change: 0.3 }
      }
    };

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Trends analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trends analysis'
    });
  }
});

module.exports = router; 