const express = require('express');
const router = express.Router();

// Mock suggestions data
const mockSuggestions = [
  {
    id: '1',
    type: 'price_adjustment',
    title: 'Raise price from $3.98 → $4.28',
    description: 'Increase price by 7.5% to maintain target margin for Great Value Olive Oil',
    impact: 0.30,
    confidence: 0.85,
    action: 'price_adjustment',
    status: 'pending',
    productId: '1',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'supplier_change',
    title: 'Use domestic supplier (save $0.40/unit)',
    description: 'Switch to US-based supplier to avoid tariff impact for olive oil',
    impact: 0.40,
    confidence: 0.92,
    action: 'supplier_change',
    status: 'pending',
    productId: '1',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '3',
    type: 'promotion_adjustment',
    title: 'Remove current promotion',
    description: 'Current promotion is hurting margin by 2.1% for dairy products',
    impact: 0.08,
    confidence: 0.78,
    action: 'promotion_removal',
    status: 'pending',
    productId: '2',
    createdAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '4',
    type: 'price_adjustment',
    title: 'Increase price by $0.50',
    description: 'Adjust price for organic milk to cover increased COGS',
    impact: 0.50,
    confidence: 0.88,
    action: 'price_adjustment',
    status: 'approved',
    productId: '2',
    createdAt: '2024-01-15T09:15:00Z',
    approvedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '5',
    type: 'bundle_suggestion',
    title: 'Bundle with complementary product',
    description: 'Bundle coffee beans with filters to increase overall margin',
    impact: 0.25,
    confidence: 0.75,
    action: 'bundle_creation',
    status: 'rejected',
    productId: '3',
    createdAt: '2024-01-15T11:45:00Z',
    rejectedAt: '2024-01-15T12:30:00Z',
    rejectionReason: 'Not feasible with current inventory system'
  }
];

// GET /api/suggestions - Get all suggestions with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      type, 
      productId, 
      limit = 50, 
      offset = 0 
    } = req.query;

    let filteredSuggestions = [...mockSuggestions];

    // Apply filters
    if (status) {
      filteredSuggestions = filteredSuggestions.filter(s => s.status === status);
    }

    if (type) {
      filteredSuggestions = filteredSuggestions.filter(s => s.type === type);
    }

    if (productId) {
      filteredSuggestions = filteredSuggestions.filter(s => s.productId === productId);
    }

    // Apply pagination
    const paginatedSuggestions = filteredSuggestions.slice(offset, offset + parseInt(limit));

    res.json({
      success: true,
      data: {
        suggestions: paginatedSuggestions,
        total: filteredSuggestions.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Suggestions fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions'
    });
  }
});

// GET /api/suggestions/:id - Get specific suggestion
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const suggestion = mockSuggestions.find(s => s.id === id);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    res.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Suggestion fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestion'
    });
  }
});

// PUT /api/suggestions/:id/approve - Approve a suggestion
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const suggestion = mockSuggestions.find(s => s.id === id);
    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (suggestion.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Suggestion is not pending approval'
      });
    }

    // In production, this would update the database
    suggestion.status = 'approved';
    suggestion.approvedAt = new Date().toISOString();
    if (notes) {
      suggestion.approvalNotes = notes;
    }

    res.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Suggestion approval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve suggestion'
    });
  }
});

// PUT /api/suggestions/:id/reject - Reject a suggestion
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const suggestion = mockSuggestions.find(s => s.id === id);
    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (suggestion.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Suggestion is not pending approval'
      });
    }

    // In production, this would update the database
    suggestion.status = 'rejected';
    suggestion.rejectedAt = new Date().toISOString();
    suggestion.rejectionReason = reason;

    res.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Suggestion rejection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject suggestion'
    });
  }
});

// POST /api/suggestions/generate - Generate new suggestions
router.post('/generate', async (req, res) => {
  try {
    const { productId, analysisType = 'comprehensive' } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    // In production, this would:
    // 1. Fetch product data
    // 2. Call AI service to generate suggestions
    // 3. Store suggestions in database
    // 4. Return generated suggestions

    const newSuggestions = [
      {
        id: Date.now().toString(),
        type: 'price_adjustment',
        title: 'Optimize pricing strategy',
        description: 'AI-generated suggestion based on market analysis',
        impact: 0.25,
        confidence: 0.82,
        action: 'price_optimization',
        status: 'pending',
        productId,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: newSuggestions
    });
  } catch (error) {
    console.error('Suggestion generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
});

// GET /api/suggestions/stats - Get suggestion statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      total: mockSuggestions.length,
      pending: mockSuggestions.filter(s => s.status === 'pending').length,
      approved: mockSuggestions.filter(s => s.status === 'approved').length,
      rejected: mockSuggestions.filter(s => s.status === 'rejected').length,
      totalImpact: mockSuggestions
        .filter(s => s.status === 'approved')
        .reduce((sum, s) => sum + s.impact, 0),
      averageConfidence: mockSuggestions.reduce((sum, s) => sum + s.confidence, 0) / mockSuggestions.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Suggestion stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestion statistics'
    });
  }
});

module.exports = router; 